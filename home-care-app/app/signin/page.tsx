'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function SignIn() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'family' | 'nurse'>('family');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password.');
                setIsLoading(false);
                return;
            }

            // Route based on actual role, regardless of selected tab
            const session = await getSession();
            const role = session?.user?.role as 'FAMILY' | 'CAREGIVER' | undefined;

            if (role === 'CAREGIVER') {
                window.location.href = '/nurse/dashboard';
            } else {
                window.location.href = '/user/intake';
            }
        } catch (err) {
            setError('Unexpected error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="page-wrapper flex items-center justify-center bg-gray-50 py-20 min-h-screen">
            <div className="container mx-auto max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
                    <p className="text-secondary">Sign in to manage your care or schedule.</p>
                </div>

                <Card padding className="animate-slide-up">
                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                        <button
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'family' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                            onClick={() => setActiveTab('family')}
                        >
                            Family
                        </button>
                        <button
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'nurse' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                            onClick={() => setActiveTab('nurse')}
                        >
                            Caregiver
                        </button>
                    </div>

                    <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-bold text-primary mb-1.5">Email Address</label>
                            <Input
                                placeholder="name@example.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-bold text-primary">Password</label>
                                <Link href="/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <Input
                                placeholder="••••••••"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-error">
                                {error}
                            </p>
                        )}

                        <div className="mt-4">
                            <Button fullWidth loading={isLoading} size="lg">
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </div>
                    </form>

                    <p className="text-sm text-secondary">
                        Don&apos;t have an account?{' '}
                        <Link href={activeTab === 'family' ? '/user/signup' : '/nurse/signup'} className="text-primary font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </Card>
            </div>
        </main>
    );
}
