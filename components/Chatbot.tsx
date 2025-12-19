"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  type?: "text" | "options";
  options?: { label: string; action: string }[];
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour. Je suis votre concierge floral Hadilike. Comment puis-je sublimer votre expérience aujourd'hui ?",
      isUser: false,
      type: "options",
      options: [
        { label: "Livraison Gants Blancs", action: "livraison" },
        { label: "Création Sur-mesure", action: "sur_mesure" },
        { label: "Conseil Entretien", action: "entretien" },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOptionClick = (action: string, label: string) => {
    const userMsg: Message = { id: Date.now(), text: label, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: Message;

      switch (action) {
        case "livraison":
          botResponse = {
            id: Date.now() + 1,
            text: "Nous assurons une livraison 'Gants Blancs' sur Marrakech (Guéliz, Hivernage, Palmeraie, etc.). Nos livreurs sont formés pour transporter ces pièces fragiles avec le plus grand soin. Commandez avant 14h pour une livraison le jour même.",
            isUser: false,
            type: "options",
            options: [
              { label: "Voir les zones", action: "zones" },
              { label: "Retour au menu", action: "menu" }
            ]
          };
          break;
        case "sur_mesure":
          botResponse = {
            id: Date.now() + 1,
            text: "L'exception est notre norme. Pour une création unique ou un événement (Mariage, Corporate), notre atelier est à votre écoute.",
            isUser: false,
            type: "options",
            options: [
              { label: "Contacter l'atelier", action: "contact_link" },
              { label: "Retour au menu", action: "menu" }
            ]
          };
          break;
        case "entretien":
          botResponse = {
            id: Date.now() + 1,
            text: "Pour nos compositions, versez un demi-verre d'eau au centre de la mousse tous les 2 jours. Pour les bouquets, recoupez les tiges en biseau. Évitez toujours le soleil direct.",
            isUser: false,
            type: "options",
            options: [{ label: "Merci !", action: "merci" }]
          };
          break;
        case "zones":
          botResponse = {
            id: Date.now() + 1,
            text: "Nous livrons : Guéliz, Hivernage, Médina, Agdal, Palmeraie, Targa et route de l'Ourika. Une carte message est offerte avec chaque commande.",
            isUser: false,
            type: "options",
            options: [{ label: "Commander un bouquet", action: "shop_link" }]
          };
          break;
        case "merci":
          botResponse = {
            id: Date.now() + 1,
            text: "Ce fut un plaisir. À très bientôt chez Hadilike.",
            isUser: false,
            type: "options",
            options: [{ label: "Retour au menu", action: "menu" }]
          };
          break;
        case "menu":
          botResponse = {
            id: Date.now() + 1,
            text: "Que puis-je faire d'autre pour vous ?",
            isUser: false,
            type: "options",
            options: [
              { label: "Livraison Gants Blancs", action: "livraison" },
              { label: "Création Sur-mesure", action: "sur_mesure" },
              { label: "Conseil Entretien", action: "entretien" },
            ],
          };
          break;
        case "contact_link":
          window.location.href = "/contact";
          return; 
        case "shop_link":
          window.location.href = "/";
          return;
        default:
          botResponse = {
            id: Date.now() + 1,
            text: "Je suis navré, je n'ai pas compris. Voulez-vous contacter notre équipe humaine ?",
            isUser: false,
            type: "options",
            options: [{ label: "Oui, page contact", action: "contact_link" }]
          };
      }
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group ${
          isOpen ? "bg-white border border-stone-200 rotate-90" : "bg-white border border-stone-200"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-black transition-colors" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-black font-serif text-sm whitespace-nowrap">
              Conciergerie
            </span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 z-50 w-full h-full md:w-[400px] md:h-[600px] bg-white md:border md:border-stone-200 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                <Sparkles className="w-6 h-6 text-stone-800" />
              </div>
              <div>
                <h3 className="text-black font-serif text-xl tracking-wide">Conciergerie</h3>
                <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-bold">Hadilike Marrakech</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 p-2 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-brand-bg/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                    msg.isUser
                      ? "bg-black text-white rounded-2xl rounded-tr-none shadow-sm"
                      : "bg-white text-stone-700 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm font-serif italic"
                  }`}
                >
                  {msg.text}
                </div>
                
                {/* Options Buttons */}
                {!msg.isUser && msg.options && (
                  <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in zoom-in duration-500">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt.action, opt.label)}
                        className="text-[10px] border border-stone-200 text-stone-500 px-4 py-2 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300 uppercase tracking-widest font-bold"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 p-2 text-stone-300 text-xs">
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input (Fake) */}
          <div className="p-6 border-t border-stone-100 bg-white">
            <div className="relative group">
              <input
                type="text"
                placeholder="Comment puis-je vous aider ?"
                disabled
                className="w-full bg-stone-50 border border-stone-100 text-stone-400 text-xs rounded-full py-4 px-6 focus:outline-none cursor-not-allowed italic"
              />
              <button disabled className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-stone-100 rounded-full text-stone-300">
                <Send className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[9px] text-stone-400 text-center mt-4 uppercase tracking-widest font-medium">
              Réponse instantanée par notre assistant
            </p>
          </div>
        </div>
      )}
    </>
  );
}