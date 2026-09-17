import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-24 text-slate-900 dark:bg-[#0a0a0f] dark:text-white">
    <Helmet>
      <title>Page not found | Prashant Maurya</title>
      <meta name="robots" content="noindex" />
      <meta name="description" content="The requested portfolio page could not be found." />
    </Helmet>
    <section className="w-full max-w-xl text-center">
      <p className="font-mono text-sm text-cyan-500">404 / NOT FOUND</p>
      <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <Home size={32} aria-hidden="true" />
      </div>
      <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl">This page took a wrong turn.</h1>
      <p className="mx-auto mt-5 max-w-md leading-7 text-zinc-600 dark:text-zinc-400">The page you are looking for does not exist or may have moved. Let’s get you back to the portfolio.</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3.5 font-bold text-black transition hover:-translate-y-0.5">
        <ArrowLeft size={17} /> Go back home
      </Link>
    </section>
  </main>;
}
