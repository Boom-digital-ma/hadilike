export const SHOP_CONFIG = [
  {
    id: "Boîtes à fleurs",
    slug: "boites-a-fleurs",
    title: "Boîtes à fleurs",
    subtitle: "L'élégance en boîte",
    coverImage: "/images/bouqet.jpeg",
    folderName: "boites", // Used for image path logic
    flow: "wizard", // 'wizard' (standard) or 'direct' (description only)
    quickBuyPrice: "650 dh",
    descriptionLabel: "Description de la boîte",
    descriptionPlaceholder: "Quelles fleurs souhaitez-vous dans votre boîte ?",
    showExtras: false, // Hides "Boîte" and "Spéciale commande" options
    bestSellers: [
      "/images/boites/best/best1.jpeg",
      "/images/boites/best/best2.jpeg",
      "/images/boites/best/best3.jpeg",
      "/images/boites/best/best4.jpeg",
    ],
    budgets: [
      { label: "Le Petit Geste", price: "450 dh" },
      { label: "Le Plaisir", price: "650 dh" },
      { label: "L'Exception", price: "850 dh" },
      { label: "La Folie", price: "1 350 dh" },
    ],
    occasions: [
      { id: "amour", slug: "amour", label: "Amour", image: "/images/boites/amour.jpeg" },
      { id: "anniversaire", slug: "anniversaire", label: "Anniversaire", image: "/images/boites/anniversair.jpeg" },
      { id: "plaisir", slug: "plaisir-d-offrir", label: "Plaisir d'offrir", image: "/images/boites/plaisir.jpeg" },
      // Deuil excluded for Boxes based on previous logic
    ]
  },
  {
    id: "Bouquets",
    slug: "bouquets",
    title: "Bouquets",
    subtitle: "L'Art Floral",
    coverImage: "/images/boite.jpeg",
    folderName: "boquets",
    flow: "wizard",
    quickBuyPrice: "580 dh",
    descriptionLabel: "Commentaire", // Default, changes to "Description..." for Plaisir d'offrir dynamically
    descriptionPlaceholder: "Une précision pour le fleuriste ?",
    showExtras: true, // Shows all options by default
    bestSellers: [
      "/images/boquets/best/best1.jpeg",
      "/images/boquets/best/best2.jpeg",
      "/images/boquets/best/best3.jpeg",
      "/images/boquets/best/best4.jpeg",
    ],
    budgets: [
      { label: "Le Petit Geste", price: "250 dh" },
      { label: "Le Plaisir", price: "580 dh" },
      { label: "L'Exception", price: "700 dh" },
      { label: "La Folie", price: "1 200 dh" },
    ],
    occasions: [
      { id: "amour", slug: "amour", label: "Amour", image: "/images/boquets/amour.jpeg" },
      { id: "anniversaire", slug: "anniversaire", label: "Anniversaire", image: "/images/boquets/anniversaire.jpeg" },
      { id: "plaisir", slug: "plaisir-d-offrir", label: "Plaisir d'offrir", image: "/images/boquets/plaisirdoffrir.jpeg" },
      { id: "deuil", slug: "deuil", label: "Deuil", image: "/images/boquets/deuil.jpeg" },
    ]
  },
  {
    id: "Composition Spéciale",
    slug: "composition-speciale",
    title: "Composition Spéciale",
    subtitle: "Sur Mesure",
    coverImage: "/images/composition.jpeg",
    folderName: "compo",
    flow: "direct", // Skips steps 1, 2, 3
    descriptionLabel: "Description",
    descriptionPlaceholder: "Décrivez la composition que vous souhaitez (fleurs, couleurs, contenant...)",
    budgets: [
      { label: "Le Petit Geste", price: "400 dh" },
      { label: "Le Plaisir", price: "700 dh" },
      { label: "L'Exception", price: "1 200 dh" },
      { label: "La Folie", price: "2 000 dh" },
    ],
    // No occasions or best sellers for this specific flow
    sliderImages: [
        "/images/compo/comp1.jpeg",
        "/images/compo/comp2.jpeg",
        "/images/compo/comp3.jpeg",
        "/images/compo/comp4.jpeg",
        "/images/compo/comp5.jpeg",
        "/images/compo/comp6.jpeg",
        "/images/compo/comp7.jpeg"
    ]
  },
  {
    id: "events",
    slug: "evenements", // Added slug
    title: "Wedding",
    subtitle: "",
    coverImage: "/images/event.jpeg",
    type: "service", // Identifies this as a contact form flow
    sliderImages: [
        "/images/event/event1.jpeg",
        "/images/event/event2.jpeg",
        "/images/event/event3.jpeg"
    ]
  },
  {
    id: "decoration",
    slug: "decoration", // Added slug
    title: "Art floral",
    subtitle: "",
    coverImage: "/images/deco.jpeg",
    type: "service",
    sliderImages: [
        "/images/deco/deco1.jpeg",
        "/images/deco/deco2.jpeg",
        "/images/deco/deco3.jpeg",
        "/images/deco/deco4.jpeg",
        "/images/deco/deco5.jpeg",
        "/images/deco/deco6.jpeg",
        "/images/deco/deco7.jpeg"
    ]
  }
];

export const STYLES = [
  { id: "boheme", slug: "boheme", label: "Bohème", color: "bg-[#e5e0d8]" },
  { id: "romantique", slug: "romantique", label: "Romantique", color: "bg-[#fce7f3]" },
  { id: "purte", slug: "purete", label: "Pureté", color: "bg-[#f3f4f6]" }, // "Pureté" excluded for Bouquets > Anniversaire
  { id: "surprise", slug: "surprise-du-chef", label: "Surprise du Chef", color: "bg-fuchsia-600", dark: true },
];

export const PROMO_POPUP_CONFIG = {
  enabled: false,
  delay: 500, // ms
  image: "/images/boquets/best/best1.jpeg",
  subtitle: "Collection 2026",
  title: "L'Éclat de Marrakech",
  description: "Découvrez nos nouvelles créations florales d'exception. Livraison prestige offerte pour votre première commande.",
  buttonText: "Découvrir la collection",
  link: "/bouquets" // Optional link destination
};

export const CHATBOT_CONFIG = {
  enabled: true,
};

export const REVIEWS_CONFIG = {
  enabled: true,
  title: "Ils nous font confiance",
  googleMapsLink: "https://maps.app.goo.gl/PvpLHoaLEpQ9fRzY6?g_st=awb",
  reviews: [
    {
      id: 1,
      name: "Sarah B.",
      text: "Un service exceptionnel ! Le bouquet était magnifique et la livraison parfaite. Merci Hadilike.",
      rating: 5,
    },
    {
      id: 2,
      name: "Mehdi K.",
      text: "J'ai commandé une box pour l'anniversaire de ma femme, elle a adoré. Très classe.",
      rating: 5,
    },
    {
      id: 3,
      name: "Julie L.",
      text: "Fleuriste très à l'écoute et compositions originales. Je recommande vivement !",
      rating: 5,
    },
  ]
};
