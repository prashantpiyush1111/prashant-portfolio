import { motion } from 'framer-motion';

function SkillSkeleton() {
  return <div className="space-y-5">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="animate-pulse"><div className="mb-2 h-4 w-2/3 rounded bg-zinc-200 dark:bg-white/10" /><div className="h-2 rounded-full bg-zinc-200 dark:bg-white/10" /></div>)}</div>;
}

export default function Skills({ SectionTitle, Card, grouped, loading }) {
  return <section id="skills" className="border-y border-zinc-200 bg-white/60 px-6 py-24 dark:border-white/5 dark:bg-white/[.015]"><div className="mx-auto max-w-6xl"><SectionTitle eyebrow="Skills" title="My technical toolkit." /><div className="grid gap-6 md:grid-cols-2">{loading ? Array.from({ length: 2 }).map((_, index) => <Card key={index} className="p-7"><div className="mb-6 h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-white/10" /><SkillSkeleton /></Card>) : Object.entries(grouped).map(([category, list]) => <Card key={category} className="p-7"><h3 className="mb-6 text-lg font-bold">{category}</h3><div className="space-y-5">{list.map((skill) => <div key={skill.id || skill.name}><div className="mb-2 flex justify-between text-sm"><span>{skill.name}</span><span className="text-zinc-500">{skill.proficiencyPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.proficiencyPercent}%` }} viewport={{ once: true }} transition={{ duration: .9 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" /></div></div>)}</div></Card>)}</div></div></section>;
}
