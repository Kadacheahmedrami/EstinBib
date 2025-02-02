
import Link from "next/link";

import { Session } from "next-auth";
import './hover.css';
import Image from "next/image";
import DropdownImageMenu from "./Hamb"

interface HeaderProps {
  session?: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const mobilelinks = session ? ["home", "catalog", "contact-us", "login"] : ["home", "catalog", "contact-us", "profile"];
  const links = ["home", "catalog", "contact-us"] ;
  return (
    <div className="h-[88px] fixed z-20  py-8 px-[7%] flex justify-center items-center w-full bg-white">
    
        {/* Logo - Preloaded image for faster load */}
        <div   className="gap-2 mr-auto flex justify-center items-center text-[30px] font-bold"> 
        <Link href={'/'} className="gap-2 mr-auto flex justify-center items-center text-[30px] font-bold">
        <Image src="/svg/logo.svg" alt="logo" width={180} height={180} priority />
      </Link>
       
    
        </div>
     

        {/* Desktop Navigation */}
        <div className="hidden mr-auto lg:block">
        <ul className="menu-list  ">
        {links.map((menuItem, index) => (
          <li key={index} className="menu-item">
            <Link href={`/${menuItem}`} className="menu-link">
              {menuItem}
            </Link>
          </li>
        ))}

        </ul>
        </div>

        <div className="lg:hidden flex ml-auto">  
        <DropdownImageMenu links={mobilelinks} />
        </div>
       





        {/* Desktop Buttons */}

        <div className="hidden flex-row gap-6 lg:flex lg:items-center">
          { session ?
          <h1> {session.user.email}</h1>
          :
          <Link href="/auth/login">
          <button className="h-12 w-40 border-2 border-[#F1413E] text-[#F1413E] rounded-md bg-white">
            Log In
          </button>
        </Link>
          }
     
</div>

          

    
     
    
    </div>
  );
};

export default Header;