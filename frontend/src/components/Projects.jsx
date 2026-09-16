import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

function ProjectCard({ project, FaGithub, ExternalLink }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tags = (project.techStack || '').split(',').map((value) => value.trim()).filter(Boolean);
  return <motion.article initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onMouseMove={(event) => { const r = event.currentTarget.getBoundingClientRect(); setTilt({ x: ((event.clientX - r.left) / r.width - .5) * 5, y: ((event.clientY - r.top) / r.height - .5) * -5 }); }} onMouseLeave={() => setTilt({ x: 0, y: 0 })} style={{ transform: `perspective(1100px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/30 transition-all duration-300 hover:border-cyan-400/50 dark:border-white/10 dark:bg-white/[.045] dark:shadow-2xl dark:shadow-black/20">
    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-cyan-400/10 to-purple-500/10"><img src={project.imageUrl} alt={project.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-[#0a0a0f]" /><div className="absolute inset-x-4 bottom-4 flex translate-y-4 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><a href={project.liveDemoUrl || project.githubUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-bold text-black"><ExternalLink size={15} />Live Demo</a><a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/75 px-3 py-3 text-sm font-bold text-white ring-1 ring-white/20"><FaGithub />GitHub</a></div></div>
    <div className="p-6"><h3 className="text-xl font-bold">{project.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">{tag}</span>)}</div></div>
  </motion.article>;
}

export default function Projects({ SectionTitle, loading, projects, fallbackProjects, FaGithub, ExternalLink }) {
  const items = projects.length ? projects : fallbackProjects;
  const categories = useMemo(() => ['All', ...new Set(items.flatMap((project) => (project.techStack || '').split(',').map((value) => value.trim()).filter(Boolean)).map((value) => value.split('/')[0]))], [items]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const filtered = items.filter((project) => {
    const stack = (project.techStack || '').toLowerCase();
    const matchesFilter = filter === 'All' || stack.includes(filter.toLowerCase());
    const haystack = `${project.title} ${project.description} ${project.techStack}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  });
  return <section id="projects" className="mx-auto max-w-6xl px-6 py-24"><SectionTitle eyebrow="Projects" title="Things I've built." text="Selected work across Java, Spring Boot, React, databases and AI." /><div className="mb-8 flex flex-col gap-4"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects or technology…" aria-label="Search projects" className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/5" /><div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={`rounded-full border px-3 py-1.5 text-sm transition ${filter === category ? 'border-cyan-400 bg-cyan-400/10 text-cyan-500' : 'border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'}`}>{category}</button>)}</div></div><div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[16/13] animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" />) : filtered.length ? filtered.map((project, i) => <ProjectCard project={project} key={project.id || i} FaGithub={FaGithub} ExternalLink={ExternalLink} />) : <div className="rounded-3xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-white/10 md:col-span-3">No projects match this filter.</div>}</div></section>;
}
