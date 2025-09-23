import { redirect } from 'next/navigation';

export default function PortfolioPage() {
  // Redireciona automaticamente para a versão em inglês
  redirect('/en/portfolio/');
}