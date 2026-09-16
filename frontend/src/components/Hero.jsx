import { motion } from 'framer-motion';

export default function Hero({ typed, go, dark, FaGithub, FaLinkedin, Mail, ArrowUpRight, theme }) {
  return <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
    <div className="absolute left-[-10%] top-[15%] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" /><div className="absolute right-[-10%] bottom-[10%] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
    <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="relative max-w-4xl text-center">
      <p className="mb-5 font-mono text-sm text-cyan-500">&lt;hello world /&gt;</p><h1 className="text-5xl font-black tracking-tight sm:text-7xl">Hi, I'm <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Prashant Maurya</span></h1>
      <p className="mt-7 text-xl sm:text-2xl"><span>{typed}</span><span className="ml-1 animate-pulse text-cyan-500">|</span></p><p className={`mx-auto mt-6 max-w-2xl leading-7 ${theme.muted}`}>B.Tech CSE student crafting reliable Java backends, polished React interfaces, and AI-powered applications.</p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => go('projects')} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 px-7 py-3.5 font-bold text-black">View Projects <ArrowUpRight className="ml-1 inline" size={17} /></button><a href="/resume.pdf" download className="rounded-2xl border border-zinc-200 bg-white/70 px-7 py-3.5 font-bold dark:border-white/10 dark:bg-white/5">Download Resume</a></div>
      <div className="mt-8 flex justify-center gap-3"><a href="https://github.com/prashantpiyush1111" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-xl border border-zinc-200 p-3 transition hover:-translate-y-1 hover:border-cyan-400/50 dark:border-white/10"><FaGithub /></a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="TODO: replace with your actual LinkedIn profile URL" className="rounded-xl border border-zinc-200 p-3 transition hover:-translate-y-1 hover:border-cyan-400/50 dark:border-white/10"><FaLinkedin /></a><a href="mailto:prashantpiyush1111@gmail.com" aria-label="Email" className="rounded-xl border border-zinc-200 p-3 transition hover:-translate-y-1 hover:border-cyan-400/50 dark:border-white/10"><Mail size={18} /></a></div>
    </motion.div>
  </section>;
}
