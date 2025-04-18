"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface DropdownImageMenuProps {
  links: string[];
}

const DropdownImageMenu: React.FC<DropdownImageMenuProps> = ({ links }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative ">
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md  hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Extended Header Menu */}
  
    </div>
  );
};

export default DropdownImageMenu;