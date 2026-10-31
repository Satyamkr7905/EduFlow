import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MessageSquareText, ShieldCheck } from 'lucide-react';
import InquiryForm from '../../components/public/InquiryForm';
import { PageTransition, fadeUp, stagger } from '../../components/ui/Motion';

const PERKS = [
  { icon: Clock, text: 'Reply within one working day' },
  { icon: ShieldCheck, text: 'Your details stay private' },
  { icon: MessageSquareText, text: 'Real people, real answers' },
];

export default function Inquire() {
  const [params] = useSearchParams();
  const defaultCategory = params.get('category') || '';

  return (
    <PageTransition>
      <section className="relative px-4 py-10 sm:px-6 sm:py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-sage/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="mx-auto mb-10 max-w-2xl text-center">
            <motion.p variants={fadeUp} className="text-sm font-medium text-coral">
              Submit an inquiry
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-5xl">
              Tell us how we can help.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              Whether you&apos;re a parent, a student or a school, fill in the form below and the right
              member of our team will get in touch.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl rounded-xl4 border border-line bg-white p-6 shadow-lift sm:p-10"
          >
            <InquiryForm key={defaultCategory} defaultCategory={defaultCategory} />
          </motion.div>

          <motion.ul
            variants={stagger(0.08, 0.4)}
            initial="hidden"
            animate="show"
            className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3"
          >
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <motion.li key={perk.text} variants={fadeUp} className="pill bg-white text-muted shadow-soft">
                  <Icon size={14} className="text-ink" />
                  {perk.text}
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </section>
    </PageTransition>
  );
}
