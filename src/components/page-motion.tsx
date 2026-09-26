'use client';

import { motion, useReducedMotion } from 'motion/react';

export function PageMotion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return <motion.div initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.48, ease: [0.21, 0.47, 0.32, 0.98] }}>{children}</motion.div>;
}
