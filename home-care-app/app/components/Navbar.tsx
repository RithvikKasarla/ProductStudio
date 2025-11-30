'use client';

import Link from 'next/link';
import Button from './Button';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-100" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                C
              </div>
              <span className="font-bold text-xl text-primary tracking-tight">
                CareConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/user/intake" className="text-secondary hover:text-primary font-medium transition-colors">
                Find Care
              </Link>
              <Link href="/nurse/signup" className="text-secondary hover:text-primary font-medium transition-colors">
                For Nurses
              </Link>
              <Link href="/signin" className="text-secondary hover:text-primary font-medium transition-colors">
                Sign In
              </Link>
            </div>

            {/* Trust Signal + CTA */}
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(248, 196, 113, 0.18)', color: '#8a5b18', letterSpacing: '0.02em' }}>
                🛡️ Verified + Licensed
              </span>
              <Link href="/user/intake">
                <Button size="sm">Book Care</Button>
              </Link>
            </div>
          </div>
        </nav>
    );
}
