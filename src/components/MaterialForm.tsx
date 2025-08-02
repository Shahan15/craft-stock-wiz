import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { X } from 'lucide-react'

interface Material {
  id: string
  name: string
  current_stock: number
  unit_of_measurement: string
  cost_per_unit: number
  low_stock_threshold: number
}

interface MaterialFormProps {
  material?: Material | null
  onSave: () => void
  onCancel: () => void
}

export function MaterialForm({ material, onSave, onCancel }: MaterialFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: material?.name || '',
    current_stock: material?.current_stock || 0,
    unit_of_measurement: material?.unit_of_measurement || '',
    cost_per_unit: material?.cost_per_unit || 0,
    low_stock_threshold: material?.low_stock_threshold || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (material) {
        // Update existing material
        const { error } = await supabase
          .from('materials')
          .update(formData)
          .eq('id', material.id)

        if (error) throw error
      } else {
        // Create new material
        const { error } = await supabase
          .from('materials')
          .insert([{
            ...formData,
            user_id: user?.id
          }])

        if (error) throw error
      }

      onSave()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Material Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
          placeholder="e.g., Silver Chain, Glass Beads"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="current_stock" className="block text-sm font-medium text-gray-700 mb-1">
            Current Stock *
          </label>
          <input
            id="current_stock"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.current_stock}
            onChange={(e) => handleInputChange('current_stock', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="unit_of_measurement" className="block text-sm font-medium text-gray-700 mb-1">
            Unit *
          </label>
          <select
            id="unit_of_measurement"
            required
            value={formData.unit_of_measurement}
            onChange={(e) => handleInputChange('unit_of_measurement', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
          >
            <option value="">Select unit</option>
            <option value="pieces">Pieces</option>
            <option value="grams">Grams</option>
            <option value="ml">Milliliters</option>
            <option value="meters">Meters</option>
            <option value="inches">Inches</option>
            <option value="sheets">Sheets</option>
            <option value="bottles">Bottles</option>
            <option value="packets">Packets</option>
            <option value="yards">Yards</option>
            <option value="feet">Feet</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cost_per_unit" className="block text-sm font-medium text-gray-700 mb-1">
            Cost per Unit (£) *
          </label>
          <input
            id="cost_per_unit"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.cost_per_unit}
            onChange={(e) => handleInputChange('cost_per_unit', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-700 mb-1">
            Low Stock Alert
          </label>
          <input
            id="low_stock_threshold"
            type="number"
            min="0"
            step="0.01"
            value={formData.low_stock_threshold}
            onChange={(e) => handleInputChange('low_stock_threshold', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

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
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            material ? 'Update Material' : 'Add Material'
          )}
        </Button>
      </div>
    </form>
  )
}