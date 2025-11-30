'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Card from '../../components/Card';
import TrustBadge from '../../components/TrustBadge';

export default function MatchingResults() {
    const router = useRouter();

    const nurses = [
        {
            id: 1,
            name: 'Sarah Jenkins',
            role: 'Registered Nurse (RN)',
            rating: 4.9,
            reviews: 12,
            experience: '8 years',
            verified: true,
            skills: ['Post-Op', 'Wound Care', 'Mobility'],
            price: '$45/hr',
            distance: '1.2 miles away',
            image: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff',
            match: 'High',
            languages: 'English / Spanish'
        },
        {
            id: 2,
            name: 'David Chen',
            role: 'Certified Nursing Assistant (CNA)',
            rating: 4.8,
            reviews: 28,
            experience: '5 years',
            verified: true,
            skills: ['Dementia Care', 'Companionship', 'Meal Prep'],
            price: '$32/hr',
            distance: '0.8 miles away',
            image: 'https://ui-avatars.com/api/?name=David+Chen&background=23395B&color=fff',
            match: 'High',
            languages: 'English / Mandarin'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'Home Health Aide (HHA)',
            rating: 5.0,
            reviews: 8,
            experience: '12 years',
            verified: true,
            skills: ['Palliative Care', 'Medication', 'Bathing'],
            price: '$35/hr',
            distance: '2.5 miles away',
            image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=A8E6CF&color=23395B',
            match: 'Medium',
            languages: 'English / Spanish'
        },
        {
            id: 4,
            name: 'Jessica Lee',
            role: 'Licensed Practical Nurse (LPN)',
            rating: 4.9,
            reviews: 19,
            experience: '6 years',
            verified: true,
            skills: ['Diabetes Care', 'Vitals Monitoring', 'Injections'],
            price: '$40/hr',
            distance: '1.5 miles away',
            image: 'https://ui-avatars.com/api/?name=Jessica+Lee&background=CBD3D9&color=23395B',
            match: 'High',
            languages: 'English / Korean'
        },
        {
            id: 5,
            name: 'Michael Thompson',
            role: 'Registered Nurse (RN)',
            rating: 4.7,
            reviews: 45,
            experience: '15 years',
            verified: true,
            skills: ['Critical Care', 'IV Therapy', 'Rehabilitation'],
            price: '$55/hr',
            distance: '3.0 miles away',
            image: 'https://ui-avatars.com/api/?name=Michael+Thompson&background=F8C471&color=23395B',
            match: 'Medium',
            languages: 'English'
        }
    ];

    return (
        <main className="page-wrapper bg-background py-8">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold mb-2 text-primary">Verified caregivers nearby</h1>
                <p className="text-secondary mb-8">We surface 3–5 best fits. Verification and skill match come first.</p>

                <div className="flex flex-col gap-6">
                    {nurses.map((nurse, index) => (
                        <Card key={nurse.id} padding hoverEffect className="animate-slide-up">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Profile Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                        <img src={nurse.image} alt={nurse.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-xl text-primary">{nurse.name}</h3>
                                                {nurse.verified && (
                                                    <TrustBadge label="Verified" />
                                                )}
                                            </div>
                                            <p className="text-secondary font-medium">{nurse.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-primary">{nurse.price}</span>
                                            <span className="text-xs text-secondary">est. total $180</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                                        <span className="flex items-center gap-1">
                                            ⭐ <span className="font-bold text-primary">{nurse.rating}</span> ({nurse.reviews})
                                        </span>
                                        <span>•</span>
                                        <span>{nurse.experience} exp</span>
                                        <span>•</span>
                                        <span>{nurse.distance}</span>
                                    </div>

                                    <p className="text-sm text-secondary mb-3">Verified • Background Checked • License Confirmed</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-gray-100 text-secondary text-xs font-medium rounded-full">
                                            Match: {nurse.match}
                                        </span>
                                        <span className="px-3 py-1 bg-accent/30 text-green-800 text-xs font-medium rounded-full">
                                            Languages: {nurse.languages}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {nurse.skills.map((skill) => (
                                            <span key={skill} className="px-3 py-1 bg-gray-100 text-secondary text-xs font-medium rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <Button onClick={() => router.push('/user/confirmation')}>Book caregiver</Button>
                                        <Button variant="outline" onClick={() => router.push(`/user/nurse/${nurse.id}`)}>View profile</Button>
                                    </div>

                                    {index === 0 && (
                                        <div className="mt-4 text-xs text-secondary flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-success"></span>
                                            Trusted by your network: Olivia M. booked Sarah last month.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
