export default function Card({ children, className = '' }) {
  return <div className={`rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04] ${className}`}>{children}</div>;
}
