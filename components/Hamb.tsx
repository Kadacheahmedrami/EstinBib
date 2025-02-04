"use client"
import { useState } from "react";

import Link from "next/link";

interface DropdownImageMenuProps {
  links: string[];
 
}

const DropdownImageMenu: React.FC<DropdownImageMenuProps> = ({ links }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative">
      {/* Arrow Icon with Background and Rotation */}
      <div
        onClick={toggleMenu}
        className="cursor-pointer  p-2 bg-[#F1413E] rounded-[10px]  transition-transform duration-300 hover:bg-red-600 "
        style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 font-bold text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`fixed top-0 z-50 left-0 w-full h-full bg-opacity-95 bg-white flex flex-col transition-all duration-500 ${
          menuOpen ? "translate-y-[70px] opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <ul className="list-none w-full p-0 m-0">
          {links.map((linkName, index) => (
            <li
              key={index}
              className="w-full h-[65px] border-b border-t flex px-12 cursor-pointer border-gray-300 last:border-none focus:text-[#1376F8] text-black text-xl hover:text-2xl hover:bg-gray-100 transition-all duration-300"
            >
              <Link onClick={toggleMenu} href={`/${linkName}`}>

                <div className="text-start py-4">
                {
              linkName == '' || linkName == 'auth/login' ? 

              linkName == '' ? 
              "Home" 
              :
              "login"
              :
              linkName
              }
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownImageMenu;