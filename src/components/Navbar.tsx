'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignOutBtn from './SignOutBtn';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <nav className="bg-white z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="logo"
                width={75}
                height={75}
                className="mt-6 md:mt-14"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium px-3 py-2 rounded-md ${
                  pathname === item.href
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!session?.user ? (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 bg-highlightblue text-white rounded-md text-sm">
                    Log In
                  </button>
                </Link>
                <Link href="/studentform">
                  <button className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800">
                    Try a Free Demo
                  </button>
                </Link>
              </>
            ) : (
              <>
                {(session.user?.role !== 'User' && session.user?.role !== undefined) && (
                  <Link href="/dashboard">
                    <button className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800">
                      Dashboard
                    </button>
                  </Link>
                )}
                <SignOutBtn />
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Buttons */}
            {!session?.user ? (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full px-3 py-2 text-left rounded-md bg-highlightblue text-white text-base">
                    Log In
                  </button>
                </Link>
                <Link href="/demo" onClick={() => setIsOpen(false)}>
                  <button className="w-full px-3 py-2 text-left rounded-md bg-black text-white text-base hover:bg-gray-800">
                    Try a Free Demo
                  </button>
                </Link>
              </>
            ) : (
              <>
                {(session.user?.role !== 'User' && session.user?.role !== undefined) && (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <button className="mr-2 px-3 py-2 text-left rounded-md bg-black text-white text-base hover:bg-gray-800">
                      Dashboard
                    </button>
                  </Link>
                )}
                <SignOutBtn />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
