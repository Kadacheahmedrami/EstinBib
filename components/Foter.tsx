import React from 'react';
import Image from "next/image";
import LocationMapClient from '@/components/LocationMapClient';

const Footer: React.FC = () => {
    const estinLatitude = 36.7518;
    const estinLongitude = 5.0647;
    const locationName = 'ESTIN, Béjaia, Algeria';

    return (
        <footer  className="bg-gray-800 font- text-white py-12 px-4 lg:px-24 md:px-12 "    style={{ 
            fontFamily: 'Poppins, sans-serif', 
            backgroundImage: 'url(/jpg/Gradient.png)' 
          }}>

                <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
                    {/* Left Section: Logo and Address */}
                    <div className="flex flex-col mx-auto justify-center items-center text-center md:text-start space-y-4">
                        <Image 
                            src="/svg/estin.svg" 
                            alt="ESTIN Logo" 
                            width={260} 
                            height={260} 
                            className="cursor-pointer"
                        />
                        <p className="text-[22px]">National road n° 75,</p>
                        <p className="text-[22px]">Amizour 06300 Bejaia, Algeria</p>
                        <p className="text-[22px]">+213-34-824-916</p>
                        <p className="text-[22px]">contact@estin.dz</p>
                    </div>

                    {/* Middle Section: Social Media and Map */}
                    <div className="flex w-full justify-center items-center md:min-w-[350px] flex-col ">
                        <h3 className="text-[34px] font-bold">Follow Us</h3>
                        <ul className="flex mt-4 space-x-6">
                              <li>
                                <Image 
                                    src="/svg/Website.svg" 
                                    alt="Website" 
                                    width={65} 
                                    height={65} 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </li>
                            <li>
                                <Image 
                                    src="/svg/Facebook.svg" 
                                    alt="Facebook" 
                                    width={65} 
                                    height={65} 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </li>
                            <li>
                                <Image 
                                    src="/svg/LinkedIn.svg" 
                                    alt="LinkedIn" 
                                    width={65} 
                                    height={65} 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </li>
                            <li>
                                <Image 
                                    src="/svg/Insta.svg" 
                                    alt="Instagram" 
                                    width={65} 
                                    height={65} 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </li>
                            <li>
                                <Image 
                                    src="/svg/Youtube.svg" 
                                    alt="YouTube" 
                                    width={65} 
                                    height={65} 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </li>
                        </ul>
                      
                            <LocationMapClient 
                                latitude={estinLatitude} 
                                longitude={estinLongitude} 
                                locationName={locationName} 
                            />
                      
                    </div>

                    {/* Right Section: Contact Form */}
                    <div className="w-full  md:w-1/3">
                        <h3 className="text-[34px] font-bold mb-6">Contact The Library</h3>
                        <form className="flex flex-col space-y-6">
                            <div>
                           
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-4 py-3 bg-white border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                            
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-4 py-3 bg-white border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your email"
                                />
                            </div>

                            <div>
                            
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your message"
                                />
                            </div>
                            <div className='ml-auto'>
                            <button className="relative  h-12 w-40 overflow-hidden border border-[#F1413E] text-white hover:text-[#F1413E] rounded-[10px] shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm bg-[#F1413E] before:bg-white before:duration-300 before:ease-out hover:shadow-[0_4px_20px_#F1413E] hover:before:h-40 hover:before:w-40 hover:before:opacity-100">
            <span className="relative  z-1">Send</span>
          </button>
                            </div>
                 
                        </form>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 text-center text-base border-t border-gray-700 pt-6">
                    <p>© Copyrights. All rights reserved ESTIN - Bejaia</p>
                </div>
          
        </footer>
    );
};

export default Footer;