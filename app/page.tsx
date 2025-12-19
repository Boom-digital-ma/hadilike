"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { saveOrder } from "@/app/actions";
import { Toast, ToastType } from "@/components/Toast";

// Types for State
type AppView = "home" | "wizard" | "contact";
type WizardState = {
  id?: string;
  category: string;
  occasion: string;
  style: string;
  budget: string;
  message: string;
  date: string;
  slot: string;
};

// Paypal Options
const initialOptions = {
    clientId: "test", 
    currency: "EUR", 
    intent: "capture",
};

export default function HadilikeApp() {
  const [view, setView] = useState<AppView>("home");
  const [step, setStep] = useState(1);
  const [contactTitle, setContactTitle] = useState("Contact");
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  
  // App State
  const [order, setOrder] = useState<WizardState>({
    category: "",
    occasion: "",
    style: "",
    budget: "",
    message: "",
    date: "",
    slot: "",
  });

  const [cart, setCart] = useState<WizardState[]>([]);

  // --- Helpers ---
  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/\D/g, ""), 10);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + parsePrice(item.budget), 0);
  };

  // --- Actions ---
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const startWizard = (category: string) => {
    setOrder((prev) => ({ ...prev, category }));
    setStep(1);
    switchView("wizard");
  };

  const showContact = (type: string) => {
    setContactTitle(type);
    switchView("contact");
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  const resetApp = () => {
    setOrder({
      category: "",
      occasion: "",
      style: "",
      budget: "",
      message: "",
      date: "",
      slot: "",
    });
    setStep(1);
    switchView("home");
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  const switchView = (newView: AppView) => {
    setIsAnimationPlaying(true);
    setTimeout(() => {
      setView(newView);
      setIsAnimationPlaying(false);
    }, 100); 
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else resetApp();
  };

  const updateOrder = (key: keyof WizardState, value: string) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
    nextStep();
  };

  const addToCart = () => {
    const newOrder = { 
        ...order, 
        id: `HDL-${Math.floor(Math.random() * 10000)}` 
    };
    setCart([...cart, newOrder]);
    resetApp(); 
    setIsCartOpen(true); 
    showToast("Création ajoutée au panier", "success");
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    showToast("Article retiré", "info");
  };

  // --- Logic for Date Restriction (14h rule) ---
  const getMinDate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    let minDate = new Date();

    if (currentHour >= 14) {
      minDate.setDate(minDate.getDate() + 1);
    }
    return minDate.toISOString().split("T")[0];
  };

  const isLate = new Date().getHours() >= 14;

  const validateStep5 = () => {
    if (!order.date || !order.slot) {
      showToast("Veuillez choisir une date et un créneau.", "error");
      return;
    }
    nextStep();
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {/* Toast Notification */}
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
              <h2 className="font-serif text-2xl font-bold tracking-wider">HADILIKE</h2>
              <button onClick={toggleMenu} className="text-stone-400 hover:text-black">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="space-y-6">
              <button onClick={resetApp} className="block text-lg font-serif hover:text-stone-600 transition">Accueil</button>
              <button onClick={() => showContact("Contact")} className="block text-lg font-serif hover:text-stone-600 transition">Contact</button>
              <Link href="/a-propos" className="block text-lg font-serif hover:text-stone-600 transition">L'Atelier</Link>
              <div className="w-12 h-px bg-stone-200 my-6"></div>
              <Link href="/mentions-legales" className="block text-sm text-stone-500 hover:text-black transition">Mentions Légales</Link>
              <Link href="/cgv" className="block text-sm text-stone-500 hover:text-black transition">CGV</Link>
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
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart}></div>
        <div className="absolute right-0 w-3/4 max-w-sm h-full bg-white shadow-2xl p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl font-bold tracking-wider">PANIER</h2>
            <button onClick={toggleCart} className="text-stone-400 hover:text-black">
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
                onClick={() => { toggleCart(); resetApp(); }}
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
                            <button onClick={() => removeFromCart(index)} className="text-xs text-red-400 hover:text-red-600 underline">Retirer</button>
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
                                    customer: details.payer
                                };
                                
                                await saveOrder(orderData);
                                
                                const firstName = details.payer?.name?.given_name || "Client";
                                showToast(`Merci ${firstName}! Commande validée.`, "success");
                                setCart([]); 
                                toggleCart(); 
                            }
                        }}
                     />
                </div>
            )}
          </div>
        </div>
      </div>

      <header className="fixed top-0 w-full bg-brand-bg/95 backdrop-blur-sm z-50 border-b border-stone-200">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={toggleMenu} className="text-brand-black hover:text-stone-600 transition">
            <Menu className="w-6 h-6" />
          </button>

          <div onClick={resetApp} className="cursor-pointer">
            <img src="/images/logo.jpeg" alt="HADILIKE" className="h-8 object-contain" />
          </div>

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

      <main className={`pt-24 pb-12 max-w-md mx-auto min-h-screen px-6 transition-opacity duration-300 ${isAnimationPlaying ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* === HOME VIEW === */}
        {view === "home" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col min-h-[80vh]">
            <div className="flex-grow">
            <h2 className="font-serif text-3xl text-center mb-2">L'Art Floral</h2>
            <p className="text-center text-stone-500 mb-8 text-sm uppercase tracking-widest">
              Marrakech
            </p>

            <div className="space-y-4">
              <button
                onClick={() => startWizard("Bouquets")}
                className="w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition z-10">
                  <span className="font-serif text-xl text-white tracking-wide">
                    Bouquets
                  </span>
                </div>
                <div className="w-full h-full bg-[url('/images/boite.jpeg')] bg-cover bg-center opacity-80 group-hover:scale-105 transition duration-700"></div>
              </button>

              <button
                onClick={() => startWizard("Boîtes à fleurs")}
                className="w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition z-10">
                  <span className="font-serif text-xl text-white tracking-wide">
                    Boîtes à fleurs
                  </span>
                </div>
                <div className="w-full h-full bg-[url('/images/bouqet.jpeg')] bg-cover bg-center opacity-80 group-hover:scale-105 transition duration-700"></div>
              </button>

              <button
                onClick={() => startWizard("Composition Spéciale")}
                className="w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition z-10">
                  <span className="font-serif text-xl text-white tracking-wide text-center px-4">
                    Composition Spéciale
                  </span>
                </div>
                <div className="w-full h-full bg-[url('/images/composition.jpeg')] bg-cover bg-center opacity-80 group-hover:scale-105 transition duration-700"></div>
              </button>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => showContact("Événements")}
                  className="group relative overflow-hidden h-24 rounded-lg border border-stone-300 flex flex-col items-center justify-center hover:bg-stone-50 transition"
                >
                  <div className="absolute inset-0 bg-[url('/images/event.jpeg')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <span className="relative z-10 font-serif text-lg">Événements</span>
                  <span className="relative z-10 text-xs text-stone-500 uppercase mt-1">
                    Sur Mesure
                  </span>
                </button>
                <button
                  onClick={() => showContact("Décoration")}
                  className="group relative overflow-hidden h-24 rounded-lg border border-stone-300 flex flex-col items-center justify-center hover:bg-stone-50 transition"
                >
                  <div className="absolute inset-0 bg-[url('/images/deco.jpeg')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <span className="relative z-10 font-serif text-lg">Décoration</span>
                  <span className="relative z-10 text-xs text-stone-500 uppercase mt-1">
                    Floral Art
                  </span>
                </button>
              </div>
            </div>
            </div>

            {/* === FOOTER === */}
            <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
              <nav className="flex flex-wrap justify-center gap-4 text-xs text-stone-500 uppercase tracking-widest mb-6">
                <Link href="/mentions-legales" className="hover:text-black transition">Mentions</Link>
                <Link href="/cgv" className="hover:text-black transition">CGV</Link>
                <Link href="/a-propos" className="hover:text-black transition">L'Atelier</Link>
                <button onClick={() => showContact("Contact")} className="hover:text-black transition">Contact</button>
              </nav>
              <p className="text-[10px] text-stone-400">
                Fait avec amour à Marrakech
              </p>
            </footer>
          </div>
        )}

        {/* === WIZARD VIEW === */}
        {view === "wizard" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={prevStep}
                className="text-sm text-stone-500 hover:text-black flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <span className="text-xs uppercase tracking-widest text-stone-400">
                Étape {step}/6
              </span>
            </div>

            {/* Step 1: Occasion */}
            {step === 1 && (
              <div>
                <h3 className="font-serif text-2xl mb-6">Quelle est l'occasion ?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {["Amour", "Anniversaire", "Plaisir d'offrir", "Deuil"].map((occ) => (
                    <button
                      key={occ}
                      onClick={() => updateOrder("occasion", occ)}
                      className="p-4 border border-stone-300 rounded hover:bg-stone-100 hover:border-black transition text-left"
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Style */}
            {step === 2 && (
              <div>
                <h3 className="font-serif text-2xl mb-6">L'Esprit du bouquet</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Bohème", color: "bg-[#e5e0d8]" },
                    { name: "Romantique", color: "bg-[#fce7f3]" },
                    { name: "Pureté", color: "bg-[#f3f4f6]" },
                    { name: "Surprise", color: "bg-[#1c1917]", dark: true },
                  ].map((style) => (
                    <div
                      key={style.name}
                      onClick={() => updateOrder("style", style.name)}
                      className="cursor-pointer group"
                    >
                      <div className={`h-32 ${style.color} rounded mb-2 group-hover:scale-105 transition shadow-sm flex items-center justify-center`}>
                        {style.dark && <span className="text-white text-3xl font-serif">?</span>}
                      </div>
                      <p className="text-center font-serif">{style.name === "Surprise" ? "Surprise du Chef" : style.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Inspiration */}
            {step === 3 && (
              <div>
                <h3 className="font-serif text-2xl mb-2">
                  Inspiration {order.style}
                </h3>
                <p className="text-sm text-stone-500 mb-6 italic">
                  "Chaque création est unique et dépend de l'arrivage du matin."
                </p>

                <div className="grid grid-cols-2 gap-2 mb-8">
                  <div className="h-40 bg-stone-200 rounded animate-pulse"></div>
                  <div className="h-40 bg-stone-300 rounded animate-pulse delay-75"></div>
                  <div className="h-40 bg-stone-300 rounded animate-pulse delay-150"></div>
                  <div className="h-40 bg-stone-200 rounded animate-pulse delay-200"></div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition"
                >
                  Continuer vers le budget
                </button>
              </div>
            )}

            {/* Step 4: Budget */}
            {step === 4 && (
              <div>
                <h3 className="font-serif text-2xl mb-6">Votre Budget</h3>
                <div className="space-y-3">
                  {[
                    { label: "Le Petit Geste", price: "400 dh" },
                    { label: "Le Plaisir", price: "700 dh" },
                    { label: "L'Exception", price: "1 200 dh" },
                    { label: "La Folie", price: "2 000 dh" },
                  ].map((opt) => (
                    <button
                      key={opt.price}
                      onClick={() => updateOrder("budget", opt.price)}
                      className="w-full p-4 border border-stone-300 rounded flex justify-between hover:border-black hover:bg-stone-50 transition"
                    >
                      <span>{opt.label}</span>
                      <span className="font-bold">{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Details */}
            {step === 5 && (
              <div>
                <h3 className="font-serif text-2xl mb-6">Détails de livraison</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-stone-500 mb-2">
                      Message Carte
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-3 bg-white border border-stone-300 rounded focus:border-black focus:ring-0 outline-none transition"
                      placeholder="Votre mot doux..."
                      value={order.message}
                      onChange={(e) =>
                        setOrder({ ...order, message: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wide text-stone-500 mb-2">
                      Date de livraison
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={order.date}
                      onChange={(e) =>
                        setOrder({ ...order, date: e.target.value })
                      }
                      className="w-full p-3 bg-white border border-stone-300 rounded focus:border-black outline-none mb-2"
                    />
                    {isLate && (
                      <p className="text-xs text-orange-600">
                        Il est plus de 14h, livraison pour aujourd'hui impossible.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wide text-stone-500 mb-2">
                      Créneau
                    </label>
                    <div className="flex gap-4">
                      {["Matin", "Soir"].map((slot) => (
                        <label
                          key={slot}
                          className={`flex-1 p-3 border rounded cursor-pointer text-center transition ${
                            order.slot === slot
                              ? "bg-black text-white border-black"
                              : "border-stone-300 hover:bg-stone-50"
                  }`}
                        >
                          <input
                            type="radio"
                            name="slot"
                            value={slot}
                            checked={order.slot === slot}
                            onChange={(e) =>
                              setOrder({ ...order, slot: e.target.value })
                            }
                            className="hidden"
                          />
                          {slot}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={validateStep5}
                    className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide mt-4 hover:bg-stone-800 transition"
                  >
                    Voir le récapitulatif
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Summary */}
            {step === 6 && (
              <div>
                <h3 className="font-serif text-2xl mb-6">Récapitulatif</h3>

                <div className="bg-white p-6 rounded shadow-sm border border-stone-100 mb-6">
                  <p className="text-sm text-stone-500 uppercase tracking-widest mb-1">
                    Catégorie
                  </p>
                  <p className="font-serif text-xl mb-4 text-black">
                    {order.category}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-stone-500">Occasion:</span> <br />
                      <span className="font-bold">{order.occasion}</span>
                    </div>
                    <div>
                      <span className="text-stone-500">Style:</span> <br />
                      <span className="font-bold">{order.style}</span>
                    </div>
                    <div>
                      <span className="text-stone-500">Budget:</span> <br />
                      <span className="font-bold">{order.budget}</span>
                    </div>
                    <div>
                      <span className="text-stone-500">Date:</span> <br />
                      <span className="font-bold">
                        {order.date} ({order.slot})
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-500">Message :</p>
                  <p className="italic text-stone-800 font-serif">
                    "{order.message || "Aucun message"}"
                  </p>
                </div>

                <button
                  onClick={addToCart}
                  className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition shadow-lg"
                >
                  Ajouter au Panier ({order.budget})
                </button>
              </div>
            )}
          </div>
        )}

        {/* === CONTACT VIEW === */}
        {view === "contact" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <button
              onClick={resetApp}
              className="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Retour Accueil
            </button>

            {/* Header Image for specific services */}
            {(contactTitle === "Événements" || contactTitle === "Décoration") && (
              <div className="w-full h-48 rounded-lg mb-8 overflow-hidden relative">
                <img 
                  src={contactTitle === "Événements" ? "/images/event.jpeg" : "/images/deco.jpeg"} 
                  className="w-full h-full object-cover" 
                  alt={contactTitle}
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}

            <h2 className="font-serif text-3xl mb-2">{contactTitle}</h2>
            <p className="text-stone-600 mb-6 italic text-sm">
              {contactTitle === "Événements" || contactTitle === "Décoration" 
                ? "Pour vos projets d'exception, notre atelier conçoit des scénographies uniques."
                : "Une question ? Notre équipe est à votre écoute."}
            </p>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Message envoyé ! Nous vous répondrons sous peu.", "success");
                resetApp();
              }}
            >
              <input
                type="text"
                placeholder="Votre Nom"
                className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
                required
              />
              <input
                type="tel"
                placeholder="Téléphone"
                className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
                required
              />
              <textarea
                placeholder="Décrivez votre projet..."
                rows={4}
                className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black transition"
                required
              ></textarea>
              <button className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition">
                Envoyer la demande
              </button>
            </form>
          </div>
        )}
      </main>
    </PayPalScriptProvider>
  );
}