'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b fixed top-0 left-0 right-0 z-50 border-gray-800 bg-[#000814] style={{--navbar-height: '4rem'}}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 space-x-3">
            <Link href="/" className="text-2xl font-bold">
              <Image
                src="/mainlogo.png"
                alt="Logo"
                width={150}
                height={170}
                className="logo-class"
              />
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="block lg:hidden">
            <button
              className="text-gray-300 hover:text-gray-100 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`fixed inset-0 bg-[#000814] bg-opacity-90 transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:flex lg:space-x-8`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 lg:flex-row lg:space-y-0 lg:space-x-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 focus:outline-none lg:hidden"
                onClick={() => setMenuOpen(false)}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {[
                { href: '/data-hub', label: 'Data Hub' },
                // { href: '/placements', label: 'Placements' },
                // { href: '/internships', label: 'Internships' },
                // { href: '/analysis', label: 'Analysis' },
                { href: '/analytics', label: 'Analytics' },
                { href: '/career-programs', label: 'Career Programs' },
                { href: '/interview-diaries', label: 'Interview Diaries' },
                { href: '/alumni-connect', label: 'Alumni Connect' },
                { href: '/about-us', label: 'Us' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="relative block text-gray-300 hover:text-gray-100 text-lg lg:inline">
                  <motion.span
                    className={`inline-block ${pathname === href ? 'text-gray-100' : 'text-gray-300 hover:text-gray-100'
                      }`}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {label}
                  </motion.span>
                  {pathname === href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100"
                      layoutId="underline"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
