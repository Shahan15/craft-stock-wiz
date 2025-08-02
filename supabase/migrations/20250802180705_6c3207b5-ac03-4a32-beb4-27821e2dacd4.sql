-- Fix function search path security issue
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;