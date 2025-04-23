"use client";

import Link from "next/link";
import { Session } from "next-auth";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  MessageCircle,
  BookOpen,
  Mail,
  Lightbulb,
  Clock,
  FileText,
  Globe,
  GraduationCap
} from "lucide-react";
import { useState } from "react";
import ProfileDropdown from '@/components/profile';

interface HeaderProps {
  session?: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = (): void => setMenuOpen(prev => !prev);

  const navItems = [
    { key: "home", label: "Home", href: "/", Icon: Home },
    { key: "chat", label: "Chat", href: "/Bot", Icon: MessageCircle },
    { key: "catalog", label: "Catalog", href: "/catalog", Icon: BookOpen },
    { key: "contact", label: "Contact Us", href: "/contact-us", Icon: Mail },
    { key: "ideas", label: "Ideas", href: "/ideas", Icon: Lightbulb },
    {
      key: "services",
      label: "Services",
      href: "#",
      Icon: FileText,
      submenu: [
        { key: "hours", label: "Library Hours", href: "/hours", Icon: Clock },
        { key: "loans", label: "My Loans", href: "/profile", Icon: BookOpen },
        { key: "sndl", label: "SNDL Portal", href: "https://sndl.cerist.dz", Icon: Globe },
        { key: "formation", label: "Formation", href: "/formation", Icon: GraduationCap },
        { key: "ressources", label: "Ressources Utiles", href: "/ressources-utiles", Icon: FileText }
      ]
    }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 z-[40] w-full bg-white backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-[70px] items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/svg/logo.svg" alt="logo" width={70} height={70} priority />
            </Link>

            <div className="hidden z-[4] lg:flex items-center space-x-8">
              {navItems.map(item => (
                <div key={item.key} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-700 text-lg font-normal py-2 relative transition-colors hover:text-[#F1413E] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-0.5 after:bg-[#F1413E] after:transition-all group-hover:after:w-full"
                  >
                    <item.Icon className="mr-2 h-5 w-5" />
                    {item.label}
                    {item.submenu && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {item.submenu && (
                    <ul
                      className="absolute left-0 mt-1 w-48 bg-white shadow-md rounded-md
                        opacity-0 group-hover:opacity-100 transition-opacity
                        pointer-events-none group-hover:pointer-events-auto"
                    >
                      {item.submenu.map(sub => (
                        <li key={sub.key} className="border-b last:border-none">
                          {sub.href.startsWith('http') ? (
                            <a
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#F1413E] transition-colors"
                            >
                              <sub.Icon className="mr-2 h-4 w-4" />
                              {sub.label}
                            </a>
                          ) : (
                            <Link
                              href={sub.href}
                              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#F1413E] transition-colors"
                            >
                              <sub.Icon className="mr-2 h-4 w-4" />
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

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-[70px] z-[4] left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          menuOpen 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <ul className="py-2">
          {navItems.map(item => (
            <li key={item.key}>
              {item.submenu ? (
                <div className="space-y-1">
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#F1413E] transition-colors">
                    <item.Icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </div>
                  <ul className="pl-8 space-y-1">
                    {item.submenu.map(sub => (
                      <li key={sub.key}>
                        {sub.href.startsWith('http') ? (
                          <a
                            href={sub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#F1413E] transition-colors"
                          >
                            <sub.Icon className="mr-2 h-4 w-4" />
                            {sub.label}
                          </a>
                        ) : (
                          <Link
                            href={sub.href}
                            onClick={toggleMenu}
                            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#F1413E] transition-colors"
                          >
                            <sub.Icon className="mr-2 h-4 w-4" />
                            {sub.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={toggleMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#F1413E] transition-colors"
                >
                  <item.Icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Header;