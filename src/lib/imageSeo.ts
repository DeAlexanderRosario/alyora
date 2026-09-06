/**
 * Utility functions for Cloudinary optimization & Google Images SEO
 */

export function getOptimizedImageUrl(url: string, width = 800, quality = 'auto'): string {
    if (!url) return '/placeholder.jpg';

    // Handle Cloudinary URLs
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
        // Avoid double transformation insertion
        if (url.includes('/upload/w_') || url.includes('/upload/f_auto')) {
            return url;
        }
        return url.replace('/upload/', `/upload/w_${width},f_auto,q_${quality},c_limit/`);
    }

    // Handle Pexels URLs
    if (url.includes('images.pexels.com')) {
        const cleanUrl = url.split('?')[0];
        return `${cleanUrl}?auto=compress&cs=tinysrgb&w=${width}`;
    }

    // Handle Unsplash URLs
    if (url.includes('images.unsplash.com')) {
        const cleanUrl = url.split('?')[0];
        return `${cleanUrl}?auto=format&fit=crop&w=${width}&q=80`;
    }

    return url;
}

export function generatePropertyImageAlt(
    property: {
        name?: string;
        location?: string;
        propertyType?: string;
        beds?: string;
    },
    caption?: string,
    index?: number
): string {
    const title = property.name || 'Real Estate Listing';
    const location = property.location || 'Kerala';
    const type = property.propertyType || 'Property';
    const beds = property.beds ? `${property.beds} Bedroom ` : '';

    if (caption && caption.trim().length > 3) {
        return `${caption.trim()} - ${beds}${type} for sale in ${location} | ALYORA Real Estate`;
    }

    if (index === 0 || index === undefined) {
        return `Exterior view of ${title} - ${beds}${type} for sale in ${location}, Kerala`;
    }

    return `Photo ${index + 1} of ${title} - ${beds}${type} in ${location}, Kerala`;
}
