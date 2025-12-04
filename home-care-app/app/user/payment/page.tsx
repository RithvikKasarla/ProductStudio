'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/Button';
import Card from '../../components/Card';

function PaymentPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [saveCard, setSaveCard] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Booking summary (would come from API in real implementation)
    const [bookingDetails, setBookingDetails] = useState({
        caregiverName: 'Loading...',
        caregiverType: '',
        date: '',
        hours: 4,
        hourlyRate: 60,
        serviceFee: 15,
    });

    useEffect(() => {
        // Simulate fetching booking details
        const fetchDetails = async () => {
            if (bookingId) {
                try {
                    const res = await fetch(`/api/bookings/${bookingId}`);
                    if (res.ok) {
                        const data = await res.json();
                        const booking = data.booking;
                        const start = new Date(booking.startTime);
                        const end = new Date(booking.endTime);
                        const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));

                        setBookingDetails({
                            caregiverName: booking.caregiverProfile.user.name,
                            caregiverType: booking.caregiverProfile.caregiverType,
                            date: start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
                            hours: hours || 4,
                            hourlyRate: booking.hourlyRateCents / 100,
                            serviceFee: 15,
                        });
                    }
                } catch {
                    // Fall back to defaults
                }
            }
        };
        void fetchDetails();
    }, [bookingId]);

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    // Format expiry date
    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.replace(/\s/g, '').length <= 16) {
            setCardNumber(formatted);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiry(e.target.value.replace('/', ''));
        if (formatted.replace('/', '').length <= 4) {
            setExpiry(formatted);
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value.replace(/[^0-9]/gi, '');
        if (v.length <= 4) {
            setCvv(v);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Navigate to confirmation
        if (bookingId) {
            router.push(`/user/confirmation?bookingId=${bookingId}`);
        } else {
            router.push('/user/confirmation');
        }
    };

    const subtotal = bookingDetails.hourlyRate * bookingDetails.hours;
    const total = subtotal + bookingDetails.serviceFee;

    // Determine card type icon
    const getCardIcon = () => {
        const num = cardNumber.replace(/\s/g, '');
        if (num.startsWith('4')) return '💳'; // Visa
        if (num.startsWith('5')) return '💳'; // Mastercard
        if (num.startsWith('3')) return '💳'; // Amex
        return '💳';
    };

    return (
        <main className="page-wrapper bg-background py-10">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Payment Form - Left Side */}
                    <div className="md:col-span-3">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-primary mb-2">Complete your booking</h1>
                            <p className="text-secondary">Enter your payment details to confirm</p>
                        </div>

                        <Card padding className="animate-slide-up">
                            <form onSubmit={handleSubmit}>
                                {/* Payment Method Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-primary">Payment Method</h2>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                        <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                                            <div className="w-3 h-3 bg-red-600 rounded-full opacity-80"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1 opacity-80"></div>
                                        </div>
                                        <div className="w-10 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
                                    </div>
                                </div>

                                {/* Card Number */}
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-secondary block mb-2">
                                        Card Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg tracking-wider"
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                                            {getCardIcon()}
                                        </span>
                                    </div>
                                </div>

                                {/* Cardholder Name */}
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-secondary block mb-2">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="John Smith"
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Expiry & CVV */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="text-sm font-medium text-secondary block mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={handleExpiryChange}
                                            placeholder="MM/YY"
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center tracking-wider"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-secondary block mb-2">
                                            CVV
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={cvv}
                                                onChange={handleCvvChange}
                                                placeholder="•••"
                                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center tracking-wider"
                                                required
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                                                🔒
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Card Checkbox */}
                                <label className="flex items-center gap-3 mb-8 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={saveCard}
                                        onChange={(e) => setSaveCard(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                                    />
                                    <span className="text-sm text-secondary">Save card for future bookings</span>
                                </label>

                                {/* Security Notice */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                                    <span className="text-xl">🔐</span>
                                    <div>
                                        <p className="text-sm font-medium text-primary">Your payment is secure</p>
                                        <p className="text-xs text-secondary">256-bit SSL encryption protects your information</p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    fullWidth
                                    size="lg"
                                    type="submit"
                                    disabled={processing || !cardNumber || !cardName || !expiry || !cvv}
                                    loading={processing}
                                >
                                    {processing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
                                </Button>

                                <p className="text-center text-xs text-secondary mt-4">
                                    By completing this payment, you agree to our Terms of Service
                                </p>
                            </form>
                        </Card>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="md:col-span-2">
                        <Card padding className="animate-slide-up sticky top-6">
                            <h2 className="text-lg font-bold text-primary mb-4">Booking Summary</h2>

                            {/* Caregiver Info */}
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xl">👩‍⚕️</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-primary">{bookingDetails.caregiverName}</p>
                                    <p className="text-sm text-secondary">{bookingDetails.caregiverType}</p>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-secondary">
                                    <span>📅</span>
                                    <span>{bookingDetails.date || 'Tomorrow'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-secondary mt-1">
                                    <span>⏱️</span>
                                    <span>{bookingDetails.hours} hours</span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="py-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">
                                        ${bookingDetails.hourlyRate}/hr × {bookingDetails.hours} hrs
                                    </span>
                                    <span className="text-primary">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Service fee</span>
                                    <span className="text-primary">${bookingDetails.serviceFee.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-primary">Total</span>
                                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-secondary mt-2">
                                    You won&apos;t be charged until the visit is complete
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-secondary mb-2">
                                    <span>✓</span>
                                    <span>Free cancellation up to 2 hours before</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-secondary mb-2">
                                    <span>✓</span>
                                    <span>Verified & background-checked caregiver</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-secondary">
                                    <span>✓</span>
                                    <span>24/7 support available</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <main className="page-wrapper justify-center items-center bg-background py-10">
                <div className="container mx-auto max-w-lg text-center">
                    <p className="text-secondary">Loading payment...</p>
                </div>
            </main>
        }>
            <PaymentPageContent />
        </Suspense>
    );
}
