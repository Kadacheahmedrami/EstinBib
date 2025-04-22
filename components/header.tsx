"use client";
import Link from "next/link";
import { Session } from "next-auth";
import './hover.css';
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import ProfileDropdown from '@/components/profile';

interface HeaderProps {
  session?: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = (): void => setMenuOpen(prev => !prev);

  const navItems = [
    { label: "Chat", href: "/Bot" },
    { key: "", label: "Home", href: "/" },
    { key: "catalog", label: "Catalog", href: "/catalog" },
    { key: "contact-us", label: "Contact Us", href: "/contact-us" },
    { label: "Ideas", href: "/ideas" },
  
    {
      key: "services",
      label: "Services",
      href: "#",
      submenu: [
        { label: "Library Hours", href: "/hours" },
        { label: "My Loans", href: "/profile" },
       
        { label: "SNDL Portal", href: "https://sndl.cerist.dz" },
        { label: "Formation", href: "/formation" },
        { label: "Ressources Utiles", href: "/ressources-utiles" }
      ]
    }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 z-30 w-full bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-[70px] items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/svg/logo.svg" alt="logo" width={70} height={70} priority />
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map(item => (
                <div key={item.key} className="relative group">
                  <Link
                    href={item.href}
                    className="menu-link flex flex-row items-center hover:text-gray-900 transition-colors py-2"
                  >
                    {item.label}
                    {item.submenu && (
                      <ChevronDown className="ml-1 h-4 w-4 flex flex-row text-gray-700 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  {item.submenu && (
                    <ul className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.submenu.map((sub, idx) => (
                        <li key={idx} className="border-b last:border-none">
                          {sub.href.startsWith('http') ? (
                            <a
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 hover:bg-gray-100"
                            >
                              {sub.label}
                            </a>
                          ) : (
                            <Link
                              href={sub.href}
                              className="block px-4 py-2 hover:bg-gray-100"
                            >
                              {sub.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95"
              >
                {menuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
              </button>

              <div className="hidden lg:block">
                {session ? (
                  <ProfileDropdown session={session} />
                ) : (
                  <Link href="/auth/login">
                    <button className="h-12 w-40 border-2 border-[#F1413E] text-[#F1413E] rounded-md bg-white transition-colors hover:font-bold hover:bg-[#F1413E] hover:text-white">
                      Log In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu omitted for brevity; similar dropdown arrow logic could be applied */}
    </>
  );
};

export default Header;
