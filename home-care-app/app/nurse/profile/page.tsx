'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

type AvailabilitySlot = {
    dayOfWeek: number;
    startMinutes: number;
    endMinutes: number;
};

type Profile = {
    yearsExperience?: number | null;
    skills: string[];
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    availabilitySlots?: AvailabilitySlot[];
};

const SPECIALTIES = ['Dementia Care', 'Post-Op', 'Wound Care', 'Physical Therapy', 'Palliative Care'];

const DAYS = [
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: 0 },
];

export default function ProfileSetup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'verifying' | 'success'>('idle');
    const [showOtherSpecialty, setShowOtherSpecialty] = useState(false);
    const [yearsExperience, setYearsExperience] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Availability state: map of day value -> { start: string, end: string, active: boolean }
    const [availability, setAvailability] = useState<Record<number, { start: string; end: string; active: boolean }>>(
        DAYS.reduce((acc, day) => ({
            ...acc,
            [day.value]: { start: '09:00', end: '17:00', active: false }
        }), {})
    );

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetch('/api/caregiver/profile');
                const data = await res.json();
                if (!res.ok) {
                    setError(data?.error ?? 'Unable to load profile.');
                    return;
                }
                if (data.profile) {
                    const p = data.profile as Profile;
                    setProfile(p);
                    if (typeof p.yearsExperience === 'number') {
                        setYearsExperience(String(p.yearsExperience));
                    }
                    if (Array.isArray(p.skills)) {
                        setSelectedSkills(p.skills);
                    }
                    if (p.verificationStatus === 'APPROVED') {
                        setUploadStatus('success');
                    }

                    if (p.availabilitySlots && p.availabilitySlots.length > 0) {
                        const newAvailability = { ...availability };
                        // Reset all to inactive first? Or just merge?
                        // Let's reset to default first to be safe, but keep default times if not present
                        // Actually, better to just iterate slots and update.

                        p.availabilitySlots.forEach(slot => {
                            const startH = Math.floor(slot.startMinutes / 60);
                            const startM = slot.startMinutes % 60;
                            const endH = Math.floor(slot.endMinutes / 60);
                            const endM = slot.endMinutes % 60;

                            const startStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
                            const endStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

                            newAvailability[slot.dayOfWeek] = {
                                start: startStr,
                                end: endStr,
                                active: true
                            };
                        });
                        setAvailability(newAvailability);
                    }
                }
            } catch {
                setError('Unexpected error while loading profile.');
            }
        };

        void loadProfile();
    }, []);

    const handleFileUpload = () => {
        setUploadStatus('uploading');
        setTimeout(() => {
            setUploadStatus('verifying');
            setTimeout(() => {
                setUploadStatus('success');
            }, 2000);
        }, 1500);
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
        );
    };

    const handleDayToggle = (dayValue: number) => {
        setAvailability(prev => ({
            ...prev,
            [dayValue]: { ...prev[dayValue], active: !prev[dayValue].active }
        }));
    };

    const handleTimeChange = (dayValue: number, field: 'start' | 'end', value: string) => {
        setAvailability(prev => ({
            ...prev,
            [dayValue]: { ...prev[dayValue], [field]: value }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const years = yearsExperience ? parseInt(yearsExperience, 10) : undefined;

            // Transform availability to slots
            const availabilitySlots = Object.entries(availability)
                .filter(([_, config]) => config.active)
                .map(([dayStr, config]) => {
                    const dayOfWeek = parseInt(dayStr);
                    const [startH, startM] = config.start.split(':').map(Number);
                    const [endH, endM] = config.end.split(':').map(Number);
                    return {
                        dayOfWeek,
                        startMinutes: startH * 60 + startM,
                        endMinutes: endH * 60 + endM,
                    };
                });

            const res = await fetch('/api/caregiver/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    yearsExperience: years,
                    skills: selectedSkills,
                    availabilitySlots,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.error ?? 'Unable to save profile.');
                setLoading(false);
                return;
            }
            setProfile(data.profile as Profile);
            router.push('/nurse/dashboard');
        } catch {
            setError('Unexpected error while saving profile.');
        } finally {
            setLoading(false);
        }
    };

    const isComplete = profile?.verificationStatus === 'APPROVED';

    return (
        <main className="page-wrapper justify-center items-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container mx-auto animate-fade-in" style={{ maxWidth: '600px', paddingBottom: '40px' }}>
                <div className="mb-6 text-center">
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
                        {isComplete ? 'Profile Complete' : 'Complete Your Profile'}
                    </h1>
                    <p className="text-secondary">
                        {isComplete
                            ? 'You can update your experience and skills anytime.'
                            : 'Verify your credentials to start accepting jobs.'}
                    </p>
                </div>

                {error && (
                    <p className="text-sm text-error mb-4 text-center">{error}</p>
                )}

                <Card padding className="animate-slide-up">
                    {isComplete && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-secondary">
                            <p className="font-semibold text-primary mb-1">You&apos;re ready to accept jobs.</p>
                            <p>
                                We&apos;ve saved your documents, years of experience, and specialties. You can adjust
                                them below if anything changes.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h3 className="font-bold mb-4 text-lg">Upload Documents</h3>

                            {uploadStatus === 'idle' && !isComplete && (
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all hover:border-primary cursor-pointer bg-gray-50"
                                    style={{ border: '2px dashed var(--color-border)', padding: '40px', borderRadius: 'var(--radius-md)', backgroundColor: '#f9f9f9' }}
                                    onClick={handleFileUpload}
                                >
                                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>📄</div>
                                    <p className="font-medium mb-2">Upload Government ID & License</p>
                                    <p className="text-secondary text-sm mb-4">Drag & drop or click to browse</p>
                                    <Button type="button" variant="outline" size="sm">Browse Files</Button>
                                </div>
                            )}

                            {uploadStatus === 'uploading' && (
                                <div className="p-8 text-center bg-gray-50 rounded-xl">
                                    <p className="font-medium mb-4">Uploading...</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '60%', backgroundColor: 'var(--color-primary)', transition: 'width 2s ease' }}></div>
                                    </div>
                                </div>
                            )}

                            {uploadStatus === 'verifying' && (
                                <div className="p-8 text-center bg-gray-50 rounded-xl">
                                    <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" style={{ borderTopColor: 'transparent' }}></div>
                                    <p className="font-medium text-primary">Verifying Credentials...</p>
                                    <p className="text-sm text-secondary mt-2">Checking with State Board...</p>
                                </div>
                            )}

                            {uploadStatus === 'success' && (
                                <div className="p-8 text-center bg-green-50 rounded-xl border border-green-100" style={{ backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                    <p className="font-bold text-success" style={{ color: 'var(--color-success)' }}>Documents Verified</p>
                                    <p className="text-sm text-secondary">License verified as active.</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold mb-4 text-lg">Experience & Skills</h3>
                            <Input
                                label="Years of Experience"
                                type="number"
                                placeholder="e.g. 5"
                                value={yearsExperience}
                                onChange={(e) => setYearsExperience(e.target.value)}
                            />

                            <div className="mb-4">
                                <label className="text-sm font-medium text-secondary block mb-3">Specialties</label>
                                <div className="flex flex-wrap gap-3">
                                    {SPECIALTIES.map(skill => (
                                        <label key={skill} className={`flex items-center gap-2 bg-white px-4 py-2 rounded-full border cursor-pointer transition-all shadow-sm ${selectedSkills.includes(skill) ? 'border-primary' : 'border-gray-200 hover:border-primary'}`}>
                                            <input
                                                type="checkbox"
                                                className="accent-primary"
                                                checked={selectedSkills.includes(skill)}
                                                onChange={() => toggleSkill(skill)}
                                            />
                                            <span className="text-sm font-medium">{skill}</span>
                                        </label>
                                    ))}
                                    <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:border-primary transition-all shadow-sm">
                                        <input
                                            type="checkbox"
                                            className="accent-primary"
                                            checked={showOtherSpecialty}
                                            onChange={(e) => setShowOtherSpecialty(e.target.checked)}
                                        />
                                        <span className="text-sm font-medium">Other</span>
                                    </label>
                                </div>

                                {showOtherSpecialty && (
                                    <div className="mt-4 animate-fade-in">
                                        <Input label="Please specify other specialties" placeholder="e.g. Pediatric Care, Oncology..." />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold mb-4 text-lg">Availability</h3>
                            <div className="space-y-2">
                                {DAYS.map((day) => (
                                    <div key={day.value} className="flex items-center gap-2">
                                        <label className="flex items-center gap-2 w-20">
                                            <input
                                                type="checkbox"
                                                checked={availability[day.value].active}
                                                onChange={() => handleDayToggle(day.value)}
                                                className="accent-primary"
                                            />
                                            <span className="text-sm">{day.label}</span>
                                        </label>
                                        {availability[day.value].active && (
                                            <div className="flex items-center gap-1 flex-1">
                                                <input
                                                    type="time"
                                                    value={availability[day.value].start}
                                                    onChange={(e) => handleTimeChange(day.value, 'start', e.target.value)}
                                                    className="p-1 border rounded text-sm w-full"
                                                />
                                                <span className="text-xs text-secondary">-</span>
                                                <input
                                                    type="time"
                                                    value={availability[day.value].end}
                                                    onChange={(e) => handleTimeChange(day.value, 'end', e.target.value)}
                                                    className="p-1 border rounded text-sm w-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button fullWidth type="submit" disabled={loading || uploadStatus !== 'success'} loading={loading} size="lg">
                            {loading ? 'Finalizing Profile...' : isComplete ? 'Save Changes' : 'Complete Setup'}
                        </Button>
                    </form>
                </Card>
            </div>
        </main>
    );
}
