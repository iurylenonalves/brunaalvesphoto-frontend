"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/client/_components/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   // Troque a URL abaixo para a rota da sua API de login
  //   const res = await fetch("https://sua-api.com/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ username, password }),
  //   });
  //   if (res.ok) {
  //     const data = await res.json();
  //     login(data.token); // Salva o token no contexto/localStorage
  //     router.push("/admin/posts");
  //   } else {
  //     setError("User or password is incorrect.");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const fakeToken = "token-teste";
    login(fakeToken); // Salva o token no contexto/localStorage
    router.push("/admin/posts");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Entrar
        </button>
      </form>
    </main>
  );
}