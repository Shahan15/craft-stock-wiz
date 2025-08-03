import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { 
  Plus, 
  AlertTriangle, 
  Package, 
  Palette, 
  ShoppingCart,
  TrendingUp,
  Calendar,
  Sparkles,
  Bell
} from 'lucide-react'

interface LowStockMaterial {
  id: string
  name: string
  current_stock: number
  low_stock_threshold: number
  unit_of_measurement: string
}

interface RecentOrder {
  id: string
  quantity_sold: number
  order_date: string
  products: {
    name: string
    selling_price: number
    cogs: number
  } | null
}

export default function Dashboard() {
  const { user } = useAuth()
  const [lowStockMaterials, setLowStockMaterials] = useState<LowStockMaterial[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalProducts: 0,
    totalOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  // Check for critical stock alerts on load
  useEffect(() => {
    if (lowStockMaterials.length > 0) {
      const outOfStock = lowStockMaterials.filter(m => m.current_stock === 0)
      const criticallyLow = lowStockMaterials.filter(m => m.current_stock > 0 && m.current_stock <= m.low_stock_threshold * 0.3)
      
      if (outOfStock.length > 0) {
        toast.error(`${outOfStock.length} material(s) are out of stock!`, {
          description: `Check your inventory: ${outOfStock.map(m => m.name).join(', ')}`,
          duration: 6000,
        })
      } else if (criticallyLow.length > 0) {
        toast.warning(`${criticallyLow.length} material(s) are critically low!`, {
          description: `Consider restocking: ${criticallyLow.map(m => m.name).join(', ')}`,
          duration: 5000,
        })
      }
    }
  }, [lowStockMaterials])

  const fetchDashboardData = async () => {
    try {
      // Fetch low stock materials
      const { data: lowStock } = await supabase
        .from('materials')
        .select('*')
        .lte('current_stock', 'low_stock_threshold')
        .eq('user_id', user?.id)
        .order('current_stock', { ascending: true })
        .limit(5)

      setLowStockMaterials(lowStock || [])

      // Fetch recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          quantity_sold,
          order_date,
          products!inner(name, selling_price, cogs)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentOrders((orders || []).map(order => ({
        ...order,
        products: Array.isArray(order.products) ? order.products[0] : order.products
      })))

      // Fetch stats
      const [materialsCount, productsCount, ordersCount] = await Promise.all([
        supabase.from('materials').select('*', { count: 'exact' }).eq('user_id', user?.id),
        supabase.from('products').select('*', { count: 'exact' }).eq('user_id', user?.id),
        supabase.from('orders').select('*', { count: 'exact' }).eq('user_id', user?.id)
      ])

      setStats({
        totalMaterials: materialsCount.count || 0,
        totalProducts: productsCount.count || 0,
        totalOrders: ordersCount.count || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back! 
              <span className="handwritten text-2xl text-craft-brown ml-2 transform -rotate-2 inline-block">
                Let's craft something amazing
              </span>
            </h1>
            <p className="text-gray-600">Here's what's happening with your inventory today.</p>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/orders">
              <Button variant="craft-warm" size="lg" className="font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Log Manual Sale
              </Button>
            </Link>
            <Link to="/materials">
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="craft-warm">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="craft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Materials</p>
                <p className="text-3xl font-bold text-teal mt-1">{stats.totalMaterials}</p>
              </div>
              <div className="p-3 bg-teal/10 rounded-full">
                <Package className="w-6 h-6 text-teal" />
              </div>
            </div>
          </Card>

          <Card className="craft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-craft-orange mt-1">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-craft-orange/10 rounded-full">
                <Palette className="w-6 h-6 text-craft-orange" />
              </div>
            </div>
          </Card>

          <Card className="craft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-craft-brown mt-1">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-craft-brown/10 rounded-full">
                <ShoppingCart className="w-6 h-6 text-craft-brown" />
              </div>
            </div>
          </Card>

          <Card className="craft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Stock Alerts</p>
                <p className={`text-3xl font-bold mt-1 ${lowStockMaterials.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {lowStockMaterials.length}
                </p>
              </div>
              <div className={`p-3 rounded-full ${lowStockMaterials.length > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                {lowStockMaterials.length > 0 ? (
                  <Bell className="w-6 h-6 text-red-500" />
                ) : (
                  <Sparkles className="w-6 h-6 text-green-500" />
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Alerts */}
          <Card className="craft-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Inventory Alerts
              </h2>
              <Link to="/materials">
                <Button variant="outline" size="sm">
                  Manage Stock
                </Button>
              </Link>
            </div>

            {lowStockMaterials.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">All materials are well stocked!</p>
                <p className="text-gray-500 text-sm">You're doing great managing your inventory.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockMaterials.map((material) => {
                  const isOutOfStock = material.current_stock === 0
                  const isCriticallyLow = material.current_stock > 0 && material.current_stock <= material.low_stock_threshold * 0.5
                  
                  return (
                    <div 
                      key={material.id} 
                      className={`p-4 rounded-lg border ${
                        isOutOfStock 
                          ? 'bg-red-100 border-red-300' 
                          : isCriticallyLow 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium ${isOutOfStock ? 'text-red-900' : isCriticallyLow ? 'text-red-800' : 'text-yellow-800'}`}>
                              {material.name}
                            </p>
                            {isOutOfStock && (
                              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-semibold">
                                OUT OF STOCK
                              </span>
                            )}
                            {isCriticallyLow && !isOutOfStock && (
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                                CRITICAL
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${isOutOfStock ? 'text-red-700' : isCriticallyLow ? 'text-red-600' : 'text-yellow-700'}`}>
                            {material.current_stock} {material.unit_of_measurement} remaining
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${isOutOfStock ? 'text-red-600' : isCriticallyLow ? 'text-red-500' : 'text-yellow-600'}`}>
                            Threshold: {material.low_stock_threshold} {material.unit_of_measurement}
                          </p>
                          <Link to="/materials">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className={`mt-1 text-xs ${
                                isOutOfStock 
                                  ? 'border-red-300 text-red-600 hover:bg-red-50' 
                                  : 'border-yellow-300 text-yellow-600 hover:bg-yellow-50'
                              }`}
                            >
                              Restock
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Recent Sales */}
          <Card className="craft-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Recent Sales
              </h2>
              <Link to="/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No recent sales</p>
                <p className="text-gray-500 text-sm">Start by adding your first sale!</p>
                <Link to="/orders" className="mt-4 inline-block">
                  <Button size="sm" variant="default">
                    Add Sale
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const profit = order.products ? (order.products.selling_price - order.products.cogs) * order.quantity_sold : 0
                  const revenue = order.products ? order.products.selling_price * order.quantity_sold : 0
                  
                  return (
                    <div key={order.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-green-900">{order.products?.name || 'Unknown Product'}</p>
                        <div className="text-right">
                          <p className="text-green-600 font-semibold">Qty: {order.quantity_sold}</p>
                          <p className="text-green-700 text-sm">£{revenue.toFixed(2)} revenue</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-green-700 text-sm">
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                        <p className={`font-semibold text-sm ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          £{profit.toFixed(2)} profit
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="craft-card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/materials">
              <div className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <Package className="w-8 h-8 text-teal mx-auto mb-2" />
                <p className="font-medium text-gray-900">Add Material</p>
                <p className="text-gray-500 text-xs">Track raw materials</p>
              </div>
            </Link>
            
            <Link to="/products">
              <div className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <Palette className="w-8 h-8 text-craft-orange mx-auto mb-2" />
                <p className="font-medium text-gray-900">Create Product</p>
                <p className="text-gray-500 text-xs">Build recipes</p>
              </div>
            </Link>
            
            <Link to="/orders">
              <div className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <ShoppingCart className="w-8 h-8 text-craft-brown mx-auto mb-2" />
                <p className="font-medium text-gray-900">Log Sale</p>
                <p className="text-gray-500 text-xs">Record orders</p>
              </div>
            </Link>
            
            <Link to="/settings">
              <div className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <TrendingUp className="w-8 h-8 text-teal mx-auto mb-2" />
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-gray-500 text-xs">Insights & analytics</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  )
}