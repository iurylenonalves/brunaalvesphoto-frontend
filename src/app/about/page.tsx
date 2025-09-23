import { redirect } from 'next/navigation';

export default function AboutPage() {
  // Redireciona automaticamente para a versão em inglês
  redirect('/en/about/');
}