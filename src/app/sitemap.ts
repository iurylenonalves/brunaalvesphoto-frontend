import { MetadataRoute } from 'next';
import { PostSummary } from '@/types';

// Base names for portfolio images used in the sitemap
const portfolioImageBases = [
  "london-tower-bridge-tourism-photography-3",
  "south-bank-london-houses-of-parliament-and-big-ben-tourism-photography",
  "westminster-london-red-telephone-booth-and-big-ben-tourism-photography-3",
  "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-3",
  "green-park-london-autumn-foliage-tourism-photography",
  "british-museum-london-british-museum-professional-photography",
  "westminster-london-big-ben-and-red-telephone-booth-tourism-photography-3",
  "pub-london-traditional-london-pub-tourism-photography",
  "tower-bridge-london-tower-bridge-tourism-photography",
  "london-tower-bridge-tourism-photography-2",
  "westminster-london-big-ben-tourism-photography-2",
  "westminster-bridge-london-london-eye-and-county-hall-tourism-photography",
  "westminster-london-big-ben-tourism-photography",
  "british-museum-london-great-court-tourism-photography",
  "westminster-london-big-ben-and-houses-of-parliament-tourism-photography",
  "london-tower-bridge-tourism-photography",
  "westminster-london-big-ben-and-red-telephone-booth-tourism-photography",
  "westminster-london-red-telephone-booths-and-london-eye-tourism-photography",
  "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-2",
  "piccadilly-circus-london-piccadilly-circus-underground-station-tourism-photography",
  "westminster-london-red-telephone-booth-and-big-ben-tourism-photography",
  "westminster-london-big-ben-and-red-telephone-booth-tourism-photography-2",
  "leadenhall-market-london-leadenhall-market-tourism-photography",
  "st-dunstan-in-the-east-church-garden-london-st-dunstan-in-the-east-tourism-photography",
  "westminster-london-big-ben-and-houses-of-parliament-tourism-photography-4",
  "south-bank-london-houses-of-parliament-and-big-ben-tourism-photography-2",
  "south-bank-london-big-ben-and-houses-of-parliament-tourism-photography",
  "westminster-london-red-telephone-booth-and-big-ben-tourism-photography-2",
  "westminster-bridge-london-big-ben-and-houses-of-parliament-tourism-photography",
  "st-pauls-cathedral-london-st-pauls-cathedral-tourism-photography",
  "tower-bridge-london-tower-bridge-tourism-photography-2",
  "westminster-london-london-eye-professional-photography",
  "london-architectural-interior-professional-photography",
  "london-cafe-professional-photography",
  "london-cafe-professional-photography-2",
  "covent-garden-london-covent-garden-professional-photography",
  "london-cafe-professional-photography-3",
  "london-color-analysis-session-professional-photography",
  "london-london-street-scene-professional-photography",
  "london-online-consultation-professional-photography",
  "london-beauty-treatment-preparation-professional-photography",
  "london-founders-portrait-professional-photography",
  "london-salon-interior-professional-photography",
  "london-haircut-professional-photography",
  "london-salon-interior-professional-photography-2",
  "london-founders-professional-portrait-professional-photography",
  "london-salon-decor-detail-professional-photography", 
  "london-hair-styling-service-professional-photography",
  "london-salon-interior-reflection-professional-photography",
  "london-themed-cafe-professional-photography",
  "london-london-eye-professional-photography",
  "london-charming-london-street-professional-photography",
  "london-home-office-professional-photography",
  "london-home-office-portrait-professional-photography",
  "london-working-on-linkedin-professional-photography",
  "london-studio-headshot-professional-photography",
  "london-studio-headshot-professional-photography-2",
  "london-studio-headshot-professional-photography-3",
  "london-maternity-portrait-studio-photography",
  "london-team-portrait-studio-photography",
  "london-fashion-portrait-studio-photography",
  "london-business-headshot-studio-photography",
  "london-dramatic-portrait-studio-photography",
  "london-bridal-portrait-studio-photography",
  "london-maternity-silhouette-portrait-studio-photography",
  "london-modern-maternity-portrait-studio-photography",
  "london-couples-maternity-portrait-studio-photography",
  "london-behindthescenes-fashion-shoot-studio-photography",
  "london-modern-business-headshot-studio-photography",
  "london-bridal-fashion-portrait-studio-photography",
  "london-modern-maternity-portrait-studio-photography-2",
  "london-maternity-portrait-studio-photography-2",
  "london-highkey-business-portrait-studio-photography",
  "london-professional-headshot-studio-photography",
  "london-bridal-hairstyle-detail-studio-photography",
  "london-professional-portrait-studio-photography"
];

//Fetches blog posts from the API to include in the sitemap 
async function fetchBlogPosts(): Promise<PostSummary[]> {
  try {
    // Fetch posts from the API with 1-hour cache revalidation
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) { 
      return []; 
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Sitemap: Error fetching posts:', error);
    return [];
  }
}


//Generates the sitemap for the website
//Includes home pages, static pages, and dynamic blog posts in both languages 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.brunaalvesphoto.com';

  // Fetch blog posts for dynamic sitemap generation
  const posts = await fetchBlogPosts();
  
  // Create sitemap entries for blog posts in both languages with alternates
  const postUrls = posts.flatMap(post => ([
    { 
      url: `${baseUrl}/en/blog/${post.slug}`, 
      alternates: { languages: { pt: `${baseUrl}/pt/blog/${post.slug}` } } 
    },
    { 
      url: `${baseUrl}/pt/blog/${post.slug}`, 
      alternates: { languages: { en: `${baseUrl}/en/blog/${post.slug}` } } 
    },
  ]));

  // Home page entries with language alternates and highest priority
  const homeUrls = [
    { 
      url: `${baseUrl}/`, 
      alternates: { languages: { pt: `${baseUrl}/pt/` } }, 
      priority: 1.0 
    },
    { 
      url: `${baseUrl}/pt/`, 
      alternates: { languages: { en: `${baseUrl}/` } }, 
      priority: 1.0 
    },
  ];
  
  // Static pages that exist in both languages
  const staticPages = ['about', 'contact', 'blog', 'portfolio'];

  // Generate sitemap entries for static pages in both languages
  const staticUrls = staticPages.flatMap(page => {    
    // English version of the page
    const enEntry: MetadataRoute.Sitemap[0] = {
      url: `${baseUrl}/en/${page}/`,
      lastModified: new Date(),
      // Set priority based on page importance
      priority: page === 'portfolio' || page === 'blog' ? 0.9 : (page === 'about' ? 0.8 : 0.7),
      alternates: { languages: { pt: `${baseUrl}/pt/${page}/` } },
    };
    
    // Add portfolio images to the portfolio page for better SEO
    if (page === 'portfolio') {
      enEntry.images = portfolioImageBases.map(base => `${baseUrl}/images/${base}-large.webp`);
    }
    
    // Portuguese version of the page
    const ptEntry: MetadataRoute.Sitemap[0] = {
      url: `${baseUrl}/pt/${page}/`,
      lastModified: new Date(),
      priority: page === 'portfolio' || page === 'blog' ? 0.9 : (page === 'about' ? 0.8 : 0.7),
      alternates: { languages: { en: `${baseUrl}/en/${page}/` } },
    };

    return [enEntry, ptEntry];
  });
  
  // Combine all URL entries for the final sitemap
  return [...homeUrls, ...staticUrls, ...postUrls];
}