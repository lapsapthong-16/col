'use client';

import { ArrowUpRight, CheckCircle2, WalletCards } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const answers = ['Expiry label verification', 'Checkout confirmation', 'Variant match'];

export default function Earnings() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
  };

  return (
    <motion.div
      className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:pt-16"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } }}
    >
      <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300/80 pb-5">
        <div className="eyebrow">WORKER VIEW / EARNINGS</div>
        <div className="mono flex items-center gap-2 text-[.65rem] uppercase tracking-[.12em] text-stone-500">
          <span className="h-2 w-2 rounded-full bg-[#b5d43a] shadow-[0_0_0_4px_rgba(181,212,58,.18)]" />
          Demo ledger · synced
        </div>
      </motion.div>

      <div className="grid gap-12 py-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20 lg:py-16">
        <motion.section variants={item} className="flex flex-col justify-between">
          <div>
            <div className="eyebrow">THE WORKER LEDGER</div>
            <h1 className="serif mt-4 max-w-xl text-6xl leading-[.92] md:text-8xl">
              Your judgment,
              <br />
              <i>accounted for.</i>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-stone-500">
              A small record of the calls that helped an agent keep moving.
            </p>
          </div>

          <div className="mt-14 border-t border-stone-300/80 pt-5 lg:mt-24">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="eyebrow">RECORDED REVIEWS</div>
                <div className="mono mt-3 text-3xl text-stone-800">{answers.length.toString().padStart(2, '0')}</div>
              </div>
              <WalletCards className="mt-1 text-stone-400" size={21} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="mt-5 h-px bg-stone-200">
              <motion.div
                className="h-px origin-left bg-[#b5d43a]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.section>

        <motion.section variants={item} className="relative overflow-hidden rounded-[4px] border border-stone-300 bg-white/60 shadow-[0_18px_50px_rgba(23,33,27,.06)]">
          <div className="grid-bg absolute inset-0 opacity-35" aria-hidden="true" />
          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between gap-6 border-b border-stone-300/80 pb-8">
              <div>
                <div className="eyebrow">DEMO BALANCE</div>
                <div className="mono mt-4 text-6xl tracking-[-.08em] text-stone-900 md:text-7xl">$0.35</div>
                <p className="mt-2 text-sm text-stone-500">USDC accrued</p>
              </div>
              <span className="pill">MVP / 01</span>
            </div>

            <div className="pt-8">
              <div className="flex items-center justify-between">
                <div className="eyebrow">RECENT ANSWERS</div>
                <div className="mono text-[.65rem] uppercase tracking-[.1em] text-stone-400">3 entries</div>
              </div>
              <div className="mt-3 divide-y divide-stone-200/90">
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer}
                    initial={{ opacity: 0, x: reduce ? 0 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.08, duration: 0.4 }}
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <CheckCircle2 size={17} strokeWidth={1.6} className="shrink-0 text-[#718b1a]" aria-hidden="true" />
                      <span className="truncate text-sm font-semibold text-stone-800">{answer}</span>
                    </div>
                    <span className="mono shrink-0 text-sm font-medium text-emerald-700">+$0.05</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-stone-300/80 pt-5 text-xs text-stone-500">
              <span>Each judgment is recorded independently.</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </div>
          </div>
        </motion.section>
      </div>

      <motion.p variants={item} className="max-w-2xl border-l-2 border-[#b5d43a] pl-4 text-sm leading-6 text-stone-500">
        Demo data. Production payouts, KYC, and worker accounts are future work.
      </motion.p>
    </motion.div>
  );
}
