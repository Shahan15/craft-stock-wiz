-- Create integrations table to store platform connections
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('shopify', 'etsy')),
  shop_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  shop_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform, shop_name)
);

-- Enable RLS
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own integrations" 
ON public.integrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations" 
ON public.integrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
ON public.integrations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" 
ON public.integrations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create sync_logs table to track synchronization events
CREATE TABLE public.sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('products', 'orders', 'inventory')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')) DEFAULT 'success',
  items_processed INTEGER DEFAULT 0,
  error_message TEXT,
  sync_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for sync_logs
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for sync_logs
CREATE POLICY "Users can view sync logs for their integrations" 
ON public.sync_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.integrations 
  WHERE integrations.id = sync_logs.integration_id 
  AND integrations.user_id = auth.uid()
));

-- Create external_products table to map platform products to local products
CREATE TABLE public.external_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  local_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  external_product_id TEXT NOT NULL,
  external_variant_id TEXT,
  platform_data JSONB,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(integration_id, external_product_id)
);

-- Enable RLS for external_products
ALTER TABLE public.external_products ENABLE ROW LEVEL SECURITY;

-- Create policies for external_products
CREATE POLICY "Users can view external products for their integrations" 
ON public.external_products 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.integrations 
  WHERE integrations.id = external_products.integration_id 
  AND integrations.user_id = auth.uid()
));

CREATE POLICY "Users can create external products for their integrations" 
ON public.external_products 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.integrations 
  WHERE integrations.id = external_products.integration_id 
  AND integrations.user_id = auth.uid()
));

CREATE POLICY "Users can update external products for their integrations" 
ON public.external_products 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.integrations 
  WHERE integrations.id = external_products.integration_id 
  AND integrations.user_id = auth.uid()
));

CREATE POLICY "Users can delete external products for their integrations" 
ON public.external_products 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.integrations 
  WHERE integrations.id = external_products.integration_id 
  AND integrations.user_id = auth.uid()
));

-- Add trigger for updating timestamps
CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON public.integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();