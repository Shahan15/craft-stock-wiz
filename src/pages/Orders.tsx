import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  ShoppingCart, 
  Calendar, 
  Package,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Order {
  id: string;
  product_id: string;
  quantity_sold: number;
  status: string;
  order_date: string;
  created_at: string;
  products?: {
    name: string;
    selling_price: number;
  };
}

interface Product {
  id: string;
  name: string;
  selling_price: number;
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    product_id: '',
    quantity_sold: 1,
    status: 'Completed',
    order_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchProducts();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            name,
            selling_price
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, selling_price')
        .eq('user_id', user?.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddOrder = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          ...newOrder,
          user_id: user?.id,
          quantity_sold: Number(newOrder.quantity_sold)
        }]);

      if (error) throw error;

      toast.success('Order added successfully');
      setShowAddModal(false);
      setNewOrder({
        product_id: '',
        quantity_sold: 1,
        status: 'Completed',
        order_date: new Date().toISOString().split('T')[0]
      });
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to add order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.products?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) => 
    sum + (order.quantity_sold * (order.products?.selling_price || 0)), 0
  );

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 handwritten">Orders & Sales</h1>
            <p className="text-gray-600 mt-1">Track your sales and manage orders</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal hover:bg-teal-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-craft-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-craft-orange">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Package className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">{completedOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="craft-card hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{order.products?.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.order_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Qty: {order.quantity_sold}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-teal mb-2">
                      ${((order.products?.selling_price || 0) * order.quantity_sold).toFixed(2)}
                    </div>
                    <Badge 
                      variant={order.status === 'Completed' ? 'default' : 
                              order.status === 'Pending' ? 'secondary' : 'destructive'}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card className="craft-card">
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Start by adding your first order'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => setShowAddModal(true)} className="bg-teal hover:bg-teal-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Order
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Order Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Order</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product</label>
                  <Select value={newOrder.product_id} onValueChange={(value) => 
                    setNewOrder(prev => ({ ...prev, product_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.selling_price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={newOrder.quantity_sold}
                    onChange={(e) => setNewOrder(prev => ({ 
                      ...prev, 
                      quantity_sold: parseInt(e.target.value) || 1 
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Order Date</label>
                  <Input
                    type="date"
                    value={newOrder.order_date}
                    onChange={(e) => setNewOrder(prev => ({ 
                      ...prev, 
                      order_date: e.target.value 
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select value={newOrder.status} onValueChange={(value) => 
                    setNewOrder(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddOrder}
                  disabled={!newOrder.product_id}
                  className="flex-1 bg-teal hover:bg-teal-dark"
                >
                  Add Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}