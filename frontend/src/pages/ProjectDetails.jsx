import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock3, Star } from 'lucide-react';
import api from '../api/axios';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    api.get(`/projects/${id}`).then(({ data }) => { if (active) setProject(data); }).catch(() => active && setError(true));
    api.get(`/projects/${id}/github-stats`).then(({ data }) => active && setStats(data)).catch(() => {});
    return () => { active = false; };
  }, [id]);

  const images = useMemo(() => {
    const values = project?.imageUrls?.length ? project.imageUrls : [project?.imageUrl];
    return values.filter(Boolean);
  }, [project]);

  if (error) return <main className="mx-auto max-w-4xl px-6 py-32 text-center"><Helmet><title>Project not found | Prashant Maurya</title></Helmet><h1 className="text-3xl font-black">Project not found</h1><Link className="mt-6 inline-block text-cyan-500" to="/">Back to portfolio</Link></main>;
  if (!project) return <main className="mx-auto max-w-4xl px-6 py-32"><div className="h-8 w-64 animate-pulse rounded bg-zinc-200 dark:bg-white/10" /><div className="mt-6 aspect-video w-full animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" /></main>;

  const showPrevious = () => setActiveImage((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setActiveImage((current) => (current + 1) % images.length);

  return <main className="min-h-screen bg-slate-50 px-6 py-24 text-slate-900 dark:bg-[#0a0a0f] dark:text-white">
    <Helmet><title>{project.title} | Prashant Maurya</title><meta name="description" content={project.description} /><link rel="canonical" href={`${window.location.origin}/projects/${project.id}`} /></Helmet>
    <article className="mx-auto max-w-5xl">
      <Link to="/" className="text-sm text-cyan-500">← Back to portfolio</Link>
      {images.length > 0 && <div className="mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[.045]">
          <img src={images[activeImage]} alt={`${project.title} screenshot ${activeImage + 1}`} className="aspect-video w-full object-cover" />
          {images.length > 1 && <><button onClick={showPrevious} aria-label="Previous project image" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-white">←</button><button onClick={showNext} aria-label="Next project image" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-white">→</button></>}
        </div>
        {images.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto">{images.map((image, index) => <button key={image} onClick={() => setActiveImage(index)} className={`shrink-0 overflow-hidden rounded-xl border-2 ${index === activeImage ? 'border-cyan-400' : 'border-transparent'}`}><img src={image} alt="" className="h-20 w-28 object-cover" /></button>)}</div>}
      </div>}
      <div className="mt-8 flex flex-wrap items-start justify-between gap-5"><div><h1 className="text-4xl font-black md:text-6xl">{project.title}</h1><div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500">{stats && <span className="flex items-center gap-1"><Star size={15} /> {stats.stars} stars</span>}{stats?.updatedAt && <span className="flex items-center gap-1"><Clock3 size={15} /> Updated {new Date(stats.updatedAt).toLocaleDateString()}</span>}</div></div></div>
      <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{project.description}</p>
      <div className="mt-7 flex flex-wrap gap-2">{(project.techStack || '').split(',').map((tag) => <span key={tag} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-white/10 dark:bg-white/5">{tag.trim()}</span>)}</div>
      <div className="mt-9 flex flex-wrap gap-3">{project.githubUrl && <a className="rounded-xl bg-black px-5 py-3 font-bold text-white dark:bg-white dark:text-black" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}{project.liveDemoUrl && <a className="rounded-xl border border-zinc-300 px-5 py-3 font-bold dark:border-white/10" href={project.liveDemoUrl} target="_blank" rel="noreferrer">Live Demo</a>}</div>
    </article>
  </main>;
}
