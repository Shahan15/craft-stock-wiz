import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ExportData {
  orders: any[];
  products: any[];
  materials: any[];
  analytics: any;
}

export const useExport = () => {
  const { user } = useAuth();

  const generateCSV = useCallback((data: any[], filename: string) => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and escape commas
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success(`${filename} exported successfully!`);
  }, []);

  const generateJSON = useCallback((data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    toast.success(`${filename} exported successfully!`);
  }, []);

  const downloadFile = useCallback((content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportOrders = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          quantity_sold,
          order_date,
          status,
          created_at,
          products!inner(name, selling_price, cogs)
        `)
        .eq('user_id', user?.id)
        .order('order_date', { ascending: false });

      if (error) throw error;

      const flattenedOrders = (orders || []).map(order => ({
        id: order.id,
        product_name: Array.isArray(order.products) ? order.products[0]?.name : order.products?.name,
        quantity_sold: order.quantity_sold,
        selling_price: Array.isArray(order.products) ? order.products[0]?.selling_price : order.products?.selling_price,
        cogs: Array.isArray(order.products) ? order.products[0]?.cogs : order.products?.cogs,
        revenue: order.quantity_sold * (Array.isArray(order.products) ? order.products[0]?.selling_price || 0 : order.products?.selling_price || 0),
        profit: order.quantity_sold * ((Array.isArray(order.products) ? order.products[0]?.selling_price || 0 : order.products?.selling_price || 0) - (Array.isArray(order.products) ? order.products[0]?.cogs || 0 : order.products?.cogs || 0)),
        order_date: order.order_date,
        status: order.status,
        created_at: order.created_at
      }));

      if (format === 'csv') {
        generateCSV(flattenedOrders, 'orders');
      } else {
        generateJSON(flattenedOrders, 'orders');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export orders');
    }
  }, [user?.id, generateCSV, generateJSON]);

  const exportProducts = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('name', { ascending: true });

      if (error) throw error;

      if (format === 'csv') {
        generateCSV(products || [], 'products');
      } else {
        generateJSON(products || [], 'products');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export products');
    }
  }, [user?.id, generateCSV, generateJSON]);

  const exportMaterials = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    try {
      const { data: materials, error } = await supabase
        .from('materials')
        .select('*')
        .eq('user_id', user?.id)
        .order('name', { ascending: true });

      if (error) throw error;

      if (format === 'csv') {
        generateCSV(materials || [], 'materials');
      } else {
        generateJSON(materials || [], 'materials');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export materials');
    }
  }, [user?.id, generateCSV, generateJSON]);

  const exportAnalytics = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    try {
      // Fetch comprehensive analytics data
      const [ordersRes, productsRes, materialsRes] = await Promise.all([
        supabase
          .from('orders')
          .select(`
            id,
            quantity_sold,
            order_date,
            products!inner(name, selling_price, cogs)
          `)
          .eq('user_id', user?.id)
          .order('order_date', { ascending: false }),
        supabase
          .from('products')
          .select('*')
          .eq('user_id', user?.id),
        supabase
          .from('materials')
          .select('*')
          .eq('user_id', user?.id)
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (productsRes.error) throw productsRes.error;
      if (materialsRes.error) throw materialsRes.error;

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const materials = materialsRes.data || [];

      // Calculate comprehensive analytics
      const totalRevenue = orders.reduce((sum, order) => {
        const price = Array.isArray(order.products) ? order.products[0]?.selling_price || 0 : order.products?.selling_price || 0;
        return sum + (order.quantity_sold * price);
      }, 0);

      const totalProfit = orders.reduce((sum, order) => {
        const price = Array.isArray(order.products) ? order.products[0]?.selling_price || 0 : order.products?.selling_price || 0;
        const cogs = Array.isArray(order.products) ? order.products[0]?.cogs || 0 : order.products?.cogs || 0;
        return sum + (order.quantity_sold * (price - cogs));
      }, 0);

      const lowStockMaterials = materials.filter(m => m.current_stock <= m.low_stock_threshold);

      const analyticsData = {
        summary: {
          total_revenue: totalRevenue,
          total_profit: totalProfit,
          profit_margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
          total_orders: orders.length,
          total_products: products.length,
          total_materials: materials.length,
          low_stock_materials: lowStockMaterials.length,
          average_order_value: orders.length > 0 ? totalRevenue / orders.length : 0,
          export_date: new Date().toISOString()
        },
        orders_summary: orders.map(order => ({
          id: order.id,
          product_name: Array.isArray(order.products) ? order.products[0]?.name : order.products?.name,
          quantity_sold: order.quantity_sold,
          revenue: order.quantity_sold * (Array.isArray(order.products) ? order.products[0]?.selling_price || 0 : order.products?.selling_price || 0),
          profit: order.quantity_sold * ((Array.isArray(order.products) ? order.products[0]?.selling_price || 0 : order.products?.selling_price || 0) - (Array.isArray(order.products) ? order.products[0]?.cogs || 0 : order.products?.cogs || 0)),
          order_date: order.order_date
        })),
        products_summary: products.map(product => ({
          id: product.id,
          name: product.name,
          selling_price: product.selling_price,
          cogs: product.cogs,
          profit_margin: product.selling_price > 0 ? ((product.selling_price - product.cogs) / product.selling_price) * 100 : 0
        })),
        materials_summary: materials.map(material => ({
          id: material.id,
          name: material.name,
          current_stock: material.current_stock,
          low_stock_threshold: material.low_stock_threshold,
          stock_value: material.current_stock * material.cost_per_unit,
          status: material.current_stock <= material.low_stock_threshold ? 'Low Stock' : 'In Stock'
        }))
      };

      if (format === 'csv') {
        // For CSV, export the summary as a flattened structure
        const summaryArray = [analyticsData.summary];
        generateCSV(summaryArray, 'analytics_summary');
      } else {
        generateJSON(analyticsData, 'analytics_full_report');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics');
    }
  }, [user?.id, generateCSV, generateJSON]);

  const exportAllData = useCallback(async () => {
    try {
      toast.info('Preparing comprehensive export...');
      
      const [ordersRes, productsRes, materialsRes] = await Promise.all([
        supabase
          .from('orders')
          .select(`
            id,
            quantity_sold,
            order_date,
            status,
            created_at,
            products!inner(name, selling_price, cogs)
          `)
          .eq('user_id', user?.id)
          .order('order_date', { ascending: false }),
        supabase
          .from('products')
          .select('*')
          .eq('user_id', user?.id),
        supabase
          .from('materials')
          .select('*')
          .eq('user_id', user?.id)
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (productsRes.error) throw productsRes.error;
      if (materialsRes.error) throw materialsRes.error;

      const completeExport = {
        export_info: {
          generated_at: new Date().toISOString(),
          user_id: user?.id,
          version: '1.0'
        },
        orders: ordersRes.data || [],
        products: productsRes.data || [],
        materials: materialsRes.data || []
      };

      generateJSON(completeExport, 'stock_kit_complete_backup');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to create complete export');
    }
  }, [user?.id, generateJSON]);

  return {
    exportOrders,
    exportProducts,
    exportMaterials,
    exportAnalytics,
    exportAllData
  };
};