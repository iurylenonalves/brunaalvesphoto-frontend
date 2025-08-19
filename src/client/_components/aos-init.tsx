"use client"

import { useEffect } from "react"


export function AosInit() {
  useEffect(() => {
    // load AOS on client side
    const loadAos = async () => {
      const AOS = (await import('aos')).default;      
      
      if (!document.getElementById('aos-stylesheet')) {
        const link = document.createElement('link');
        link.id = 'aos-stylesheet';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/aos@2.3.4/dist/aos.css';
        document.head.appendChild(link);
      }
      
      AOS.init({
        once: true,
        duration: 800,
      });
    };

    const handleLoad = () => {
      setTimeout(() => {
        loadAos();
      }, 100); // Um pequeno atraso para garantir que a renderização principal ocorra
    };
    
    if (document.readyState === 'complete') {
      loadAos();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return null;
}