'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

const DAYS = [
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: 0 },
];

export default function NurseSignup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [licenseType, setLicenseType] = useState<'RN' | 'LPN' | 'CNA' | 'HHA'>('RN');
    const [password, setPassword] = useState('');

    // Availability state: map of day value -> { start: string, end: string, active: boolean }
    const [availability, setAvailability] = useState<Record<number, { start: string; end: string; active: boolean }>>(
        DAYS.reduce((acc, day) => ({
            ...acc,
            [day.value]: { start: '09:00', end: '17:00', active: false }
        }), {})
    );

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

            const res = await fetch('/api/auth/signup/nurse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    licenseType,
                    password,
                    availabilitySlots,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error ?? 'Something went wrong while creating your account.');
                setLoading(false);
                return;
            }

            await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            router.push('/nurse/profile');
        } catch (err) {
            setError('Unexpected error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-wrapper justify-center items-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container mx-auto" style={{ maxWidth: '480px' }}>
                <div className="text-center mb-4">
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Join as a Caregiver</h1>
                    <p className="text-secondary">Earn more with flexible, short-term shifts.</p>
                </div>

                <Card padding>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            placeholder="Jane Doe"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="jane@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <div className="mb-4">
                            <label className="text-sm font-medium text-secondary block mb-2">I am a...</label>
                            <select
                                className="w-full p-3 rounded-lg border border-gray-300"
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)' }}
                                value={licenseType}
                                onChange={(e) => setLicenseType(e.target.value as 'RN' | 'LPN' | 'CNA' | 'HHA')}
                            >
                                <option value="RN">Registered Nurse (RN)</option>
                                <option value="LPN">Licensed Practical Nurse (LPN)</option>
                                <option value="CNA">Certified Nursing Assistant (CNA)</option>
                                <option value="HHA">Home Health Aide (HHA)</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-secondary block mb-2">Availability</label>
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

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <p className="text-sm text-error mt-1">
                                {error}
                            </p>
                        )}

                        <div style={{ marginTop: '24px' }}>
                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Continue'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </main>
    );
}
