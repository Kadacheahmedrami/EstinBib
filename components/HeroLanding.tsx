
import React from 'react';
import Image from 'next/image';
import LandingPageSearch from '@/components/seach-bar';

const HeroLanding: React.FC = () => {
  const stats = [
    { value: '200+', label: 'Books' },
    { value: '200+', label: 'Authors' },
    { value: '2', label: 'Subjects' }
  ];

  return (
    <div className="relative min-h-[90vh]  flex flex-col lg:flex-row items-start justify-between bg-[#06293A] px-6 md:px-16 lg:px-32   overflow-hidden">
      {/* Left Content */}
      <div className="relative z-10 max-w-2xl flex flex-col justify-center h-[90vh] w-full items-center text-left">
        <div className='flex flex-col items-start'>
          <Image src="/svg/landingLogo.svg" alt="Logo" width={300} height={250} className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Welcome to Biblio Estin</h1>
          <p className="text-lg text-gray-300 mb-8">
            The online platform of ESTIN s Higher School of Computer Science Library.
            Access our catalog, reserve books, and manage your borrowed materials easily.
          </p>

          {/* Search Bar */}
          <LandingPageSearch />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 bg-white/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Image */}

        <Image src="/jpg/library.png" alt="Library Illustration" width={900} height={900} className="absolute right-0 top-0 hidden lg:block my-8 mx-12  h-auto" />
 
    </div>
  );
};

export default HeroLanding;
