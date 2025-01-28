import "./globals.css";

import Header from '@/components/header';
import Footer from '@/components/Foter';


export const metadata = {
  title: "DZ Tabib ",
  description: "DZ Tabib is your trusted platform to find doctors, psychologists, and healthcare services in Algeria. Your health, our priority.",
  keywords: "DZ Tabib, Tabib DZ, doctors Algeria, psychologists Algeria, healthcare Algeria, find doctors, Algeria healthcare platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        
      </head>
      
      <body className="min-h-screen bg-background font-sans antialiased">
   
        

            <Header />
            <div className='mt-[100px]'></div>
            <main className="relative flex flex-col ">
              {children}
            </main>
            <Footer />
   
      </body>
    </html>
  );
}