// SEO Constants for Portfolio Images
export const PHOTOGRAPHER_NAME = "Bruna Alves";
export const BUSINESS_NAME = "Bruna Alves Photography";
export const LOCATION = "London, UK";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

// Multilingual SEO-optimized descriptions
export const CATEGORY_DESCRIPTIONS = {
  en: {
    travel: "London landmarks and tourism photography capturing iconic British architecture and cityscapes",
    business: "Professional business photography including corporate headshots, salon interiors, and commercial spaces",
    studio: "Studio portrait photography featuring maternity, bridal, fashion, and professional headshots",
    all: "Complete photography portfolio showcasing London tourism, professional business, and studio portrait work"
  },
  pt: {
    travel: "Fotografia de pontos turísticos de Londres capturando arquitetura britânica icônica e paisagens urbanas",
    business: "Fotografia profissional empresarial incluindo retratos corporativos, interiores de salão e espaços comerciais",
    studio: "Fotografia de retrato em estúdio apresentando maternidade, noiva, moda e retratos profissionais",
    all: "Portfólio completo de fotografia apresentando turismo em Londres, negócios profissionais e trabalho de retrato em estúdio"
  }
};

// Multilingual keywords for different photography categories
export const CATEGORY_KEYWORDS = {
  en: {
    travel: ["London photography", "tourism photography", "Big Ben", "Tower Bridge", "Westminster", "British landmarks"],
    business: ["business photography", "professional headshots", "corporate photography", "salon photography", "commercial photography"],
    studio: ["studio photography", "portrait photography", "maternity photography", "bridal photography", "fashion photography"],
    all: ["professional photography London", "photographer London", "portrait photography", "business photography", "tourism photography"]
  },
  pt: {
    travel: ["fotografia Londres", "fotografia turismo", "Big Ben", "Tower Bridge", "Westminster", "pontos turísticos britânicos"],
    business: ["fotografia empresarial", "retratos profissionais", "fotografia corporativa", "fotografia salão", "fotografia comercial"],
    studio: ["fotografia estúdio", "fotografia retrato", "fotografia maternidade", "fotografia noiva", "fotografia moda"],
    all: ["fotografia profissional Londres", "fotógrafo Londres", "fotografia retrato", "fotografia empresarial", "fotografia turismo"]
  }
};

// Translation mappings for image metadata
export const IMAGE_TRANSLATIONS = {
  en: {
    professional: "Professional",
    photography: "Photography",
    by: "by",
    view: "View",
    portfolio: "Portfolio",
    tourism: "Tourism",
    business: "Business", 
    studio: "Studio",
    london: "London",
    westminster: "Westminster",
    "big-ben": "Big Ben",
    "tower-bridge": "Tower Bridge",
    "houses-of-parliament": "Houses Of Parliament",
    "red-telephone-booth": "Red Telephone Booth",
    "london-eye": "London Eye",
    "british-museum": "British Museum",
    "great-court": "Great Court",
    "south-bank": "South Bank",
    "green-park": "Green Park",
    "autumn-foliage": "Autumn Foliage",
    "piccadilly-circus": "Piccadilly Circus",
    "underground-station": "Underground Station",
    "leadenhall-market": "Leadenhall Market",
    "traditional-london-pub": "Traditional London Pub",
    "st-dunstan-in-the-east": "St Dunstan In The East",
    "church-garden": "Church Garden",
    "county-hall": "County Hall",
    "st-pauls-cathedral": "St Pauls Cathedral",
    "covent-garden": "Covent Garden",
    cafe: "Cafe",
    "color-analysis-session": "Color Analysis Session",
    "street-scene": "Street Scene",
    "online-consultation": "Online Consultation",
    "beauty-treatment-preparation": "Beauty Treatment Preparation",
    "founders-portrait": "Founders Portrait",
    "salon-interior": "Salon Interior",
    haircut: "Haircut",
    "salon-decor-detail": "Salon Decor Detail",
    "hair-styling-service": "Hair Styling Service",
    "salon-interior-reflection": "Salon Interior Reflection",
    "themed-cafe": "Themed Cafe",
    "charming-london-street": "Charming London Street",
    "home-office": "Home Office",
    "working-on-linkedin": "Working On Linkedin",
    "studio-headshot": "Studio Headshot",
    "maternity-portrait": "Maternity Portrait",
    "team-portrait": "Team Portrait",
    "fashion-portrait": "Fashion Portrait",
    "business-headshot": "Business Headshot",
    "dramatic-portrait": "Dramatic Portrait",
    "bridal-portrait": "Bridal Portrait",
    "maternity-silhouette-portrait": "Maternity Silhouette Portrait",
    "modern-maternity-portrait": "Modern Maternity Portrait",
    "couples-maternity-portrait": "Couples Maternity Portrait",
    "behindthescenes-fashion-shoot": "Behind The Scenes Fashion Shoot",
    "modern-business-headshot": "Modern Business Headshot",
    "bridal-fashion-portrait": "Bridal Fashion Portrait",
    "highkey-business-portrait": "High Key Business Portrait",
    "professional-headshot": "Professional Headshot",
    "bridal-hairstyle-detail": "Bridal Hairstyle Detail",
    "professional-portrait": "Professional Portrait",
    "architectural-interior": "Architectural Interior"
  },
  pt: {
    professional: "Profissional",
    photography: "Fotografia",
    by: "por",
    view: "Ver",
    portfolio: "Portfólio",
    tourism: "Turismo",
    business: "Empresarial",
    studio: "Estúdio",
    london: "Londres",
    westminster: "Westminster",
    "big-ben": "Big Ben",
    "tower-bridge": "Tower Bridge", 
    "houses-of-parliament": "Casas Do Parlamento",
    "red-telephone-booth": "Cabine Telefônica Vermelha",
    "london-eye": "London Eye",
    "british-museum": "Museu Britânico",
    "great-court": "Grande Pátio",
    "south-bank": "South Bank",
    "green-park": "Green Park",
    "autumn-foliage": "Folhagem Outonal",
    "piccadilly-circus": "Piccadilly Circus",
    "underground-station": "Estação Do Metrô",
    "leadenhall-market": "Mercado Leadenhall",
    "traditional-london-pub": "Pub Tradicional De Londres",
    "st-dunstan-in-the-east": "St Dunstan No Leste",
    "church-garden": "Jardim Da Igreja",
    "county-hall": "County Hall",
    "st-pauls-cathedral": "Catedral De St Paul",
    "covent-garden": "Covent Garden",
    cafe: "Café",
    "color-analysis-session": "Sessão De Análise De Cores",
    "street-scene": "Cena De Rua",
    "online-consultation": "Consulta Online",
    "beauty-treatment-preparation": "Preparação De Tratamento De Beleza",
    "founders-portrait": "Retrato De Fundadores",
    "salon-interior": "Interior Do Salão",
    haircut: "Corte De Cabelo",
    "salon-decor-detail": "Detalhe Da Decoração Do Salão",
    "hair-styling-service": "Serviço De Penteado",
    "salon-interior-reflection": "Reflexo Do Interior Do Salão",
    "themed-cafe": "Café Temático",
    "charming-london-street": "Rua Encantadora De Londres",
    "home-office": "Home Office",
    "working-on-linkedin": "Trabalhando No Linkedin",
    "studio-headshot": "Retrato De Estúdio",
    "maternity-portrait": "Retrato De Maternidade",
    "team-portrait": "Retrato De Equipe",
    "fashion-portrait": "Retrato De Moda",
    "business-headshot": "Retrato Empresarial",
    "dramatic-portrait": "Retrato Dramático",
    "bridal-portrait": "Retrato De Noiva",
    "maternity-silhouette-portrait": "Retrato Silhueta De Maternidade",
    "modern-maternity-portrait": "Retrato Moderno De Maternidade",
    "couples-maternity-portrait": "Retrato De Casal Maternidade",
    "behindthescenes-fashion-shoot": "Bastidores De Ensaio De Moda",
    "modern-business-headshot": "Retrato Empresarial Moderno",
    "bridal-fashion-portrait": "Retrato De Moda Nupcial",
    "highkey-business-portrait": "Retrato Empresarial High Key",
    "professional-headshot": "Retrato Profissional",
    "bridal-hairstyle-detail": "Detalhe Do Penteado De Noiva",
    "professional-portrait": "Retrato Profissional",
    "architectural-interior": "Interior Arquitetônico"
  }
};

// Generate SEO-friendly text from kebab-case image names
export const generateSEOText = (kebabText: string, locale: 'en' | 'pt' = 'en'): string => {
  const parts = kebabText.replace(/\d+$/, '').split('-');
  const translations = IMAGE_TRANSLATIONS[locale];
  
  const translatedParts = parts.map(part => 
    translations[part as keyof typeof translations] || 
    part.charAt(0).toUpperCase() + part.slice(1)
  );
  
  return translatedParts.join(' ').trim();
};

// Generate comprehensive alt text for images with locale support
export const generateAltText = (imageName: string, locale: 'en' | 'pt' = 'en'): string => {
  const readableText = generateSEOText(imageName, locale);
  const translations = IMAGE_TRANSLATIONS[locale];
  
  return `${translations.professional} ${readableText} ${translations.by} ${PHOTOGRAPHER_NAME}`;
};

// Generate title attribute for images with locale support
export const generateImageTitle = (imageName: string, locale: 'en' | 'pt' = 'en'): string => {
  const readableText = generateSEOText(imageName, locale);
  const translations = IMAGE_TRANSLATIONS[locale];
  
  return `${translations.view} ${readableText} - ${BUSINESS_NAME} ${translations.portfolio}`;
};
