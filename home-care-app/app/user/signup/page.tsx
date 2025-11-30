'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

export default function UserSignup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            router.push('/user/intake');
        }, 1000);
    };

    return (
        <main className="page-wrapper justify-center items-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container mx-auto" style={{ maxWidth: '480px' }}>
                <div className="text-center mb-4">
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Create Account</h1>
                    <p className="text-secondary">Join to find trusted care for your loved ones.</p>
                </div>

                <Card padding>
                    <form onSubmit={handleSubmit}>
                        <Input label="Full Name" placeholder="Jane Doe" required />
                        <Input label="Phone Number" type="tel" placeholder="(555) 123-4567" required />
                        <Input label="Zip Code" placeholder="10001" required />

                        <div style={{ marginTop: '24px' }}>
                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Continue'}
                            </Button>
                        </div>
                    </form>
                </Card>

                <p className="text-center text-secondary mt-4" style={{ fontSize: '14px' }}>
                    Already have an account? <a href="#" className="text-primary">Sign in</a>
                </p>
            </div>
        </main>
    );
}
