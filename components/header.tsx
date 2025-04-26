"use client";

import Link from "next/link";
import { Session } from "next-auth";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  GraduationCap,
  Gavel,
  Network,

  Info,
  Search,
  Wrench,
  Film,
  Calendar,
  Users,
  HelpCircle,

} from "lucide-react";
import { useState } from "react";
import ProfileDropdown from '@/components/profile';

interface HeaderProps {
  session?: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const toggleMenu = (): void => setMenuOpen(prev => !prev);
  const toggleSearch = (): void => setSearchOpen(prev => !prev);

  // Don't render header on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  // Main navigation items
  const mainNavItems = [
    { key: "home", label: "Home", href: "/", Icon: Home },
    { key: "chat", label: "Chat", href: "/Bot", Icon: MessageCircle },
    { key: "catalog", label: "Catalog", href: "/catalog", Icon: BookOpen },
    { key: "ideas", label: "Ideas", href: "/ideas", Icon: Lightbulb },
    { key: "contact", label: "Contact Us", href: "/contact-us", Icon: Mail },
    {
      key: "services",
      label: "Services",
      href: "#",
      Icon: FileText,
      submenu: [
        { key: "loans", label: "My Loans", href: "/profile", Icon: BookOpen },
        { key: "sndl", label: "SNDL request", href: "/sndl-request", Icon: Globe },
        { key: "formation", label: "Formation", href: "/formation", Icon: GraduationCap },
      ]
    }
  ];

  // Secondary navigation items (for top bar)
  const secondaryNavItems = [
    { key: "hours", label: "Library Hours", href: "/hours", Icon: Clock },
    { key: "about", label: "About Us", href: "/about", Icon: Info },
    { key: "events", label: "Events", href: "/events", Icon: Calendar },
    { key: "faq", label: "FAQ", href: "/faq", Icon: HelpCircle },
    { key: "sndl", label: "SNDL request", href: "/sndl-request", Icon: Globe },
    { key: "formation", label: "Formation", href: "/formation", Icon: GraduationCap },
    { key: "ressources", label: "Ressources Utiles", href: "/ressources-utiles", Icon: FileText },
    { key: "regulations", label: "Library Regulations", href: "/library-regulations", Icon: Gavel },
    { key: "organigramme", label: "Organigramme", href: "/organigramme", Icon: Network },
    {
      key: "information_pratique",
      label: "Information Pratique",
      href: "/information-pratique",
      Icon: Wrench,
    },
    {
      key: "culture",
      label: "Culture",
      href: "/culture",
      Icon: BookOpen,
    },
    {
      key: "multimedia",
      label: "Multimédia",
      href: "/multimedia",
      Icon: Film,
    },
    {
      key: "research_help",
      label: "Research Help",
      href: "/research-help",
      Icon: Search,
    },
    
  ];

  // Additional resources for the mobile menu
  const resourcesItems = [
    { key: "hours", label: "Library Hours", href: "/hours", Icon: Clock },
    { key: "about", label: "About Us", href: "/about", Icon: Info },
    { key: "events", label: "Events", href: "/events", Icon: Calendar },
    { key: "faq", label: "FAQ", href: "/faq", Icon: HelpCircle },
    { key: "sndl", label: "SNDL request", href: "/sndl-request", Icon: Globe },
    { key: "formation", label: "Formation", href: "/formation", Icon: GraduationCap },
    { key: "ressources", label: "Ressources Utiles", href: "/ressources-utiles", Icon: FileText },
    { key: "regulations", label: "Library Regulations", href: "/library-regulations", Icon: Gavel },
    { key: "organigramme", label: "Organigramme", href: "/organigramme", Icon: Network },
    {
      key: "information_pratique",
      label: "Information Pratique",
      href: "/information-pratique",
      Icon: Wrench,
    },
    {
      key: "culture",
      label: "Culture",
      href: "/culture",
      Icon: BookOpen,
    },
    {
      key: "multimedia",
      label: "Multimédia",
      href: "/multimedia",
      Icon: Film,
    },
    {
      key: "research_help",
      label: "Research Help",
      href: "/research-help",
      Icon: Search,
    },
    
    
  ];

  return (
    <>
      {/* Top secondary header */}
      <div className="mt-[75px] md:mt-[100px]"></div>
      <div className="hidden lg:block fixed top-0 left-0 z-[41] w-full bg-gray-100 shadow-sm py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5 text-sm">
              {secondaryNavItems.map(item => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-[#F1413E] transition-colors"
                >
                  <item.Icon className="mr-1 h-3 w-3" />
                  {item.label}
                </Link>
              ))}
            </div>
         
          </div>
        </div>
        </div>
     
      {/* Main header */}
      <nav className="fixed top-0 lg:top-7  left-0 z-[40] w-full bg-white backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-[70px] items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="logo" width={60} height={60} priority />
            </Link>

            <div className="hidden z-[4] lg:flex items-center space-x-8">
              {mainNavItems.map(item => (
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

      {/* Search overlay */}
      <div 
        className={`fixed inset-0 z-[45] bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
          searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="bg-white w-full max-w-2xl mx-4 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Search the library</h3>
            <button onClick={toggleSearch} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search books, resources, services..." 
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1413E]"
            />
            <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Popular searches:</span>
            <button className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">New arrivals</button>
            <button className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Research papers</button>
            <button className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">E-books</button>
          </div>
        </div>
        </div>
       
      {/* Mobile Menu - Enhanced with categories */}
      <div
        className={`lg:hidden fixed top-[70px] z-[42] left-0 w-full h-[calc(100vh-70px)] bg-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out ${
          menuOpen 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          {session ? (
            <div className="flex items-center space-x-3 mb-2">
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  width={40} 
                  height={40} 
                  className="rounded-full" 
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div>
                <p className="font-medium">{session.user?.name}</p>
                <Link 
                  href="/profile" 
                  onClick={toggleMenu}
                  className="text-sm text-[#F1413E]"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" onClick={toggleMenu}>
              <button className="w-full py-3 border-2 border-[#F1413E] text-[#F1413E] rounded-md bg-white transition-colors hover:bg-[#F1413E] hover:text-white">
            Log In
          </button>
        </Link>
          )}
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">Main Navigation</h3>
          <ul className="space-y-1">
            {mainNavItems.map(item => (
              <li key={item.key}>
                {item.submenu ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2 text-gray-700 font-medium rounded-md">
                      <item.Icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </div>
                    <ul className="pl-5 space-y-1">
                      {item.submenu.map(sub => (
                        <li key={sub.key}>
                          <Link
                            href={sub.href}
                            onClick={toggleMenu}
                            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#F1413E] rounded-md transition-colors"
                          >
                            <sub.Icon className="mr-2 h-4 w-4" />
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#F1413E] rounded-md transition-colors"
                  >
                    <item.Icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
</div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-1">
            {secondaryNavItems.map(item => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={toggleMenu}
                  className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#F1413E] rounded-md transition-colors"
                >
                  <item.Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2">Resources</h3>
          <ul className="grid grid-cols-2 gap-1">
            {resourcesItems.map(item => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={toggleMenu}
                  className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#F1413E] rounded-md transition-colors"
                >
                  <item.Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;