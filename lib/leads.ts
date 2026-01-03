import { supabase } from './supabase';

export async function saveLead(brandId: string, data: any) {
  const { error } = await supabase
    .from('leads')
    .insert({
      brand_id: brandId,
      ...data
    });

  if (error) {
    console.error("Error saving lead:", error);
    throw error;
  }
  return true;
}
