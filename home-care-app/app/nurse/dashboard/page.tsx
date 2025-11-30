'use client';

import React, { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function NurseDashboard() {
    const [activeTab, setActiveTab] = useState('requests');
    const [jobs, setJobs] = useState([
        {
            id: 1,
            title: 'Short-term Care Needed',
            location: 'Manhattan, NY (Upper West Side)',
            rate: '$30/hr',
            patient: '78yo Female, Mobility Assistance',
            schedule: 'Tomorrow, 9:00 AM - 1:00 PM',
            tasks: 'Meal Prep, Medication, Companionship',
            distance: '1.2 miles'
        },
        {
            id: 2,
            title: 'Post-Op Recovery Support',
            location: 'Brooklyn, NY (Williamsburg)',
            rate: '$35/hr',
            patient: '45yo Male, Knee Surgery Recovery',
            schedule: 'Nov 12 - Nov 14, 2:00 PM - 6:00 PM',
            tasks: 'Mobility, Physical Therapy Exercises',
            distance: '3.5 miles'
        },
        {
            id: 3,
            title: 'Weekend Companion',
            location: 'Queens, NY (Astoria)',
            rate: '$28/hr',
            patient: '82yo Male, Mild Dementia',
            schedule: 'Sat & Sun, 10:00 AM - 4:00 PM',
            tasks: 'Companionship, Light Housekeeping',
            distance: '4.0 miles'
        },
        {
            id: 4,
            title: 'Overnight Monitoring',
            location: 'Manhattan, NY (Tribeca)',
            rate: '$40/hr',
            patient: '60yo Female, Post-Hospitalization',
            schedule: 'Tonight, 8:00 PM - 8:00 AM',
            tasks: 'Vitals Monitoring, Assistance',
            distance: '2.1 miles'
        },
        {
            id: 5,
            title: 'Daily Living Assistance',
            location: 'Brooklyn, NY (Park Slope)',
            rate: '$32/hr',
            patient: '70yo Female, Arthritis',
            schedule: 'Mon-Fri, 9:00 AM - 12:00 PM',
            tasks: 'Bathing, Dressing, Meal Prep',
            distance: '2.8 miles'
        }
    ]);
    const [acceptedJobs, setAcceptedJobs] = useState<number[]>([]);

    const handleAccept = (id: number) => {
        setAcceptedJobs([...acceptedJobs, id]);
        setTimeout(() => {
            setJobs(jobs.filter(job => job.id !== id));
        }, 600); // Wait for animation
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
                        {jobs.length === 0 ? (
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
                                            <Button fullWidth onClick={() => handleAccept(job.id)}>Accept Job</Button>
                                            <Button fullWidth variant="outline">Decline</Button>
                                        </div>
                                    </Card>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="text-center py-20 text-secondary animate-fade-in">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                        <h3 className="text-xl font-bold mb-2">No Upcoming Jobs</h3>
                        <p>Accept new requests to fill your schedule.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
