import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IntegrationCard } from '@/components/IntegrationCard'
import { AddIntegrationDialog } from '@/components/AddIntegrationDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, Link, Settings, TrendingUp } from 'lucide-react'
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

interface SyncLog {
  id: string
  sync_type: string
  status: 'success' | 'error' | 'partial'
  items_processed: number
  error_message?: string
  created_at: string
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    loadIntegrations()
    loadSyncLogs()
    
    // Handle OAuth callbacks
    handleOAuthCallback()
  }, [])

  const loadIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setIntegrations(data || [])
    } catch (error) {
      console.error('Error loading integrations:', error)
      toast.error('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }

  const loadSyncLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('sync_logs')
        .select(`
          id,
          sync_type,
          status,
          items_processed,
          error_message,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setSyncLogs(data || [])
    } catch (error) {
      console.error('Error loading sync logs:', error)
    }
  }

  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const shop = urlParams.get('shop')
    
    if (code) {
      if (shop) {
        // Shopify callback
        await handleShopifyCallback(code, shop)
      } else {
        // Etsy callback
        await handleEtsyCallback(code)
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  const handleShopifyCallback = async (code: string, shop: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('shopify-auth', {
        method: 'POST',
        body: { shop, code }
      })

      if (error) throw error

      // Save integration
      const { error: saveError } = await supabase
        .from('integrations')
        .insert({
          platform: 'shopify',
          shop_name: shop,
          shop_url: `https://${shop}.myshopify.com`,
          access_token: data.access_token
        })

      if (saveError) throw saveError

      toast.success('Shopify integration added successfully!')
      loadIntegrations()
    } catch (error) {
      console.error('Shopify callback error:', error)
      toast.error('Failed to complete Shopify integration')
    }
  }

  const handleEtsyCallback = async (code: string) => {
    try {
      const codeVerifier = localStorage.getItem('etsy_code_verifier')
      const shopName = localStorage.getItem('etsy_shop_name')
      
      if (!codeVerifier || !shopName) {
        throw new Error('Missing required data for Etsy integration')
      }

      const { data, error } = await supabase.functions.invoke('etsy-auth', {
        method: 'POST',
        body: { code, codeVerifier }
      })

      if (error) throw error

      // Save integration
      const { error: saveError } = await supabase
        .from('integrations')
        .insert({
          platform: 'etsy',
          shop_name: shopName,
          shop_url: `https://www.etsy.com/shop/${shopName}`,
          access_token: data.access_token,
          refresh_token: data.refresh_token
        })

      if (saveError) throw saveError

      // Clean up localStorage
      localStorage.removeItem('etsy_code_verifier')
      localStorage.removeItem('etsy_shop_name')

      toast.success('Etsy integration added successfully!')
      loadIntegrations()
    } catch (error) {
      console.error('Etsy callback error:', error)
      toast.error('Failed to complete Etsy integration')
    }
  }

  const handleSync = async (integrationId: string, syncType: string) => {
    setSyncing(true)
    try {
      const { data, error } = await supabase.functions.invoke('shopify-sync', {
        body: { integrationId, syncType }
      })

      if (error) throw error

      toast.success(`${syncType} sync completed successfully`)
      loadSyncLogs()
      loadIntegrations()
    } catch (error) {
      console.error('Sync error:', error)
      toast.error(`Failed to sync ${syncType}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleDeleteIntegration = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId)

      if (error) throw error
      loadIntegrations()
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  const handleToggleActive = async (integrationId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: isActive })
        .eq('id', integrationId)

      if (error) throw error
      loadIntegrations()
    } catch (error) {
      console.error('Toggle error:', error)
      throw error
    }
  }

  const activeIntegrations = integrations.filter(i => i.is_active).length
  const recentSyncs = syncLogs.filter(log => {
    const logDate = new Date(log.created_at)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return logDate > dayAgo
  }).length

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading integrations...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold relative inline-block">
              Platform Integrations
              <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5 Q 50 1 98 4" stroke="hsl(var(--craft-orange))" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </h1>
            <p className="text-muted-foreground mt-2">Connect and sync with external platforms</p>
          </div>
          <AddIntegrationDialog onIntegrationAdded={loadIntegrations} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeIntegrations}</div>
              <p className="text-xs text-muted-foreground">
                out of {integrations.length} total
              </p>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Syncs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentSyncs}</div>
              <p className="text-xs text-muted-foreground">
                in the last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {syncing ? 'Syncing...' : 'Ready'}
              </div>
              <p className="text-xs text-muted-foreground">
                {syncing ? 'Sync in progress' : 'All systems operational'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Grid */}
        {integrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onSync={handleSync}
                onDelete={handleDeleteIntegration}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        ) : (
          <Card className="craft-card text-center py-12">
            <CardContent>
              <Link className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Integrations Yet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your first platform to start syncing inventory and orders
              </p>
              <AddIntegrationDialog onIntegrationAdded={loadIntegrations} />
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {syncLogs.length > 0 && (
          <Card className="craft-card">
            <CardHeader>
              <CardTitle className="relative inline-block">
                Recent Sync Activity
                <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 5 Q 50 1 98 4" stroke="hsl(var(--craft-orange))" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </CardTitle>
              <CardDescription>Latest synchronization events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="bg-green-500">
                        {log.status}
                      </Badge>
                      <span className="text-sm capitalize">{log.sync_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {log.items_processed} items
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}