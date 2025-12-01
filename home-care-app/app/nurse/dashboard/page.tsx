'use client';

import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

type BookingJob = {
    id: string;
    location: string;
    rate: string;
    patient: string;
    schedule: string;
    tasks: string;
    distance: string;
};

export default function NurseDashboard() {
    const [activeTab, setActiveTab] = useState('requests');
    const [jobs, setJobs] = useState<BookingJob[]>([]);
    const [scheduleJobs, setScheduleJobs] = useState<BookingJob[]>([]);
    const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const [pendingRes, upcomingRes] = await Promise.all([
                fetch('/api/bookings?scope=pending'),
                fetch('/api/bookings?scope=upcoming'),
            ]);

            const pendingData = await pendingRes.json();
            const upcomingData = await upcomingRes.json();

            if (!pendingRes.ok) {
                setError(pendingData?.error ?? 'Unable to load new requests.');
                setLoading(false);
                return;
            }

            const mapBookingToJob = (booking: any): BookingJob => {
                const hourly = booking.hourlyRateCents / 100;
                const start = new Date(booking.startTime);
                const end = new Date(booking.endTime);
                const schedule = `${start.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                })}, ${start.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                })} - ${end.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                })}`;

                const tasks = (booking.intake?.tasks ?? []).join(', ') || 'General support';
                const location = booking.intake?.zip
                    ? `NYC • ${booking.intake.zip}`
                    : 'New York City';

                return {
                    id: booking.id as string,
                    location,
                    rate: `$${hourly}/hr`,
                    patient: booking.intake?.whoNeedsCare
                        ? `${booking.intake.whoNeedsCare}, Home care`
                        : 'Home care visit',
                    schedule,
                    tasks,
                    distance: 'Nearby',
                };
            };

            const pending = (pendingData.bookings ?? []).map(mapBookingToJob);
            const upcoming = (upcomingData.bookings ?? []).map(mapBookingToJob);

            setJobs(pending);
            setScheduleJobs(upcoming);
        } catch {
            setError('Unexpected error while loading your requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchJobs();
    }, []);

    const handleAccept = async (id: string) => {
        setAcceptedJobs((prev) => [...prev, id]);
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ACCEPTED' }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.error ?? 'Unable to accept job right now.');
            }
        } catch {
            setError('Unable to accept job. Please try again.');
        } finally {
            void fetchJobs();
        }
    };

    const handleDecline = async (id: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'DECLINED' }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.error ?? 'Unable to decline job right now.');
            }
        } catch {
            setError('Unable to decline job. Please try again.');
        } finally {
            void fetchJobs();
        }
    };

    return (
        <main className="page-wrapper" style={{ backgroundColor: 'var(--color-background)' }}>
            <nav className="glass-panel sticky top-0 z-10 px-6 py-4 mb-6" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="font-bold text-xl tracking-tight text-primary">CareConnect <span className="text-secondary font-normal">Provider</span></h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-secondary">Sarah Jenkins</span>
                        <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff" alt="Profile" />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto animate-fade-in" style={{ paddingBottom: '40px' }}>
                <div className="flex gap-8 mb-8 border-b border-gray-200">
                    <button
                        className={`pb-3 font-medium text-lg transition-all ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
                        onClick={() => setActiveTab('requests')}
                        style={{ borderBottom: activeTab === 'requests' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
                    >
                        New Requests <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full ml-2">{jobs.length}</span>
                    </button>
                    <button
                        className={`pb-3 font-medium text-lg transition-all ${activeTab === 'schedule' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
                        onClick={() => setActiveTab('schedule')}
                        style={{ borderBottom: activeTab === 'schedule' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
                    >
                        My Schedule
                    </button>
                </div>

                {activeTab === 'requests' && (
                    <div className="flex flex-col gap-6">
                        {loading ? (
                            <p className="text-secondary">Loading new requests…</p>
                        ) : error ? (
                            <p className="text-error">{error}</p>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-20 text-secondary animate-fade-in">
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                                <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
                                <p>There are no new job requests at the moment.</p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className={`transition-all duration-500 ${acceptedJobs.includes(job.id) ? 'opacity-0 transform translate-x-full' : 'opacity-100'}`}
                                >
                                    <Card padding hoverEffect className="animate-slide-up">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-xl mb-1 text-primary">{job.title}</h3>
                                                <div className="flex items-center gap-2 text-secondary text-sm">
                                                    <span>📍 {job.location}</span>
                                                    <span>•</span>
                                                    <span>{job.distance}</span>
                                                </div>
                                            </div>
                                            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-lg font-bold border border-green-100">
                                                {job.rate}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-secondary uppercase tracking-wider font-bold mb-1">Patient</p>
                                                    <p className="font-medium">{job.patient}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-secondary uppercase tracking-wider font-bold mb-1">Schedule</p>
                                                    <p className="font-medium">{job.schedule}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-secondary uppercase tracking-wider font-bold mb-1">Tasks</p>
                                                    <p className="font-medium">{job.tasks}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button fullWidth onClick={() => void handleAccept(job.id)}>Accept Job</Button>
                                            <Button fullWidth variant="outline" onClick={() => void handleDecline(job.id)}>Decline</Button>
                                        </div>
                                    </Card>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="animate-fade-in">
                        {loading ? (
                            <div className="text-center py-20 text-secondary">
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                                <h3 className="text-xl font-bold mb-2">Loading your schedule…</h3>
                            </div>
                        ) : scheduleJobs.length === 0 ? (
                            <div className="text-center py-20 text-secondary">
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                                <h3 className="text-xl font-bold mb-2">No Upcoming Jobs</h3>
                                <p>Accept new requests to fill your schedule.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {scheduleJobs.map((job) => (
                                    <Card key={job.id} padding hoverEffect className="animate-slide-up">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-xl mb-1 text-primary">Confirmed Visit</h3>
                                                <div className="flex items-center gap-2 text-secondary text-sm">
                                                    <span>📍 {job.location}</span>
                                                    <span>•</span>
                                                    <span>{job.distance}</span>
                                                </div>
                                            </div>
                                            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-lg font-bold border border-blue-100">
                                                {job.rate}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-secondary uppercase tracking-wider font-bold mb-1">Patient</p>
                                                    <p className="font-medium">{job.patient}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-secondary uppercase tracking-wider font-bold mb-1">Schedule</p>
                                                    <p className="font-medium">{job.schedule}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-secondary uppercase tracking-wider font-bold mb-1">Tasks</p>
                                                    <p className="font-medium">{job.tasks}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
