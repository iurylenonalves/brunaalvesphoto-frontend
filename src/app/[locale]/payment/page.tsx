import PaymentInterface from "@/client/_components/payment/PaymentInterface";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import { Suspense } from "react";

export const metadata = {
  title: "Payment | Bruna Alves Photography",
  description: "Secure payment for photography sessions.",
  robots: "noindex, nofollow" // Payment pages shouldn't be indexed
};

export default function PaymentPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-24 pb-12">
        <div className="container mx-auto px-4 w-full">
          <Suspense fallback={<div className="text-center py-20">Loading payment details...</div>}>
            <PaymentInterface />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
