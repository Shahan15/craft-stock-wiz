-- Add COGS (Cost of Goods Sold) column to products table
ALTER TABLE public.products 
ADD COLUMN cogs numeric DEFAULT 0 NOT NULL;