'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import Card from '../../../components/Card';

type Task = {
    id: string;
    description: string;
    completed: boolean;
    timestamp?: string;
};

export default function SessionSimulation() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', description: 'Arrive at patient home', completed: false },
        { id: '2', description: 'Check patient vitals', completed: false },
        { id: '3', description: 'Administer medication', completed: false },
        { id: '4', description: 'Assist with meal preparation', completed: false },
        { id: '5', description: 'Complete session notes', completed: false },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [sessionActive, setSessionActive] = useState(false);

    useEffect(() => {
        if (sessionActive && currentTaskIndex < tasks.length) {
            const timer = setTimeout(() => {
                setTasks((prev) => {
                    const newTasks = [...prev];
                    newTasks[currentTaskIndex] = {
                        ...newTasks[currentTaskIndex],
                        completed: true,
                        timestamp: new Date().toLocaleTimeString(),
                    };
                    return newTasks;
                });
                setCurrentTaskIndex((prev) => prev + 1);
            }, 3000); // Simulate 3 seconds per task

            return () => clearTimeout(timer);
        }
    }, [sessionActive, currentTaskIndex, tasks.length]);

    const handleStartSession = () => {
        setSessionActive(true);
    };

    const handleDownloadVideo = (taskId: string) => {
        // Trigger download of the dummy PNG
        const link = document.createElement('a');
        link.href = '/test-video-placeholder.png';
        link.download = `task-${taskId}-video-proof.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main className="page-wrapper bg-background py-8">
            <div className="container mx-auto max-w-2xl px-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">Live Session</h1>
                        <p className="text-secondary">Monitoring active care session.</p>
                    </div>
                    {!sessionActive && currentTaskIndex === 0 && (
                        <Button onClick={handleStartSession}>
                            Start Simulation
                        </Button>
                    )}
                    {currentTaskIndex === tasks.length && (
                        <Button variant="outline" onClick={() => router.push('/user/dashboard')}>
                            Return to Dashboard
                        </Button>
                    )}
                </div>

                <Card padding className="animate-slide-up">
                    <div className="space-y-6">
                        {tasks.map((task, index) => (
                            <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${task.completed
                                    ? 'bg-green-50 border-green-200'
                                    : index === currentTaskIndex && sessionActive
                                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                                        : 'bg-gray-50 border-gray-100 opacity-60'
                                }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${task.completed
                                            ? 'bg-green-500 text-white'
                                            : index === currentTaskIndex && sessionActive
                                                ? 'bg-blue-500 text-white animate-pulse'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {task.completed ? '✓' : index + 1}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${task.completed ? 'text-green-900' : 'text-gray-700'}`}>
                                            {task.description}
                                        </p>
                                        {task.timestamp && (
                                            <p className="text-xs text-green-700 mt-1">
                                                Completed at {task.timestamp}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {task.completed && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDownloadVideo(task.id)}
                                        className="text-xs"
                                    >
                                        Download Video
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </main>
    );
}
