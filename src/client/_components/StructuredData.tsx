'use client';

import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    // Schema.org JSON-LD para Professional Service
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Brazilian Photographer in London",
      "alternateName": "Fotógrafa Brasileira em Londres",
      "description": "Want to turn your moments into unforgettable memories? Whether for your trip, your brand, or a special portrait, I'm here to capture your essence in every click.",
      "url": "https://brunaalvesphoto.com",
      "logo": "https://brunaalvesphoto.com/images/logo-brunaalvesphoto-large.webp",
      "image": [
        "https://brunaalvesphoto.com/images/hero-image-large.webp",
        "https://brunaalvesphoto.com/images/about-image-large.webp",
        "https://brunaalvesphoto.com/images/contact-image-large.webp"
      ],
      "telephone": "+44-xxx-xxx-xxxx",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "London",
        "addressCountry": "UK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.5074",
        "longitude": "-0.1278"
      },
      "serviceType": [
        "Photography",
        "Portrait Photography",
        "Corporate Photography",
        "Tourism Photography",
        "Studio Photography"
      ],
      "areaServed": {
        "@type": "City",
        "name": "London"
      },
      "founder": {
        "@type": "Person",
        "name": "Bruna Alves",
        "nationality": "Brazilian",
        "image": "https://brunaalvesphoto.com/images/about-image-large.webp"
      },
      "sameAs": [
        "https://www.instagram.com/brunaalvesphoto",
        "https://www.facebook.com/brunaalvesphoto"
      ]
    };

    // Remove script existente se houver
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Adiciona novo script
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}
