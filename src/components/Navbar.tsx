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
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' }
  ];

  return (
    <nav className="bg-white z-100 sticky left-0 top-0 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/">
              <Image src="/logo.webp" alt="logo" width={80} height={80} className="mt-14" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Buttons */}
          {!session?.user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-highlightblue text-white">
                  Log In
                </button>
              </Link>
              <Link href="/demo">
                <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800">
                  Try a Free Demo
                </button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/profile">
                <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-highlightblue text-white">
                  Profile
                </button>
              </Link>
              <SignOutBtn/>
              {
                (session.user.role!='User')&&
                <Link href="/dashboard">
                  <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800">
                    Dashboard
                  </button>
                </Link>
              }
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {isOpen && (
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.href ? 'text-gray-900 bg-gray-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!session?.user ? (
                  <div className="mt-4 space-y-2">
                    <Link href="/login">
                      <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium text-white">
                        Log In
                      </button>
                    </Link>
                    <Link href="/demo">
                      <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800">
                        Try a Free Demo
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    <Link href="/profile">
                      <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium text-white">
                        Profile
                      </button>
                    </Link>
                    <SignOutBtn/>
                    <Link href="/dashboard">
                      <button className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800">
                        Dashboard
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;