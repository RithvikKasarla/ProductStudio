'use client';

import Link from 'next/link';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function BookingConfirmation() {
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
              <span className="text-primary font-semibold">Sarah Jenkins, RN</span>
            </div>
            <div className="flex justify-between text-sm text-secondary mb-2">
              <span>Date & time</span>
              <span className="text-primary font-semibold">Tomorrow • 9:00a – 1:00p</span>
            </div>
            <div className="flex justify-between text-sm text-secondary mb-2">
              <span>Location</span>
              <span className="text-primary font-semibold">10001 • Manhattan</span>
            </div>
            <div className="flex justify-between text-sm text-secondary mb-3">
              <span>Rate</span>
              <span>$45/hr</span>
            </div>
            <div className="flex justify-between font-bold text-primary text-lg pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>$180.00</span>
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
            <Link href="/user/matching" className="w-full">
              <Button fullWidth variant="outline">Message caregiver</Button>
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
