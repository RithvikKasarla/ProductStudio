'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                C
                            </div>
                            <span className="font-bold text-xl text-primary tracking-tight">CareConnect</span>
                        </Link>
                        <p className="text-secondary text-sm leading-relaxed">
                            Connecting families with trusted local caregivers for short-term home health needs.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-primary mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/press" className="hover:text-primary transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-primary mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/safety" className="hover:text-primary transition-colors">Safety Information</Link></li>
                            <li><Link href="/cancellation" className="hover:text-primary transition-colors">Cancellation Options</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h4 className="font-bold text-primary mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/cookie" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-secondary">
                        © {new Date().getFullYear()} CareConnect Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Placeholders */}
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                            𝕏
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                            in
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                            f
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
