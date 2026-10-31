import { motion } from 'framer-motion';

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = (delay = 0.08, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});

/** Wraps a routed page: fade + slide-up on mount, fade on exit. */
export function PageTransition({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Reveal-on-scroll section for the public landing page. */
export function Reveal({ children, className, delay = 0, once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const MotionItem = ({ children, className, ...props }) => (
  <motion.div variants={fadeUp} className={className} {...props}>
    {children}
  </motion.div>
);
