import Link from 'next/link';
import Button from './components/Button';
import Card from './components/Card';
import TrustBadge from './components/TrustBadge';

export default function Home() {
  return (
    <main className="page-wrapper">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 bg-gradient-to-b from-background to-[#EDF1F4]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(900px_at_20%_20%,rgba(168,230,207,0.18),transparent),radial-gradient(800px_at_90%_10%,rgba(248,196,113,0.16),transparent)]" />
        <div className="container mx-auto relative grid md:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#F8C471]/18 text-[#8a5b18] tracking-wide">
              🛡️ Trust-first home care, NYC
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-primary tracking-tight">
              Home health care that feels like family—booked in under 2 minutes.
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-xl leading-relaxed">
              We pair families with verified, background-checked caregivers. Clear pricing, gentle design, and constant visit visibility.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/user/intake">
                <Button size="lg">Find Care Now</Button>
              </Link>
              <Link href="/nurse/signup">
                <Button variant="secondary" size="lg">Apply as a Caregiver</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { label: 'Verified caregivers', value: '100%' },
                { label: 'Avg. response', value: '< 9 min' },
                { label: 'Background + license', value: 'Always confirmed' },
                { label: 'Booking time', value: '~1:45' }
              ].map((stat) => (
                <div key={stat.label} className="glass-panel rounded-xl px-4 py-3">
                  <p className="text-xs text-secondary uppercase tracking-wide font-semibold">{stat.label}</p>
                  <p className="text-lg font-bold text-primary">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 -top-6 w-20 h-20 rounded-full bg-accent blur-[45px] opacity-50" />
            <Card padding className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-secondary">Progress</p>
                  <h3 className="text-xl font-bold text-primary">0:42 / ~2 minutes</h3>
                </div>
                <TrustBadge label="Amber verified" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=23395B&color=fff" alt="Nurse" />
                </div>
                <div>
                  <p className="text-sm text-secondary">Top match</p>
                  <p className="font-bold text-lg text-primary">Sarah Jenkins, RN</p>
                  <p className="text-sm text-secondary">Verified • Background Checked • License Confirmed</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xl font-bold text-primary">$45/hr</p>
                  <p className="text-xs text-secondary">1.2 miles away</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary">Who needs care?</p>
                    <span className="text-secondary text-sm">Self</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary">Schedule</p>
                    <span className="text-secondary text-sm">Tomorrow • 9a-1p</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary">Care tasks</p>
                    <span className="text-secondary text-sm">Meals • Medication • Transfers</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button fullWidth size="sm">Continue intake</Button>
                <Button fullWidth size="sm" variant="outline">See matches</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-3">Comfort-first, informative, never overwhelming</h2>
            <p className="text-secondary">We keep everything in small cards and clear steps so families can book care without stress.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Quick intake',
                body: '4 steps, < 2 minutes. Clear progress bar and minimal fields each screen.',
                icon: '⏱️'
              },
              {
                title: 'Trust-forward matching',
                body: 'Verification and license status appear before price. Skill match and distance are surfaced immediately.',
                icon: '🛡️'
              },
              {
                title: 'Transparent confirmation',
                body: 'Plain language breakdown, ETA expectations, and live visit statuses: en route → arrived → in session → complete.',
                icon: '✅'
              }
            ].map((item) => (
              <Card key={item.title} padding hoverEffect className="text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-accent/30">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">{item.title}</h3>
                <p className="text-secondary leading-relaxed">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="section bg-[#F4F6F8]">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Matches you can trust</h2>
              <p className="text-secondary">We show only 3–5 caregivers who fit best. Verification comes first, price comes last.</p>
            </div>
            <Link href="/user/matching" className="text-primary font-bold hover:underline">
              View all matches →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Jenkins', role: 'RN', experience: '8 yrs', match: 'High', languages: 'EN / ES', distance: '1.2 mi', rate: '$45/hr', image: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=23395B&color=fff' },
              { name: 'David Chen', role: 'CNA', experience: '5 yrs', match: 'High', languages: 'EN / CN', distance: '0.8 mi', rate: '$32/hr', image: 'https://ui-avatars.com/api/?name=David+Chen&background=CBD3D9&color=23395B' },
              { name: 'Maria Rodriguez', role: 'HHA', experience: '6 yrs', match: 'Medium', languages: 'EN / ES', distance: '2.0 mi', rate: '$30/hr', image: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=A8E6CF&color=23395B' }
            ].map((nurse) => (
              <Card key={nurse.name} padding hoverEffect>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-white shadow-sm">
                    <img src={nurse.image} alt={nurse.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-primary">{nurse.name}</h3>
                      <TrustBadge label="Verified" />
                    </div>
                    <p className="text-secondary text-sm">{nurse.role} • {nurse.experience}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{nurse.rate}</p>
                    <p className="text-xs text-secondary">{nurse.distance}</p>
                  </div>
                </div>

                <div className="text-sm text-secondary mb-3">
                  Verified • Background Checked • License Confirmed
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EEF4] text-[#23395B]">Match: {nurse.match}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/35 text-[#1f6c4a]">Languages: {nurse.languages}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F9F2E9] text-[#8a5b18]">Near you</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button fullWidth size="sm">Book</Button>
                  <Button fullWidth size="sm" variant="outline">View Profile</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visibility Section */}
      <section className="section bg-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Visit visibility without feeling watched</h2>
            <p className="text-secondary mb-6">
              Simple, timestamped statuses let families know what is happening without extra pings. Comforting, not surveillance.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Caregiver en route', time: '9:05 AM', status: 'complete' },
                { label: 'Caregiver arrived', time: '9:22 AM', status: 'complete' },
                { label: 'Session in progress', time: '9:25 AM', status: 'active' },
                { label: 'Session completed', time: '1:05 PM', status: 'pending' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${item.status === 'complete' ? 'border-accent bg-accent' :
                      item.status === 'active' ? 'border-primary bg-primary' :
                        'border-border bg-white'
                      }`}
                  />
                  <div className="flex-1 border-b border-dashed border-border"></div>
                  <div className="w-56 flex justify-between items-center">
                    <p className="text-sm font-semibold text-primary">{item.label}</p>
                    <span className="text-xs text-secondary">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card padding>
            <p className="text-sm text-secondary mb-2">Confirmation</p>
            <h3 className="text-2xl font-bold text-primary mb-4">Everything looks good. Ready to book?</h3>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm text-secondary mb-2">
                <span>Hourly</span>
                <span>$45</span>
              </div>
              <div className="flex justify-between text-sm text-secondary mb-2">
                <span>Estimated hours</span>
                <span>4</span>
              </div>
              <div className="flex justify-between font-bold text-primary text-lg">
                <span>Total today</span>
                <span>$180</span>
              </div>
            </div>
            <p className="text-sm text-secondary mb-4">Caregiver will confirm within 10 minutes. You can chat or adjust schedule anytime.</p>
            <div className="flex gap-3">
              <Button fullWidth>Confirm booking</Button>
              <Button fullWidth variant="outline">Edit details</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold mb-2">Ready to feel reassured?</h3>
            <p className="text-blue-100 text-lg">Soft neutrals, clear steps, and verified caregivers make booking care feel calm.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/user/intake">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Start Intake</Button>
            </Link>
            <Link href="/nurse/signup">
              <Button size="lg" variant="secondary" className="bg-white/15 text-white border border-white/30 hover:bg-white/25">
                Join as Caregiver
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
