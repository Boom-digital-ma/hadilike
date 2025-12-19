export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  longDescription: string;
  storytelling: string;
  maintenance: string;
  features: string[];
  images: string[];
  slug: string;
}

export const products: Product[] = [
  // --- BOÎTES À FLEURS ---
  {
    id: "ecrin-signature",
    name: "L'Écrin Signature – L'Explosion de Couleurs",
    category: "Boîtes à Fleurs",
    price: 850,
    shortDescription: "L'art d'offrir sans contrainte. Cette boîte à fleurs luxueuse renferme un mélange vibrant de roses sélectionnées.",
    longDescription: "Découvrez L'Écrin Signature par Hadilike.ma, la rencontre entre l'art floral et la mode. Oubliez la recherche du vase : nos artisans fleuristes à Marrakech composent ce mélange harmonieux de roses aux couleurs éclatantes.",
    storytelling: "Inspirée par les jardins secrets de la Médina, cette boîte ronde apporte une touche contemporaine et sophistiquée qui sublime le bouquet.",
    maintenance: "Verser délicatement un demi-verre d'eau au centre de la mousse tous les 2 jours.",
    features: ["Prêt à poser", "Design & Tendance", "Longue tenue"],
    images: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000",
      "https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=1000",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1000"
    ],
    slug: "ecrin-signature"
  },
  {
    id: "boite-blanche-royale",
    name: "L'Écrin Royal – Roses Blanches",
    category: "Boîtes à Fleurs",
    price: 950,
    shortDescription: "La pureté absolue. Une boîte cylindrique noire remplie de roses blanches d'une fraîcheur éclatante.",
    longDescription: "Le contraste saisissant entre la boîte noire mate et la blancheur immaculée des roses Avalon. Une pièce maîtresse pour les intérieurs minimalistes ou pour exprimer un respect profond.",
    storytelling: "C'est la composition préférée de nos clients de l'Hivernage pour décorer les halls d'entrée majestueux.",
    maintenance: "Humidifier la mousse centrale tous les 2 jours. Éviter le soleil direct.",
    features: ["Élégance Monochrome", "Boîte Luxe", "Roses Premium"],
    images: [
      "https://images.unsplash.com/photo-1596627706509-32243d5ae686?q=80&w=1000",
      "https://images.unsplash.com/photo-1533616688419-07a58529e2e4?q=80&w=1000",
      "https://images.unsplash.com/photo-1491234323906-4f056ca415bc?q=80&w=1000"
    ],
    slug: "ecrin-royal-blanches"
  },
  {
    id: "boite-velours-rouge",
    name: "Velours Passion – Box Carrée",
    category: "Boîtes à Fleurs",
    price: 1100,
    shortDescription: "L'amour en boîte. Une disposition géométrique parfaite de roses rouges dans un écrin carré.",
    longDescription: "Une architecture florale rigoureuse et passionnée. Chaque rose est sélectionnée pour avoir le même calibre, créant un tapis de velours rouge uniforme et envoûtant.",
    storytelling: "Un classique revisité, inspiré par la géométrie des zelliges marocains, où la répétition crée la beauté.",
    maintenance: "Ajouter un peu d'eau au centre. Ne pas mouiller les pétales.",
    features: ["Design Géométrique", "Roses Red Naomi", "Cadeau Romantique"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
      "https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=1000",
      "https://images.unsplash.com/photo-1599733589046-10c005739ef9?q=80&w=1000"
    ],
    slug: "velours-passion-box"
  },

  // --- COMPOSITIONS SPÉCIALES ---
  {
    id: "eclat-marrakech",
    name: "L'Éclat de Marrakech : Lys & Bois",
    category: "Compositions Spéciales",
    price: 1200,
    shortDescription: "Apportez une sophistication instantanée à votre espace avec cette pièce maîtresse de notre collection.",
    longDescription: "Elle marie la noblesse incomparable des Lys Blancs impériaux à un vase signature unique, alliant la modernité du verre fumé à la chaleur d'un socle en bois massif.",
    storytelling: "Le verre fumé sombre crée un contraste saisissant qui fait 'ressortir' la blancheur immaculée des pétales de lys, tandis que le bois ancre la composition.",
    maintenance: "Recoupez légèrement les tiges en biseau tous les 2 jours et changez l'eau du vase.",
    features: ["Fleurs d'Exception", "Contenant Design Inclus", "Style 'Chic Marrakech'"],
    images: [
      "https://images.unsplash.com/photo-1520330055272-359286460334?q=80&w=1000",
      "https://images.unsplash.com/photo-1563241527-3004b7be0fab?q=80&w=1000",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1000"
    ],
    slug: "eclat-marrakech"
  },
  {
    id: "orchidee-prestige",
    name: "Orchidée Phalaenopsis – Coupe Artisanale",
    category: "Compositions Spéciales",
    price: 1450,
    shortDescription: "La grâce durable. Une cascade d'orchidées blanches doubles hampes dans une coupe en céramique artisanale.",
    longDescription: "Plus qu'une fleur, une sculpture vivante. Nos orchidées sont sélectionnées pour leur floraison généreuse et installées dans une céramique texturée de Tamegroute ou safiote revisitée.",
    storytelling: "Symbole de beauté raffinée, cette composition est conçue pour durer plusieurs mois, apportant une élégance zen.",
    maintenance: "Baignez les racines une fois par semaine (hors pot décoratif).",
    features: ["Longue Durée (Mois)", "Support Artisanal", "Déco Intemporelle"],
    images: [
      "https://images.unsplash.com/photo-1550953982-15f5a898df5d?q=80&w=1000",
      "https://images.unsplash.com/photo-1598522696537-805c6d362534?q=80&w=1000",
      "https://images.unsplash.com/photo-1545657803-b0b2e8d89ba3?q=80&w=1000"
    ],
    slug: "orchidee-prestige"
  },
  {
    id: "jardin-majorelle",
    name: "Jardin Majorelle – Mix Exotique",
    category: "Compositions Spéciales",
    price: 1600,
    shortDescription: "Un hommage vibrant à Yves Saint Laurent. Strelitzias, feuilles de monstera et touches de bleu.",
    longDescription: "Une composition audacieuse et sculpturale qui capture l'essence du célèbre jardin. Les oiseaux de paradis s'élancent vers le ciel, entourés d'un feuillage luxuriant.",
    storytelling: "Créée pour les amoureux de l'architecture et des couleurs franches qui font la renommée de Marrakech.",
    maintenance: "Brumisez le feuillage. Changez l'eau tous les 3 jours.",
    features: ["Style Tropical Chic", "Grand Format", "Couleurs Vibrantes"],
    images: [
      "https://images.unsplash.com/photo-1563919632832-6b9965d1d4d3?q=80&w=1000",
      "https://images.unsplash.com/photo-1525642456456-613d53896dfa?q=80&w=1000",
      "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=1000"
    ],
    slug: "jardin-majorelle"
  },

  // --- BOUQUETS ---
  {
    id: "eternel-roses-rouges",
    name: "L'Éternel – Bouquet de Roses Rouges Passion",
    category: "Bouquets",
    price: 650,
    shortDescription: "L'intensité à l'état pur. Ce bouquet signature rassemble des roses rouges bien ouvertes et fraîches.",
    longDescription: "Déclarez votre flamme avec l'intensité du bouquet L'Éternel. Roses rouges de variété locale, reconnues pour leur bouton généreux et leur texture de velours.",
    storytelling: "Le rouge profond incarne la passion absolue. Une création intemporelle qui capture la passion du premier jour.",
    maintenance: "Recoupez les tiges en biseau tous les 2 jours.",
    features: ["Symbolique forte", "Qualité Artisanale", "Idéal Saint-Valentin"],
    images: [
      "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1000",
      "https://images.unsplash.com/photo-1548849186-e997d4150756?q=80&w=1000",
      "https://images.unsplash.com/photo-1563241527-3004b7be0fab?q=80&w=1000"
    ],
    slug: "eternel-roses-rouges"
  },
  {
    id: "douceur-poudree",
    name: "Douceur Poudrée – Roses Pastel",
    category: "Bouquets",
    price: 700,
    shortDescription: "Une caresse florale. Un dégradé de roses pales et de lisianthus pour une tendresse infinie.",
    longDescription: "Ce bouquet rond est une ode à la douceur. Les teintes crème, rose poudré et pêche se marient dans une harmonie apaisante, parfaite pour une naissance ou un anniversaire.",
    storytelling: "Invoque la lumière douce de la fin d'après-midi sur les remparts de Marrakech.",
    maintenance: "Changez l'eau quotidiennement et gardez au frais la nuit.",
    features: ["Teintes Pastel", "Romantisme Doux", "Volume Généreux"],
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=1000",
      "https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?q=80&w=1000",
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000"
    ],
    slug: "douceur-poudree"
  },
  {
    id: "champetre-chic",
    name: "Atlas Sauvage – Bouquet Champêtre",
    category: "Bouquets",
    price: 550,
    shortDescription: "L'élégance décontractée. Un mélange de fleurs de saison et d'eucalyptus odorant.",
    longDescription: "Inspiré par la nature sauvage de la vallée de l'Ourika, ce bouquet déstructuré mêle fleurs des champs, chardons bleus et feuillages grisés.",
    storytelling: "Pour ceux qui préfèrent le charme naturel et spontané à la rigueur des bouquets classiques.",
    maintenance: "Recoupez les tiges. L'eucalyptus diffuse son parfum dans la pièce.",
    features: ["Style Bohème", "Parfum Naturel", "Fleurs de Saison"],
    images: [
      "https://images.unsplash.com/photo-1457089328109-e5d9bd4963cc?q=80&w=1000",
      "https://images.unsplash.com/photo-1495908333965-f43c886968e2?q=80&w=1000",
      "https://images.unsplash.com/photo-1523694576729-dc99e9c0f3b4?q=80&w=1000"
    ],
    slug: "atlas-sauvage"
  }
];