

import Title from '@/components/Title';
import ParentComponent from "@/components/FilterETSearch"
export default function Catalog() {
 

    return (
        <>
        
     
        <Title
      
      mainTitle="Library's Catalogue "
      subTitle="Welcome to Biblio Estin, the online platform of ESTIN's Higher School of Computer Science Library Here"
      ></Title>
    
    <div 
  className="absolute bg-red-400 z-[-1] h-[450px] w-full"
  style={{
    backgroundImage: `url('/jpg/hero.png')`, // Replace with the path to your image
    backgroundSize: 'cover', // Ensures the image covers the entire div
    backgroundPosition: 'center', // Centers the image
    backgroundRepeat: 'no-repeat', // Prevents the image from repeating
  }}
></div>
     <ParentComponent></ParentComponent>
    
            
       
   

     
        </>

    );
  }
  
  
  
