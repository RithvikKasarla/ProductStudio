'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import TrustGraph from '../../../components/TrustGraph';
import TrustBadge from '../../../components/TrustBadge';

export default function NurseProfileDetails() {
    // const params = useParams();
    // const { id } = params; // Unused for mock data

    // Mock Data - Expanded
    const nurse = {
        id: 1,
        name: 'Sarah Jenkins',
        role: 'Registered Nurse (RN)',
        rating: 4.9,
        reviews: 12,
        experience: '8 years',
        verified: true,
        bio: 'Compassionate RN with extensive experience in geriatric care and post-surgery recovery. I specialize in wound care and mobility assistance. I treat every patient like my own family, ensuring they feel safe, respected, and comfortable in their own home.',
        certifications: ['Registered Nurse (RN)', 'CPR Certified', 'Dementia Care Specialist', 'Wound Care Certified'],
        languages: ['English', 'Spanish'],
        availability: ['Mon', 'Tue', 'Wed', 'Fri'],
        reviewsList: [
            { id: 1, user: 'Emily R.', relation: 'Friend', text: 'Sarah was amazing with my mom. Highly recommended! She was always on time and very patient.', date: '2 weeks ago' },
            { id: 2, user: 'John D.', relation: 'Community', text: 'Very professional and punctual. Knew exactly how to handle the post-op care.', date: '1 month ago' },
            { id: 3, user: 'Maria G.', relation: 'Community', text: 'Sarah is a gem. She made my father feel so comfortable during a difficult time.', date: '2 months ago' }
        ]
    };

    return (
        <main className="page-wrapper pb-24 bg-background">
            {/* Header / Cover */}
            <div className="bg-primary h-48 relative">
                <div className="absolute -bottom-16 left-0 right-0 container mx-auto px-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                        <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto pt-20 px-6">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-primary">{nurse.name}</h1>
                        <p className="text-xl text-secondary mb-3">{nurse.role}</p>
                        <div className="flex items-center gap-3">
                            <TrustBadge label="Verified License" />
                            <span className="flex items-center gap-1 text-sm font-bold text-primary">
                                ⭐ {nurse.rating} <span className="text-secondary font-normal">({nurse.reviews} reviews)</span>
                            </span>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <span className="text-3xl font-bold text-primary">$45<span className="text-lg font-normal text-secondary">/hr</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Main Info */}
                    <div className="md:col-span-2 flex flex-col gap-8">

                        {/* Trust Graph */}
                        <section>
                            <h3 className="text-lg font-bold mb-4 text-primary">Trust & Connections</h3>
                            <Card padding>
                                <TrustGraph nurseName={nurse.name} mutualContacts={['Emily R.']} />
                                <p className="text-sm text-secondary mt-4">
                                    You have a mutual connection! <strong>Emily R.</strong> (your friend) has booked Sarah before.
                                </p>
                            </Card>
                        </section>

                        {/* About */}
                        <section>
                            <h3 className="text-lg font-bold mb-4 text-primary">About Me</h3>
                            <Card padding>
                                <p className="text-secondary leading-relaxed mb-6">{nurse.bio}</p>
                                <div className="flex flex-wrap gap-2">
                                    {nurse.languages.map(lang => (
                                        <span key={lang} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-secondary font-medium">🗣️ {lang}</span>
                                    ))}
                                </div>
                            </Card>
                        </section>

                        {/* Experience & Skills */}
                        <section>
                            <h3 className="text-lg font-bold mb-4 text-primary">Experience & Skills</h3>
                            <Card padding>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <p className="text-xs text-secondary uppercase font-bold mb-1 tracking-wide">Experience</p>
                                        <p className="font-medium text-primary">{nurse.experience}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary uppercase font-bold mb-1 tracking-wide">Background Check</p>
                                        <p className="font-medium text-success">Passed Nov 2024</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary uppercase font-bold mb-3 tracking-wide">Certifications</p>
                                    <div className="flex flex-wrap gap-2">
                                        {nurse.certifications.map((cert) => (
                                            <span key={cert} className="px-3 py-1 border border-primary/20 bg-primary/5 text-primary rounded-full text-sm font-medium">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Reviews */}
                        <section>
                            <h3 className="text-lg font-bold mb-4 text-primary">Reviews</h3>
                            <div className="flex flex-col gap-4">
                                {nurse.reviewsList.map((review) => (
                                    <Card key={review.id} padding className="bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-primary">{review.user}</span>
                                            <span className="text-xs text-secondary">{review.date}</span>
                                        </div>
                                        <div className="mb-3">
                                            {review.relation === 'Friend' && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Friend</span>}
                                            {review.relation === 'Community' && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold">Community</span>}
                                        </div>
                                        <p className="text-secondary text-sm leading-relaxed">{review.text}</p>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Availability & Booking (Desktop) */}
                    <div className="hidden md:block">
                        <div className="sticky top-6">
                            <Card padding>
                                <h3 className="text-2xl font-bold mb-6 text-primary">$45<span className="text-sm text-secondary font-normal">/hr</span></h3>
                                <div className="mb-8">
                                    <p className="text-sm font-bold text-secondary mb-3 uppercase tracking-wide">Availability</p>
                                    <div className="flex gap-2 justify-between">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                            <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${[0, 1, 2, 4].includes(i) ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button fullWidth size="lg">Book This Caregiver</Button>
                                <p className="text-xs text-center text-secondary mt-4">You won&apos;t be charged yet</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border md:hidden glass-panel z-50">
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <span className="block text-lg font-bold text-primary">$45/hr</span>
                        <span className="text-xs text-secondary">Total est. $180</span>
                    </div>
                    <div className="flex-1">
                        <Button fullWidth>Book Now</Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
