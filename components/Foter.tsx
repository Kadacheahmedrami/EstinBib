import React from 'react';
import Image from "next/image";
import LocationMapClient from '@/components/LocationMapClient';
import Link from 'next/link';

const Footer: React.FC = () => {
    const estinLatitude = 36.6636426;
    const estinLongitude = 4.9125355;
    
    const locationName = 'ESTIN, Béjaia, Algeria';

    return (
        <footer className="bg-gray-800 text-white pt-8 pb-4 px-6 lg:px-16 md:px-10" 
            style={{ fontFamily: 'Poppins, sans-serif', backgroundImage: 'url(/jpg/Gradient.png)' }}>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8 space-y-6 md:space-y-0">
                {/* Left Section: Logo and Address */}
                <div className="flex flex-col items-start md:items-start text-center md:text-left space-y-9 w-full md:w-1/3">
                    <Image src="/svg/estin.svg" alt="ESTIN Logo" width={200} height={200} className="cursor-pointer"/>
                    <p className="text-[24px] w-full">National road n° 75, Amizour 06300 Bejaia, Algeria</p>
                    <p className="text-[24px]">
                    <a href="tel:+21334824916" className="text-[24px] text-[#F1413E] hover:underline">+213-34-824-916</a>
                    </p>

                    <Link href="mailto:contact@estin.dz" className="text-[24px] text-[#F1413E] hover:underline">contact@estin.dz</Link>

                    <div className="h-full  text-start text-base border-t border-gray-700 pt-4 w-full">
                        <p>© Copyrights. All rights reserved ESTIN - Bejaia</p>
                    </div>
                </div>

                {/* Middle Section: Social Media and Map */}
                <div className="flex flex-col items-start w-full md:w-1/3 space-y-4">
                    <h3 className="text-2xl font-bold">Follow Us</h3>
              
                    <LocationMapClient latitude={estinLatitude} longitude={estinLongitude} locationName={locationName} />

                    <ul className="flex space-x-5">
                        {["Website", "Facebook", "LinkedIn", "Insta", "Youtube"].map((icon) => (
                            <li key={icon}>
                                <Image 
                                    src={`/svg/${icon}.svg`} 
                                    alt={icon} 
                                    width={60} 
                                    height={60} 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section: Contact Form */}
                <div className="w-full md:w-1/3 flex flex-col">
                    <h3 className="text-2xl  font-bold mb-5">Contact The Library</h3>
                    <form className="flex flex-col space-y-4">
                        <input type="text" placeholder="Your name" className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input type="email" placeholder="Your email" className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <textarea rows={4} placeholder="Your message" className="w-full px-4  bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <button className="h-12 w-36 bg-[#F1413E] text-white text-lg rounded-lg hover:shadow-lg transition-all">Send</button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
