import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then(({ data }) => setProject(data)).catch(() => setError(true));
  }, [id]);

  if (error) return <main className="mx-auto max-w-4xl px-6 py-32 text-center"><Helmet><title>Project not found | Prashant Maurya</title></Helmet><h1 className="text-3xl font-black">Project not found</h1><Link className="mt-6 inline-block text-cyan-500" to="/">Back to portfolio</Link></main>;
  if (!project) return <main className="mx-auto max-w-4xl px-6 py-32"><div className="h-8 w-64 animate-pulse rounded bg-zinc-200 dark:bg-white/10" /></main>;

  return <main className="min-h-screen bg-slate-50 px-6 py-24 text-slate-900 dark:bg-[#0a0a0f] dark:text-white">
    <Helmet>
      <title>{project.title} | Prashant Maurya</title>
      <meta name="description" content={project.description} />
      <link rel="canonical" href={`${window.location.origin}/projects/${project.id}`} />
    </Helmet>
    <article className="mx-auto max-w-4xl">
      <Link to="/" className="text-sm text-cyan-500">← Back to portfolio</Link>
      <img src={project.imageUrl} alt={project.title} className="mt-8 aspect-video w-full rounded-3xl object-cover" />
      <h1 className="mt-8 text-4xl font-black md:text-6xl">{project.title}</h1>
      <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{project.description}</p>
      <div className="mt-7 flex flex-wrap gap-2">{(project.techStack || '').split(',').map((tag) => <span key={tag} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-white/10 dark:bg-white/5">{tag.trim()}</span>)}</div>
      <div className="mt-9 flex flex-wrap gap-3">{project.githubUrl && <a className="rounded-xl bg-black px-5 py-3 font-bold text-white dark:bg-white dark:text-black" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}{project.liveDemoUrl && <a className="rounded-xl border border-zinc-300 px-5 py-3 font-bold dark:border-white/10" href={project.liveDemoUrl} target="_blank" rel="noreferrer">Live Demo</a>}</div>
    </article>
  </main>;
}
