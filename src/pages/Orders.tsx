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
  sale_price?: number;
  products?: {
    name: string;
    selling_price: number;
    cogs: number;
  };
}

interface Product {
  id: string;
  name: string;
  selling_price: number;
  cogs: number;
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
    order_date: new Date().toISOString().split('T')[0],
    sale_price: 0,
    useCustomPrice: false
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
            selling_price,
            cogs
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
        .select('id, name, selling_price, cogs')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddOrder = async () => {
    try {
      setLoading(true);
      
      // Get the selected product for validation and inventory deduction
      const selectedProduct = products.find(p => p.id === newOrder.product_id);
      if (!selectedProduct) {
        toast.error('Please select a valid product');
        return;
      }

      // Calculate actual sale price
      const actualSalePrice = newOrder.useCustomPrice && newOrder.sale_price > 0 
        ? newOrder.sale_price 
        : selectedProduct.selling_price;

      // Insert the order
      const orderData = {
        product_id: newOrder.product_id,
        quantity_sold: Number(newOrder.quantity_sold),
        status: newOrder.status,
        order_date: newOrder.order_date,
        user_id: user?.id,
        ...(newOrder.useCustomPrice && newOrder.sale_price > 0 && { sale_price: actualSalePrice })
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (orderError) throw orderError;

      // Deduct materials from inventory (simulate production)
      if (newOrder.status === 'Completed') {
        await deductMaterialsFromInventory(newOrder.product_id, Number(newOrder.quantity_sold));
      }

      toast.success('Sale logged successfully! Materials have been deducted from inventory.');
      setShowAddModal(false);
      resetOrderForm();
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to log sale');
    } finally {
      setLoading(false);
    }
  };

  const deductMaterialsFromInventory = async (productId: string, quantitySold: number) => {
    try {
      // Get the product recipe
      const { data: recipes, error: recipeError } = await supabase
        .from('recipes')
        .select(`
          material_id,
          quantity_needed,
          materials!inner(current_stock)
        `)
        .eq('product_id', productId);

      if (recipeError) throw recipeError;

      // Deduct materials for each recipe item
      for (const recipe of recipes || []) {
        const totalNeeded = recipe.quantity_needed * quantitySold;
        
        // Get current stock for this material
        const { data: materialData, error: materialError } = await supabase
          .from('materials')
          .select('current_stock')
          .eq('id', recipe.material_id)
          .single();

        if (materialError) throw materialError;

        const currentStock = materialData?.current_stock || 0;
        const newStock = Math.max(0, currentStock - totalNeeded);

        const { error: updateError } = await supabase
          .from('materials')
          .update({ current_stock: newStock })
          .eq('id', recipe.material_id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error deducting materials:', error);
      toast.error('Sale logged but failed to update inventory');
    }
  };

  const resetOrderForm = () => {
    setNewOrder({
      product_id: '',
      quantity_sold: 1,
      status: 'Completed',
      order_date: new Date().toISOString().split('T')[0],
      sale_price: 0,
      useCustomPrice: false
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.products?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) => {
    const price = order.sale_price || (order.products?.selling_price || 0);
    return sum + (order.quantity_sold * price);
  }, 0);

  const totalProfit = orders.reduce((sum, order) => {
    const price = order.sale_price || (order.products?.selling_price || 0);
    const cogs = order.products?.cogs || 0;
    return sum + (order.quantity_sold * (price - cogs));
  }, 0);

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
            <h1 className="text-3xl font-bold text-gray-900 handwritten">Manual Sales Log</h1>
            <p className="text-gray-600 mt-1">Track sales from all channels (markets, social media, etc.)</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-craft-orange hover:bg-craft-orange/90 text-white font-semibold"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Log New Sale
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">£{totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">£{totalProfit.toFixed(2)}</div>
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
                    <div className="text-xl font-bold text-teal mb-1">
                      £{((order.sale_price || order.products?.selling_price || 0) * order.quantity_sold).toFixed(2)}
                    </div>
                    {order.products && (
                      <div className="text-sm text-green-600 font-medium mb-2">
                        £{(((order.sale_price || order.products.selling_price) - order.products.cogs) * order.quantity_sold).toFixed(2)} profit
                      </div>
                    )}
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
                  <Button onClick={() => setShowAddModal(true)} variant="default">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Your First Sale
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Sale Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Log Manual Sale</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product *</label>
                  <Select value={newOrder.product_id} onValueChange={(value) => {
                    const selectedProduct = products.find(p => p.id === value);
                    setNewOrder(prev => ({ 
                      ...prev, 
                      product_id: value,
                      sale_price: selectedProduct?.selling_price || 0
                    }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            <span className="text-xs text-gray-500">
                              £{product.selling_price} • £{(product.selling_price - product.cogs).toFixed(2)} profit/unit
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quantity Sold *</label>
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
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={newOrder.useCustomPrice}
                      onChange={(e) => setNewOrder(prev => ({ 
                        ...prev, 
                        useCustomPrice: e.target.checked 
                      }))}
                      className="rounded"
                    />
                    <span>Use custom sale price</span>
                  </label>
                  {newOrder.useCustomPrice && (
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Custom price per unit"
                      value={newOrder.sale_price}
                      onChange={(e) => setNewOrder(prev => ({ 
                        ...prev, 
                        sale_price: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sale Date *</label>
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
                  <label className="block text-sm font-medium mb-1">Channel/Source</label>
                  <Select value={newOrder.status} onValueChange={(value) => 
                    setNewOrder(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Market Stall</SelectItem>
                      <SelectItem value="Online">Social Media</SelectItem>
                      <SelectItem value="Direct">Direct Sale</SelectItem>
                      <SelectItem value="Craft Fair">Craft Fair</SelectItem>
                      <SelectItem value="Custom">Custom Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newOrder.product_id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900 mb-1">Sale Summary</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span>£{((newOrder.useCustomPrice ? newOrder.sale_price : products.find(p => p.id === newOrder.product_id)?.selling_price || 0) * newOrder.quantity_sold).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit:</span>
                        <span className="font-medium text-green-600">
                          £{(((newOrder.useCustomPrice ? newOrder.sale_price : products.find(p => p.id === newOrder.product_id)?.selling_price || 0) - (products.find(p => p.id === newOrder.product_id)?.cogs || 0)) * newOrder.quantity_sold).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddModal(false);
                    resetOrderForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddOrder}
                  disabled={!newOrder.product_id || loading}
                  className="flex-1 bg-craft-orange hover:bg-craft-orange/90"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging...</span>
                    </div>
                  ) : (
                    'Log Sale'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}