import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Blog({ SectionTitle, Card, blogs }) {
  return <section id="blog" className="border-y border-zinc-200 bg-white/60 px-6 py-24 dark:border-white/5 dark:bg-white/[.015]"><div className="mx-auto max-w-6xl"><SectionTitle eyebrow="Blog" title="Notes from the build process." /><div className="grid gap-6 md:grid-cols-2">{blogs.length ? blogs.map((item) => <Link key={item.id} to={`/blog/${item.id}`} className="text-left"><motion.div whileHover={{ y: -4 }}><Card className="overflow-hidden p-0 transition hover:border-cyan-400/30"><img src={item.thumbnailUrl} alt={item.title} loading="lazy" className="aspect-video w-full object-cover" /><div className="p-6"><p className="text-xs text-cyan-500">{item.publishedDate}</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.summary}</p></div></Card></motion.div></Link>) : <Card className="p-8 text-center text-zinc-500 md:col-span-2">New Java and Spring Boot articles are coming soon.</Card>}</div></div></section>;
}
