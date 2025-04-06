"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUsers, FaSignInAlt, FaInfoCircle, FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';

export default function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || '/';

  const getNavItems = () => {
    // Base navigation items (always shown)
    const items = [
      { path: '/collaboration', label: 'Collaboration', icon: <FaUsers className="mr-2" /> },
      { path: '/about', label: 'About', icon: <FaInfoCircle className="mr-2" /> },
    ];

    // Only add Home button when not on the home page
    if (pathname !== '/') {
      items.unshift({ path: '/', label: 'Home', icon: <FaHome className="mr-2" /> });
    }

    return items;
  };

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  // Get the navigation items based on current path
  const navItems = getNavItems();

  return (
    <div className="nav-container">
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and brand */}
            <Link href="/" className="text-xl font-bold flex items-center">
              <span className="text-blue-400">Gaia</span>
              <span className="ml-1">Explorer</span>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Visualizing Our World</span>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                {isMenuOpen ?
                  <FaTimes className="h-6 w-6" /> :
                  <FaBars className="h-6 w-6" />
                }
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex space-x-1 mr-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${isActiveLink(item.path)
                      ? 'bg-gray-800 text-white border-b-2 border-blue-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Search Button */}
              <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md mr-2">
                <FaSearch />
              </button>

              {/* Login/User Button - styled differently */}
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
              >
                {pathname.startsWith('/user') ?
                  <><FaUser className="mr-2" />Profile</> :
                  <><FaSignInAlt className="mr-2" />Login</>
                }
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${isActiveLink(item.path)
                  ? 'bg-gray-900 text-white border-l-4 border-blue-400'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Search in mobile menu */}
            <Link
              href="/search"
              className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSearch className="mr-2" />
              Search
            </Link>

            {/* Login in mobile menu */}
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium flex items-center bg-blue-600 text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {pathname.startsWith('/user') ?
                <><FaUser className="mr-2" />Profile</> :
                <><FaSignInAlt className="mr-2" />Login</>
              }
            </Link>
          </div>
        </div>
      </nav>

      {/* Optional Secondary Navigation for Map Pages */}
      {pathname.includes('/maps') && (
        <div className="bg-gray-800 text-white py-2 px-4 shadow-md">
          <div className="container mx-auto flex flex-wrap items-center justify-between text-sm">
            <div className="flex space-x-4">
              <button className="px-2 py-1 hover:bg-gray-700 rounded transition-colors">Today</button>
              <button className="px-2 py-1 hover:bg-gray-700 rounded transition-colors">This Week</button>
              <button className="px-2 py-1 hover:bg-gray-700 rounded transition-colors">This Month</button>
            </div>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <button className="px-2 py-1 hover:bg-gray-700 rounded transition-colors">All Events</button>
              <button className="px-2 py-1 hover:bg-gray-700 rounded transition-colors">Conflicts</button>
              <button className="px-2 py-1 hover:bg-gray-700 rounded transition-colors">Economics</button>
              <button className="px-2 py-1 hover:bg-gray-700 rounded transition-colors">Disasters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 