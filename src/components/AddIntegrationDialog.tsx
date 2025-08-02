import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, ExternalLink } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface AddIntegrationDialogProps {
  onIntegrationAdded: () => void
}

export function AddIntegrationDialog({ onIntegrationAdded }: AddIntegrationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shopifyShop, setShopifyShop] = useState('')
  const [etsyShop, setEtsyShop] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const handleShopifyConnect = async () => {
    if (!shopifyShop.trim()) {
      toast.error('Please enter your Shopify shop name')
      return
    }

    setLoading('shopify')
    try {
      const { data, error } = await supabase.functions.invoke('shopify-auth', {
        method: 'GET',
        body: { shop: shopifyShop.trim().toLowerCase().replace('.myshopify.com', '') }
      })

      if (error) throw error

      // Store shop name for later use
      localStorage.setItem('shopify_shop_name', shopifyShop.trim().toLowerCase().replace('.myshopify.com', ''))
      
      // Redirect to Shopify OAuth
      window.location.href = data.authUrl
    } catch (error) {
      console.error('Shopify connection error:', error)
      toast.error('Failed to initiate Shopify connection')
    } finally {
      setLoading(null)
    }
  }

  const handleEtsyConnect = async () => {
    if (!etsyShop.trim()) {
      toast.error('Please enter your Etsy shop name')
      return
    }

    setLoading('etsy')
    try {
      const { data, error } = await supabase.functions.invoke('etsy-auth', {
        method: 'GET'
      })

      if (error) throw error

      // Store shop name and code verifier for later use
      localStorage.setItem('etsy_shop_name', etsyShop.trim())
      localStorage.setItem('etsy_code_verifier', data.codeVerifier)
      
      // Redirect to Etsy OAuth
      window.location.href = data.authUrl
    } catch (error) {
      console.error('Etsy connection error:', error)
      toast.error('Failed to initiate Etsy connection')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="craft-card">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
          <DialogDescription>
            Connect your Stock-Kit account to external platforms to sync inventory and orders.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="craft-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛍️</span>
                <div>
                  <CardTitle className="text-lg">Shopify</CardTitle>
                  <CardDescription>Connect your Shopify store</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="shopify-shop">Shop Name</Label>
                <Input
                  id="shopify-shop"
                  placeholder="your-shop-name"
                  value={shopifyShop}
                  onChange={(e) => setShopifyShop(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter just the shop name (without .myshopify.com)
                </p>
              </div>
              <Button
                onClick={handleShopifyConnect}
                disabled={loading === 'shopify' || !shopifyShop.trim()}
                className="w-full"
                size="sm"
              >
                {loading === 'shopify' ? 'Connecting...' : 'Connect Shopify'}
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="craft-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎨</span>
                <div>
                  <CardTitle className="text-lg">Etsy</CardTitle>
                  <CardDescription>Connect your Etsy shop</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="etsy-shop">Shop Name</Label>
                <Input
                  id="etsy-shop"
                  placeholder="YourEtsyShopName"
                  value={etsyShop}
                  onChange={(e) => setEtsyShop(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your Etsy shop name as it appears in your shop URL
                </p>
              </div>
              <Button
                onClick={handleEtsyConnect}
                disabled={loading === 'etsy' || !etsyShop.trim()}
                className="w-full"
                size="sm"
              >
                {loading === 'etsy' ? 'Connecting...' : 'Connect Etsy'}
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}