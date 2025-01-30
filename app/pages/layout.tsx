

import Footer from '@/components/Foter'


export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
 
 
  return (
    <>
    
    {children}
  <Footer />
    
    </>

    
  );
}
