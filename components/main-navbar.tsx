"use client"

import UserMenu from '@/components/navbar-components/user-menu';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function MainNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const navbar = useRef(null);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const visibleClass = isHomePage
    ? isVisible
      ? "translate-y-0"
      : "-translate-y-full"
    : "translate-y-0";

  const scrolledClass = isHomePage
    ? isScrolled
      ? "bg-white shadow"
      : "bg-transparent"
    : "bg-white shadow";

  return (
    <header
      ref={navbar}
      className={`px-4 md:px-6 fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out z-[9999]
        ${visibleClass} ${scrolledClass}`}
    >
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-6">
            <a href="/" className="text-primary hover:text-primary/90">
              <Image
                className="w-32"
                src={
                  isHomePage && !isScrolled
                    ? "/Logo.svg"
                    : "/img/Frame.svg"
                }
                alt="Logo"
                width={200}
                height={200}
                loading="lazy"
              />
            </a>
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center gap-4">
          <UserMenu isVisible={isHomePage ? isScrolled : true} />
        </div>
      </div>
    </header>
  );
}
