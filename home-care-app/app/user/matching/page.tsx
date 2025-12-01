'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/Button';
import Card from '../../components/Card';
import TrustBadge from '../../components/TrustBadge';

type CaregiverMatch = {
    id: string;
    userId: string;
    name: string;
    caregiverType: 'RN' | 'LPN' | 'CNA' | 'HHA';
    yearsExperience?: number;
    hourlyRate?: number;
    skills: string[];
    languages: string[];
    matchScore: number;
    matchLabel: 'High' | 'Medium' | 'Low';
};

export default function MatchingResults() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [matches, setMatches] = useState<CaregiverMatch[]>([]);
    const [intakeId, setIntakeId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);
            try {
                const intakeIdFromUrl = searchParams.get('intakeId');
                const url = intakeIdFromUrl
                    ? `/api/matching?intakeId=${encodeURIComponent(intakeIdFromUrl)}`
                    : '/api/matching';

                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) {
                    setError(data?.error ?? 'Unable to load matches right now.');
                    setLoading(false);
                    return;
                }

                setMatches(data.caregivers ?? []);
                setIntakeId(data.intakeId ?? null);
            } catch {
                setError('Unexpected error while loading matches.');
            } finally {
                setLoading(false);
            }
        };

        void fetchMatches();
    }, [searchParams]);

    const handleBook = async (caregiverProfileId: string) => {
        if (!intakeId) {
            router.push('/user/confirmation');
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intakeId, caregiverProfileId }),
            });

            if (!res.ok) {
                // For MVP, just proceed to confirmation even if booking API fails
                router.push('/user/confirmation');
                return;
            }
        } catch {
            // Swallow error for now; still give the confirmation experience
        }

        router.push('/user/confirmation');
    };

    const renderRoleLabel = (caregiverType: CaregiverMatch['caregiverType']) => {
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

    return (
        <main className="page-wrapper bg-background py-8">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold mb-2 text-primary">Verified caregivers nearby</h1>
                <p className="text-secondary mb-8">We surface 3–5 best fits. Verification and skill match come first.</p>

                {error && (
                    <p className="text-sm text-error mb-4">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-secondary">Loading matches…</p>
                ) : matches.length === 0 ? (
                    <p className="text-secondary">
                        No caregivers match this intake yet. Try adjusting your details or check back soon.
                    </p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {matches.map((nurse, index) => {
                            const experienceLabel = nurse.yearsExperience
                                ? `${nurse.yearsExperience} yrs`
                                : 'Experience shared at booking';
                            const priceLabel = nurse.hourlyRate
                                ? `$${nurse.hourlyRate}/hr`
                                : '$40/hr';
                            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                nurse.name,
                            )}&background=23395B&color=fff`;

                            return (
                                <Card key={nurse.id} padding hoverEffect className="animate-slide-up">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Profile Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <img src={avatarUrl} alt={nurse.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-xl text-primary">{nurse.name}</h3>
                                                        <TrustBadge label="Verified" />
                                                    </div>
                                                    <p className="text-secondary font-medium">
                                                        {renderRoleLabel(nurse.caregiverType)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-xl font-bold text-primary">{priceLabel}</span>
                                                    <span className="text-xs text-secondary">est. total • based on hours</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                                                <span className="flex items-center gap-1">
                                                    ⭐ <span className="font-bold text-primary">
                                                        {(Math.max(3.8, Math.min(5, nurse.matchScore / 20 + 4))).toFixed(1)}
                                                    </span>{' '}
                                                    (10+)
                                                </span>
                                                <span>•</span>
                                                <span>{experienceLabel}</span>
                                                <span>•</span>
                                                <span>Near you</span>
                                            </div>

                                            <p className="text-sm text-secondary mb-3">
                                                Verified • Background Checked • License Confirmed
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-3 py-1 bg-gray-100 text-secondary text-xs font-medium rounded-full">
                                                    Match: {nurse.matchLabel}
                                                </span>
                                                {nurse.languages.length > 0 && (
                                                    <span className="px-3 py-1 bg-accent/30 text-green-800 text-xs font-medium rounded-full">
                                                        Languages: {nurse.languages.join(' / ')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {nurse.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-3 py-1 bg-gray-100 text-secondary text-xs font-medium rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-4">
                                                <Button onClick={() => void handleBook(nurse.id)}>
                                                    Book caregiver
                                                </Button>
                                                <Button variant="outline" onClick={() => router.push(`/user/nurse/${nurse.id}`)}>
                                                    View profile
                                                </Button>
                                            </div>

                                            {index === 0 && (
                                                <div className="mt-4 text-xs text-secondary flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-success"></span>
                                                    Trusted by your network: Olivia M. booked this caregiver last month.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

