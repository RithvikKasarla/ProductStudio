'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import Card from '../../../components/Card';

type Task = {
    id: string;
    description: string;
    completed: boolean;
    proofUploaded: boolean;
    timestamp?: string;
};

type BookingDetails = {
    id: string;
    patientName: string;
    tasks: string[];
};

export default function NurseSession() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`/api/bookings/${params.id}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data?.error ?? 'Unable to load session details.');
                    return;
                }

                const b = data.booking;
                setBooking({
                    id: b.id,
                    patientName: b.intake.whoNeedsCare,
                    tasks: b.intake.tasks,
                });

                // Initialize tasks
                setTasks(
                    (b.intake.tasks as string[]).map((t, i) => ({
                        id: `task-${i}`,
                        description: t,
                        completed: false,
                        proofUploaded: false,
                    }))
                );
            } catch {
                setError('Unexpected error loading session.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            void fetchBooking();
        }
    }, [params.id]);

    const handleUploadProof = (taskId: string) => {
        setUploadingId(taskId);
        // Simulate upload delay
        setTimeout(() => {
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskId ? { ...t, proofUploaded: true } : t
                )
            );
            setUploadingId(null);
        }, 1500);
    };

    const handleToggleTask = (taskId: string) => {
        setTasks((prev) =>
            prev.map((t) => {
                if (t.id === taskId) {
                    // Only allow checking if proof is uploaded
                    if (!t.proofUploaded && !t.completed) return t;

                    return {
                        ...t,
                        completed: !t.completed,
                        timestamp: !t.completed ? new Date().toLocaleTimeString() : undefined,
                    };
                }
                return t;
            })
        );
    };

    const handleCompleteSession = async () => {
        // In a real app, we would update the booking status to COMPLETED here
        // For MVP, just redirect
        router.push('/nurse/dashboard');
    };

    const allTasksCompleted = tasks.length > 0 && tasks.every((t) => t.completed);

    if (loading) {
        return (
            <main className="page-wrapper bg-background py-8">
                <div className="container mx-auto max-w-2xl px-6 text-center text-secondary">
                    Loading session...
                </div>
            </main>
        );
    }

    if (error || !booking) {
        return (
            <main className="page-wrapper bg-background py-8">
                <div className="container mx-auto max-w-2xl px-6 text-center text-error">
                    {error ?? 'Session not found.'}
                </div>
            </main>
        );
    }

    return (
        <main className="page-wrapper bg-background py-8">
            <div className="container mx-auto max-w-2xl px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Active Session</h1>
                    <p className="text-secondary">
                        Patient: <span className="font-semibold text-primary">{booking.patientName}</span>
                    </p>
                </div>

                <Card padding className="animate-slide-up">
                    <div className="space-y-6">
                        {tasks.map((task, index) => (
                            <div
                                key={task.id}
                                className={`p-4 rounded-xl border transition-all duration-300 ${task.completed
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${task.completed
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {index + 1}
                                        </div>
                                        <span className={`font-medium ${task.completed ? 'text-green-900' : 'text-gray-900'}`}>
                                            {task.description}
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleTask(task.id)}
                                        disabled={!task.proofUploaded}
                                        className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                                    />
                                </div>

                                <div className="pl-11">
                                    {!task.proofUploaded ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleUploadProof(task.id)}
                                            disabled={uploadingId === task.id}
                                            className="text-xs"
                                        >
                                            {uploadingId === task.id ? 'Uploading...' : '📷 Upload Proof'}
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-green-700">
                                            <span>✓ Proof uploaded</span>
                                            {task.timestamp && <span>• Completed at {task.timestamp}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <Button
                            fullWidth
                            onClick={handleCompleteSession}
                            disabled={!allTasksCompleted}
                            className={allTasksCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {allTasksCompleted ? 'Complete Session' : 'Complete All Tasks to Finish'}
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}
