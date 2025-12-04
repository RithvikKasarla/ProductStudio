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
    zip?: string | null;
    availabilitySlots?: {
        dayOfWeek: number;
        startMinutes: number;
        endMinutes: number;
    }[];
};

export default function NurseProfileDetails() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [nurse, setNurse] = useState<NurseProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [intakeId, setIntakeId] = useState<string | null>(null);
    const [booking, setBooking] = useState(false);

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
                setIntakeId(data.intakeId ?? null);
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
                    zip: found.zip ?? null,
                    availabilitySlots: found.availabilitySlots ?? [],
                });
            } catch {
                setError('Unexpected error while loading caregiver profile.');
            } finally {
                setLoading(false);
            }
        };

        void loadNurse();
    }, [params.id]);

    const handleBook = async () => {
        if (!nurse) return;
        setBooking(true);

        if (!intakeId) {
            router.push('/user/payment');
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intakeId, caregiverProfileId: nurse.id }),
            });

            if (!res.ok) {
                router.push('/user/payment');
                return;
            }

            const data = await res.json();
            if (data.booking?.id) {
                router.push(`/user/payment?bookingId=${data.booking.id}`);
                return;
            }
        } catch {
            // Swallow error; still proceed to payment
        }

        router.push('/user/payment');
    };

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

    // Helper to check if a day is available
    // Days are 0 (Sun) - 6 (Sat) in DB
    // UI displays M T W T F S S
    // Map UI index 0 (Mon) -> 1, 1 (Tue) -> 2, ..., 5 (Sat) -> 6, 6 (Sun) -> 0
    const isDayAvailable = (uiIndex: number) => {
        const dbDay = uiIndex === 6 ? 0 : uiIndex + 1;
        return nurse.availabilitySlots?.some(slot => slot.dayOfWeek === dbDay);
    };

    const getDayTimeRange = (uiIndex: number) => {
        const dbDay = uiIndex === 6 ? 0 : uiIndex + 1;
        const slot = nurse.availabilitySlots?.find(slot => slot.dayOfWeek === dbDay);
        if (!slot) return null;

        const startH = Math.floor(slot.startMinutes / 60);
        const startM = slot.startMinutes % 60;
        const endH = Math.floor(slot.endMinutes / 60);
        const endM = slot.endMinutes % 60;

        const formatTime = (h: number, m: number) => {
            const ampm = h >= 12 ? 'pm' : 'am';
            const h12 = h % 12 || 12;
            return `${h12}:${m.toString().padStart(2, '0')}${ampm}`;
        };

        return `${formatTime(startH, startM)} - ${formatTime(endH, endM)}`;
    };

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
                            {nurse.zip && (
                                <span className="flex items-center gap-1 text-sm font-medium text-secondary">
                                    📍 {nurse.zip}
                                </span>
                            )}
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
                                    <div className="flex gap-2 justify-between mb-4">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                            const available = isDayAvailable(i);
                                            return (
                                                <div
                                                    key={i}
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${available ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
                                                    title={available ? getDayTimeRange(i) ?? '' : 'Unavailable'}
                                                >
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-xs text-secondary">
                                        {nurse.availabilitySlots && nurse.availabilitySlots.length > 0 ? (
                                            <ul className="space-y-1">
                                                {nurse.availabilitySlots.map(slot => {
                                                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                    const startH = Math.floor(slot.startMinutes / 60);
                                                    const startM = slot.startMinutes % 60;
                                                    const endH = Math.floor(slot.endMinutes / 60);
                                                    const endM = slot.endMinutes % 60;
                                                    const formatTime = (h: number, m: number) => {
                                                        const ampm = h >= 12 ? 'pm' : 'am';
                                                        const h12 = h % 12 || 12;
                                                        return `${h12}:${m.toString().padStart(2, '0')}${ampm}`;
                                                    };
                                                    return (
                                                        <li key={slot.dayOfWeek} className="flex justify-between">
                                                            <span>{days[slot.dayOfWeek]}</span>
                                                            <span>{formatTime(startH, startM)} - {formatTime(endH, endM)}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p>No availability listed.</p>
                                        )}
                                    </div>
                                </div>
                                <Button fullWidth size="lg" onClick={() => void handleBook()} disabled={booking}>
                                    {booking ? 'Booking...' : 'Book This Caregiver'}
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
                        <Button fullWidth onClick={() => void handleBook()} disabled={booking}>
                            {booking ? 'Booking...' : 'Book Now'}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
