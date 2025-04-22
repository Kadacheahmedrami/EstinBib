import Title from '@/components/Title';

import Catalogue from '@/components/Catalogue';
import Footer from '@/components/Footer'
// Catalog component expects the books prop to be an array of Book objects

export default async function Catalog() {
  return (
    <>
      <Title
        mainTitle="Library's Catalogue"
        subTitle="Welcome to Biblio Estin, the online platform of ESTIN's Higher School of Computer Science Library Here"
      />
      <div
        className="absolute bg-red-400 z-[-1] h-[500px] w-full"
        style={{
          backgroundImage: `url('/jpg/hero.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <Catalogue></Catalogue>
    
      <Footer />
    </>
  );
}
