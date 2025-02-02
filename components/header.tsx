"use client";
import Link from "next/link";
import "./hover.css";
import Image from "next/image";
import DropdownImageMenu from "./Hamb";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";

interface HeaderProps {
  session?: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const links = !session ? ["home", "catalog", "contact-us", "login"] : ["home", "catalog", "contact-us", "profile"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div
      className={`h-[75px] fixed z-30 py-8 px-[7%] flex justify-center items-center w-full bg-white transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Logo */}
      <Link href={'/'} className="gap-2 mr-auto flex justify-center items-center text-[30px] font-bold">
        <Image src="/svg/logo.svg" alt="logo" width={180} height={180} priority />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden mr-auto lg:block">
        <ul className="menu-list">
          {["Home", "Catalog", "Contact Us"].map((menuItem, index) => (
            <li key={index} className="menu-item">
              <Link href={`/${menuItem.toLowerCase().replace(" ", "-")}`} className="menu-link">
                {menuItem}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex ml-auto">
        <DropdownImageMenu  links={links} />
      </div>

      {/* Desktop Profile */}
      <div className="hidden flex-row gap-6 lg:flex lg:items-center">
        {session ? (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Icon with Email */}
            <button
              id="dropdownDividerButton"
              onClick={toggleDropdown}
              className="flex items-center px-4 gap-2 cursor-pointer border-[#F1413E] rounded-full border-solid border-[2px] p-2 text-black"
            >
              <FaUserCircle size={30} />
              <span className="text-[18px]">{session?.user?.email}</span>
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                id="dropdownDivider"
                className="absolute right-0 mt-2 w-44 bg-gray-100 divide-y divide-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
                <div className="py-2">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login">
            <button className="h-12 w-40 border-2 border-[#F1413E] text-[#F1413E] rounded-md bg-white">
              Log In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
