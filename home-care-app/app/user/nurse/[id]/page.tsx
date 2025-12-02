'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import TrustGraph from '../../../components/TrustGraph';
import TrustBadge from '../../../components/TrustBadge';

type NurseProfile = {
    id: string;
    name: string;
    caregiverType: 'RN' | 'LPN' | 'CNA' | 'HHA';
    yearsExperience?: number | null;
    hourlyRate?: number | null;
    languages: string[];
    bio?: string | null;
};

export default function NurseProfileDetails() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [nurse, setNurse] = useState<NurseProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNurse = async () => {
            setLoading(true);
            setError(null);
            try {
                // For MVP, reuse the matching API data shape by fetching all matches
                const res = await fetch('/api/matching');
                const data = await res.json();
                if (!res.ok) {
                    setError(data?.error ?? 'Unable to load caregiver profile.');
                    setLoading(false);
                    return;
                }

                const allCaregivers = (data.caregivers ?? []) as any[];
                const found = allCaregivers.find((c) => c.id === params.id);
                if (!found) {
                    setError('Caregiver not found.');
                    setLoading(false);
                    return;
                }

                setNurse({
                    id: found.id,
                    name: found.name,
                    caregiverType: found.caregiverType,
                    yearsExperience: found.yearsExperience ?? null,
                    hourlyRate: found.hourlyRate ?? null,
                    languages: found.languages ?? [],
                    bio: found.bio ?? null,
                });
            } catch {
                setError('Unexpected error while loading caregiver profile.');
            } finally {
                setLoading(false);
            }
        };

        void loadNurse();
    }, [params.id]);

    const renderRoleLabel = (caregiverType: NurseProfile['caregiverType']) => {
        switch (caregiverType) {
            case 'RN':
                return 'Registered Nurse (RN)';
            case 'LPN':
                return 'Licensed Practical Nurse (LPN)';
            case 'CNA':
                return 'Certified Nursing Assistant (CNA)';
            case 'HHA':
                return 'Home Health Aide (HHA)';
            default:
                return 'Caregiver';
        }
    };

    const hourlyRateLabel = nurse?.hourlyRate
        ? `$${nurse.hourlyRate}/hr`
        : '$40/hr';

    if (loading) {
        return (
            <main className="page-wrapper pb-24 bg-background">
                <div className="container mx-auto pt-20 px-6">
                    <p className="text-secondary">Loading caregiver profile…</p>
                </div>
            </main>
        );
    }

    if (error || !nurse) {
        return (
            <main className="page-wrapper pb-24 bg-background">
                <div className="container mx-auto pt-20 px-6">
                    <p className="text-error mb-4">{error ?? 'Caregiver not found.'}</p>
                    <Button variant="outline" onClick={() => router.back()}>
                        Go back
                    </Button>
                </div>
            </main>
        );
    }

    const experienceLabel = nurse.yearsExperience
        ? `${nurse.yearsExperience} years`
        : 'Experience shared at booking';

    const languages = nurse.languages.length > 0 ? nurse.languages : ['English'];

    return (
        <main className="page-wrapper pb-24 bg-background">
            {/* Header / Cover */}
            <div className="bg-primary h-48 relative">
                <div className="absolute -bottom-16 left-0 right-0 container mx-auto px-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                nurse.name,
                            )}&background=0D8ABC&color=fff`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto pt-20 px-6">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-primary">{nurse.name}</h1>
                        <p className="text-xl text-secondary mb-3">
                            {renderRoleLabel(nurse.caregiverType)}
                        </p>
                        <div className="flex items-center gap-3">
                            <TrustBadge label="Verified License" />
                            <span className="flex items-center gap-1 text-sm font-bold text-primary">
                                ⭐ 4.8 <span className="text-secondary font-normal">(10+ reviews)</span>
                            </span>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <span className="text-3xl font-bold text-primary">
                            {hourlyRateLabel}
                        </span>
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
                                    You have a mutual connection! <strong>Emily R.</strong> (your friend) has booked this caregiver before.
                                </p>
                            </Card>
                        </section>

                        {/* About */}
                        <section>
                            <h3 className="text-lg font-bold mb-4 text-primary">About Me</h3>
                            <Card padding>
                                <p className="text-secondary leading-relaxed mb-6">
                                    {nurse.bio ||
                                        'This caregiver prefers to share more about their background during the initial call. They have been vetted by our team and are licensed to practice.'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang) => (
                                        <span
                                            key={lang}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-secondary font-medium"
                                        >
                                            🗣️ {lang}
                                        </span>
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
                                        <p className="font-medium text-primary">{experienceLabel}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary uppercase font-bold mb-1 tracking-wide">Background Check</p>
                                        <p className="font-medium text-success">Passed Nov 2024</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary uppercase font-bold mb-3 tracking-wide">Certifications</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 border border-primary/20 bg-primary/5 text-primary rounded-full text-sm font-medium">
                                            Licensed & background-checked
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Reviews */}
                        <section>
                            <h3 className="text-lg font-bold mb-4 text-primary">Reviews</h3>
                            <div className="flex flex-col gap-4">
                                <Card padding className="bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-primary">Recent family</span>
                                        <span className="text-xs text-secondary">Last month</span>
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                                            Community
                                        </span>
                                    </div>
                                    <p className="text-secondary text-sm leading-relaxed">
                                        &quot;Showed up early, communicated clearly, and made our dad feel comfortable the entire
                                        visit.&quot;
                                    </p>
                                </Card>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Availability & Booking (Desktop) */}
                    <div className="hidden md:block">
                        <div className="sticky top-6">
                            <Card padding>
                                <h3 className="text-2xl font-bold mb-6 text-primary">
                                    {hourlyRateLabel}
                                </h3>
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
                                <Button fullWidth size="lg" onClick={() => router.push('/user/confirmation')}>
                                    Book This Caregiver
                                </Button>
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
                        <span className="block text-lg font-bold text-primary">{hourlyRateLabel}</span>
                        <span className="text-xs text-secondary">Total est. $180</span>
                    </div>
                    <div className="flex-1">
                        <Button fullWidth onClick={() => router.push('/user/confirmation')}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
