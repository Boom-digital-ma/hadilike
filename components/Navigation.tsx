"use client";

import { useState } from "react";
import { Menu, ShoppingBag, X, ArrowLeft, CreditCard, Banknote, Landmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { saveOrder } from "@/app/actions";
import { Toast, ToastType } from "@/components/Toast";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const { cart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, toggleCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'western' | 'cod'>('paypal');
  const [customerDetails, setCustomerDetails] = useState({ name: "", phone: "" });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/\D/g, ""), 10);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + parsePrice(item.budget), 0);
  };

  const navigateTo = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const handleManualOrder = async () => {
    if (!customerDetails.name || !customerDetails.phone) {
        showToast("Veuillez remplir vos coordonnées (Nom et Tél/WhatsApp)", "error");
        return;
    }

    const orderData = {
        cart: cart,
        total: calculateTotal(),
        method: paymentMethod,
        customer: {
            name: { given_name: customerDetails.name, surname: "" },
            phone: { phone_number: { national_number: customerDetails.phone } }
        },
        status: paymentMethod === 'cod' ? 'PENDING_COD' : 'PENDING_WESTERN_UNION'
    };
    
    const result = await saveOrder(orderData);
    if (result.success) {
        showToast("Commande enregistrée avec succès !", "success");
        // Dispatch custom event or use router to handle success view
        window.dispatchEvent(new CustomEvent("orderCompleted", { detail: { ...orderData, id: `MANUAL-${Date.now()}` } }));
        clearCart();
        setIsCartOpen(false);
        setCustomerDetails({ name: "", phone: "" });
    } else {
        showToast("Erreur lors de l'enregistrement", "error");
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* === MENU DRAWER === */}
      <div 
        className={`fixed inset-0 z-[60] transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMenu}></div>
        <div className="relative w-3/4 max-w-sm h-full bg-white shadow-2xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-12">
              <Link href="/" onClick={toggleMenu} className="cursor-pointer">
                <img src="/images/logo-new.jpeg" alt="HADILIKE" className="h-12 object-contain" />
              </Link>
              <button onClick={toggleMenu} className="text-stone-400 hover:text-black transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="space-y-6">
              <button onClick={() => navigateTo("/")} className="block text-lg font-serif hover:text-stone-600 transition">Accueil</button>
              <button onClick={() => navigateTo("/a-propos")} className="block text-lg font-serif hover:text-stone-600 transition">L'Atelier</button>
              <div className="w-12 h-px bg-stone-200 my-6"></div>
              <button onClick={() => navigateTo("/mentions-legales")} className="block text-sm text-stone-500 hover:text-black transition">Mentions Légales</button>
              <button onClick={() => navigateTo("/cgv")} className="block text-sm text-stone-500 hover:text-black transition">CGV</button>
            </nav>
          </div>
          
          <div className="text-xs text-stone-400 uppercase tracking-widest">
            © 2025 Hadilike Marrakech
          </div>
        </div>
      </div>

      {/* === CART DRAWER === */}
      <div 
        className={`fixed inset-0 z-[60] transform transition-transform duration-500 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
        <div className="absolute right-0 w-3/4 max-w-sm h-full bg-white shadow-2xl p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl font-bold tracking-wider">PANIER</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-black transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {cart.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-stone-200" />
                <p className="font-serif text-lg text-stone-500">Votre panier est vide</p>
                <p className="text-xs text-stone-400 uppercase tracking-widest px-8">
                Parcourez nos créations pour trouver le bouquet idéal.
                </p>
                <button 
                onClick={() => { setIsCartOpen(false); router.push("/"); }}
                className="mt-6 px-8 py-3 border border-brand-black text-xs uppercase tracking-[0.2em] hover:bg-brand-black hover:text-white transition"
                >
                Découvrir
                </button>
            </div>
          ) : (
            <div className="flex-grow space-y-6">
                {cart.map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-stone-100 pb-4">
                        <div>
                            <p className="font-serif font-bold">{item.category}</p>
                            <p className="text-xs text-stone-500">{item.occasion} • {item.style}</p>
                            <p className="text-xs text-stone-400 mt-1">{item.date} ({item.slot})</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold mb-2">{item.budget}</p>
                            <button onClick={() => { removeFromCart(index); showToast("Article retiré", "info"); }} className="text-xs text-red-400 hover:text-red-600 underline transition">Retirer</button>
                        </div>
                    </div>
                ))}
            </div>
          )}
          
          <div className="pt-8 border-t border-stone-100 mt-auto">
            <div className="flex justify-between text-sm uppercase tracking-widest mb-6">
              <span>Total</span>
              <span className="font-bold">{calculateTotal()} DH</span>
            </div>
            
            {cart.length > 0 && (
                <div className="w-full">
                     <div className="mb-6 space-y-3">
                        <label className={`flex items-center space-x-3 p-3 rounded border cursor-pointer transition ${paymentMethod === 'paypal' ? 'border-brand-black bg-stone-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                            <input type="radio" name="payment" className="accent-brand-black" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                            <CreditCard className="w-5 h-5 text-stone-600" />
                            <span className="text-sm font-medium">PayPal / Carte Bancaire</span>
                        </label>
                        <label className={`flex items-center space-x-3 p-3 rounded border cursor-pointer transition ${paymentMethod === 'western' ? 'border-brand-black bg-stone-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                            <input type="radio" name="payment" className="accent-brand-black" checked={paymentMethod === 'western'} onChange={() => setPaymentMethod('western')} />
                            <Landmark className="w-5 h-5 text-stone-600" />
                            <span className="text-sm font-medium">Western Union</span>
                        </label>
                         <label className={`flex items-center space-x-3 p-3 rounded border cursor-pointer transition ${paymentMethod === 'cod' ? 'border-brand-black bg-stone-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                            <input type="radio" name="payment" className="accent-brand-black" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                            <Banknote className="w-5 h-5 text-stone-600" />
                            <span className="text-sm font-medium">Paiement à la livraison</span>
                        </label>
                     </div>

                     {paymentMethod !== 'paypal' && (
                        <div className="mb-6 space-y-4 bg-stone-50 p-4 rounded border border-stone-200 animate-in fade-in slide-in-from-top-2">
                             <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Vos coordonnées</p>
                             <input 
                                type="text" 
                                placeholder="Votre Nom complet" 
                                className="w-full p-3 text-sm border border-stone-300 rounded focus:border-brand-black focus:ring-0 outline-none"
                                value={customerDetails.name}
                                onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                             />
                             <input 
                                type="tel" 
                                placeholder="Téléphone / WhatsApp" 
                                className="w-full p-3 text-sm border border-stone-300 rounded focus:border-brand-black focus:ring-0 outline-none"
                                value={customerDetails.phone}
                                onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                             />
                        </div>
                     )}

                     {paymentMethod === 'paypal' && (
                        <PayPalButtons 
                            style={{ layout: "vertical", shape: "rect" }}
                            createOrder={(data, actions) => {
                                const totalAmount = calculateTotal();
                                return actions.order.create({
                                    intent: "CAPTURE", 
                                    purchase_units: [
                                        {
                                            description: "Commande Hadilike Fleurs",
                                            amount: {
                                                currency_code: "EUR",
                                                value: (totalAmount * 0.1).toFixed(2) 
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={async (data, actions) => {
                                if (actions.order) {
                                    const details = await actions.order.capture();
                                    const orderData = {
                                        paypalId: details.id,
                                        cart: cart,
                                        total: calculateTotal(),
                                        customer: details.payer,
                                        status: 'PAID'
                                    };
                                    
                                    await saveOrder(orderData);
                                    
                                    // Dispatch custom event or use router to handle success view
                                    window.dispatchEvent(new CustomEvent("orderCompleted", { detail: { ...orderData, id: details.id } }));
                                    clearCart();
                                    setIsCartOpen(false);
                                }
                            }}
                        />
                     )}

                     {paymentMethod === 'western' && (
                        <div className="bg-stone-50 p-4 rounded text-center border border-stone-200">
                             <p className="text-sm font-serif mb-2 text-stone-800">Transfert Western Union</p>
                             <p className="text-xs text-stone-500 mb-4">
                                Validez votre commande pour recevoir les coordonnées de transfert par email/WhatsApp.
                             </p>
                             <button onClick={handleManualOrder} className="w-full py-3 bg-brand-black text-white text-xs uppercase tracking-widest rounded hover:bg-stone-800 transition">
                                Confirmer la commande
                             </button>
                        </div>
                     )}

                     {paymentMethod === 'cod' && (
                         <div className="bg-stone-50 p-4 rounded text-center border border-stone-200">
                             <p className="text-sm font-serif mb-2 text-stone-800">Paiement à la livraison</p>
                             <p className="text-xs text-stone-500 mb-4">
                                Réglez votre commande en espèces directement auprès du livreur.
                             </p>
                             <button onClick={handleManualOrder} className="w-full py-3 bg-brand-black text-white text-xs uppercase tracking-widest rounded hover:bg-stone-800 transition">
                                Confirmer la commande
                             </button>
                        </div>
                     )}

                     <div className="mt-6 space-y-2 text-center">
                        <p className="text-xs text-stone-500">
                          ✓ Vous recevez une validation de votre commande après paiement par notre atelier.
                        </p>
                        <p className="text-xs text-stone-500">
                          ✓ Une photo réelle sera envoyée sur votre WhatsApp pour validation avant livraison le jour J.
                        </p>
                      </div>
                </div>
            )}
          </div>
        </div>
      </div>

      <header className="fixed top-0 w-full bg-white z-50 border-b border-stone-200">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={toggleMenu} className="text-brand-black hover:text-stone-600 transition">
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="cursor-pointer">
            <img src="/images/logo-new.jpeg" alt="HADILIKE" className="h-12 object-contain" />
          </Link>

          <button onClick={toggleCart} className="text-brand-black hover:text-stone-600 transition relative">
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}