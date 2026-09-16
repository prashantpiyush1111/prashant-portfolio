import { lazy, Suspense } from 'react';

const Blog = lazy(() => import('./Blog'));

export default function LazyBlog(props) {
  return (
    <Suspense fallback={<section id="blog" className="border-y border-zinc-200 bg-white/60 px-6 py-24 dark:border-white/5 dark:bg-white/[.015]"><div className="mx-auto max-w-6xl text-center text-zinc-500">Loading blog…</div></section>}>
      <Blog {...props} />
    </Suspense>
  );
}
