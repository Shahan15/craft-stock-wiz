-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit_of_measurement TEXT NOT NULL,
  cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
  low_stock_threshold DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipes table (junction table for products and materials)
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  quantity_needed DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, material_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_sold INTEGER NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for materials
CREATE POLICY "Users can view their own materials" 
ON public.materials FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own materials" 
ON public.materials FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials" 
ON public.materials FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials" 
ON public.materials FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for products
CREATE POLICY "Users can view their own products" 
ON public.products FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" 
ON public.products FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.products FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.products FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for recipes
CREATE POLICY "Users can view recipes for their products" 
ON public.recipes FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = recipes.product_id 
  AND products.user_id = auth.uid()
));

CREATE POLICY "Users can create recipes for their products" 
ON public.recipes FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = recipes.product_id 
  AND products.user_id = auth.uid()
));

CREATE POLICY "Users can update recipes for their products" 
ON public.recipes FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = recipes.product_id 
  AND products.user_id = auth.uid()
));

CREATE POLICY "Users can delete recipes for their products" 
ON public.recipes FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = recipes.product_id 
  AND products.user_id = auth.uid()
));

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" 
ON public.orders FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON public.materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate available stock for products
CREATE OR REPLACE FUNCTION public.calculate_product_stock(product_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  min_possible INTEGER := 999999;
  recipe_record RECORD;
  possible_units INTEGER;
BEGIN
  -- Loop through all materials in the product recipe
  FOR recipe_record IN 
    SELECT r.quantity_needed, m.current_stock
    FROM public.recipes r
    JOIN public.materials m ON r.material_id = m.id
    WHERE r.product_id = product_id_param
  LOOP
    -- Calculate how many units can be made with this material
    possible_units := FLOOR(recipe_record.current_stock / recipe_record.quantity_needed);
    
    -- Track the minimum (bottleneck material)
    IF possible_units < min_possible THEN
      min_possible := possible_units;
    END IF;
  END LOOP;
  
  -- If no recipes found, return 0
  IF min_possible = 999999 THEN
    RETURN 0;
  END IF;
  
  RETURN min_possible;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;