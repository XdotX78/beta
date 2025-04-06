"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Maps", href: "#", subItems: [
      { name: "News Map", href: "/maps/news" },
      { name: "History Map", href: "/maps/history" },
      { name: "Mysteries Map", href: "/maps/mysteries" },
    ]},
    { name: "Blogs", href: "#", subItems: [
      { name: "News Blog", href: "/blogs/news" },
      { name: "Mysteries Blog", href: "/blogs/mysteries" },
    ]},
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter">GAIA</span>
          <span className="hidden sm:inline-block text-sm opacity-75">News • History • Mysteries</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.href === "#" ? (
                <button 
                  className="text-gray-100 hover:text-white transition-colors duration-200 flex items-center focus:outline-none"
                >
                  {item.name}
                  {item.subItems && (
                    <span className="ml-1">▼</span>
                  )}
                </button>
              ) : (
                <Link 
                  href={item.href} 
                  className="text-gray-100 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )}
              
              {item.subItems && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-100"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-indigo-800"
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.name} className="block">
                {item.href === "#" ? (
                  <div 
                    className="block px-3 py-2 text-base font-medium text-white hover:bg-indigo-700 rounded-md"
                  >
                    {item.name}
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="block px-3 py-2 text-base font-medium text-white hover:bg-indigo-700 rounded-md"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                )}
                
                {item.subItems && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-indigo-200 hover:bg-indigo-700 rounded-md"
                        onClick={toggleMenu}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header; 