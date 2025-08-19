const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in your environment variables.");
}

// Dados de fallback para uso durante build quando API não estiver disponível
const fallbackPosts = [
  {
    id: "1",
    slug: "exemplo-post",
    title: "Post de Exemplo",
    subtitle: "Este é um post de exemplo para visualização.",
    locale: "en",
    publishedAt: "2024-06-01",
    blocks: [
      { type: "text" as const, content: "Conteúdo de exemplo." },
      { type: "image" as const, src: "https://placekitten.com/400/200", alt: "Gatinho de exemplo" }
    ]
  },
  {
    id: "2",
    slug: "exemplo-post-pt",
    title: "Post de Exemplo PT",
    subtitle: "Este é um post de exemplo para visualização em português.",
    locale: "pt",
    publishedAt: "2024-06-02",
    blocks: [
      { type: "text" as const, content: "Conteúdo de exemplo em português." },
      { type: "image" as const, src: "https://placekitten.com/400/200", alt: "Gatinho de exemplo" }
    ]
  },
  {
    id: "3",
    slug: "english-post-1",
    title: "Bride Portrait",
    subtitle: "By Bruna Alves",
    locale: "en",
    publishedAt: "2024-06-03",
    blocks: [
      { type: "text" as const, content: "<p>Professional bride portrait session in London.</p>" },
      { type: "image" as const, src: "/images/posts/studio09-large.webp", alt: "Bride Portrait" },
      { type: "text" as const, content: "<p>Capturing the beauty and elegance of the bride.</p>" }
    ]
  },
  {
    id: "4",
    slug: "professional-photography",
    title: "Professional Photography Services",
    subtitle: "London Portrait Photography",
    locale: "en",
    publishedAt: "2024-06-10",
    blocks: [
      { type: "text" as const, content: "<p>Professional photography services in London.</p>" },
      { type: "image" as const, src: "https://placekitten.com/600/400", alt: "Professional Photography" }
    ]
  },
  {
    id: "5",
    slug: "fotografia-profissional",
    title: "Serviços de Fotografia Profissional",
    subtitle: "Fotografia de Retrato em Londres",
    locale: "pt",
    publishedAt: "2024-06-15",
    blocks: [
      { type: "text" as const, content: "<p>Serviços de fotografia profissional em Londres.</p>" },
      { type: "image" as const, src: "https://placekitten.com/600/400", alt: "Fotografia Profissional" }
    ]
  }
];

function getFallbackPosts(locale: string) {
  return fallbackPosts.filter(post => post.locale === locale);
}

function getFallbackPostBySlug(slug: string, locale: string) {
  return fallbackPosts.find(post => post.slug === slug && post.locale === locale) || null;
}

export async function getPosts(locale: string) {
  console.log(`[API] Attempting to fetch posts for locale: ${locale}`);
  console.log(`[API] Using API URL: ${API_URL}/api/posts?locale=${locale}`);
  
  try {
    const response = await fetch(`${API_URL}/api/posts?locale=${locale}`,{
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Static-Build'
      },
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    console.log(`[API] Response status: ${response.status}`);
    
    if (!response.ok) {   
      const errorBody = await response.text(); 
      console.error(`[API] Error response body: ${errorBody.substring(0, 500)}`);
      
      // Se for erro 401 (autenticação), usar fallback durante build
      if (response.status === 401) {
        console.warn("[API] 401 Authentication failed during build, using fallback data");
        return getFallbackPosts(locale);
      }
      
      console.error(`[API] HTTP Error ${response.status}, using fallback data`);
      return getFallbackPosts(locale);
    }
    
    const data = await response.json();
    console.log(`[API] Successfully fetched ${data.length} posts`);
    return data;
  } catch (_error) {
    console.error(`[API] Network/Timeout error: ${_error}`);
    console.warn("[API] Using fallback data due to network error");
    return getFallbackPosts(locale);
  }
}

export async function getPostBySlug(slug: string, locale: string) {
  console.log(`[API] Fetching post: ${slug} (${locale})`);
  
  try {
    const response = await fetch(`${API_URL}/api/posts/${slug}?locale=${locale}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Static-Build'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    console.log(`[API] Post response status: ${response.status}`);
    
    if (!response.ok) {
      // Se for erro 401 (autenticação), usar fallback durante build
      if (response.status === 401) {
        console.warn(`[API] 401 for post ${slug}, using fallback data`);
        return getFallbackPostBySlug(slug, locale);
      }
      console.warn(`[API] Post ${slug} not found (${response.status})`);
      return null; 
    }
    
    const data = await response.json();
    console.log(`[API] Successfully fetched post: ${data.title}`);
    return data;
  } catch (_error) {
    console.error(`[API] Error fetching post ${slug}: ${_error}`);
    console.warn(`[API] Using fallback for post ${slug}`);
    return getFallbackPostBySlug(slug, locale);
  }
}

export async function createPost(formData: FormData, token: string) {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create post');
  }

  return response.json();
}

export async function updatePost(slug: string, formData: FormData, token: string) {
  const response = await fetch(`${API_URL}/api/posts/${slug}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update post');
  }
  return response.json();
}

export async function deletePost(slug: string, token: string, locale: string) {
  const response = await fetch(`${API_URL}/api/posts/${slug}?locale=${locale}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete post');
  }  
  return { success: true };
}

// New: Direct-to-Blob client upload flow
// 1) Ask backend to sign client upload
export async function getClientUploadToken(jwt: string, pathname: string) {
  const res = await fetch(`${API_URL}/api/uploads/sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // The handleUpload helper expects the raw body from the client SDK,
      // but for non-Next frameworks, passing pathname here is enough to
      // generate a token via onBeforeGenerateToken.
      // We also pass our JWT inside clientPayload.
      action: 'blob.generate-client-token',
      pathname,
      clientPayload: JSON.stringify({ jwt })
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to get upload token: ${err}`);
  }
  return res.json();
}

// 2) Create post using JSON (after images uploaded directly to Blob)
type TextBlock = { type: 'text'; content: string };
type ImageBlock = { 
  type: 'image';
  src: string;
  alt?: string
  width?: number;
  height?: number;
};


export type PostJsonPayload = {
  title: string;
  subtitle: string;
  locale: 'en' | 'pt';
  publishedAt?: string;
  relatedSlug?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  blocks: Array<TextBlock | ImageBlock>;
};

export async function createPostJson(payload: PostJsonPayload, token: string) {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create post');
  }
  return res.json();
}

export async function updatePostJson(slug: string, payload: PostJsonPayload, token: string) {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update post');
  }
  return res.json();
}

// Interface para o retorno do nosso novo endpoint
export interface ProcessedImageResult {
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

/**
 * NOVA FUNÇÃO: Faz o upload de um arquivo de imagem para nosso backend
 * para processamento e armazenamento.
 */
export async function uploadImage(imageFile: File, token: string): Promise<ProcessedImageResult> {
  const formData = new FormData();
  formData.append("image", imageFile); // A chave "image" deve corresponder ao upload.single("image") no backend

  const response = await fetch(`${API_URL}/api/uploads/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // NÃO defina 'Content-Type', o navegador fará isso automaticamente para FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to upload image." }));
    throw new Error(errorData.error || 'Failed to upload image');
  }

  return response.json();
}