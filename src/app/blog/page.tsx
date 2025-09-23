import { redirect } from 'next/navigation';

export default function BlogPage() {
  // Redireciona automaticamente para a versão em inglês
  redirect('/en/blog/');
}