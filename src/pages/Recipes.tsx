import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Scissors, 
  Package,
  Sparkles,
  Search,
  Edit,
  Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Recipe {
  id: string;
  product_id: string;
  material_id: string;
  quantity_needed: number;
  products?: {
    name: string;
  };
  materials?: {
    name: string;
    unit_of_measurement: string;
    current_stock: number;
  };
}

interface Product {
  id: string;
  name: string;
}

interface Material {
  id: string;
  name: string;
  unit_of_measurement: string;
  current_stock: number;
}

export default function Recipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    product_id: '',
    material_id: '',
    quantity_needed: 1
  });

  useEffect(() => {
    if (user) {
      fetchRecipes();
      fetchProducts();
      fetchMaterials();
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          products (name),
          materials (name, unit_of_measurement, current_stock)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('user_id', user?.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('id, name, unit_of_measurement, current_stock')
        .eq('user_id', user?.id);

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleAddRecipe = async () => {
    try {
      const { error } = await supabase
        .from('recipes')
        .insert([{
          ...newRecipe,
          quantity_needed: Number(newRecipe.quantity_needed)
        }]);

      if (error) throw error;

      toast.success('Recipe added successfully');
      setShowAddModal(false);
      setNewRecipe({
        product_id: '',
        material_id: '',
        quantity_needed: 1
      });
      fetchRecipes();
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('Failed to add recipe');
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Recipe deleted successfully');
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = 
      recipe.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.materials?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = selectedProduct === 'all' || recipe.product_id === selectedProduct;
    return matchesSearch && matchesProduct;
  });

  // Group recipes by product
  const recipesByProduct = filteredRecipes.reduce((groups, recipe) => {
    const productName = recipe.products?.name || 'Unknown Product';
    if (!groups[productName]) {
      groups[productName] = [];
    }
    groups[productName].push(recipe);
    return groups;
  }, {} as Record<string, Recipe[]>);

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
            <h1 className="text-3xl font-bold text-gray-900 handwritten">Recipe Builder</h1>
            <p className="text-gray-600 mt-1">Define how your products are made</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal hover:bg-teal-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Recipe
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-full sm:w-64">
              <Package className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recipes by Product */}
        <div className="space-y-8">
          {Object.entries(recipesByProduct).map(([productName, productRecipes]) => (
            <Card key={productName} className="craft-card transform rotate-1 hover:rotate-0 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl handwritten text-teal">
                  <Scissors className="w-5 h-5" />
                  {productName}
                  <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 5 Q 50 1 98 4" stroke="#5a8a8a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productRecipes.map((recipe, index) => (
                    <div key={recipe.id}>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg border-l-4 border-teal-400">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                          <span className="font-medium">
                            {recipe.quantity_needed} {recipe.materials?.unit_of_measurement} × {recipe.materials?.name}
                          </span>
                          <Badge 
                            variant={(recipe.materials?.current_stock || 0) >= recipe.quantity_needed ? 'default' : 'destructive'}
                            className="ml-2"
                          >
                            Stock: {recipe.materials?.current_stock || 0}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {index < productRecipes.length - 1 && (
                        <div className="text-center py-2">
                          <span className="handwritten text-2xl text-orange-500">+</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {productRecipes.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-teal-300">
                        <Sparkles className="w-5 h-5 text-teal-600" />
                        <span className="text-lg font-bold text-teal-800">= 1 × {productName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(recipesByProduct).length === 0 && (
            <Card className="craft-card">
              <CardContent className="text-center py-12">
                <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedProduct !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Start building your first product recipe'
                  }
                </p>
                {!searchTerm && selectedProduct === 'all' && (
                  <Button onClick={() => setShowAddModal(true)} className="bg-teal hover:bg-teal-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Recipe
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Recipe Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Recipe Step</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product</label>
                  <Select value={newRecipe.product_id} onValueChange={(value) => 
                    setNewRecipe(prev => ({ ...prev, product_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <Select value={newRecipe.material_id} onValueChange={(value) => 
                    setNewRecipe(prev => ({ ...prev, material_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.unit_of_measurement})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quantity Needed</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={newRecipe.quantity_needed}
                    onChange={(e) => setNewRecipe(prev => ({ 
                      ...prev, 
                      quantity_needed: parseFloat(e.target.value) || 1 
                    }))}
                  />
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
                  onClick={handleAddRecipe}
                  disabled={!newRecipe.product_id || !newRecipe.material_id}
                  className="flex-1 bg-teal hover:bg-teal-dark"
                >
                  Add Recipe Step
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}