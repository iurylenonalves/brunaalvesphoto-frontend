import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {  
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  
  const browserLocale = acceptLanguage?.split(',')[0].toLowerCase();
  
  if (browserLocale?.startsWith('pt')) {
    redirect('/pt');
  } else {
    redirect('/en');
  }
}