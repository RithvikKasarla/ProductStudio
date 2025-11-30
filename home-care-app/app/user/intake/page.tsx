'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

export default function IntakeFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      router.push('/user/matching');
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <main className="page-wrapper justify-center items-center bg-background py-10">
      <div className="container mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary text-sm font-bold uppercase tracking-wide">Step {step} of 4</span>
            <span className="text-secondary text-sm">0:42 / ~2 minutes</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card padding className="animate-slide-up">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">Who needs care?</h2>
              <p className="text-secondary mb-6 text-sm">We keep questions light—just enough to find the right caregiver.</p>
              <div className="grid grid-cols-1 gap-3">
                {['Self', 'Parent', 'Spouse', 'Other Relative'].map((option) => (
                  <button
                    key={option}
                    className="text-left p-5 rounded-2xl border border-border bg-background transition-all hover:border-primary hover:shadow-sm flex items-center justify-between group"
                    onClick={handleNext}
                  >
                    <span className="font-bold text-lg text-primary">{option}</span>
                    <span className="text-secondary group-hover:text-primary transition-colors">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">Care details</h2>
              <p className="text-secondary mb-6 text-sm">Comfort-first: only a couple inputs per screen.</p>
              <Input label="Age of care recipient" type="number" placeholder="e.g. 78" />

              <div className="mb-8">
                <label className="text-sm font-medium text-secondary block mb-3">Mobility level</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Walking independently', 'Needs cane/walker', 'Wheelchair', 'Bedbound'].map((level) => (
                    <label key={level} className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-primary transition-all bg-background">
                      <input type="radio" name="mobility" className="accent-primary w-5 h-5" />
                      <span className="font-medium text-primary">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button fullWidth onClick={handleNext} size="lg">Continue</Button>
                <Button fullWidth variant="outline" onClick={handleBack} size="lg">Back</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">Care tasks</h2>
              <p className="text-secondary mb-6 text-sm">Pick what matters now. Everything else can be added later.</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['Meals', 'Medication reminders', 'Bathing', 'Toileting', 'Transfers', 'Light housekeeping'].map((task) => (
                  <label key={task} className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-primary transition-all bg-background">
                    <input type="checkbox" className="accent-primary w-4 h-4" />
                    <span className="font-medium text-sm text-primary">{task}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button fullWidth onClick={handleNext} size="lg">Continue</Button>
                <Button fullWidth variant="outline" onClick={handleBack} size="lg">Back</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">Schedule & location</h2>
              <p className="text-secondary mb-6 text-sm">Fast minicalendar + chips (no dropdowns).</p>
              <div className="mb-6">
                <label className="text-sm font-medium text-secondary block mb-3">When do you need help?</label>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {['Today', 'Tomorrow', 'Wed 15', 'Thu 16', 'Fri 17'].map((day, i) => (
                    <button key={day} className={`px-5 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-all ${i === 1 ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-secondary border-border hover:border-primary/50'}`}>
                      {day}
                    </button>
                  ))}
                </div>
                <Input label="Hours needed" type="number" placeholder="4" />
              </div>

              <Input label="ZIP code" placeholder="10001" defaultValue="10001" />

              <div className="flex gap-3 mt-8">
                <Button fullWidth onClick={handleNext} size="lg">See my matches</Button>
                <Button fullWidth variant="outline" onClick={handleBack} size="lg">Back</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
