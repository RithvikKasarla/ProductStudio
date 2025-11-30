'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

export default function ProfileSetup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'verifying' | 'success'>('idle');
    const [showOtherSpecialty, setShowOtherSpecialty] = useState(false);

    const handleFileUpload = () => {
        setUploadStatus('uploading');
        setTimeout(() => {
            setUploadStatus('verifying');
            setTimeout(() => {
                setUploadStatus('success');
            }, 2000);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push('/nurse/dashboard');
        }, 1500);
    };

    return (
        <main className="page-wrapper justify-center items-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className="container mx-auto animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="mb-6 text-center">
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Complete Your Profile</h1>
                    <p className="text-secondary">Verify your credentials to start accepting jobs.</p>
                </div>

                <Card padding className="animate-slide-up">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h3 className="font-bold mb-4 text-lg">Upload Documents</h3>

                            {uploadStatus === 'idle' && (
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all hover:border-primary cursor-pointer bg-gray-50"
                                    style={{ border: '2px dashed var(--color-border)', padding: '40px', borderRadius: 'var(--radius-md)', backgroundColor: '#f9f9f9' }}
                                    onClick={handleFileUpload}
                                >
                                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>📄</div>
                                    <p className="font-medium mb-2">Upload Government ID & License</p>
                                    <p className="text-secondary text-sm mb-4">Drag & drop or click to browse</p>
                                    <Button type="button" variant="outline" size="sm">Browse Files</Button>
                                </div>
                            )}

                            {uploadStatus === 'uploading' && (
                                <div className="p-8 text-center bg-gray-50 rounded-xl">
                                    <p className="font-medium mb-4">Uploading...</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '60%', backgroundColor: 'var(--color-primary)', transition: 'width 2s ease' }}></div>
                                    </div>
                                </div>
                            )}

                            {uploadStatus === 'verifying' && (
                                <div className="p-8 text-center bg-gray-50 rounded-xl">
                                    <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" style={{ borderTopColor: 'transparent' }}></div>
                                    <p className="font-medium text-primary">Verifying Credentials...</p>
                                    <p className="text-sm text-secondary mt-2">Checking with State Board...</p>
                                </div>
                            )}

                            {uploadStatus === 'success' && (
                                <div className="p-8 text-center bg-green-50 rounded-xl border border-green-100" style={{ backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                    <p className="font-bold text-success" style={{ color: 'var(--color-success)' }}>Documents Verified</p>
                                    <p className="text-sm text-secondary">License #RN-12345678 verified active.</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold mb-4 text-lg">Experience & Skills</h3>
                            <Input label="Years of Experience" type="number" placeholder="e.g. 5" />

                            <div className="mb-4">
                                <label className="text-sm font-medium text-secondary block mb-3">Specialties</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Dementia Care', 'Post-Op', 'Wound Care', 'Physical Therapy', 'Palliative Care'].map(skill => (
                                        <label key={skill} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:border-primary transition-all shadow-sm">
                                            <input type="checkbox" className="accent-primary" />
                                            <span className="text-sm font-medium">{skill}</span>
                                        </label>
                                    ))}
                                    <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:border-primary transition-all shadow-sm">
                                        <input
                                            type="checkbox"
                                            className="accent-primary"
                                            checked={showOtherSpecialty}
                                            onChange={(e) => setShowOtherSpecialty(e.target.checked)}
                                        />
                                        <span className="text-sm font-medium">Other</span>
                                    </label>
                                </div>

                                {showOtherSpecialty && (
                                    <div className="mt-4 animate-fade-in">
                                        <Input label="Please specify other specialties" placeholder="e.g. Pediatric Care, Oncology..." />
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button fullWidth type="submit" disabled={loading || uploadStatus !== 'success'} loading={loading} size="lg">
                            {loading ? 'Finalizing Profile...' : 'Complete Setup'}
                        </Button>
                    </form>
                </Card>
            </div>
        </main>
    );
}
