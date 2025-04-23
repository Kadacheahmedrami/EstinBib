import React from 'react';
import Image from "next/image";
import LocationMapClient from '@/components/pages/map/LocationMapClient';
import Link from 'next/link';
import SocialIcons from '@/components/pages/footer-comps/socialicons';

const Footer: React.FC = () => {
    const estinLatitude = 36.6636426;
    const estinLongitude = 4.9125355;
    const locationName = 'ESTIN, Béjaia, Algeria';

    return (
        <footer className="bg-gray-800 text-white py-12 px-6 lg:px-16 md:px-10" 
            style={{ fontFamily: 'Poppins, sans-serif', backgroundImage: 'url(/jpg/Gradient.png)' }}>
            
            <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
                {/* Left Section: Logo and Address */}
                <div className="col-span-1 md:col-span-2 flex flex-col items-start space-y-3">
                    <Image src="/svg/estin.svg" alt="ESTIN Logo" width={200} height={200} className="mr-auto cursor-pointer" />
                    <p className="text-[24px]">
                        <a href="tel:+21334824916" className="text-[24px] underline">
                            +213-34-824-916
                        </a>
                    </p>
                    <Link href="mailto:contact@estin.dz" className="text-[24px] underline">
                        contact@estin.dz
                    </Link>
                    <h3 className="text-2xl font-bold">Follow Us</h3>
                    <ul className="flex space-x-5">
                        <SocialIcons />
                    </ul>
             
                </div>

                {/* Middle Section: Address and Map */}
                <div className="col-span-1 md:col-span-3 flex flex-col items-start ">

                    <h3 className='text-2xl  font-bold bg-opacity-80 relative md:left-7  '>Adress :</h3>
                <p className="text-[20px] relative md:left-7   ">
                        National road n° 75, Amizour 06300 Bejaia, Algeria
                    </p>
                   
                    <div className='w-[80%]  z-[1] bottom-4 relative md:left-7 '>
                    <LocationMapClient 
                        latitude={estinLatitude} 
                        longitude={estinLongitude} 
                        locationName={locationName} 
                    />
                    </div>
             
                </div>

                {/* Right Section: Contact Form */}
                <div className="col-span-1 md:col-span-3 flex flex-col">
                    <h3 className="text-2xl font-bold mb-5">Contact The Library</h3>
                    <form className="flex flex-col space-y-4">
                        <input 
                            type="text" 
                            placeholder="Your name" 
                            className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <input 
                            type="email" 
                            placeholder="Your email" 
                            className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <textarea 
                            rows={4} 
                            placeholder="Your message" 
                            className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <button className="h-12 w-36 bg-[#F1413E] ml-auto text-white text-lg rounded-lg hover:shadow-lg transition-all">
                            Send
                        </button>
                    </form>
                    
                </div>
                
            </div>
            <div className="border-t text-center mt-8 border-gray-700 pt-4 w-full">
                        <p>© Copyrights. All rights reserved ESTIN - Bejaia</p>
                    </div>
        </footer>
    );
};

export default Footer;
