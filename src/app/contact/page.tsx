import { redirect } from 'next/navigation';

export default function ContactPage() {
  // Redireciona automaticamente para a versão em inglês
  redirect('/en/contact/');
}