'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-white text-[#153545] flex flex-col font-sans">
            <Header />

            <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-20 text-center">
                <div className="max-w-md space-y-6">
                    <h1 className="serif text-3xl font-bold text-[#153545]">Something went wrong</h1>
                    <p className="text-sm text-[#3d4d53]">
                        We encountered a temporary network or server issue while retrieving the property information.
                    </p>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => reset()}
                            className="px-5 py-2.5 rounded-xl bg-[#153545] text-white text-xs font-semibold shadow hover:bg-[#1e4559] transition"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-xl bg-[#f7f9f9] text-[#153545] text-xs font-semibold border border-[#e8edee] hover:bg-[#e8edee] transition"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
