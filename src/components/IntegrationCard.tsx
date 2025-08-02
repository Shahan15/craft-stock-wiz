import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle, Clock, RefreshCw, Settings, Trash2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface Integration {
  id: string
  platform: 'shopify' | 'etsy'
  shop_name: string
  shop_url?: string
  is_active: boolean
  last_sync_at?: string
  created_at: string
}

interface IntegrationCardProps {
  integration: Integration
  onSync: (integrationId: string, syncType: string) => void
  onDelete: (integrationId: string) => void
  onToggleActive: (integrationId: string, isActive: boolean) => void
}

export function IntegrationCard({ integration, onSync, onDelete, onToggleActive }: IntegrationCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSync = async (syncType: string) => {
    setIsLoading(true)
    try {
      await onSync(integration.id, syncType)
      toast.success(`${syncType} sync completed successfully`)
    } catch (error) {
      toast.error(`Failed to sync ${syncType}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      await onToggleActive(integration.id, !integration.is_active)
      toast.success(`Integration ${integration.is_active ? 'disabled' : 'enabled'}`)
    } catch (error) {
      toast.error('Failed to update integration status')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this integration? This cannot be undone.')) {
      try {
        await onDelete(integration.id)
        toast.success('Integration deleted successfully')
      } catch (error) {
        toast.error('Failed to delete integration')
      }
    }
  }

  const getPlatformIcon = () => {
    switch (integration.platform) {
      case 'shopify':
        return '🛍️'
      case 'etsy':
        return '🎨'
      default:
        return '🔗'
    }
  }

  const getStatusBadge = () => {
    if (!integration.is_active) {
      return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Disabled</Badge>
    }
    
    if (integration.last_sync_at) {
      const lastSync = new Date(integration.last_sync_at)
      const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceSync < 1) {
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Synced</Badge>
      } else if (hoursSinceSync < 24) {
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Needs Sync</Badge>
      }
    }
    
    return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Never Synced</Badge>
  }

  return (
    <Card className="craft-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getPlatformIcon()}</span>
            <div>
              <CardTitle className="text-lg capitalize">{integration.platform}</CardTitle>
              <CardDescription className="text-sm">{integration.shop_name}</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {integration.shop_url && (
          <p className="text-sm text-muted-foreground">
            <a href={integration.shop_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {integration.shop_url}
            </a>
          </p>
        )}
        
        {integration.last_sync_at && (
          <p className="text-xs text-muted-foreground">
            Last synced: {new Date(integration.last_sync_at).toLocaleString()}
          </p>
        )}
        
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick Sync</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSync('products')}
              disabled={isLoading || !integration.is_active}
            >
              {isLoading ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : null}
              Products
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSync('orders')}
              disabled={isLoading || !integration.is_active}
            >
              {isLoading ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : null}
              Orders
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSync('inventory')}
              disabled={isLoading || !integration.is_active}
            >
              {isLoading ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : null}
              Inventory
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleActive}
          >
            <Settings className="w-3 h-3 mr-1" />
            {integration.is_active ? 'Disable' : 'Enable'}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}