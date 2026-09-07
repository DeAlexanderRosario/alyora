'use client';

import React, { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, X, Maximize2, Sparkles, Layers } from 'lucide-react';
import { getPdfThumbnailUrl, generatePropertyImageAlt } from '@/lib/imageSeo';

interface MediaItem {
    secure_url?: string;
    url?: string;
    image_url?: string;
    type?: string;
    caption?: string;
    name?: string;
}

interface GalleryViewerProps {
    media: Array<MediaItem | string>;
    title: string;
}

function getItemUrl(item: MediaItem | string): string {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.secure_url || item.url || item.image_url || '';
}

function getItemCaption(item: MediaItem | string): string | undefined {
    if (!item || typeof item === 'string') return undefined;
    return item.caption || item.name;
}

export function GalleryViewer({ media, title }: GalleryViewerProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

    if (!media || media.length === 0) return null;

    const validMedia = media.filter((item) => !!getItemUrl(item));
    if (validMedia.length === 0) return null;

    // PRELOAD ALL GALLERY IMAGES FOR INSTANT LIGHTBOX OPEN & SWAPPING
    useEffect(() => {
        if (typeof window === 'undefined') return;
        validMedia.forEach((item) => {
            const rawUrl = getItemUrl(item);
            if (rawUrl && !rawUrl.toLowerCase().endsWith('.pdf')) {
                const img = new window.Image();
                img.src = rawUrl;
            }
        });
    }, [validMedia]);

    // KEYBOARD CONTROLS FOR LIGHTBOX
    useEffect(() => {
        if (selectedIdx === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedIdx(null);
            if (e.key === 'ArrowLeft') setSelectedIdx((prev) => (prev! > 0 ? prev! - 1 : validMedia.length - 1));
            if (e.key === 'ArrowRight') setSelectedIdx((prev) => (prev! < validMedia.length - 1 ? prev! + 1 : 0));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIdx, validMedia.length]);

    const handleImageError = (index: number) => {
        setFailedImages((prev) => ({ ...prev, [index]: true }));
    };

    return (
        <div className="space-y-4">
            {/* HEADER WITH FROSTED MIRROR GLASS BADGE */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm text-[#153545]">
                        <Layers size={18} className="text-[#cbbf9d]" />
                    </div>
                    <h3 className="serif text-xl font-bold text-[#153545] tracking-tight">
                        Property Photo Gallery
                    </h3>
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#153545]/10 backdrop-blur-md text-[#153545] border border-[#153545]/15 shadow-2xs">
                        {validMedia.length} Photos
                    </span>
                </div>

                {validMedia.length > 4 && (
                    <button
                        onClick={() => setSelectedIdx(0)}
                        className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-[#153545] hover:text-white text-xs font-bold text-[#153545] transition-all duration-300 flex items-center gap-1.5 border border-white/80 backdrop-blur-xl shadow-md hover:shadow-xl hover:border-[#cbbf9d]"
                    >
                        <Eye size={14} aria-hidden="true" />
                        <span>View All Gallery</span>
                    </button>
                )}
            </div>

            {/* MIRROR TRANSPARENCY THUMBNAILS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {validMedia.slice(0, 4).map((item, idx) => {
                    const rawUrl = getItemUrl(item);
                    const isPdf = rawUrl.toLowerCase().endsWith('.pdf') || (typeof item !== 'string' && item.type === 'pdf');
                    const displayUrl = failedImages[idx]
                        ? '/placeholder.jpg'
                        : isPdf
                            ? getPdfThumbnailUrl(rawUrl, 400)
                            : rawUrl;

                    const caption = getItemCaption(item);
                    const altText = generatePropertyImageAlt({ name: title }, caption, idx + 1);

                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedIdx(idx)}
                            className="group relative h-32 sm:h-40 rounded-2xl overflow-hidden cursor-pointer border border-white/50 bg-white/20 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(21,53,69,0.25)] hover:border-[#cbbf9d]/80 transition-all duration-500 transform hover:-translate-y-1"
                        >
                            <img
                                src={displayUrl}
                                alt={altText}
                                loading="eager"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                onError={() => handleImageError(idx)}
                            />

                            {/* MIRROR SHEEN / GLASS REFLECTION OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#091a24]/85 via-[#091a24]/20 to-white/10 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-opacity duration-500 pointer-events-none" />

                            {/* MIRROR CAPTION PILL */}
                            {caption && (
                                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1 rounded-xl bg-black/40 backdrop-blur-xl border border-white/25 text-white text-[11px] font-medium truncate shadow-lg">
                                    {caption}
                                </div>
                            )}

                            {/* MIRROR EXPAND BADGE */}
                            <div className="absolute top-3 right-3 p-2 rounded-xl bg-white/20 backdrop-blur-xl border border-white/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-xl">
                                <Maximize2 className="w-4 h-4 text-white" />
                            </div>

                            {/* MORE COUNT MIRROR GLASS OVERLAY FOR 4TH ITEM */}
                            {idx === 3 && validMedia.length > 4 && (
                                <div className="absolute inset-0 bg-[#091a24]/80 backdrop-blur-xl flex flex-col items-center justify-center text-white text-xs font-bold gap-2 shadow-inner border border-white/20">
                                    <div className="p-3 rounded-full bg-white/15 border border-white/30 backdrop-blur-2xl shadow-lg">
                                        <Eye size={22} className="text-[#cbbf9d]" />
                                    </div>
                                    <span className="tracking-wider text-white font-semibold">+{validMedia.length - 4} More Photos</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* FULLSCREEN LIGHTBOX MODAL WITH DEEP MIRROR GLASS & FROSTED EFFECTS */}
            {selectedIdx !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image Gallery Lightbox"
                    className="fixed inset-0 z-50 bg-[#051119]/85 backdrop-blur-3xl flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200"
                >
                    {/* TOP MIRROR GLASS BAR */}
                    <div className="w-full max-w-6xl flex items-center justify-between py-3 px-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white z-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            <span className="px-3.5 py-1 rounded-full bg-[#cbbf9d] text-[#153545] text-xs font-bold shadow-md">
                                {selectedIdx + 1} / {validMedia.length}
                            </span>
                            {getItemCaption(validMedia[selectedIdx]) && (
                                <span className="text-sm font-semibold text-white/95 truncate max-w-md hidden sm:inline">
                                    {getItemCaption(validMedia[selectedIdx])}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedIdx(null)}
                            aria-label="Close Lightbox"
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#cbbf9d] hover:text-[#153545] text-white transition-all duration-300 border border-white/30 flex items-center gap-1.5 text-xs font-bold backdrop-blur-md shadow-lg"
                        >
                            <span>Close</span>
                            <X size={18} />
                        </button>
                    </div>

                    {/* MAIN IMAGE DISPLAY WITH GLOWING MIRROR BORDER */}
                    <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4">
                        {/* PREVIOUS NAV BUTTON */}
                        <button
                            onClick={() => setSelectedIdx((prev) => (prev! > 0 ? prev! - 1 : validMedia.length - 1))}
                            aria-label="Previous Image"
                            className="absolute left-2 sm:left-6 z-20 p-3.5 sm:p-4 rounded-full bg-white/10 hover:bg-[#cbbf9d] hover:text-[#153545] backdrop-blur-2xl text-white transition-all duration-300 border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transform active:scale-95"
                        >
                            <ChevronLeft size={28} />
                        </button>

                        {/* DISPLAY IMAGE CONTAINER */}
                        <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center p-2">
                            {(() => {
                                const activeItem = validMedia[selectedIdx];
                                const rawUrl = getItemUrl(activeItem);
                                const isPdf = rawUrl.toLowerCase().endsWith('.pdf') || (typeof activeItem !== 'string' && activeItem.type === 'pdf');
                                const displayUrl = failedImages[selectedIdx]
                                    ? '/placeholder.jpg'
                                    : isPdf
                                        ? getPdfThumbnailUrl(rawUrl, 1200)
                                        : rawUrl;
                                const caption = getItemCaption(activeItem);
                                const altText = generatePropertyImageAlt({ name: title }, caption, selectedIdx + 1);

                                return (
                                    <img
                                        src={displayUrl}
                                        alt={altText}
                                        loading="eager"
                                        className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.7)] transition-all duration-300"
                                        onError={() => handleImageError(selectedIdx)}
                                    />
                                );
                            })()}
                        </div>

                        {/* NEXT NAV BUTTON */}
                        <button
                            onClick={() => setSelectedIdx((prev) => (prev! < validMedia.length - 1 ? prev! + 1 : 0))}
                            aria-label="Next Image"
                            className="absolute right-2 sm:right-6 z-20 p-3.5 sm:p-4 rounded-full bg-white/10 hover:bg-[#cbbf9d] hover:text-[#153545] backdrop-blur-2xl text-white transition-all duration-300 border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transform active:scale-95"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {/* BOTTOM THUMBNAILS CAROUSEL WITH FROSTED GLASS & GOLD MIRROR GLOW */}
                    <div className="w-full max-w-4xl flex items-center justify-center gap-3 overflow-x-auto py-3 px-5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 scrollbar-thin shadow-2xl">
                        {validMedia.map((item, idx) => {
                            const rawUrl = getItemUrl(item);
                            const thumbUrl = failedImages[idx] ? '/placeholder.jpg' : rawUrl;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedIdx(idx)}
                                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${selectedIdx === idx
                                            ? 'border-[#cbbf9d] scale-108 ring-4 ring-[#cbbf9d]/50 shadow-[0_0_25px_rgba(203,191,157,0.7)]'
                                            : 'border-transparent opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={thumbUrl}
                                        alt={`Thumbnail ${idx + 1}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError(idx)}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
