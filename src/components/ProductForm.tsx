import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Plus, X, Minus, Upload, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Material {
  id: string
  name: string
  current_stock: number
  unit_of_measurement: string
  cost_per_unit: number
}

interface Recipe {
  material_id: string
  quantity_needed: number
  materials?: Material
}

interface Product {
  id: string
  name: string
  selling_price: number
  photo_url: string | null
  recipes: Recipe[]
}

interface ProductFormProps {
  product?: Product | null
  materials: Material[]
  onSave: () => void
  onCancel: () => void
}

export function ProductForm({ product, materials, onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.photo_url || null)
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    selling_price: product?.selling_price || 0,
    photo_url: product?.photo_url || '',
  })

  const [recipes, setRecipes] = useState<Recipe[]>(
    product?.recipes || []
  )

  const [availableMaterials, setAvailableMaterials] = useState<Material[]>([])

  useEffect(() => {
    // Filter out materials already in the recipe
    const usedMaterialIds = recipes.map(r => r.material_id)
    setAvailableMaterials(materials.filter(m => !usedMaterialIds.includes(m.id)))
  }, [materials, recipes])

  const calculateCOGS = () => {
    let totalCost = 0
    for (const recipe of recipes) {
      const material = getMaterialById(recipe.material_id)
      if (material) {
        totalCost += recipe.quantity_needed * material.cost_per_unit
      }
    }
    return totalCost
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      setError('')

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

      setFormData(prev => ({ ...prev, photo_url: publicUrl }))
      setImagePreview(publicUrl)
      toast.success('Image uploaded successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, photo_url: '' }))
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (recipes.length === 0) {
      setError('Please add at least one material to the recipe')
      setLoading(false)
      return
    }

    try {
      let productId = product?.id
      const cogs = calculateCOGS()

      if (product) {
        // Update existing product
        const { error: productError } = await supabase
          .from('products')
          .update({
            ...formData,
            cogs
          })
          .eq('id', product.id)

        if (productError) throw productError

        // Delete existing recipes
        const { error: deleteError } = await supabase
          .from('recipes')
          .delete()
          .eq('product_id', product.id)

        if (deleteError) throw deleteError
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert([{
            ...formData,
            cogs,
            user_id: user?.id
          }])
          .select()
          .single()

        if (productError) throw productError
        productId = newProduct.id
      }

      // Insert new recipes
      const recipeData = recipes.map(recipe => ({
        product_id: productId,
        material_id: recipe.material_id,
        quantity_needed: recipe.quantity_needed
      }))

      const { error: recipeError } = await supabase
        .from('recipes')
        .insert(recipeData)

      if (recipeError) throw recipeError

      onSave()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addRecipeItem = () => {
    if (availableMaterials.length > 0) {
      setRecipes([...recipes, {
        material_id: availableMaterials[0].id,
        quantity_needed: 1
      }])
    }
  }

  const removeRecipeItem = (index: number) => {
    setRecipes(recipes.filter((_, i) => i !== index))
  }

  const updateRecipeItem = (index: number, field: string, value: string | number) => {
    const updatedRecipes = [...recipes]
    updatedRecipes[index] = {
      ...updatedRecipes[index],
      [field]: value
    }
    setRecipes(updatedRecipes)
  }

  const getMaterialById = (id: string) => {
    return materials.find(m => m.id === id)
  }

  const canMakeUnits = () => {
    if (recipes.length === 0) return 0
    
    let minUnits = Infinity
    for (const recipe of recipes) {
      const material = getMaterialById(recipe.material_id)
      if (material) {
        const possibleUnits = Math.floor(material.current_stock / recipe.quantity_needed)
        minUnits = Math.min(minUnits, possibleUnits)
      }
    }
    return minUnits === Infinity ? 0 : minUnits
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-craft-orange focus:border-transparent"
            placeholder="e.g., Beaded Necklace, Silver Ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price (£) *
            </label>
            <input
              id="selling_price"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.selling_price}
              onChange={(e) => setFormData(prev => ({ ...prev, selling_price: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-craft-orange focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="photo_upload" className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="space-y-3">
              <input
                id="photo_upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-craft-orange focus:border-transparent"
              />
              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-100 hover:bg-red-200 border-red-300"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              )}
              {uploadingImage && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 border-2 border-craft-orange border-t-transparent rounded-full animate-spin"></div>
                  Uploading image...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recipe Builder</h3>
          <div className="text-sm text-gray-600">
            Can make: <span className="font-semibold text-teal">{canMakeUnits()} units</span>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No materials in recipe yet</p>
              <p className="text-sm">Add materials to build your product recipe</p>
            </div>
            {availableMaterials.length > 0 ? (
              <Button
                type="button"
                onClick={addRecipeItem}
                className="bg-craft-orange hover:bg-craft-orange/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Material
              </Button>
            ) : (
              <div className="text-gray-500">
                <p className="text-sm">No materials available</p>
                <p className="text-xs">Please add materials to your inventory first</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {recipes.map((recipe, index) => {
              const material = getMaterialById(recipe.material_id)
              const maxQuantity = material ? material.current_stock : 0
              
              return (
                <div key={index} className="flex items-center space-x-3 p-4 bg-craft-cream rounded-lg">
                  <div className="flex-1">
                    <select
                      value={recipe.material_id}
                      onChange={(e) => updateRecipeItem(index, 'material_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-craft-orange focus:border-transparent"
                    >
                      {/* Current selection */}
                      {material && (
                        <option value={material.id}>
                          {material.name} ({material.current_stock} {material.unit_of_measurement} available)
                        </option>
                      )}
                      
                      {/* Other available materials */}
                      {availableMaterials.map(mat => (
                        <option key={mat.id} value={mat.id}>
                          {mat.name} ({mat.current_stock} {mat.unit_of_measurement} available)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-32">
                    <input
                      type="number"
                      min="0.01"
                      max={maxQuantity}
                      step="0.01"
                      value={recipe.quantity_needed}
                      onChange={(e) => updateRecipeItem(index, 'quantity_needed', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-craft-orange focus:border-transparent"
                      placeholder="Qty"
                    />
                  </div>
                  
                  {material && (
                    <div className="text-xs text-gray-500 w-16">
                      {material.unit_of_measurement}
                    </div>
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRecipeItem(index)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}
            
            {availableMaterials.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addRecipeItem}
                className="w-full border-dashed border-gray-400 text-gray-600 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Material
              </Button>
            )}
          </div>
        )}

        {recipes.length > 0 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Recipe Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                {recipes.map((recipe, index) => {
                  const material = getMaterialById(recipe.material_id)
                  const itemCost = material ? recipe.quantity_needed * material.cost_per_unit : 0
                  return material ? (
                    <div key={index} className="flex justify-between">
                      <span>{recipe.quantity_needed} {material.unit_of_measurement} {material.name}</span>
                      <span>£{itemCost.toFixed(2)}</span>
                    </div>
                  ) : null
                })}
                <div className="border-t border-blue-300 pt-2 mt-2 font-semibold flex justify-between">
                  <span>Total COGS per unit:</span>
                  <span>£{calculateCOGS().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Price:</span>
                  <span>£{formData.selling_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Profit per unit:</span>
                  <span className={formData.selling_price - calculateCOGS() > 0 ? 'text-green-600' : 'text-red-600'}>
                    £{(formData.selling_price - calculateCOGS()).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-blue-700 mt-2">
                  You can make {canMakeUnits()} units with current stock
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || recipes.length === 0}
          className="flex-1 bg-craft-orange hover:bg-craft-orange/90 text-white"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            product ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  )
}
