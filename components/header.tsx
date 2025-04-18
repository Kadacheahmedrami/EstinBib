"use client";
import Link from "next/link";
import { Session } from "next-auth";
import './hover.css';
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ProfileDropdown from '@/components/profile';

interface HeaderProps {
  session?: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const mobilelinks = !session ? ["", "catalog", "contact-us", "auth/login"] : ["", "catalog", "contact-us", "profile"];
  const links = ["", "catalog", "contact-us"];

  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed z-20 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-[70px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/svg/logo.svg" 
              alt="logo" 
              width={70} 
              height={70} 
              priority 
             
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <ul className="menu-list flex items-center space-x-8">
              {links.map((menuItem, index) => (
                <li key={index} className="menu-item">
                  <Link href={`/${menuItem}`} className="menu-link">
                    {menuItem === "" ? "Home" : menuItem}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:block">
            {session ? (
              <ProfileDropdown session={session} />
            ) : (
              <Link href="/auth/login">
                <button className="h-12 w-40 border-2 border-[#F1413E] text-[#F1413E] rounded-md bg-white transition-all hover:font-bold ease-in-out duration-100 hover:text-white hover:bg-[#F1413E]">
                  Log In
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
            menuOpen 
              ? "opacity-100 visible translate-y-0" 
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <ul className="py-2">
            {mobilelinks.map((linkName, index) => (
              <li key={index}>
                <Link
                  href={`/${linkName}`}
                  onClick={toggleMenu}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#F1413E] transition-colors"
                >
                  {linkName === "" ? "Home" : linkName === "auth/login" ? "Login" : linkName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;