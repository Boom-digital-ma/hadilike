"use server";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function saveOrder(orderData: any) {
  try {
    const { brandId, cityId, cart, total, method, customer, status, paypalId } = orderData;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        brand_id: brandId,
        city_id: cityId,
        customer_name: customer.name.given_name + (customer.name.surname ? ' ' + customer.name.surname : ''),
        customer_phone: customer.phone.phone_number.national_number,
        customer_email: customer.email || null,
        total_amount: total,
        payment_method: method || (paypalId ? 'paypal' : 'unknown'),
        payment_status: status || (paypalId ? 'paid' : 'pending'),
        items: cart,
        metadata: { paypal_id: paypalId }
      })
      .select()
      .single();

    if (error) {
        console.error("Supabase Insert Error:", error);
        throw error;
    }

    return { success: true, message: "Commande enregistrée avec succès", orderId: data.id };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la commande:", error);
    return { success: false, message: "Erreur serveur interne", error: error };
  }
}
