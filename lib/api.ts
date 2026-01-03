import { supabase } from './supabase';

export async function getBrand(slug: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getCategories(brandId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data;
}

export async function getBudgets(brandId: string, cityId?: string, categoryId?: string) {
  let query = supabase
    .from('budgets')
    .select('*')
    .eq('brand_id', brandId);

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('display_order');
  if (error) throw error;
  return data;
}

export async function getStyles(brandId: string) {
  const { data, error } = await supabase
    .from('styles')
    .select('*')
    .eq('brand_id', brandId);

  if (error) throw error;
  return data;
}

export async function getOccasions(brandId: string, categoryId?: string) {
  let query = supabase
    .from('occasions')
    .select('*')
    .eq('brand_id', brandId);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('display_order');
  if (error) throw error;
  return data;
}

export async function getSiteSettings(brandId: string, cityId?: string) {
  let query = supabase
    .from('site_settings')
    .select('*')
    .eq('brand_id', brandId);

  // We fetch both global (city_id is null) and specific city settings
  const { data, error } = await query;
  if (error) throw error;
  
  // Transform array into a handy object
  const settings: Record<string, any> = {};
  data.forEach((s: any) => {
    settings[s.key] = s.value;
  });
  return settings;
}

export async function getReviews(brandId: string, cityId?: string) {
  let query = supabase
    .from('reviews')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_visible', true);

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getGalleryImages(brandId: string, categoryId?: string) {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .eq('brand_id', brandId);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('display_order');
  if (error) throw error;
  return data;
}

export async function getPage(brandId: string, slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('brand_id', brandId)
    .eq('slug', slug)
    .single();

  if (error) return null; // Return null instead of throwing for cleaner handling in components
  return data;
}

// Special helper to get the "Cities" of a brand
export async function getCities(brandId: string) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}
