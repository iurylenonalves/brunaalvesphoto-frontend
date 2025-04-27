"use client";

import { useState } from "react";
import AdminPostForm from "@/client/_components/AdmimPostForm";

export default function AdminPostsPage() {
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <AdminPostForm onSuccess={() => setSuccessMessage("Post created successfully!")} />
      {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
    </main>
  );
}