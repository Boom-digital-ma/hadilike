"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { saveOrder } from "@/app/actions";
import { Toast, ToastType } from "@/components/Toast";
import { useCart, WizardState } from "@/context/CartContext";
import ImageSlider from "@/components/ImageSlider";
import { SHOP_CONFIG, STYLES } from "@/data/shop-config";

// Types for State
type AppView = "home" | "wizard" | "contact" | "order-success" | "quick-preview";

export default function HadilikeApp() {
  const [view, setView] = useState<AppView>("home");
  const [step, setStep] = useState(1);
  const [contactTitle, setContactTitle] = useState("Contact");
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  
  const { addToCart, cart } = useCart();

  // Local Wizard State
  const [order, setOrder] = useState<WizardState>({
    category: "",
    occasion: "",
    style: "",
    extras: [],
    specialRequest: "",
    budget: "",
    message: "",
    date: "",
    slot: "",
  });

  const [lastOrder, setLastOrder] = useState<{ id: string; cart: WizardState[]; total: number; customer: any } | null>(null);

  // Helper to get current category config
  const getCategoryConfig = () => SHOP_CONFIG.find(c => c.id === order.category);

  // --- Listen for order completion from Navigation (PayPal) ---
  useEffect(() => {
    const handleOrderCompleted = (e: any) => {
      setLastOrder(e.detail);
      switchView("order-success");
    };
    window.addEventListener("orderCompleted", handleOrderCompleted);
    return () => window.removeEventListener("orderCompleted", handleOrderCompleted);
  }, []);

  // --- Helpers ---
  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  const resetApp = () => {
    setOrder({
      category: "",
      occasion: "",
      style: "",
      extras: [],
      specialRequest: "",
      budget: "",
      message: "",
      date: "",
      slot: "",
    });
    setStep(1);
    switchView("home");
  };

  const switchView = (newView: AppView) => {
    setIsAnimationPlaying(true);
    setTimeout(() => {
      setView(newView);
      setIsAnimationPlaying(false);
    }, 100); 
  };

  const nextStep = () => {
    const config = getCategoryConfig();
    if (!config) return;

    // Direct Flow (Composition Spéciale)
    if (step === 1 && config.flow === "direct") {
        setStep(4);
        return;
    }

    // Special Logic for "Plaisir d'offrir" in standard flow
    const isPlaisir = order.occasion === "Plaisir d'offrir";
    
    if (step === 2 && isPlaisir) {
        setStep(4); // Skip step 3
        return;
    }
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step === 1) {
        resetApp();
        return;
    }

    const config = getCategoryConfig();

    // Quick Buy Flow (Coup de Cœur) - Go back to start if at details or budget
    if (order.occasion === "Coup de Cœur") {
        setStep(1);
        return;
    }
    
    // Direct Flow
    if (step === 4 && config?.flow === "direct") {
        setStep(1);
        return;
    }

    // Special Logic for "Plaisir d'offrir"
    const isPlaisir = order.occasion === "Plaisir d'offrir";

    if (step === 4 && isPlaisir) {
        setStep(2); // Back to step 2
        return;
    }
    if (step > 1) setStep(step - 1);
    else resetApp();
  };

  const updateOrder = (key: keyof WizardState, value: string) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
    nextStep();
  };

  const toggleExtra = (extra: string) => {
    setOrder(prev => {
        const currentExtras = prev.extras || [];
        const newExtras = currentExtras.includes(extra) 
            ? currentExtras.filter(e => e !== extra)
            : [...currentExtras, extra];
        return { ...prev, extras: newExtras };
    });
  };

  const handleAddToCart = () => {
    const newOrder = { 
        ...order, 
        id: `HDL-${Math.floor(Math.random() * 10000)}` 
    };
    addToCart(newOrder);
    resetApp(); 
    showToast("Création ajoutée au panier", "success");
  };

  const showContact = (type: string) => {
    setContactTitle(type);
    switchView("contact");
  };

  const startWizard = (category: string) => {
    setOrder((prev) => ({ ...prev, category }));
    setStep(1);
    switchView("wizard");
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
    <div className="bg-brand-bg min-h-screen">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
              {/* Main Categories (Product Flows) */}
              {SHOP_CONFIG.filter(c => c.type !== "service").map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => startWizard(cat.id)}
                  className="w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition z-10">
                    <span className="font-serif text-xl text-white tracking-wide text-center px-4">
                      {cat.title}
                    </span>
                  </div>
                  <div 
                    className="w-full h-full bg-cover bg-center opacity-80 group-hover:scale-105 transition duration-700"
                    style={{ backgroundImage: `url('${cat.coverImage}')` }}
                  ></div>
                </button>
              ))}

              {/* Service Categories (Contact Flows) */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {SHOP_CONFIG.filter(c => c.type === "service").map((svc) => (
                    <button
                    key={svc.id}
                    onClick={() => showContact(svc.title)}
                    className="group relative overflow-hidden h-24 rounded-lg border border-stone-300 flex flex-col items-center justify-center hover:bg-stone-50 transition"
                    >
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity"
                        style={{ backgroundImage: `url('${svc.coverImage}')` }}
                    ></div>
                    <span className="relative z-10 font-serif text-lg">{svc.title}</span>
                    <span className="relative z-10 text-xs text-stone-500 uppercase mt-1">
                        {svc.subtitle}
                    </span>
                    </button>
                ))}
              </div>
            </div>
            </div>

            {/* === FOOTER === */}
            <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
              <nav className="flex flex-wrap justify-center gap-4 text-xs text-stone-500 uppercase tracking-widest mb-6">
                <button onClick={() => window.location.href = "/mentions-legales"} className="hover:text-black transition">Mentions</button>
                <button onClick={() => window.location.href = "/cgv"} className="hover:text-black transition">CGV</button>
                <button onClick={() => window.location.href = "/a-propos"} className="hover:text-black transition">L'Atelier</button>
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
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevStep}
                className="text-sm text-stone-500 hover:text-black flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
            </div>

            {/* === QUICK BUY SLIDER (Coups de Cœur) === */}
            {(() => {
                const config = getCategoryConfig();
                if (step === 1 && config?.bestSellers && config.bestSellers.length > 0) {
                    return (
                        <div className="mb-4">
                            <h3 className="font-serif text-lg mb-3">Nos Coups de Cœur <span className="text-xs text-stone-400 font-sans tracking-widest ml-2 uppercase">Best-Sellers</span></h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                            {config.bestSellers.map((imgSrc, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setOrder({
                                            ...order,
                                            occasion: "Coup de Cœur",
                                            style: "Création du Chef",
                                            budget: config.quickBuyPrice
                                        });
                                        setPreviewImage(imgSrc);
                                        switchView("quick-preview");
                                    }}
                                    className="flex-shrink-0 w-24 aspect-square group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white border border-stone-100"
                                >
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imgSrc}')` }}></div>
                                </button>
                            ))}
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {/* Step 1: Occasion (or Direct Flow Description) */}
            {step === 1 && (
              <div>
                {getCategoryConfig()?.flow === "direct" ? (
                  <div>
                    <h3 className="font-serif text-2xl mb-6">{getCategoryConfig()?.title || "Votre Composition"}</h3>
                    <div className="mb-8">
                        <label className="block text-sm text-stone-500 uppercase tracking-widest mb-2">
                            {getCategoryConfig()?.descriptionLabel || "Description"}
                        </label>
                        <textarea 
                            className="w-full p-4 border border-stone-200 rounded focus:border-black outline-none transition"
                            rows={5}
                            placeholder={getCategoryConfig()?.descriptionPlaceholder || "Décrivez votre besoin..."}
                            value={order.specialRequest || ""}
                            onChange={(e) => setOrder({...order, specialRequest: e.target.value})}
                        ></textarea>
                    </div>
                    <button 
                        onClick={nextStep}
                        className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition"
                    >
                        Continuer vers le budget
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-serif text-2xl mb-6">Quelle est l'occasion ?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {getCategoryConfig()?.occasions?.map((occ) => (
                        <button
                          key={occ.id}
                          onClick={() => updateOrder("occasion", occ.label)}
                          className="group flex flex-col gap-2 text-center"
                        >
                          <div className="relative w-full aspect-square rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:border-black transition duration-300">
                            <div 
                              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-700" 
                              style={{ backgroundImage: `url('${occ.image}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          </div>
                          <span className="text-stone-800 font-serif text-lg tracking-wide group-hover:text-black transition-colors">
                            {occ.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Style */}
            {step === 2 && (
              <div>
                {(order.occasion === "Plaisir d'offrir" || getCategoryConfig()?.id === "Boîtes à fleurs") ? (
                    // === VARIANT FOR 'PLAISIR D'OFFRIR' OR 'BOÎTES À FLEURS' ===
                    <div>
                        <h3 className="font-serif text-2xl mb-6">Les petits plus</h3>
                        <div className="space-y-3 mb-8">
                            {["Boîte", "Chocolat Ferrero Rocher", "Chocolat Raffaello", "Spéciale commande"]
                              .filter(extra => {
                                const config = getCategoryConfig();
                                // Hide "Boîte" and "Spéciale commande" if showExtras is false (like for Boxes or Plaisir)
                                // "Plaisir" is handled by condition, "Boîtes" by config
                                // Actually, for simplicity based on prompt history:
                                // Boites -> Hide Boite/Speciale
                                // Bouquets > Plaisir -> Hide Boite/Speciale
                                if (order.category === "Boîtes à fleurs" || order.occasion === "Plaisir d'offrir") {
                                    return extra !== "Boîte" && extra !== "Spéciale commande";
                                }
                                return true;
                              })
                              .map((extra) => (
                                <label key={extra} className="flex items-center gap-3 p-4 border border-stone-200 rounded cursor-pointer hover:bg-stone-50 transition">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 accent-black"
                                        checked={order.extras?.includes(extra) || false}
                                        onChange={() => toggleExtra(extra)}
                                    />
                                    <span className="font-serif text-lg">{extra}</span>
                                </label>
                            ))}
                        </div>
                        
                        <div className="mb-8">
                            <label className="block text-sm text-stone-500 uppercase tracking-widest mb-2">
                              {getCategoryConfig()?.descriptionLabel || "Commentaire"}
                            </label>
                            <textarea 
                                className="w-full p-4 border border-stone-200 rounded focus:border-black outline-none transition"
                                rows={3}
                                placeholder={
                                    getCategoryConfig()?.descriptionPlaceholder || "Une précision pour le fleuriste ?"
                                }
                                value={order.specialRequest || ""}
                                onChange={(e) => setOrder({...order, specialRequest: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            onClick={nextStep}
                            className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition"
                        >
                            Continuer vers le budget
                        </button>
                    </div>
                ) : (
                    // === STANDARD STYLE SELECTION ===
                    <div>
                        <h3 className="font-serif text-2xl mb-6">L'Esprit du bouquet</h3>
                        <div className="grid grid-cols-2 gap-4">
                        {STYLES
                        .filter(style => {
                            // Exclude Pureté for Anniversary in Bouquets
                            if (order.category === "Bouquets" && order.occasion === "Anniversaire" && style.id === "purte") {
                                return false;
                            }
                            return true;
                        })
                        .map((style) => {
                            // Image logic
                            let imgSrc = null;
                            const folder = getCategoryConfig()?.folderName;
                            
                            if (order.occasion === "Amour" && style.id !== "surprise") {
                                // Amour -> always .jpeg
                                imgSrc = `/images/${folder}/amour/esprit/${style.id}.jpeg`;
                            } else if (order.occasion === "Anniversaire" && style.id !== "surprise") {
                                // Anniversaire -> .png for boheme/purte, .jpeg for others
                                let filename = style.id;
                                if (filename === "purte") filename = "pure"; // legacy naming fix
                                const ext = (style.id === "purte" || style.id === "boheme") ? "png" : "jpeg";
                                // legacy folder naming fix "espirt"
                                imgSrc = `/images/${folder}/anniversaire/espirt/${filename}.${ext}`;
                            }

                            return (
                            <div
                                key={style.id}
                                onClick={() => updateOrder("style", style.label)}
                                className="cursor-pointer group"
                            >
                                <div className={`h-32 ${style.color} rounded mb-2 group-hover:scale-105 transition shadow-sm flex items-center justify-center overflow-hidden relative`}>
                                {imgSrc ? (
                                    <img src={imgSrc} className="absolute inset-0 w-full h-full object-cover" alt={style.label} />
                                ) : (
                                    style.dark && <span className="text-white text-3xl font-serif">?</span>
                                )}
                                </div>
                                <p className="text-center font-serif">{style.label}</p>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                )}
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

                <div className="w-full aspect-square rounded-lg overflow-hidden mb-8 shadow-inner bg-stone-100 relative">
                  {/* Image mapping logic re-used from step 2 concept */}
                  {(() => {
                    const styleObj = STYLES.find(s => s.label === order.style);
                    const styleKey = styleObj?.id;
                    const folder = getCategoryConfig()?.folderName;
                    let src = "";

                    if (styleKey) {
                        if (order.occasion === "Amour") {
                            src = `/images/${folder}/amour/esprit/${styleKey}.jpeg`;
                        } else if (order.occasion === "Anniversaire") {
                            let filename = styleKey;
                            if (filename === "purte") filename = "pure";
                            const ext = (styleKey === "purte" || styleKey === "boheme") ? "png" : "jpeg";
                            src = `/images/${folder}/anniversaire/espirt/${filename}.${ext}`;
                        }
                    } else {
                        // Fallback/Default images based on occasion only
                        let occasionKey = order.occasion.toLowerCase();
                        // legacy naming map
                        if (folder === "boites" && occasionKey === "anniversaire") occasionKey = "anniversair";
                        if (folder !== "boites" && occasionKey === "plaisir d'offrir") occasionKey = "plaisirdoffrir";
                        
                        src = `/images/${folder}/${occasionKey}.jpeg`;
                    }

                    return (
                      <img 
                        src={src} 
                        className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
                        alt={`Inspiration ${order.style}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/composition.jpeg";
                        }}
                      />
                    );
                  })()}
                </div>

                <button
                  onClick={nextStep}
                  className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition shadow-md"
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
                  {getCategoryConfig()?.budgets?.map((opt) => (
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
                      <span className="font-bold">{order.occasion || "Sur mesure"}</span>
                    </div>
                    {/* Conditional display for Style or Extras */}
                    {(order.occasion === "Plaisir d'offrir" && order.category === "Bouquets") || order.category === "Boîtes à fleurs" ? (
                        <div className="col-span-2">
                            <span className="text-stone-500">Extras:</span> <br />
                            <span className="font-bold text-xs">{(order.extras?.length ?? 0) > 0 ? order.extras?.join(", ") : "Aucun"}</span>
                            {order.specialRequest && (
                                <p className="mt-1 text-xs italic text-stone-600">Note: {order.specialRequest}</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <span className="text-stone-500">Style:</span> <br />
                            <span className="font-bold">{order.style || "Personnalisé"}</span>
                        </div>
                    )}
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
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition shadow-lg"
                >
                  Ajouter au Panier ({order.budget})
                </button>
              </div>
            )}
          </div>
        )}

        {/* === QUICK PREVIEW VIEW === */}
        {view === "quick-preview" && (
          <div className="animate-in fade-in zoom-in duration-500 flex flex-col min-h-[70vh]">
            <button
              onClick={() => switchView("wizard")}
              className="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à la sélection
            </button>

            <div className="flex-grow">
                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-8 bg-white border border-stone-100">
                    <img src={previewImage} className="w-full h-full object-cover" alt="Aperçu Coup de Cœur" />
                </div>

                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl mb-2">Notre Signature</h2>
                    <p className="text-stone-500 uppercase tracking-[0.2em] text-xs mb-4">{order.category}</p>
                    <div className="inline-block px-6 py-2 bg-stone-100 rounded-full font-bold text-lg">
                        {order.budget}
                    </div>
                </div>
            </div>

            <button
              onClick={() => { setStep(5); switchView("wizard"); }}
              className="w-full py-5 bg-brand-black text-white rounded-xl font-serif text-xl tracking-wide hover:bg-stone-800 transition shadow-lg"
            >
              Commander maintenant
            </button>
          </div>
        )}

        {/* === ORDER SUCCESS VIEW === */}
        {view === "order-success" && lastOrder && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-8 h-8 rotate-180" />
              </div>
              <h2 className="font-serif text-3xl mb-2">Merci {lastOrder.customer?.name?.given_name || "Client"} !</h2>
              <p className="text-stone-500 text-sm">Votre commande a été validée.</p>
              <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">Réf: {lastOrder.id}</p>
            </div>

            <div className="bg-white border border-stone-100 rounded-lg p-6 mb-8 shadow-sm">
              <h3 className="font-serif text-lg mb-4 border-b border-stone-100 pb-2">Récapitulatif</h3>
              <div className="space-y-4">
                {lastOrder.cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <span className="font-bold block">{item.category}</span>
                      <span className="text-stone-500 text-xs">{item.occasion} • {item.style || "Personnalisé"}</span>
                    </div>
                    <span>{item.budget}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-4 border-t border-stone-100 mt-4">
                  <span>Total Payé</span>
                  <span>{lastOrder.total} DH</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-6 rounded-lg mb-8 text-sm text-stone-600">
              <p className="mb-2 font-bold text-black">Prochaines étapes :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vous recevrez un email de confirmation.</li>
                <li>Notre atelier va commencer la création.</li>
                <li>Livraison prévue le <strong>{lastOrder.cart[0]?.date}</strong> ({lastOrder.cart[0]?.slot}).</li>
              </ul>
            </div>

            <button 
              onClick={resetApp}
              className="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </main>
    </div>
  );
}