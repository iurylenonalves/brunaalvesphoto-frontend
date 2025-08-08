// let mockPosts = [
//   {
//     slug: "exemplo-post",
//     title: "Post de Exemplo",
//     subtitle: "Este é um post de exemplo para visualização.",
//     locale: "en",
//     publishedAt: "2024-06-01",
//     blocks: [
//       { type: "text" as "text", content: "Conteúdo de exemplo." },
//       { type: "image" as "image", src: "https://placekitten.com/400/200", alt: "Gatinho de exemplo" }
//     ]
//   },
//   {
//     slug: "exemplo-post-pt",
//     title: "Post de Exemplo PT",
//     subtitle: "Este é um post de exemplo para visualização em português.",
//     locale: "pt",
//     publishedAt: "2024-06-02",
//     blocks: [
//       { type: "text" as "text", content: "Conteúdo de exemplo em português." },
//       { type: "image" as "image", src: "https://placekitten.com/400/200", alt: "Gatinho de exemplo" }
//     ]
//   },
//   {
//     slug: "english-post-1",
//     title: "Bride Portrait",
//     subtitle: "By Bruna Alves",
//     locale: "en",
//     publishedAt: "2024-06-03",
//     blocks: [
//       { type: "text" as "text", content: "<p>Primeiro texto do post...</p>" },
//       { type: "image" as "image", src: "/images/posts/studio09-large.webp", alt: "Bride Portrait" },
//       { type: "text" as "text", content: "<p>Segundo texto do post...</p>" },
//       { type: "image" as "image", src: "/images/posts/studio10-large.webp", alt: "Another photo" },
//       { type: "text" as "text", content: "<p>Terceiro texto do post...</p>" },
//       { type: "image" as "image", src: "/images/posts/studio11-large.webp", alt: "Last photo" },
//       { type: "text" as "text", content: "<p>Texto final do post...</p>" }
//     ]
//   },
//   {
//     slug: "english-post-2",
//     title: "English Post 2",
//     subtitle: "Subtitle EN 2",
//     locale: "en",
//     publishedAt: "2024-06-10",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 2.</p>" },
//       { type: "image" as "image", src: "/images/posts/en2.jpg", alt: "Image for English Post 2" }
//     ]
//   },
//   {
//     slug: "english-post-3",
//     title: "English Post 3",
//     subtitle: "Subtitle EN 3",
//     locale: "en",
//     publishedAt: "2024-06-15",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 3.</p>" },
//       { type: "image" as "image", src: "/images/posts/en3.jpg", alt: "Image for English Post 3" }
//     ]
//   },
//   {
//     slug: "english-post-4",
//     title: "English Post 4",
//     subtitle: "Subtitle EN 4",
//     locale: "en",
//     publishedAt: "2024-06-20",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 4.</p>" },
//       { type: "image" as "image", src: "/images/posts/en4.jpg", alt: "Image for English Post 4" }
//     ]
//   },
//   {
//     slug: "english-post-5",
//     title: "English Post 5",
//     subtitle: "Subtitle EN 5",
//     locale: "en",
//     publishedAt: "2024-06-25",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 5.</p>" },
//       { type: "image" as "image", src: "/images/posts/en5.jpg", alt: "Image for English Post 5" }
//     ]
//   },
//   {
//     slug: "english-post-6",
//     title: "English Post 6",
//     subtitle: "Subtitle EN 6",
//     locale: "en",
//     publishedAt: "2024-06-30",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 6.</p>" },
//       { type: "image" as "image", src: "/images/posts/en6.jpg", alt: "Image for English Post 6" }
//     ]
//   },
//   {
//     slug: "english-post-7",
//     title: "English Post 7",
//     subtitle: "Subtitle EN 7",
//     locale: "en",
//     publishedAt: "2024-07-05",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 7.</p>" },
//       { type: "image" as "image", src: "/images/posts/en7.jpg", alt: "Image for English Post 7" }
//     ]
//   },
//   {
//     slug: "english-post-8",
//     title: "English Post 8",
//     subtitle: "Subtitle EN 8",
//     locale: "en",
//     publishedAt: "2024-07-10",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 8.</p>" },
//       { type: "image" as "image", src: "/images/posts/en8.jpg", alt: "Image for English Post 8" }
//     ]
//   },
//   {
//     slug: "english-post-9",
//     title: "English Post 9",
//     subtitle: "Subtitle EN 9",
//     locale: "en",
//     publishedAt: "2024-07-15",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 9.</p>" },
//       { type: "image" as "image", src: "/images/posts/en9.jpg", alt: "Image for English Post 9" }
//     ]
//   },
//   {
//     slug: "english-post-10",
//     title: "English Post 10",
//     subtitle: "Subtitle EN 10",
//     locale: "en",
//     publishedAt: "2024-07-20",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 10.</p>" },
//       { type: "image" as "image", src: "/images/posts/en10.jpg", alt: "Image for English Post 10" }
//     ]
//   },
//   {
//     slug: "english-post-11",
//     title: "English Post 11",
//     subtitle: "Subtitle EN 11",
//     locale: "en",
//     publishedAt: "2024-07-25",
//     blocks: [
//       { type: "text" as "text", content: "<p>Content for English Post 11.</p>" },
//       { type: "image" as "image", src: "/images/posts/en11.jpg", alt: "Image for English Post 11" }
//     ]
//   }
// ];



// export async function getPosts(locale: string) {
//   // Retorna todos os posts do idioma selecionado
//   return mockPosts.filter(post => post.locale === locale);
// }

// export async function getPostBySlug(slug: string, locale: string) {
//   return mockPosts.find(post => post.slug === slug && post.locale === locale) || mockPosts[0];
// }

// export async function createPost(formData: FormData, token: string) {
//   const title = formData.get("title") as string;
//   const subtitle = formData.get("subtitle") as string;
//   const locale = formData.get("locale") as string;
//   const publishedAt = formData.get("publishedAt") as string; // <-- Adicione esta linha
//   const blocks = JSON.parse(formData.get("blocks") as string);

//   const slug = title
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w-]+/g, "")
//     + "-" + Math.random().toString(36).substring(2, 6);

//   // Inclua publishedAt no objeto
//   const newPost = { slug, title, subtitle, locale, publishedAt, blocks };
//   mockPosts = [newPost, ...mockPosts];
//   return newPost;
// }



// export async function updatePost(slug: string, formData: FormData, token: string, locale: string) {
//   const title = formData.get("title") as string;
//   const subtitle = formData.get("subtitle") as string;
//   const publishedAt = formData.get("publishedAt") as string; // <-- Adicione esta linha
//   const blocks = JSON.parse(formData.get("blocks") as string);

//   mockPosts = mockPosts.map(post =>
//     post.slug === slug && post.locale === locale
//       ? { ...post, title, subtitle, publishedAt, blocks }
//       : post
//   );
//   return mockPosts.find(post => post.slug === slug && post.locale === locale);
// }

// export async function deletePost(slug: string, token: string, locale: string) {
//   mockPosts = mockPosts.filter(post => !(post.slug === slug && post.locale === locale));
//   return true;
// }

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
type ImageBlock = { type: 'image'; src: string; alt?: string };
export type PostJsonPayload = {
  title: string;
  subtitle: string;
  locale: 'en' | 'pt';
  publishedAt?: string;
  relatedSlug?: string;
  thumbnailSrc?: string;
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
