import React from 'react';
import Image from 'next/image';
import LandingPageSearch from '@/components/pages/home/HomeSearch';

const HeroLanding: React.FC = () => {
  const stats = [
    { value: '200', label: 'Books' },
    { value: '200', label: 'Authors' },
    { value: '2', label: 'Subjects' }
  ];

  return (
    <>
    <div className="relative min-h-[85vh] flex flex-col lg:flex-row items-start justify-between bg-[#06293A] px-6 md:px-16 lg:px-32 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/jpg/back.webp')" }}>
      {/* Left Content */}
      <div className="relative z-10 max-w-2xl flex flex-col justify-center h-[90svh] md:h-[90svh] w-full items-center text-left">
        <div className='flex flex-col items-start'>
          <Image src="/svg/landingLogo.svg" alt="Logo" width={300} height={250} className="mb-6" />
  
          <p className="md:text-xl lg:text-2xl text-gray-300 mb-8">
          Welcome to Biblio Estin, the online platform of ESTIN s Higher School of Computer Science Library. Here, you can access our library catalog and conveniently reserve, renew, and review your borrowed books.  
          </p>

          {/* Search Bar */}
          <LandingPageSearch />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 ">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 flex flex-col justify-start items-start rounded-lg text-center">
                <div className="text-4xl font-bold text-white">
                  {stat.value}
                  <span className="mx-2 text-[#F1413E]">+</span>
                </div>
                <div className="text-white  font-bold text-2xl ">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      <Image src="/svg/back1.svg" draggable={false} alt="Library Illustration" width={900} height={900} className="absolute right-[-100px] bottom-[-100px] hidden lg:block mx-12 h-auto" />
    </div>
    </>
  );
};

export default HeroLanding;
