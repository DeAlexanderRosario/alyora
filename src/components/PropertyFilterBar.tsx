'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';

const PROPERTY_TYPES = ['All', 'Villa', 'Apartment', 'Land', 'House', 'Commercial', 'Plot', 'Penthouse', 'Farmhouse'];

export function PropertyFilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
    const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || searchParams.get('filter') || 'All');

    const updateFilters = (newSearch: string, newType: string, newTag: string) => {
        const params = new URLSearchParams();
        if (newSearch) params.set('search', newSearch);
        if (newType && newType !== 'All') params.set('type', newType);
        if (newTag && newTag !== 'All') params.set('tag', newTag);

        startTransition(() => {
            router.push(`/properties?${params.toString()}`);
        });
    };

    return (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">
            <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                    type="text"
                    aria-label="Search location or keyword"
                    placeholder="Search location or keyword..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        updateFilters(e.target.value, selectedType, selectedTag);
                    }}
                    className="w-full bg-white text-[#153545] placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none shadow border border-[#dde4e5]"
                />
            </div>

            <div>
                <select
                    aria-label="Filter by property type"
                    value={selectedType}
                    onChange={(e) => {
                        setSelectedType(e.target.value);
                        updateFilters(searchQuery, e.target.value, selectedTag);
                    }}
                    className="w-full bg-white text-[#153545] px-4 py-2.5 rounded-xl text-sm outline-none shadow border border-[#dde4e5]"
                >
                    {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                            Type: {t}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <select
                    aria-label="Filter by status tag"
                    value={selectedTag}
                    onChange={(e) => {
                        setSelectedTag(e.target.value);
                        updateFilters(searchQuery, selectedType, e.target.value);
                    }}
                    className="w-full bg-white text-[#153545] px-4 py-2.5 rounded-xl text-sm outline-none shadow border border-[#dde4e5]"
                >
                    <option value="All">Status: All Tags</option>
                    <option value="For Sale">For Sale</option>
                    <option value="Featured">Featured</option>
                    <option value="Land">Land</option>
                    <option value="Rent">Rent</option>
                </select>
            </div>
        </div>
    );
}
