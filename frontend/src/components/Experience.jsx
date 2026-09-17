import { motion } from 'framer-motion';
import { Award, BriefcaseBusiness, Trophy } from 'lucide-react';

const ICONS = { hackathon: Trophy, certification: Award, experience: BriefcaseBusiness };

function Skeleton() {
  return <div className="space-y-8">{[0, 1, 2].map((item) => <div key={item} className="grid gap-4 md:grid-cols-[1fr_24px_1fr]"><div className={`${item % 2 ? 'md:col-start-3' : ''} h-32 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5`} /><div className="hidden md:block" /></div>)}</div>;
}

export default function Experience({ SectionTitle, achievements, loading }) {
  return <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
    <SectionTitle eyebrow="Experience & Achievements" title="Milestones that shaped my journey." text="Experience, certifications and hackathons in one timeline." />
    {loading ? <Skeleton /> : achievements.length ? <div className="relative space-y-8 md:space-y-10"><div className="absolute bottom-4 left-3 top-4 w-px bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent md:left-1/2" />{achievements.map((item, index) => { const Icon = ICONS[item.type] || Award; const right = index % 2 === 1; return <motion.article key={item.id || `${item.title}-${index}`} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .45 }} className="relative grid gap-4 pl-10 md:grid-cols-[1fr_24px_1fr] md:pl-0"><div className={`${right ? 'md:col-start-3' : 'md:col-start-1'} rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/30 dark:border-white/10 dark:bg-white/[.045] dark:shadow-black/20`}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-500">{item.type}</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3></div><span className="whitespace-nowrap text-sm text-zinc-500">{item.date}</span></div><p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">{item.description}</p></div><div className="absolute left-[-1px] top-7 z-10 flex h-7 w-7 items-center justify-center rounded-full border-4 border-slate-50 bg-cyan-400 text-black dark:border-[#0a0a0f] md:static md:col-start-2 md:row-start-1 md:mt-7 md:ml-[-2px]"><Icon size={13} /></div></motion.article>; })}</div> : <div className="rounded-3xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-white/10">Achievements will be added soon.</div>}
  </section>;
}
