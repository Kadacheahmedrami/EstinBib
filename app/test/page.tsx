import Catalogue from "@/components/Catalogue";
import Title from "@/components/Title";

export default function TestPage() {
  return (
    <>
      <Title
        mainTitle="Library's Catalogue"
        subTitle="Welcome to Biblio Estin,  the online platform of ESTIN's Higher School of Computer Science Library Here"
      />
      <div
        className="absolute fle bg-red-400 z-[-1] h-[55%] w-full"
        style={{
        
          backgroundImage: `url('/jpg/hero.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <Catalogue />
    </>
  );
} 