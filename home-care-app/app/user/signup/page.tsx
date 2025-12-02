'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

export default function UserSignup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [zip, setZip] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/signup/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, zip, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error ?? 'Something went wrong while creating your account.');
                setLoading(false);
                return;
            }

            // Automatically sign in the new family user
            await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            router.push('/user/intake');
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
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Create Account</h1>
                    <p className="text-secondary">Join to find trusted care for your loved ones.</p>
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
                            label="Phone Number"
                            type="tel"
                            placeholder="(555) 123-4567"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <Input
                            label="Zip Code"
                            placeholder="10001"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
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

                <p className="text-center text-secondary mt-4" style={{ fontSize: '14px' }}>
                    Already have an account? <a href="/signin" className="text-primary">Sign in</a>
                </p>
            </div>
        </main>
    );
}
