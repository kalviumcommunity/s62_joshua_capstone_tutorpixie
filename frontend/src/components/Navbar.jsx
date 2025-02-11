import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.webp'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src={logo} alt='logo' className="w-[5rem] h-[5rem] mt-14" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to='/login'>
                <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-800">
                Log In
                </button>
            </NavLink>
            <NavLink to='/demo'>
                <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800">
                Try a Free Demo
                </button>
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {item.name}
            </a>
          ))}
          <div className="mt-4 space-y-2">
            <NavLink to='/login'>
                <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
                Log In
                </button>
            </NavLink>
            <NavLink to='/demo'>
                <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-gray-600 text-white hover:bg-blue-700">
                Try a Free Demo
                </button>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;