import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BedDouble, Bath, Ruler } from 'lucide-react';
import { getOptimizedImageUrl, generatePropertyImageAlt } from '@/lib/imageSeo';

interface PropertyCardProps {
    property: {
        _id?: string;
        id?: string;
        name: string;
        location: string;
        price: string;
        propertyType?: string;
        image_url?: string;
        image?: { secure_url?: string };
        tag?: string;
        tag_color?: string;
        beds?: string;
        baths?: string;
        area?: string;
        featured?: boolean;
    };
    priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
    const propertyId = property._id || property.id;
    const rawImg = property.image?.secure_url || property.image_url || '/placeholder.jpg';
    const displayImg = getOptimizedImageUrl(rawImg, 600, 'auto');
    const imageAlt = generatePropertyImageAlt(property, undefined, 0);

    const tagColor = property.tag_color || '#3c70b8';
    const propertyTitle = property.name || 'Property Listing';
    const locationName = property.location || 'Kerala';

    return (
        <article className="property-card">
            <Link href={`/properties/${propertyId}`} className="block group">
                <div className="property-img-wrap relative">
                    <Image
                        src={displayImg}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={priority}
                        className="property-img object-cover transition duration-700 group-hover:scale-105"
                    />

                    <span
                        className="property-tag"
                        style={{ backgroundColor: tagColor }}
                    >
                        {property.tag || 'For Sale'}
                    </span>

                    {property.featured && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#cbbf9d] text-[#153545] text-[9px] font-bold uppercase tracking-wider shadow">
                            Featured
                        </span>
                    )}
                </div>

                <div className="property-body">
                    <h3 className="property-name group-hover:text-[#3c70b8] transition-colors">
                        {propertyTitle}
                    </h3>

                    <div className="property-location flex items-center gap-1">
                        <MapPin size={12} className="shrink-0 text-[#3d4d53]" aria-hidden="true" />
                        <span>{locationName}</span>
                    </div>

                    <div className="property-price">{property.price}</div>

                    {(property.beds || property.baths || property.area) && (
                        <div className="spec-row flex items-center gap-3 text-xs text-[#3d4d53] mt-2">
                            {property.beds && (
                                <span className="flex items-center gap-1">
                                    <BedDouble size={14} aria-hidden="true" /> {property.beds} Beds
                                </span>
                            )}
                            {property.baths && (
                                <span className="flex items-center gap-1">
                                    <Bath size={14} aria-hidden="true" /> {property.baths} Baths
                                </span>
                            )}
                            {property.area && (
                                <span className="flex items-center gap-1">
                                    <Ruler size={14} aria-hidden="true" /> {property.area}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
}
