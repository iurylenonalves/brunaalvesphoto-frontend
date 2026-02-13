"use client";
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/client/_components/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("No credential received from Google");
      return;
    }
    
    setError(""); // clear any previous error
    setLoading(true);
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
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
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
          {loading && (
            <div className="mb-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}
          {/* Google OAuth Provider and Login Button */}
          <GoogleOAuthProvider clientId={clientId}>
            {!loading && (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
                useOneTap // Enables one-tap sign-in
              />
            )}
          </GoogleOAuthProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}