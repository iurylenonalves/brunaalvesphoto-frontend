import { redirect } from 'next/navigation';

export default function RootPage() {
  // Esta página redireciona automaticamente para a versão em inglês
  redirect('/en');
}
