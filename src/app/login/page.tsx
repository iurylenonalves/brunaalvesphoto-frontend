"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "@/client/_components/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(""); // clear any previous error
    try {
      // 1. Send the Google token to your backend for validation
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/google`, { // Ensure this endpoint exists in your backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (!res.ok) {
        throw new Error("Backend validation failed");
      }

      // 2. Receives YOUR JWT token from your backend
      const data = await res.json();
      login(data.token);

      // 3. Redirects the user to the correct page
      const redirect = sessionStorage.getItem("redirectAfterLogin");
      if (redirect) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirect);
      } else {
        router.push("/admin/posts");
      }

    } catch (err) {
      console.error(err);
      setError("Falha no login. Tente novamente.");
    }
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <p>Google Client ID not found. Please check your environment variables.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-sm flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h1>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          {/* Google OAuth Provider and Login Button */}
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              useOneTap // Enables one-tap sign-in
            />
          </GoogleOAuthProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}