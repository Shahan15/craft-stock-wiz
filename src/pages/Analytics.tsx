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
  Target,
  Coins,
  TrendingDown,
  Activity,
  Filter,
  Download,
  FileText,
  Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useExport } from '@/hooks/useExport';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface OrderWithProduct {
  id: string;
  quantity_sold: number;
  order_date: string;
  products: {
    name: string;
    selling_price: number;
    cogs: number;
  } | null;
}

interface MonthlyData {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
}

interface MaterialUsage {
  name: string;
  total_used: number;
  unit_of_measurement: string;
  cost_impact: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalProducts: number;
  totalMaterials: number;
  lowStockMaterials: number;
  recentOrders: OrderWithProduct[];
  topProducts: Array<{
    name: string;
    total_sold: number;
    revenue: number;
    profit: number;
    margin_percent: number;
  }>;
  monthlyTrends: MonthlyData[];
  materialUsage: MaterialUsage[];
}

export default function Analytics() {
  const { user } = useAuth();
  const { exportOrders, exportProducts, exportMaterials, exportAnalytics, exportAllData } = useExport();
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalMaterials: 0,
    lowStockMaterials: 0,
    recentOrders: [],
    topProducts: [],
    monthlyTrends: [],
    materialUsage: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Calculate date filter based on timeRange
      let dateFilter = '';
      const now = new Date();
      if (timeRange === '30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = thirtyDaysAgo.toISOString().split('T')[0];
      } else if (timeRange === '7days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = sevenDaysAgo.toISOString().split('T')[0];
      }

      // Fetch orders with product info including COGS
      const ordersQuery = supabase
        .from('orders')
        .select(`
          id,
          quantity_sold,
          order_date,
          products!inner (name, selling_price, cogs)
        `)
        .eq('user_id', user?.id)
        .order('order_date', { ascending: false });

      if (dateFilter) {
        ordersQuery.gte('order_date', dateFilter);
      }

      const { data: orders, error: ordersError } = await ordersQuery;
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

      const totalProfit = processedOrders.reduce((sum, order) => {
        const revenue = order.quantity_sold * (order.products?.selling_price || 0);
        const costs = order.quantity_sold * (order.products?.cogs || 0);
        return sum + (revenue - costs);
      }, 0);

      const lowStockMaterials = materials?.filter(material => 
        material.current_stock <= material.low_stock_threshold
      ).length || 0;

      // Calculate top products with profit analysis
      const productSales = processedOrders.reduce((acc, order) => {
        const productName = order.products?.name || 'Unknown';
        const revenue = order.quantity_sold * (order.products?.selling_price || 0);
        const costs = order.quantity_sold * (order.products?.cogs || 0);
        const profit = revenue - costs;
        
        if (!acc[productName]) {
          acc[productName] = { 
            total_sold: 0, 
            revenue: 0, 
            profit: 0,
            selling_price: order.products?.selling_price || 0,
            cogs: order.products?.cogs || 0
          };
        }
        
        acc[productName].total_sold += order.quantity_sold;
        acc[productName].revenue += revenue;
        acc[productName].profit += profit;
        
        return acc;
      }, {} as Record<string, { total_sold: number; revenue: number; profit: number; selling_price: number; cogs: number }>);

      const topProducts = Object.entries(productSales)
        .map(([name, stats]) => ({ 
          name, 
          ...stats,
          margin_percent: stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0
        }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);

      // Calculate monthly trends
      const monthlyData = processedOrders.reduce((acc, order) => {
        const month = new Date(order.order_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!acc[month]) {
          acc[month] = { revenue: 0, profit: 0, orders: 0 };
        }
        
        const revenue = order.quantity_sold * (order.products?.selling_price || 0);
        const costs = order.quantity_sold * (order.products?.cogs || 0);
        
        acc[month].revenue += revenue;
        acc[month].profit += (revenue - costs);
        acc[month].orders += 1;
        
        return acc;
      }, {} as Record<string, { revenue: number; profit: number; orders: number }>);

      const monthlyTrends = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-6); // Last 6 months

      setData({
        totalRevenue,
        totalProfit,
        totalOrders: processedOrders.length,
        totalProducts: productsCount || 0,
        totalMaterials: materials?.length || 0,
        lowStockMaterials,
        recentOrders: processedOrders.slice(0, 5),
        topProducts,
        monthlyTrends,
        materialUsage: [] // Will be implemented in next phase
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 handwritten">Business Analytics</h1>
            <p className="text-gray-600 mt-1">Track your performance and growth</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => exportAnalytics('csv')}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => exportAnalytics('json')}
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Export JSON</span>
              </Button>
              <Button 
                variant="craft-warm"
                onClick={exportAllData}
                className="flex items-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>Full Backup</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">£{data.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Gross sales
              </p>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <Coins className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">£{data.totalProfit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.totalRevenue > 0 ? `${((data.totalProfit / data.totalRevenue) * 100).toFixed(1)}% margin` : 'No margin'}
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
                Completed sales
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Products by Profit */}
          <Card className="craft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-teal" />
                Top Products by Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.length > 0 ? (
                  data.topProducts.map((product, index) => (
                    <div key={product.name} className="p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Sold: {product.total_sold}</p>
                          <p className="text-green-600 font-semibold">£{product.profit.toFixed(2)} profit</p>
                        </div>
                        <div className="text-right">
                          <p className="text-teal-600">£{product.revenue.toFixed(2)} revenue</p>
                          <p className={`font-medium ${product.margin_percent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.margin_percent.toFixed(1)}% margin
                          </p>
                        </div>
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

          {/* Monthly Trends */}
          <Card className="craft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-craft-orange" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.monthlyTrends.length > 0 ? (
                  data.monthlyTrends.map((month) => {
                    const profitMargin = month.revenue > 0 ? (month.profit / month.revenue) * 100 : 0;
                    return (
                      <div key={month.month} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{month.month}</h4>
                          <span className="text-xs text-gray-600">{month.orders} orders</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-craft-orange font-semibold">£{month.revenue.toFixed(2)}</p>
                            <p className="text-gray-600 text-xs">Revenue</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${month.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              £{month.profit.toFixed(2)}
                            </p>
                            <p className="text-gray-600 text-xs">{profitMargin.toFixed(1)}% profit</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No trend data yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="craft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-craft-orange" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => {
                    const revenue = (order.products?.selling_price || 0) * order.quantity_sold;
                    const costs = (order.products?.cogs || 0) * order.quantity_sold;
                    const profit = revenue - costs;
                    
                    return (
                      <div key={order.id} className="p-3 bg-gradient-to-r from-orange-50 to-teal-50 rounded-lg border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{order.products?.name || 'Unknown Product'}</h4>
                          <span className="text-xs text-gray-600">
                            {new Date(order.order_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-craft-orange font-semibold">£{revenue.toFixed(2)}</p>
                            <p className="text-gray-600 text-xs">Qty: {order.quantity_sold}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              £{profit.toFixed(2)}
                            </p>
                            <p className="text-gray-600 text-xs">Profit</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
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

        {/* Enhanced Growth Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="craft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                  <h4 className="font-semibold text-teal mb-2">Average Order Value</h4>
                  <div className="text-2xl font-bold text-teal">
                    £{data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders).toFixed(2) : '0.00'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Average Profit per Sale</h4>
                  <div className="text-2xl font-bold text-green-600">
                    £{data.totalOrders > 0 ? (data.totalProfit / data.totalOrders).toFixed(2) : '0.00'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <h4 className="font-semibold text-craft-orange mb-2">Overall Profit Margin</h4>
                  <div className="text-2xl font-bold text-craft-orange">
                    {data.totalRevenue > 0 ? ((data.totalProfit / data.totalRevenue) * 100).toFixed(1) : '0'}%
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

          <Card className="craft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-green-500" />
                Profit Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Total Business Profit</h4>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    £{data.totalProfit.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">
                    From £{data.totalRevenue.toFixed(2)} in total sales
                  </p>
                </div>

                {data.totalOrders > 0 && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="font-medium text-blue-600">Best Month</p>
                      <p className="text-lg font-bold text-blue-800">
                        {data.monthlyTrends.length > 0 
                          ? data.monthlyTrends.sort((a, b) => b.profit - a.profit)[0]?.month || 'N/A'
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg text-center">
                      <p className="font-medium text-yellow-600">Top Margin</p>
                      <p className="text-lg font-bold text-yellow-800">
                        {data.topProducts.length > 0 
                          ? `${data.topProducts[0]?.margin_percent?.toFixed(1) || '0'}%`
                          : '0%'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}