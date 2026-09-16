import { motion } from 'framer-motion';

export default function SectionTitle({ eyebrow, title, text }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-2xl text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[.28em] text-cyan-500">{eyebrow}</p><h2 className="text-3xl font-black sm:text-5xl">{title}</h2>{text && <p className="mt-4 text-zinc-500 dark:text-zinc-400">{text}</p>}</motion.div>;
}
