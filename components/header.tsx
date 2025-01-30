  "use client"
  import Link from "next/link";
  import "./hover.css";
  import Image from "next/image";
  import DropdownImageMenu from "./Hamb";
  import { signOut } from "next-auth/react";
  import { Session } from "next-auth";

  interface HeaderProps {
    session?: Session | null;
  }

  const Header: React.FC<HeaderProps> = ({ session }) => {
    const links = ["home", "catalog", "contact-us", "login"];

    return (
      <div className="h-[88px] fixed z-30 py-8 px-[7%] flex justify-center items-center w-full bg-white">
        {/* Logo */}
        <div className="gap-2 mr-auto flex justify-center items-center text-[30px] font-bold">
          <Image src="/svg/logo.svg" alt="logo" width={180} height={180} priority />
        </div>

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
          <DropdownImageMenu links={links} />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden flex-row gap-6 lg:flex lg:items-center">
          {/* Conditionally render based on session */}
          
          {session ? (
            // If user is logged in, show logout button
            <>
              <button
                onClick={() => signOut()}
                className="relative h-12 w-40 overflow-hidden border border-[#F1413E] text-white hover:text-[#F1413E] rounded-[10px] shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm bg-[#F1413E] before:bg-white before:duration-300 before:ease-out hover:shadow-[0_4px_20px_#F1413E] hover:before:h-40 hover:before:w-40 hover:before:opacity-100"
              >
                <span className="relative z-1">Log Out</span>
              </button>
            </>
          ) : (
            // If no session (user is logged out), show login button
            <Link href="/auth/login">
              <button className="relative h-12 w-40 overflow-hidden border border-[#F1413E] text-white hover:text-[#F1413E] rounded-[10px] shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm bg-[#F1413E] before:bg-white before:duration-300 before:ease-out hover:shadow-[0_4px_20px_#F1413E] hover:before:h-40 hover:before:w-40 hover:before:opacity-100">
                <span className="relative z-1">Log In</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  };

  export default Header;
