import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle,
  Filter,
  Download,
  Upload,
  Eye
} from 'lucide-react'
import { MaterialForm } from '@/components/MaterialForm'

interface Material {
  id: string
  name: string
  current_stock: number
  unit_of_measurement: string
  cost_per_unit: number
  low_stock_threshold: number
  created_at: string
  updated_at: string
}

export default function Materials() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'low-stock' | 'out-of-stock'>('all')

  useEffect(() => {
    if (user) {
      fetchMaterials()
    }
  }, [user])

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('user_id', user?.id)
        .order('name', { ascending: true })

      if (error) throw error
      setMaterials(data || [])
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (material: Material) => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', material.id)

      if (error) throw error

      setMaterials(materials.filter(m => m.id !== material.id))
      setShowDeleteDialog(false)
      setSelectedMaterial(null)
    } catch (error) {
      console.error('Error deleting material:', error)
    }
  }

  const handleMaterialSave = () => {
    fetchMaterials()
    setShowForm(false)
    setSelectedMaterial(null)
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterType === 'low-stock') {
      return matchesSearch && material.current_stock <= material.low_stock_threshold && material.current_stock > 0
    }
    if (filterType === 'out-of-stock') {
      return matchesSearch && material.current_stock === 0
    }
    return matchesSearch
  })

  const getStockStatus = (material: Material) => {
    if (material.current_stock === 0) return 'out-of-stock'
    if (material.current_stock <= material.low_stock_threshold) return 'low-stock'
    return 'in-stock'
  }

  const getStockBadge = (material: Material) => {
    const status = getStockStatus(material)
    
    if (status === 'out-of-stock') {
      return <Badge className="bg-red-500 text-white">Out of Stock</Badge>
    }
    if (status === 'low-stock') {
      return <Badge className="bg-yellow-500 text-white">Low Stock</Badge>
    }
    return <Badge className="bg-green-500 text-white">In Stock</Badge>
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading materials...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Materials</h1>
            <p className="text-gray-600">Manage your raw materials and track stock levels.</p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setShowForm(true)}
              className=""
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Materials</p>
                <p className="text-2xl font-bold text-teal">{materials.length}</p>
              </div>
              <Package className="w-8 h-8 text-teal opacity-80" />
            </div>
          </Card>
          
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {materials.filter(m => m.current_stock <= m.low_stock_threshold && m.current_stock > 0).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600 opacity-80" />
            </div>
          </Card>
          
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {materials.filter(m => m.current_stock === 0).length}
                </p>
              </div>
              <Trash2 className="w-8 h-8 text-red-600 opacity-80" />
            </div>
          </Card>
          
          <Card className="craft-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-craft-brown">
                  £{materials.reduce((sum, m) => sum + (m.current_stock * m.cost_per_unit), 0).toFixed(2)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-craft-brown opacity-80" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="craft-card p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal focus:border-transparent"
              >
                <option value="all">All Materials</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Materials Table */}
        <Card className="craft-card overflow-hidden">
          {filteredMaterials.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' ? 'No materials found' : 'No materials yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start building your inventory by adding your first material'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <Button 
                  onClick={() => setShowForm(true)}
                  className=""
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Material
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost per Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500">
                            Threshold: {material.low_stock_threshold} {material.unit_of_measurement}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {material.current_stock} {material.unit_of_measurement}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          £{material.cost_per_unit.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStockBadge(material)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          £{(material.current_stock * material.cost_per_unit).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMaterial(material)
                              setShowForm(true)
                            }}
                            className=""
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMaterial(material)
                              setShowDeleteDialog(true)
                            }}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Material Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedMaterial ? 'Edit Material' : 'Add New Material'}
              </DialogTitle>
            </DialogHeader>
            <MaterialForm
              material={selectedMaterial}
              onSave={handleMaterialSave}
              onCancel={() => {
                setShowForm(false)
                setSelectedMaterial(null)
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{selectedMaterial?.name}</strong>? 
                This action cannot be undone and will remove this material from all product recipes.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setSelectedMaterial(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => selectedMaterial && handleDelete(selectedMaterial)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Material
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}