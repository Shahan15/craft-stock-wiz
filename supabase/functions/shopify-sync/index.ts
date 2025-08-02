import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { integrationId, syncType } = await req.json();

    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('user_id', user.id)
      .single();

    if (integrationError || !integration) {
      return new Response(JSON.stringify({ error: 'Integration not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let syncResult;
    switch (syncType) {
      case 'products':
        syncResult = await syncProducts(integration, supabase);
        break;
      case 'orders':
        syncResult = await syncOrders(integration, supabase);
        break;
      case 'inventory':
        syncResult = await syncInventory(integration, supabase);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid sync type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Log sync result
    await supabase.from('sync_logs').insert({
      integration_id: integrationId,
      sync_type: syncType,
      status: syncResult.status,
      items_processed: syncResult.itemsProcessed,
      error_message: syncResult.error,
      sync_data: syncResult.data
    });

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in shopify-sync function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncProducts(integration: any, supabase: any) {
  try {
    const response = await fetch(`https://${integration.shop_name}.myshopify.com/admin/api/2023-10/products.json`, {
      headers: {
        'X-Shopify-Access-Token': integration.access_token,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();
    const products = data.products || [];

    // Store/update external products mapping
    for (const product of products) {
      await supabase
        .from('external_products')
        .upsert({
          integration_id: integration.id,
          external_product_id: product.id.toString(),
          platform_data: product,
          last_synced_at: new Date().toISOString()
        }, {
          onConflict: 'integration_id,external_product_id'
        });
    }

    return {
      status: 'success',
      itemsProcessed: products.length,
      data: { productsCount: products.length }
    };
  } catch (error) {
    return {
      status: 'error',
      itemsProcessed: 0,
      error: error.message
    };
  }
}

async function syncOrders(integration: any, supabase: any) {
  try {
    const response = await fetch(`https://${integration.shop_name}.myshopify.com/admin/api/2023-10/orders.json?status=any&limit=250`, {
      headers: {
        'X-Shopify-Access-Token': integration.access_token,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();
    const orders = data.orders || [];

    let processedOrders = 0;
    for (const order of orders) {
      // Find local products that match Shopify line items
      for (const lineItem of order.line_items) {
        const { data: externalProduct } = await supabase
          .from('external_products')
          .select('local_product_id')
          .eq('integration_id', integration.id)
          .eq('external_product_id', lineItem.product_id.toString())
          .single();

        if (externalProduct?.local_product_id) {
          // Create order record
          await supabase.from('orders').insert({
            user_id: integration.user_id,
            product_id: externalProduct.local_product_id,
            quantity_sold: lineItem.quantity,
            order_date: order.created_at.split('T')[0],
            status: 'Completed'
          });
          processedOrders++;
        }
      }
    }

    return {
      status: 'success',
      itemsProcessed: processedOrders,
      data: { ordersProcessed: processedOrders }
    };
  } catch (error) {
    return {
      status: 'error',
      itemsProcessed: 0,
      error: error.message
    };
  }
}

async function syncInventory(integration: any, supabase: any) {
  try {
    // Get all linked products
    const { data: externalProducts } = await supabase
      .from('external_products')
      .select('external_product_id, local_product_id')
      .eq('integration_id', integration.id)
      .not('local_product_id', 'is', null);

    let updatedCount = 0;
    for (const extProduct of externalProducts || []) {
      // Calculate available stock for local product
      const { data: stockData } = await supabase
        .rpc('calculate_product_stock', { product_id_param: extProduct.local_product_id });

      if (stockData !== null) {
        // Update Shopify inventory
        const inventoryResponse = await fetch(`https://${integration.shop_name}.myshopify.com/admin/api/2023-10/products/${extProduct.external_product_id}.json`, {
          headers: {
            'X-Shopify-Access-Token': integration.access_token,
          },
        });

        if (inventoryResponse.ok) {
          const productData = await inventoryResponse.json();
          const variant = productData.product.variants[0];
          
          // Update variant inventory
          await fetch(`https://${integration.shop_name}.myshopify.com/admin/api/2023-10/variants/${variant.id}.json`, {
            method: 'PUT',
            headers: {
              'X-Shopify-Access-Token': integration.access_token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              variant: {
                id: variant.id,
                inventory_quantity: stockData
              }
            })
          });
          updatedCount++;
        }
      }
    }

    return {
      status: 'success',
      itemsProcessed: updatedCount,
      data: { inventoryUpdated: updatedCount }
    };
  } catch (error) {
    return {
      status: 'error',
      itemsProcessed: 0,
      error: error.message
    };
  }
}