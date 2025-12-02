'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

type MobilityOption =
  | 'Walking independently'
  | 'Needs cane/walker'
  | 'Wheelchair'
  | 'Bedbound';

const TASK_OPTIONS = [
  'Meals',
  'Medication reminders',
  'Bathing',
  'Toileting',
  'Transfers',
  'Light housekeeping',
] as const;

const DAY_OPTIONS = ['Today', 'Tomorrow', 'Wed 15', 'Thu 16', 'Fri 17'] as const;

export default function IntakeFlow() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [whoNeedsCare, setWhoNeedsCare] = useState<string | null>(null);
  const [age, setAge] = useState<string>('');
  const [mobility, setMobility] = useState<MobilityOption | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] =
    useState<(typeof DAY_OPTIONS)[number]>('Tomorrow');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [hoursPerDay, setHoursPerDay] = useState<string>('');
  const [zip, setZip] = useState<string>('10001');

  const [intakeId, setIntakeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveIntake(partial: Partial<{
    whoNeedsCare: string;
    age: number;
    mobility: string;
    tasks: string[];
    hoursPerDay: number;
    zip: string;
    timeSlot: string;
  }>) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? 'Unable to save your intake. Please try again.');
        return null;
      }

      setIntakeId(data.intake.id as string);
      return data.intake as {
        id: string;
        whoNeedsCare?: string | null;
        age?: number | null;
        mobility?: string | null;
        tasks?: string[];
        hoursPerDay?: number | null;
        zip?: string | null;
        timeSlot?: string | null;
      };
    } catch {
      setError('Unexpected error. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Prefill from existing open intake if present
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const res = await fetch('/api/intake');
        if (!res.ok) return;
        const data = await res.json();
        const intake = data.intake as
          | {
            id: string;
            whoNeedsCare?: string | null;
            age?: number | null;
            mobility?: string | null;
            tasks?: string[];
            hoursPerDay?: number | null;
            zip?: string | null;
            timeSlot?: string | null;
          }
          | null;
        if (!intake) return;

        setIntakeId(intake.id);
        if (intake.whoNeedsCare) setWhoNeedsCare(intake.whoNeedsCare);
        if (typeof intake.age === 'number') setAge(String(intake.age));
        if (intake.mobility) setMobility(intake.mobility as MobilityOption);
        if (Array.isArray(intake.tasks)) setSelectedTasks(intake.tasks);
        if (typeof intake.hoursPerDay === 'number')
          setHoursPerDay(String(intake.hoursPerDay));
        if (intake.zip) setZip(intake.zip);

        if (intake.timeSlot) {
          // Try to parse "Day Start-End"
          // e.g. "Tomorrow 09:00-17:00"
          // or just "Tomorrow" (legacy)
          const parts = intake.timeSlot.split(' ');
          // Check if the first part is a known day option (might be multi-word like "Wed 15")
          // This is a bit fragile but works for MVP if format is consistent.
          // Actually DAY_OPTIONS has "Wed 15", so it's 2 words.

          // Let's try to find the day in the string.
          const foundDay = DAY_OPTIONS.find(d => intake.timeSlot?.startsWith(d));
          if (foundDay) {
            setSelectedDay(foundDay);
            const rest = intake.timeSlot.slice(foundDay.length).trim();
            if (rest) {
              const [s, e] = rest.split('-');
              if (s) setStartTime(s);
              if (e) setEndTime(e);
            }
          }
        }
      } catch {
        // fail silently; user can still complete intake
      }
    };

    void loadExisting();
  }, []);

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSelectWhoNeedsCare = async (option: string) => {
    setWhoNeedsCare(option);
    const saved = await saveIntake({ whoNeedsCare: option });
    if (saved) {
      setStep(2);
    }
  };

  const handleContinueFromDetails = async () => {
    const payload = {
      whoNeedsCare: whoNeedsCare ?? undefined,
      age: age ? Number(age) : undefined,
      mobility: mobility ?? undefined,
    };
    const saved = await saveIntake(payload);
    if (saved) {
      setStep(3);
    }
  };

  const handleToggleTask = (task: string) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task],
    );
  };

  const handleContinueFromTasks = async () => {
    const payload = {
      whoNeedsCare: whoNeedsCare ?? undefined,
      age: age ? Number(age) : undefined,
      mobility: mobility ?? undefined,
      tasks: selectedTasks,
    };
    const saved = await saveIntake(payload);
    if (saved) {
      setStep(4);
    }
  };

  const handleSeeMatches = async () => {
    const payload = {
      whoNeedsCare: whoNeedsCare ?? undefined,
      age: age ? Number(age) : undefined,
      mobility: mobility ?? undefined,
      tasks: selectedTasks,
      hoursPerDay: hoursPerDay ? Number(hoursPerDay) : undefined,
      zip: zip || undefined,
      timeSlot: `${selectedDay} ${startTime}-${endTime}`,
    };
    const saved = await saveIntake(payload);
    if (saved) {
      router.push(`/user/matching?intakeId=${saved.id}`);
    }
  };

  return (
    <main className="page-wrapper justify-center items-center bg-background py-10">
      <div className="container mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary text-sm font-bold uppercase tracking-wide">
              Step {step} of 4
            </span>
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
          {error && (
            <p className="text-sm text-error mb-4">
              {error}
            </p>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Who needs care?
              </h2>
              <p className="text-secondary mb-6 text-sm">
                We keep questions light—just enough to find the right caregiver.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {['Self', 'Parent', 'Spouse', 'Other Relative'].map((option) => (
                  <button
                    key={option}
                    className={`text-left p-5 rounded-2xl border bg-background transition-all hover:border-primary hover:shadow-sm flex items-center justify-between group ${whoNeedsCare === option
                        ? 'border-primary'
                        : 'border-border'
                      }`}
                    type="button"
                    disabled={loading}
                    onClick={() => void handleSelectWhoNeedsCare(option)}
                  >
                    <span className="font-bold text-lg text-primary">
                      {option}
                    </span>
                    <span className="text-secondary group-hover:text-primary transition-colors">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Care details
              </h2>
              <p className="text-secondary mb-6 text-sm">
                Comfort-first: only a couple inputs per screen.
              </p>
              <Input
                label="Age of care recipient"
                type="number"
                placeholder="e.g. 78"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <div className="mb-8">
                <label className="text-sm font-medium text-secondary block mb-3">
                  Mobility level
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Walking independently',
                    'Needs cane/walker',
                    'Wheelchair',
                    'Bedbound',
                  ].map((level) => (
                    <label
                      key={level}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all bg-background ${mobility === level ? 'border-primary' : 'border-border'
                        }`}
                    >
                      <input
                        type="radio"
                        name="mobility"
                        className="accent-primary w-5 h-5"
                        checked={mobility === level}
                        onChange={() =>
                          setMobility(level as MobilityOption)
                        }
                      />
                      <span className="font-medium text-primary">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  fullWidth
                  onClick={() => void handleContinueFromDetails()}
                  size="lg"
                  disabled={loading}
                >
                  Continue
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={handleBack}
                  size="lg"
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Care tasks
              </h2>
              <p className="text-secondary mb-6 text-sm">
                Pick what matters now. Everything else can be added later.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {TASK_OPTIONS.map((task) => (
                  <label
                    key={task}
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all bg-background ${selectedTasks.includes(task)
                        ? 'border-primary'
                        : 'border-border'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={selectedTasks.includes(task)}
                      onChange={() => handleToggleTask(task)}
                    />
                    <span className="font-medium text-sm text-primary">
                      {task}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  fullWidth
                  onClick={() => void handleContinueFromTasks()}
                  size="lg"
                  disabled={loading}
                >
                  Continue
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={handleBack}
                  size="lg"
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Schedule & location
              </h2>
              <p className="text-secondary mb-6 text-sm">
                Fast minicalendar + chips (no dropdowns).
              </p>
              <div className="mb-6">
                <label className="text-sm font-medium text-secondary block mb-3">
                  When do you need help?
                </label>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {DAY_OPTIONS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`px-5 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-all ${selectedDay === day
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-secondary border-border hover:border-primary/50'
                        }`}
                      onClick={() =>
                        setSelectedDay(day as (typeof DAY_OPTIONS)[number])
                      }
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-2">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-2">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                <Input
                  label="Hours needed"
                  type="number"
                  placeholder="4"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                />
              </div>

              <Input
                label="ZIP code"
                placeholder="10001"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />

              <div className="flex gap-3 mt-8">
                <Button
                  fullWidth
                  onClick={() => void handleSeeMatches()}
                  size="lg"
                  disabled={loading}
                >
                  See my matches
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={handleBack}
                  size="lg"
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}

