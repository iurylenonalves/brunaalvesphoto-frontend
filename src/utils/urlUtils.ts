/**
 * Remove extensões duplicadas de URLs (principalmente .webp.webp)
 */
export function cleanImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Remove a extensão duplicada .webp.webp se existir
  return url.replace(/\.webp\.webp$/, '.webp');
}

/**
 * Normaliza URLs de thumbnail para comparação
 * Extrae o nome base do arquivo (sem extensões e sufixos)
 */
export function normalizeThumbnailUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  try {
    // Remove query parameters and fragment
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Extract filename from URL (last part after /)
    const urlParts = cleanUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    if (!filename) return null;
    
    // Extract base filename by removing all extensions and suffixes
    let baseName = filename;
    
    // Remove .webp.webp pattern (for block images)
    baseName = baseName.replace(/\.webp\.webp$/, '');
    
    // Remove -thumb.webp pattern (for thumbnail images)  
    baseName = baseName.replace(/-thumb\.webp$/, '');
    
    // Remove any remaining .webp extension
    baseName = baseName.replace(/\.webp$/, '');
    
    return baseName;
  } catch (error) {
    console.error('Error normalizing thumbnail URL:', error);
    return null;
  }
}

/**
 * Compara duas URLs de thumbnail considerando variações (-thumb, extensões duplicadas)
 */
export function compareThumbnailUrls(url1: string | null | undefined, url2: string | null | undefined): boolean {
  const normalized1 = normalizeThumbnailUrl(url1);
  const normalized2 = normalizeThumbnailUrl(url2);
  
  return normalized1 === normalized2;
}

/**
 * Constrói a URL completa para uma imagem, lidando com URLs relativas e absolutas
 */
export function buildImageUrl(url: string | null | undefined, apiUrl?: string): string {
  const cleanUrl = cleanImageUrl(url);
  
  if (!cleanUrl) return '/placeholder.png';
  
  // Se a URL já é completa (http/https), retorna ela mesma
  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('https')) {
    return cleanUrl;
  }
  
  // Se não, constrói a URL completa usando a API_URL
  const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || '';
  return `${baseUrl}/${cleanUrl}`;
}
