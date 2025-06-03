"use client"
import React, { useState } from 'react';
import Image from "next/image";
import LocationMapClient from '@/components/pages/map/LocationMapClient';
import Link from 'next/link';
import SocialIcons from '@/components/pages/footer-comps/socialicons';

const Footer: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contact@estin.dz&su=Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
        
        window.open(gmailUrl, '_blank');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <footer className="bg-gray-800 text-white py-12 px-6 lg:px-16 md:px-10" 
            style={{ fontFamily: 'Poppins, sans-serif', backgroundImage: 'url(/jpg/Gradient.png)' }}>
            
            <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
                {/* Logo and Contact Info */}
                <div className="col-span-1 md:col-span-2 flex flex-col items-start space-y-3">
                    <Image src="/svg/estin.svg" alt="ESTIN Logo" width={200} height={200} className="mx-auto md:mr-auto md:ml-0 cursor-pointer" />
                    <div className='h-[1px] mx-auto opacity-20 flex md:hidden rounded-3xl w-full bg-white'></div>
                    <a href="tel:+21334824916" className="text-[24px] underline">+213-34-824-916</a>
                    <Link href="mailto:contact@estin.dz" className="text-[24px] underline">contact@estin.dz</Link>
                    <h3 className="text-2xl font-bold">Follow Us</h3>
                    <div className="flex space-x-5">
                        <SocialIcons />
                    </div>
                </div>
                
                <div className='h-[1px] mx-auto opacity-20 flex md:hidden rounded-3xl w-full bg-white'></div>

                {/* Address and Map */}
                <div className="col-span-1 md:col-span-3 flex flex-col items-start">
                    <h3 className='text-2xl font-bold bg-opacity-80 relative md:left-7'>Address:</h3>
                    <p className="text-[20px] relative md:left-7">National road n° 75, Amizour 06300 Bejaia, Algeria</p>
                    <div className='w-[100%] md:w-[80%] z-[1] bottom-4 relative md:left-7'>
                        <LocationMapClient 
                            latitude={36.6636426} 
                            longitude={4.9125355} 
                            locationName={'ESTIN, Béjaia, Algeria'} 
                        />
                    </div>
                </div>
                
                <div className='h-[1px] mx-auto opacity-20 flex md:hidden rounded-3xl w-full bg-white'></div>

                {/* Contact Form */}
                <div className="col-span-1 md:col-span-3 flex flex-col">
                    <h3 className="text-2xl font-bold mb-5">Contact The Library</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your name" 
                            className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            required
                        />
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Your email" 
                            className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            required
                        />
                        <textarea 
                            rows={4} 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Your message" 
                            className="w-full px-4 py-3 bg-white border rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            required
                        />
                        <button 
                            type="submit"
                            className="h-12 w-36 bg-[#F1413E] ml-auto text-white text-lg rounded-lg hover:shadow-lg transition-all hover:bg-[#d63732]"
                        >
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