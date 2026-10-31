import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Award, BookOpen, HelpCircle, Music } from 'lucide-react';
import { Reveal } from '../ui/Motion';

const PROGRAMS = [
  {
    icon: Award,
    title: 'Scholarships',
    category: 'Scholarship',
    tone: 'bg-sage',
    text: 'Merit and need-based scholarships for students at every stage. We guide families through eligibility, documents and deadlines.',
  },
  {
    icon: BookOpen,
    title: 'Admissions',
    category: 'Admission',
    tone: 'bg-lavender',
    text: 'Personalised admission support — from choosing the right program to interview preparation and enrolment.',
  },
  {
    icon: Music,
    title: 'Concerts & Events',
    category: 'Concert',
    tone: 'bg-coral text-white',
    text: 'Seasonal concerts, showcases and school festivals that celebrate our learners. Reserve seats or bring your school.',
  },
  {
    icon: HelpCircle,
    title: 'General Guidance',
    category: 'General Query',
    tone: 'bg-sand',
    text: 'Not sure where to start? Ask us anything about programs, fees, schedules or partnerships.',
  },
];

export default function Programs() {
  return (
    <section id="programs" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-coral">Programs</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-ink sm:text-4xl">
              Everything you can reach out about
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Pick the program that fits and submit an inquiry — we route it to the right team member
            automatically.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((program, index) => {
            const Icon = program.icon;
            const dark = program.tone.includes('text-white');
            return (
              <Reveal key={program.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`group flex h-full flex-col justify-between rounded-xl3 p-6 shadow-soft ${program.tone}`}
                >
                  <div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        dark ? 'bg-white/20' : 'bg-white/70'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-semibold">{program.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-white/80' : 'text-ink/70'}`}>
                      {program.text}
                    </p>
                  </div>
                  <Link
                    to={`/inquire?category=${encodeURIComponent(program.category)}`}
                    className={`mt-6 inline-flex items-center gap-1.5 text-sm font-medium ${
                      dark ? 'text-white' : 'text-ink'
                    }`}
                  >
                    Ask about this
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
