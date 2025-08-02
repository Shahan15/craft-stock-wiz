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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      const { shop, code } = await req.json();
      
      if (!shop || !code) {
        return new Response(JSON.stringify({ error: 'Shop and code are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Exchange code for access token
      const tokenResponse = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: Deno.env.get('SHOPIFY_API_KEY'),
          client_secret: Deno.env.get('SHOPIFY_API_SECRET'),
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Shopify token exchange failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to exchange code for token' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const tokenData = await tokenResponse.json();
      
      return new Response(JSON.stringify({ 
        access_token: tokenData.access_token,
        scope: tokenData.scope 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const shop = url.searchParams.get('shop');
      
      if (!shop) {
        return new Response(JSON.stringify({ error: 'Shop parameter is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const scopes = 'read_products,write_products,read_orders,read_inventory,write_inventory';
      const redirectUri = `${url.origin}/integrations/shopify/callback`;
      
      const authUrl = `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${Deno.env.get('SHOPIFY_API_KEY')}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in shopify-auth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});