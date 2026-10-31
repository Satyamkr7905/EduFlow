import { CheckCircle2, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Reveal } from '../ui/Motion';

const STEPS = [
  { title: 'Tell us what you need', text: 'Submit a short inquiry — it takes under two minutes.' },
  { title: 'We route it to the right team', text: 'Scholarship, admission and event specialists pick it up.' },
  { title: 'You get a personal reply', text: 'Track progress from New → In Progress → Resolved.' },
];

const VALUES = [
  { icon: Clock, title: 'Fast responses', text: 'Most inquiries receive a personal reply within one working day.' },
  { icon: ShieldCheck, title: 'Private & secure', text: 'Your details are stored securely and only used to help you.' },
  { icon: HeartHandshake, title: 'Human support', text: 'Real counsellors, not bots — for parents, students and schools.' },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-xl4 bg-ink p-8 text-white shadow-lift sm:p-10">
              <div>
                <p className="text-sm font-medium text-sage">About EduFlow</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
                  A simpler way for families and schools to reach us.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                  EduFlow started with one idea: no question about a child&apos;s education should go
                  unanswered. Our inquiry desk brings every message into one place so counsellors can
                  respond quickly, track progress and make sure nothing slips through the cracks.
                </p>
              </div>
              <ol className="mt-10 space-y-4">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-heading text-sm font-semibold text-sage">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-white/60">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              const tones = ['bg-sage', 'bg-lavender', 'bg-sand'];
              return (
                <Reveal key={value.title} delay={i * 0.08}>
                  <div className="flex items-start gap-4 rounded-xl3 border border-line bg-white p-6 shadow-soft">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tones[i]}`}>
                      <Icon size={20} className="text-ink" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-semibold text-ink">{value.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{value.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
            <Reveal delay={0.25}>
              <div className="flex flex-wrap gap-2 rounded-xl3 bg-cream p-4">
                {['Scholarships', 'Admissions', 'Concerts', 'School partnerships', 'Counselling'].map((tag) => (
                  <span key={tag} className="pill bg-white text-ink shadow-soft">
                    <CheckCircle2 size={13} className="text-sage-dark" />
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
