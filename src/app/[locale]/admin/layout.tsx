import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Brazilian Photographer in London",
  description: "Admin panel for Bruna Alves Photography",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
