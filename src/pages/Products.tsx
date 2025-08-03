import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useExport } from '@/hooks/useExport'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Palette, 
  Package, 
  DollarSign,
  Eye,
  Image as ImageIcon,
  AlertCircle,
  Download,
  FileText
} from 'lucide-react'
import { ProductForm } from '@/components/ProductForm'

interface Material {
  id: string
  name: string
  current_stock: number
  unit_of_measurement: string
  cost_per_unit: number
}

interface Recipe {
  id: string
  material_id: string
  quantity_needed: number
  materials: Material
}

interface Product {
  id: string
  name: string
  selling_price: number
  photo_url: string | null
  created_at: string
  recipes: Recipe[]
}

export default function Products() {
  const { user } = useAuth()
  const { exportProducts } = useExport()
  const [products, setProducts] = useState<Product[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productStock, setProductStock] = useState<Record<string, number>>({})

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch products with recipes
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          recipes (
            id,
            material_id,
            quantity_needed,
            materials (
              id,
              name,
              current_stock,
              unit_of_measurement,
              cost_per_unit
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('name', { ascending: true })

      if (productsError) throw productsError

      // Fetch materials for recipe builder
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select('id, name, current_stock, unit_of_measurement, cost_per_unit')
        .eq('user_id', user?.id)
        .order('name', { ascending: true })

      if (materialsError) throw materialsError

      setProducts(productsData || [])
      setMaterials(materialsData || [])

      // Calculate available stock for each product
      const stockCalculations: Record<string, number> = {}
      for (const product of productsData || []) {
        stockCalculations[product.id] = await calculateProductStock(product.id)
      }
      setProductStock(stockCalculations)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProductStock = async (productId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_product_stock', { product_id_param: productId })

      if (error) throw error
      return data || 0
    } catch (error) {
      console.error('Error calculating stock:', error)
      return 0
    }
  }

  const handleDelete = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      setProducts(products.filter(p => p.id !== product.id))
      setShowDeleteDialog(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleProductSave = () => {
    fetchData()
    setShowForm(false)
    setSelectedProduct(null)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'out-of-stock'
    if (stock <= 5) return 'low-stock'
    return 'in-stock'
  }

  const getStockBadge = (stock: number) => {
    const status = getStockStatus(stock)
    
    if (status === 'out-of-stock') {
      return <Badge className="bg-red-500 text-white">Cannot Make</Badge>
    }
    if (status === 'low-stock') {
      return <Badge className="bg-yellow-500 text-white">Low Materials</Badge>
    }
    return <Badge className="bg-green-500 text-white">Ready to Make</Badge>
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Manage your finished products and build recipes.</p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => exportProducts('csv')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="outline"
              onClick={() => exportProducts('json')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-craft-orange hover:bg-craft-orange/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-craft-orange">{products.length}</p>
              </div>
              <Palette className="w-8 h-8 text-craft-orange opacity-80" />
            </div>
          </Card>
          
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ready to Make</p>
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(productStock).filter(stock => stock > 5).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-600 opacity-80" />
            </div>
          </Card>
          
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Materials</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {Object.values(productStock).filter(stock => stock > 0 && stock <= 5).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600 opacity-80" />
            </div>
          </Card>
          
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg. Product Value</p>
                <p className="text-2xl font-bold text-craft-brown">
                  £{products.length ? (products.reduce((sum, p) => sum + p.selling_price, 0) / products.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-craft-brown opacity-80" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="craft-card p-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-craft-orange focus:border-transparent"
            />
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="craft-card p-12 text-center">
            <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Start building your product catalog with recipes'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-craft-orange hover:bg-craft-orange/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Product
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="craft-card overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Product Image */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  {product.photo_url ? (
                    <img 
                      src={product.photo_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No image</p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStockBadge(productStock[product.id] || 0)}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <p className="text-lg font-semibold text-craft-orange">
                      £{product.selling_price.toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Available Stock:</p>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {productStock[product.id] || 0} units can be made
                      </span>
                    </div>
                  </div>

                  {/* Recipe Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Recipe ({product.recipes.length} materials):</p>
                    <div className="space-y-1">
                      {product.recipes.slice(0, 2).map((recipe) => (
                        <div key={recipe.id} className="text-xs text-gray-500 flex items-center space-x-1">
                          <span>•</span>
                          <span>
                            {recipe.quantity_needed} {recipe.materials.unit_of_measurement} {recipe.materials.name}
                          </span>
                        </div>
                      ))}
                      {product.recipes.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{product.recipes.length - 2} more materials
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowForm(true)
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowDeleteDialog(true)
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Product Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={selectedProduct}
              materials={materials}
              onSave={handleProductSave}
              onCancel={() => {
                setShowForm(false)
                setSelectedProduct(null)
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? 
                This action cannot be undone and will remove the product and its recipe.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setSelectedProduct(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => selectedProduct && handleDelete(selectedProduct)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}