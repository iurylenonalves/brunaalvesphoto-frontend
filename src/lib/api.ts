export async function getPosts(locale: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?locale=${locale}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPostBySlug(slug: string, locale: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}?locale=${locale}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function createPost(formData: FormData, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function updatePost(slug: string, formData: FormData, token: string, locale: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}?locale=${locale}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function deletePost(slug: string, token: string, locale: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}?locale=${locale}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}