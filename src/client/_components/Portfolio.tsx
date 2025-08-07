"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import Pagination from "./Pagination";
import CategoryFilter from "./CategoryFilter";
import Loader from "./Loader";
import { useTranslations } from "@/context/TranslationContext";
import { generateAltText, generateImageTitle, PHOTOGRAPHER_NAME, BUSINESS_NAME, LOCATION, CATEGORY_DESCRIPTIONS } from "@/utils/seoConstants";

interface ImageItem {
  base: string;
  alt?: string;
  title?: string;
}

type PortfolioImages = Record<string, ImageItem[]>;

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; // Number of items per page
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrollingToGallery, setIsScrollingToGallery] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [schemaData, setSchemaData] = useState<string>('')

  const { translations, locale } = useTranslations();

  // Function to generate SEO-optimized alt text and title from image base name
  const generateImageMetadata = (base: string) => {
    const currentLocale = (locale === 'pt' ? 'pt' : 'en') as 'en' | 'pt';
    return {
      alt: generateAltText(base, currentLocale),
      title: generateImageTitle(base, currentLocale)
    };
  };

  const portfolioImages: PortfolioImages = {
    all: [
      { base: "london-tower-bridge-tourism-photography-3" },
      { base: "south-bank-london-houses-of-parliament-and-big-ben-tourism-photography" },
      { base: "westminster-london-red-telephone-booth-and-big-ben-tourism-photography-3" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-3" },
      { base: "green-park-london-autumn-foliage-tourism-photography" },
      { base: "british-museum-london-british-museum-professional-photography" },
      { base: "westminster-london-big-ben-and-red-telephone-booth-tourism-photography-3" },
      { base: "pub-london-traditional-london-pub-tourism-photography" },
      { base: "tower-bridge-london-tower-bridge-tourism-photography" },
      { base: "london-tower-bridge-tourism-photography-2" },
      { base: "westminster-london-big-ben-tourism-photography-2" },
      { base: "westminster-bridge-london-london-eye-and-county-hall-tourism-photography" },
      { base: "westminster-london-big-ben-tourism-photography" },
      { base: "british-museum-london-great-court-tourism-photography" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography" },
      { base: "london-tower-bridge-tourism-photography" },
      { base: "westminster-london-big-ben-and-red-telephone-booth-tourism-photography" },
      { base: "westminster-london-red-telephone-booths-and-london-eye-tourism-photography" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-2" },
      { base: "piccadilly-circus-london-piccadilly-circus-underground-station-tourism-photography" },
      { base: "westminster-london-red-telephone-booth-and-big-ben-tourism-photography" },
      { base: "westminster-london-big-ben-and-red-telephone-booth-tourism-photography-2" },
      { base: "leadenhall-market-london-leadenhall-market-tourism-photography" },
      { base: "st-dunstan-in-the-east-church-garden-london-st-dunstan-in-the-east-tourism-photography" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-4" },
      { base: "south-bank-london-houses-of-parliament-and-big-ben-tourism-photography-2" },
      { base: "south-bank-london-big-ben-and-houses-of-parliament-tourism-photography" },
      { base: "westminster-london-red-telephone-booth-and-big-ben-tourism-photography-2" },
      { base: "westminster-bridge-london-big-ben-and-houses-of-parliament-tourism-photography" },
      { base: "st-pauls-cathedral-london-st-pauls-cathedral-tourism-photography" },
      { base: "tower-bridge-london-tower-bridge-tourism-photography-2" },
      { base: "westminster-london-london-eye-professional-photography" },
      { base: "london-architectural-interior-professional-photography" },
      { base: "london-cafe-professional-photography" },
      { base: "london-cafe-professional-photography-2" },
      { base: "covent-garden-london-covent-garden-professional-photography" },
      { base: "london-cafe-professional-photography-3" },
      { base: "london-color-analysis-session-professional-photography" },
      { base: "london-london-street-scene-professional-photography" },
      { base: "london-online-consultation-professional-photography" },
      { base: "london-beauty-treatment-preparation-professional-photography" },
      { base: "london-founders-portrait-professional-photography" },
      { base: "london-salon-interior-professional-photography" },
      { base: "london-haircut-professional-photography" },
      { base: "london-salon-interior-professional-photography-2" },
      { base: "london-founders-professional-portrait-professional-photography" },
      { base: "london-salon-decor-detail-professional-photography" },
      { base: "london-hair-styling-service-professional-photography" },
      { base: "london-salon-interior-reflection-professional-photography" },
      { base: "london-themed-cafe-professional-photography" },
      { base: "london-london-eye-professional-photography" },
      { base: "london-charming-london-street-professional-photography" },
      { base: "london-home-office-professional-photography" },
      { base: "london-home-office-portrait-professional-photography" },
      { base: "london-working-on-linkedin-professional-photography" },
      { base: "london-studio-headshot-professional-photography" },
      { base: "london-studio-headshot-professional-photography-2" },
      { base: "london-studio-headshot-professional-photography-3" },
      { base: "london-maternity-portrait-studio-photography" },
      { base: "london-team-portrait-studio-photography" },
      { base: "london-fashion-portrait-studio-photography" },
      { base: "london-business-headshot-studio-photography" },
      { base: "london-dramatic-portrait-studio-photography" },
      { base: "london-bridal-portrait-studio-photography" },
      { base: "london-maternity-silhouette-portrait-studio-photography" },
      { base: "london-modern-maternity-portrait-studio-photography" },
      { base: "london-couples-maternity-portrait-studio-photography" },
      { base: "london-behindthescenes-fashion-shoot-studio-photography" },
      { base: "london-modern-business-headshot-studio-photography" },
      { base: "london-bridal-fashion-portrait-studio-photography" },
      { base: "london-modern-maternity-portrait-studio-photography-2" },
      { base: "london-maternity-portrait-studio-photography-2" },
      { base: "london-highkey-business-portrait-studio-photography" },
      { base: "london-professional-headshot-studio-photography" },
      { base: "london-bridal-hairstyle-detail-studio-photography" },
      { base: "london-professional-portrait-studio-photography" }
    ],
    travel: [
      { base: "westminster-london-big-ben-tourism-photography" },
      { base: "british-museum-london-great-court-tourism-photography" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography" },
      { base: "london-tower-bridge-tourism-photography" },
      { base: "westminster-london-big-ben-and-red-telephone-booth-tourism-photography" },
      { base: "london-tower-bridge-tourism-photography-2" },
      { base: "westminster-london-red-telephone-booths-and-london-eye-tourism-photography" },
      { base: "tower-bridge-london-tower-bridge-tourism-photography" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-2" },
      { base: "piccadilly-circus-london-piccadilly-circus-underground-station-tourism-photography" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-3" },
      { base: "westminster-london-red-telephone-booth-and-big-ben-tourism-photography" },
      { base: "green-park-london-autumn-foliage-tourism-photography" },
      { base: "south-bank-london-houses-of-parliament-and-big-ben-tourism-photography" },
      { base: "westminster-london-big-ben-and-red-telephone-booth-tourism-photography-2" },
      { base: "london-tower-bridge-tourism-photography-3" },
      { base: "leadenhall-market-london-leadenhall-market-tourism-photography" },
      { base: "pub-london-traditional-london-pub-tourism-photography" },
      { base: "st-dunstan-in-the-east-church-garden-london-st-dunstan-in-the-east-tourism-photography" },
      { base: "westminster-bridge-london-london-eye-and-county-hall-tourism-photography" },
      { base: "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-4" },
      { base: "south-bank-london-houses-of-parliament-and-big-ben-tourism-photography-2" },
      { base: "south-bank-london-big-ben-and-houses-of-parliament-tourism-photography" },
      { base: "westminster-london-red-telephone-booth-and-big-ben-tourism-photography-2" },
      { base: "westminster-bridge-london-big-ben-and-houses-of-parliament-tourism-photography" },
      { base: "st-pauls-cathedral-london-st-pauls-cathedral-tourism-photography" },
      { base: "tower-bridge-london-tower-bridge-tourism-photography-2" },
      { base: "westminster-london-red-telephone-booth-and-big-ben-tourism-photography-3" },
      { base: "westminster-london-big-ben-and-red-telephone-booth-tourism-photography-3" },
      { base: "westminster-london-big-ben-tourism-photography-2" }
    ],
    business: [
      { base: "westminster-london-london-eye-professional-photography" },
      { base: "london-architectural-interior-professional-photography" },
      { base: "london-cafe-professional-photography" },
      { base: "london-cafe-professional-photography-2" },
      { base: "covent-garden-london-covent-garden-professional-photography" },
      { base: "london-cafe-professional-photography-3" },
      { base: "london-color-analysis-session-professional-photography" },
      { base: "london-london-street-scene-professional-photography" },
      { base: "london-online-consultation-professional-photography" },
      { base: "london-beauty-treatment-preparation-professional-photography" },
      { base: "london-founders-portrait-professional-photography" },
      { base: "london-salon-interior-professional-photography" },
      { base: "london-haircut-professional-photography" },
      { base: "london-salon-interior-professional-photography-2" },
      { base: "london-founders-professional-portrait-professional-photography" },
      { base: "london-salon-decor-detail-professional-photography" },
      { base: "london-hair-styling-service-professional-photography" },
      { base: "london-salon-interior-reflection-professional-photography" },
      { base: "london-themed-cafe-professional-photography" },
      { base: "london-london-eye-professional-photography" },
      { base: "london-charming-london-street-professional-photography" },
      { base: "london-home-office-professional-photography" },
      { base: "london-home-office-portrait-professional-photography" },
      { base: "london-working-on-linkedin-professional-photography" },
      { base: "london-studio-headshot-professional-photography" },
      { base: "london-studio-headshot-professional-photography-2" },
      { base: "london-studio-headshot-professional-photography-3" },
      { base: "british-museum-london-british-museum-professional-photography" }
    ],
    studio: [
      { base: "london-maternity-portrait-studio-photography" },
      { base: "london-team-portrait-studio-photography" },
      { base: "london-fashion-portrait-studio-photography" },
      { base: "london-business-headshot-studio-photography" },
      { base: "london-dramatic-portrait-studio-photography" },
      { base: "london-bridal-portrait-studio-photography" },
      { base: "london-maternity-silhouette-portrait-studio-photography" },
      { base: "london-modern-maternity-portrait-studio-photography" },
      { base: "london-couples-maternity-portrait-studio-photography" },
      { base: "london-behindthescenes-fashion-shoot-studio-photography" },
      { base: "london-modern-business-headshot-studio-photography" },
      { base: "london-bridal-fashion-portrait-studio-photography" },
      { base: "london-modern-maternity-portrait-studio-photography-2" },
      { base: "london-maternity-portrait-studio-photography-2" },
      { base: "london-highkey-business-portrait-studio-photography" },
      { base: "london-professional-headshot-studio-photography" },
      { base: "london-bridal-hairstyle-detail-studio-photography" },
      { base: "london-professional-portrait-studio-photography" }
    ]
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsScrollingToGallery(true);
    setIsLoading(true)
  };

  const filteredImages = portfolioImages[selectedCategory as keyof typeof portfolioImages];
  
  // Paginations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImages = useMemo(() => {
    return filteredImages.slice(startIndex, startIndex + itemsPerPage);
  }, [startIndex, filteredImages, itemsPerPage]);

  // Disable the loader when images are finished loading
  useEffect(() => {
    if (hasMounted) {
      setIsLoading(false)
    }
  }, [filteredImages, currentPage, hasMounted])

  // Scroll to top when changing pages
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }

    if (sectionRef.current && (isScrollingToGallery || currentPage !== 1)) {
      sectionRef.current.scrollIntoView({ behavior: "smooth"})
      setIsScrollingToGallery(false)
    }
  }, [currentPage, isScrollingToGallery, hasMounted]);

  // Generate schema data only on client side to avoid hydration mismatch
  useEffect(() => {
    if (hasMounted && typeof window !== 'undefined') {
      const generateClientSchemaData = () => {
        const baseUrl = window.location.origin;
        const currentLocale = (locale === 'pt' ? 'pt' : 'en') as 'en' | 'pt';
        const categoryDescriptions = CATEGORY_DESCRIPTIONS[currentLocale];
        
        // Get current category description
        const categoryKey = selectedCategory as keyof typeof categoryDescriptions;
        const description = categoryDescriptions[categoryKey] || categoryDescriptions.all;
        
        return {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": `${BUSINESS_NAME} Portfolio`,
          "description": description,
          "url": `${baseUrl}/#portfolio`,
          "inLanguage": currentLocale === 'pt' ? 'pt-BR' : 'en-GB',
          "author": {
            "@type": "Person",
            "name": PHOTOGRAPHER_NAME,
            "jobTitle": currentLocale === 'pt' ? "Fotógrafa Profissional" : "Professional Photographer",
            "url": baseUrl,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": LOCATION
            }
          },
          "image": filteredImages.slice(0, 12).map((item) => ({
            "@type": "ImageObject",
            "url": `${baseUrl}/images/${item.base}-large.webp`,
            "thumbnail": `${baseUrl}/images/${item.base}-thumbnail.webp`,
            "description": generateImageMetadata(item.base).alt,
            "name": generateImageMetadata(item.base).title,
            "contentLocation": LOCATION,
            "inLanguage": currentLocale === 'pt' ? 'pt-BR' : 'en-GB',
            "creator": {
              "@type": "Person", 
              "name": PHOTOGRAPHER_NAME
            },
            "copyrightHolder": {
              "@type": "Person",
              "name": PHOTOGRAPHER_NAME
            }
          }))
        };
      };

      const schema = generateClientSchemaData();
      setSchemaData(JSON.stringify(schema));
    }
  }, [selectedCategory, locale, filteredImages, hasMounted]);


  return (
    <>
      {/* Schema.org Structured Data - Only rendered on client side */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaData }}
        />
      )}
      
      <section 
        className="py-16 px-6 bg-white scroll-mt-16" 
        id="portfolio" 
        ref={sectionRef}
        itemScope
        itemType="https://schema.org/ImageGallery"
      >
        <div className="max-w-6xl mx-auto text-center">
          <header>
            <h2 
              className="text-4xl font-bold text-gray-900 mb-8" 
              data-aos="fade-up"
              itemProp="name"
            >
              {translations.portfolioTitle}
            </h2>
          </header>

        {/* Filter Category */}
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategoryChange} 
        />

        {/* Filtered Galery */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginatedImages.map(({ base }, index) => {
              const { alt, title } = generateImageMetadata(base);
              const currentImageIndex = startIndex + index;
              
              return (
                <figure
                  key={`${base}-${currentImageIndex}`}
                  className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onClick={() => setSelectedIndex(currentImageIndex)}
                >
                  <Image
                    src={`/images/${base}-thumbnail.webp`}
                    alt={alt}
                    title={title}
                    width={500}
                    height={400}
                    className="w-full h-72 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">{translations.portfolioImagesDetails}</span>
                  </div>
                </figure>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          totalItems={filteredImages.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <Modal
            images={filteredImages.map(({ base }) => `/images/${base}-large.webp`)}
            selectedIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </section>
    </>
  );
};

export default Portfolio;