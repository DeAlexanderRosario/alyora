'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { getOptimizedImageUrl, generatePropertyImageAlt } from '@/lib/imageSeo';

interface GalleryViewerProps {
    media: Array<{
        secure_url: string;
        type?: string;
        caption?: string;
    }>;
    title: string;
}

export function GalleryViewer({ media, title }: GalleryViewerProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    if (!media || media.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="serif text-xl font-bold text-[#153545]">Property Photo Gallery ({media.length})</h3>
                {media.length > 4 && (
                    <button
                        onClick={() => setSelectedIdx(0)}
                        className="text-xs font-semibold text-[#153545] hover:underline flex items-center gap-1"
                    >
                        <Eye size={14} aria-hidden="true" /> View All Photos
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {media.slice(0, 4).map((item, idx) => {
                    const thumbUrl = getOptimizedImageUrl(item.secure_url, 400, 'auto');
                    const altText = generatePropertyImageAlt({ name: title }, item.caption, idx + 1);

                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedIdx(idx)}
                            className="relative h-28 sm:h-36 rounded-2xl overflow-hidden border border-[#e8edee] cursor-pointer group"
                        >
                            <Image
                                src={thumbUrl}
                                alt={altText}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-5 h-5 text-white" />
                            </div>
                            {idx === 3 && media.length > 4 && (
                                <div className="absolute inset-0 bg-[#153545]/80 flex items-center justify-center text-white text-xs font-bold">
                                    +{media.length - 4} More
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* FULLSCREEN LIGHTBOX MODAL */}
            {selectedIdx !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image Gallery Lightbox"
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                >
                    <button
                        onClick={() => setSelectedIdx(null)}
                        aria-label="Close Lightbox"
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-white/10 rounded-full"
                    >
                        <X size={24} />
                    </button>

                    <button
                        onClick={() => setSelectedIdx((prev) => (prev! > 0 ? prev! - 1 : media.length - 1))}
                        aria-label="Previous Image"
                        className="absolute left-4 text-white hover:text-gray-300 p-2 bg-white/10 rounded-full"
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div className="relative w-full max-w-4xl h-[70vh]">
                        <Image
                            src={getOptimizedImageUrl(media[selectedIdx].secure_url, 1200, 'auto')}
                            alt={generatePropertyImageAlt({ name: title }, media[selectedIdx].caption, selectedIdx + 1)}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={() => setSelectedIdx((prev) => (prev! < media.length - 1 ? prev! + 1 : 0))}
                        aria-label="Next Image"
                        className="absolute right-4 text-white hover:text-gray-300 p-2 bg-white/10 rounded-full"
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            )}
        </div>
    );
}
