import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, GraduationCap, Sparkles, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { fadeUp, stagger } from '../ui/Motion';

/* Decorative dot-matrix inspired by the reference dashboard's dark card */
const COLUMNS = [3, 5, 2, 6, 4, 7, 3, 5, 6, 4, 2, 5];
const DOT_TONES = ['bg-sage', 'bg-lavender', 'bg-coral', 'border border-white/30'];

function DotMatrix() {
  return (
    <div className="flex items-end gap-2">
      {COLUMNS.map((height, col) => (
        <div key={col} className="flex flex-col-reverse gap-2">
          {Array.from({ length: height }).map((_, row) => {
            const tone = row < height - 2 ? DOT_TONES[(col + row) % 3] : DOT_TONES[3];
            return (
              <motion.span
                key={row}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + col * 0.04 + row * 0.03, type: 'spring', stiffness: 300, damping: 20 }}
                className={`h-4 w-4 rounded-full sm:h-5 sm:w-5 ${tone}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-sage/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-lavender/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <motion.div variants={stagger(0.1)} initial="hidden" animate="show" className="relative">
          <motion.div variants={fadeUp} className="pill mb-6 bg-white text-ink shadow-soft">
            <Sparkles size={14} className="text-coral" />
            Admissions, scholarships & events — one place
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance font-heading text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
          >
            Let&apos;s Build a <span className="text-coral">Brighter</span> Future Together.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            EduFlow helps families, students and partner schools discover the right programs,
            apply for scholarships and stay connected with our team. Tell us what you need — a real
            person will get back to you within one working day.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/inquire">
              <Button size="lg" iconRight={ArrowUpRight} className="w-full sm:w-auto">
                Submit an Inquiry
              </Button>
            </Link>
            <a href="#programs">
              <Button size="lg" variant="secondary" iconRight={ArrowRight} className="w-full sm:w-auto">
                Explore Programs
              </Button>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-2">
              <GraduationCap size={16} className="text-ink" /> K-12 to higher education
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-ink" /> Parents, students & schools
            </span>
          </motion.div>
        </motion.div>

        {/* Illustration composition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto grid w-full max-w-xl grid-cols-[1.5fr_1fr] grid-rows-[auto_auto] gap-4"
        >
          <motion.div
            whileHover={{ y: -4 }}
            className="row-span-2 flex flex-col justify-between overflow-hidden rounded-xl4 bg-ink p-6 text-white shadow-lift sm:p-8"
          >
            <div>
              <p className="font-heading text-xl font-medium text-white/70">Every learner</p>
              <p className="font-heading text-3xl font-semibold sm:text-4xl">Deserves a path</p>
            </div>
            <div className="mt-10 overflow-hidden">
              <DotMatrix />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-xl3 bg-sand p-5 shadow-soft"
          >
            <p className="text-xs font-medium text-muted">Inquiry response</p>
            <p className="mt-1 font-heading text-3xl font-semibold text-ink">&lt;24h</p>
            <div className="mt-4 flex items-end gap-1.5">
              {[30, 55, 40, 75, 60, 90].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 0.5}px` }}
                  transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
                  className={`w-full rounded-full ${i === 5 ? 'bg-coral' : 'bg-white'}`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-xl3 bg-sage p-5 shadow-soft"
          >
            <p className="text-xs font-medium text-ink/70">Programs</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-ink">Scholarships · Admissions · Events</p>
            <div className="mt-4 flex -space-x-2">
              {['bg-coral', 'bg-lavender', 'bg-ink', 'bg-white'].map((c, i) => (
                <span key={i} className={`h-8 w-8 rounded-full border-2 border-sage ${c}`} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
