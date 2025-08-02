import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface OrderWithProduct {
  id: string;
  quantity_sold: number;
  order_date: string;
  products: {
    name: string;
    selling_price: number;
  } | null;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalMaterials: number;
  lowStockMaterials: number;
  recentOrders: OrderWithProduct[];
  topProducts: Array<{
    name: string;
    total_sold: number;
    revenue: number;
  }>;
}

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalMaterials: 0,
    lowStockMaterials: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // Fetch orders with product info
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          quantity_sold,
          order_date,
          products!inner (name, selling_price)
        `)
        .eq('user_id', user?.id)
        .order('order_date', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      if (productsError) throw productsError;

      // Fetch materials
      const { data: materials, error: materialsError } = await supabase
        .from('materials')
        .select('current_stock, low_stock_threshold')
        .eq('user_id', user?.id);

      if (materialsError) throw materialsError;

      // Process orders data
      const processedOrders = (orders || []).map(order => ({
        id: order.id,
        quantity_sold: order.quantity_sold,
        order_date: order.order_date,
        products: Array.isArray(order.products) ? order.products[0] : order.products
      })) as OrderWithProduct[];

      // Calculate analytics
      const totalRevenue = processedOrders.reduce((sum, order) => 
        sum + (order.quantity_sold * (order.products?.selling_price || 0)), 0
      );

      const lowStockMaterials = materials?.filter(material => 
        material.current_stock <= material.low_stock_threshold
      ).length || 0;

      // Calculate top products
      const productSales = processedOrders.reduce((acc, order) => {
        const productName = order.products?.name || 'Unknown';
        const revenue = order.quantity_sold * (order.products?.selling_price || 0);
        
        if (!acc[productName]) {
          acc[productName] = { total_sold: 0, revenue: 0 };
        }
        
        acc[productName].total_sold += order.quantity_sold;
        acc[productName].revenue += revenue;
        
        return acc;
      }, {} as Record<string, { total_sold: number; revenue: number }>);

      const topProducts = Object.entries(productSales)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setData({
        totalRevenue,
        totalOrders: processedOrders.length,
        totalProducts: productsCount || 0,
        totalMaterials: materials?.length || 0,
        lowStockMaterials,
        recentOrders: processedOrders.slice(0, 5),
        topProducts
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 handwritten">Business Analytics</h1>
          <p className="text-gray-600 mt-1">Track your performance and growth</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">${data.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-craft-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-craft-orange">{data.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">{data.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active products
              </p>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{data.lowStockMaterials}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card className="craft-card transform rotate-1 hover:rotate-0 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-teal" />
                Top Products
                <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 5 Q 50 1 98 4" stroke="#5a8a8a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.length > 0 ? (
                  data.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.total_sold} sold</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-teal">${product.revenue.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">#{index + 1}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No sales data yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="craft-card transform -rotate-1 hover:rotate-0 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-craft-orange" />
                Recent Orders
                <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 5 Q 50 1 98 4" stroke="#e67e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-teal-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{order.products?.name || 'Unknown Product'}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-craft-orange">
                          ${((order.products?.selling_price || 0) * order.quantity_sold).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Qty: {order.quantity_sold}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Insights */}
        <Card className="craft-card transform rotate-1 hover:rotate-0 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal" />
              Growth Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                <h4 className="font-semibold text-teal mb-2">Average Order Value</h4>
                <div className="text-2xl font-bold text-teal">
                  ${data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders).toFixed(2) : '0.00'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <h4 className="font-semibold text-craft-orange mb-2">Materials per Product</h4>
                <div className="text-2xl font-bold text-craft-orange">
                  {data.totalProducts > 0 ? (data.totalMaterials / data.totalProducts).toFixed(1) : '0'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">Stock Health</h4>
                <div className="text-2xl font-bold text-purple-600">
                  {data.totalMaterials > 0 ? 
                    Math.round(((data.totalMaterials - data.lowStockMaterials) / data.totalMaterials) * 100) : 100}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}