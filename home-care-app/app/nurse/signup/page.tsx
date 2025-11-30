'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

export default function NurseSignup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push('/nurse/profile');
        }, 1000);
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
                        <Input label="Full Name" placeholder="Jane Doe" required />
                        <Input label="Email" type="email" placeholder="jane@example.com" required />
                        <Input label="Phone" type="tel" placeholder="(555) 123-4567" required />

                        <div className="mb-4">
                            <label className="text-sm font-medium text-secondary block mb-2">I am a...</label>
                            <select className="w-full p-3 rounded-lg border border-gray-300" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <option>Registered Nurse (RN)</option>
                                <option>Licensed Practical Nurse (LPN)</option>
                                <option>Certified Nursing Assistant (CNA)</option>
                                <option>Home Health Aide (HHA)</option>
                            </select>
                        </div>

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
