"use client"
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPageSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-[1000px] mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
      <input
        type="text"
        placeholder="Search by title..."
        className="w-full bg-white text-gray-800 rounded-full pl-12 pr-4 py-4 text-xl shadow-lg focus:outline-none hover:ring-0 ease-in  transition-all duration-300  hover:shadow-md hover:shadow-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#f84747] hover:bg-[#e43e3e] text-white rounded-full px-6 py-3 text-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:ring-4 hover:ring-white hover:ring-opacity-50"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default LandingPageSearch;
