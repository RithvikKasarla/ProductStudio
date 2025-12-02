'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '../../components/Button';
import Card from '../../components/Card';

type BookingDetails = {
  id: string;
  caregiverProfile: {
    user: {
      name: string;
    };
    caregiverType: string;
  };
  startTime: string;
  endTime: string;
  intake: {
    zip: string;
  };
  hourlyRateCents: number;
  totalPriceCents: number;
};

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(!!bookingId);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data.booking);
        }
      } catch (e) {
        console.error('Failed to fetch booking', e);
      } finally {
        setLoading(false);
      }
    };

    void fetchBooking();
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString(undefined, { weekday: 'long' });
    const timeStart = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    // Calculate end time or use provided end time
    return { day, timeStart };
  };

  const formatEndTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Default values if loading or not found (fallback to static for now to avoid breaking UI completely if ID missing)
  const caregiverName = booking ? `${booking.caregiverProfile.user.name}, ${booking.caregiverProfile.caregiverType}` : '';
  const location = booking ? `${booking.intake.zip || '10001'} • NYC` : '';
  const rate = booking ? `$${(booking.hourlyRateCents / 100).toFixed(0)}/hr` : '';
  const total = booking ? `$${(booking.totalPriceCents / 100).toFixed(2)}` : '';

  let dateDisplay = '';
  if (booking) {
    const { day, timeStart } = formatDate(booking.startTime);
    const timeEnd = formatEndTime(booking.endTime);
    dateDisplay = `${day} • ${timeStart} – ${timeEnd}`;
  }

  if (loading) {
    return (
      <main className="page-wrapper justify-center items-center bg-background py-10">
        <div className="container mx-auto max-w-lg text-center">
          <p className="text-secondary">Loading booking details...</p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="page-wrapper justify-center items-center bg-background py-10">
        <div className="container mx-auto max-w-lg text-center">
          <p className="text-error">Booking not found.</p>
          <Link href="/user/dashboard">
            <Button variant="outline" className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper justify-center items-center bg-background py-10">
      <div className="container mx-auto max-w-lg">
        <Card padding className="text-left animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-2xl">✅</div>
            <div>
              <p className="text-sm text-secondary uppercase font-bold tracking-wide">Booking confirmed</p>
              <h1 className="text-2xl font-bold text-primary">Everything is set.</h1>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-border mb-8">
            <div className="flex justify-between text-sm text-secondary mb-2">
              <span>Caregiver</span>
              <span className="text-primary font-semibold">{caregiverName}</span>
            </div>
            <div className="flex justify-between text-sm text-secondary mb-2">
              <span>Date & time</span>
              <span className="text-primary font-semibold">{dateDisplay}</span>
            </div>
            <div className="flex justify-between text-sm text-secondary mb-2">
              <span>Location</span>
              <span className="text-primary font-semibold">{location}</span>
            </div>
            <div className="flex justify-between text-sm text-secondary mb-3">
              <span>Rate</span>
              <span>{rate}</span>
            </div>
            <div className="flex justify-between font-bold text-primary text-lg pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>

          <p className="text-secondary text-sm mb-6 leading-relaxed">Caregiver will confirm within 10 minutes. You will see live status updates below—no extra alerts unless something changes.</p>

          <div className="space-y-0 mb-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-[7px] top-2 bottom-6 w-0.5 bg-border -z-10"></div>

            {[
              { label: 'Caregiver en route', time: '9:05 AM', state: 'done' },
              { label: 'Caregiver arrived', time: '9:22 AM', state: 'active' },
              { label: 'Session in progress', time: '—', state: 'pending' },
              { label: 'Session completed', time: '—', state: 'pending' }
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 pb-6 last:pb-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 mt-0.5 z-10 box-content ${item.state === 'done' ? 'bg-accent border-accent' :
                    item.state === 'active' ? 'bg-primary border-primary' :
                      'bg-white border-border'
                    }`}
                />
                <div className="flex-1 flex justify-between items-start">
                  <p className={`text-sm font-semibold ${item.state === 'pending' ? 'text-secondary' : 'text-primary'}`}>{item.label}</p>
                  <span className="text-xs text-secondary">{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link href="/user/dashboard" className="w-full">
              <Button fullWidth variant="outline">View My Bookings</Button>
            </Link>
            <Link href="/" className="w-full">
              <Button fullWidth>Return home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
