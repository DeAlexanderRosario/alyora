'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';

export function SearchPanel() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Buy');
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [budget, setBudget] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (propertyType) params.set('type', propertyType);
        if (budget) params.set('budget', budget);
        if (activeTab && activeTab !== 'Buy') params.set('tag', activeTab);

        router.push(`/properties?${params.toString()}`);
    };

    return (
        <div className="search-panel">
            <div className="search-tabs" role="tablist" aria-label="Property Search Type">
                {['Buy', 'Rent', 'Land', 'Commercial'].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={`search-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSearch} className="search-fields">
                <div className="field-box">
                    <MapPin size={16} color="#122d3a" aria-hidden="true" />
                    <input
                        aria-label="Enter location"
                        placeholder="Enter location (e.g. Kochi, Kottayam...)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="field-box">
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        aria-label="Filter by Property Type"
                    >
                        <option value="" disabled>
                            Property Type
                        </option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Land">Plot / Land</option>
                        <option value="Commercial">Commercial</option>
                    </select>
                </div>

                <div className="field-box">
                    <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        aria-label="Filter by Budget"
                    >
                        <option value="" disabled>
                            Budget
                        </option>
                        <option value="50l">Under ₹ 50 Lakhs</option>
                        <option value="1cr">₹ 50 L - ₹ 1.5 Cr</option>
                        <option value="2cr">Above ₹ 1.5 Cr</option>
                    </select>
                </div>

                <button type="submit" className="btn-search" aria-label="Search properties">
                    <Search size={16} aria-hidden="true" />
                    <span>Search</span>
                </button>
            </form>
        </div>
    );
}
