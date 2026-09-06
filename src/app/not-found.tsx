import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white text-[#153545] flex flex-col font-sans">
            <Header />

            <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-20 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-16 h-16 rounded-full bg-[#f7f9f9] border border-[#e8edee] flex items-center justify-center mx-auto text-[#153545] font-bold text-2xl">
                        404
                    </div>
                    <h1 className="serif text-3xl font-bold text-[#153545]">Property Page Not Found</h1>
                    <p className="text-sm text-[#3d4d53]">
                        The property or page you are looking for might have been sold, unlisted, or relocated.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#153545] text-white text-xs font-semibold shadow hover:bg-[#1e4559] transition"
                        >
                            <Home size={16} aria-hidden="true" />
                            <span>Back to Home</span>
                        </Link>

                        <Link
                            href="/properties"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f7f9f9] text-[#153545] text-xs font-semibold border border-[#e8edee] hover:bg-[#e8edee] transition"
                        >
                            <Search size={16} aria-hidden="true" />
                            <span>Browse Catalog</span>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
