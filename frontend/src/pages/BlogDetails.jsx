import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import api from '../api/axios';

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/blogs/${id}`).then(({ data }) => setBlog(data)).catch(() => setError(true));
  }, [id]);

  if (error) return <main className="mx-auto max-w-4xl px-6 py-32 text-center"><Helmet><title>Article not found | Prashant Maurya</title></Helmet><h1 className="text-3xl font-black">Article not found</h1><Link className="mt-6 inline-block text-cyan-500" to="/">Back to portfolio</Link></main>;
  if (!blog) return <main className="mx-auto max-w-4xl px-6 py-32"><div className="h-8 w-64 animate-pulse rounded bg-zinc-200 dark:bg-white/10" /></main>;

  return <main className="min-h-screen bg-slate-50 px-6 py-24 text-slate-900 dark:bg-[#0a0a0f] dark:text-white">
    <Helmet>
      <title>{blog.title} | Prashant Maurya</title>
      <meta name="description" content={blog.summary || blog.title} />
      <link rel="canonical" href={`${window.location.origin}/blog/${blog.id}`} />
    </Helmet>
    <article className="mx-auto max-w-4xl">
      <Link to="/" className="text-sm text-cyan-500">← Back to portfolio</Link>
      {blog.thumbnailUrl && <img src={blog.thumbnailUrl} alt={blog.title} className="mt-8 aspect-video w-full rounded-3xl object-cover" />}
      <p className="mt-8 text-xs text-cyan-500">{blog.publishedDate}</p>
      <h1 className="mt-2 text-4xl font-black md:text-6xl">{blog.title}</h1>
      <div className="prose prose-sm mt-8 max-w-none leading-8 text-zinc-700 dark:prose-invert dark:text-zinc-300"><ReactMarkdown>{blog.content || ''}</ReactMarkdown></div>
    </article>
  </main>;
}
