'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '../../components/Button';
import Card from '../../components/Card';

type Booking = {
    id: string;
    caregiverProfile: {
        user: {
            name: string;
        };
        caregiverType: string;
    };
    startTime: string;
    endTime: string;
    bookingStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
    totalPriceCents: number;
    intake: {
        whoNeedsCare: string;
        tasks: string[];
    };
};

export default function UserDashboard() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/bookings');
                const data = await res.json();

                if (!res.ok) {
                    setError(data?.error ?? 'Unable to load bookings.');
                    setLoading(false);
                    return;
                }

                setBookings(data.bookings ?? []);
            } catch {
                setError('Unexpected error while loading bookings.');
            } finally {
                setLoading(false);
            }
        };

        void fetchBookings();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: Booking['bookingStatus']) => {
        switch (status) {
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'DECLINED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <main className="page-wrapper bg-background py-8">
            <div className="container mx-auto max-w-4xl px-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-secondary">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        </div>
                        <p className="mt-4">Loading your bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                        <h3 className="text-xl font-bold mb-2 text-primary">No Bookings Yet</h3>
                        <p className="text-secondary mb-6">You haven't booked any care sessions yet.</p>
                        <Button onClick={() => router.push('/user/matching')}>
                            Find a Caregiver
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {bookings.map((booking) => (
                            <Card key={booking.id} padding hoverEffect className="animate-slide-up">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                    {booking.caregiverProfile.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-primary">
                                                        {booking.caregiverProfile.user.name}
                                                    </h3>
                                                    <p className="text-sm text-secondary">
                                                        {booking.caregiverProfile.caregiverType}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.bookingStatus)}`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div>
                                                <p className="text-xs text-secondary uppercase font-bold mb-1">Date & Time</p>
                                                <p className="font-medium text-primary">
                                                    {formatDate(booking.startTime)}
                                                </p>
                                                <p className="text-sm text-secondary">
                                                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-secondary uppercase font-bold mb-1">Patient</p>
                                                <p className="font-medium text-primary">
                                                    {booking.intake.whoNeedsCare}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-secondary uppercase font-bold mb-1">Total</p>
                                                <p className="font-medium text-primary">
                                                    ${(booking.totalPriceCents / 100).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            <p className="text-xs text-secondary uppercase font-bold mb-2">Tasks Requested</p>
                                            <div className="flex flex-wrap gap-2">
                                                {booking.intake.tasks.map((task, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-secondary">
                                                        {task}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {booking.bookingStatus === 'ACCEPTED' && (
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <Button
                                                    fullWidth
                                                    onClick={() => router.push(`/user/session/${booking.id}`)}
                                                    className="bg-green-600 hover:bg-green-700 border-green-600"
                                                >
                                                    Start Session Simulation
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
