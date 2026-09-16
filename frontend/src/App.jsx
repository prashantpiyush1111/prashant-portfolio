import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, Moon, Sun, Menu, X, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from './api/axios';
import { useTheme } from './context/ThemeContext';
import './index.css';

const NAV = ['home', 'about', 'skills', 'projects', 'blog', 'contact'];
const FALLBACK_SKILLS = [
  ['Java', 'Backend', 90], ['Spring Boot', 'Backend', 85], ['Spring Security', 'Backend', 75],
  ['JWT', 'Backend', 75], ['Hibernate/JPA', 'Backend', 80], ['MySQL', 'Database', 85],
  ['React.js', 'Frontend', 75], ['Git', 'Tools', 85], ['Maven', 'Tools', 80], ['Postman', 'Tools', 80]
];
const FALLBACK_PROJECTS = [
  { title: 'AI-Driven Sales Forecasting', description: 'AI-powered sales forecasting platform with business intelligence dashboards and predictive insights.', techStack: 'Java, Spring Boot, MySQL, React, Python, FastAPI', githubUrl: 'https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting', liveDemoUrl: 'https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { title: 'RAG Educational Assistant', description: 'Educational assistant that retrieves relevant knowledge and generates grounded answers from learning resources.', techStack: 'Java, Spring Boot, React, Python, RAG, Qdrant', githubUrl: 'https://github.com/prashantpiyush1111/rag-educational-system', liveDemoUrl: 'https://github.com/prashantpiyush1111/rag-educational-system', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Task Management System', description: 'Jira-style task management system with assignments, role-based permissions, deadlines, and collaboration.', techStack: 'Java, Spring Boot, MySQL, React, JWT', githubUrl: 'https://github.com/prashantpiyush1111', liveDemoUrl: 'https://github.com/prashantpiyush1111', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80' }
];

function SectionTitle({ eyebrow, title, text }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-2xl text-center">
    <p className="mb-3 text-sm font-bold uppercase tracking-[.28em] text-cyan-500">{eyebrow}</p>
    <h2 className="text-3xl font-black sm:text-5xl">{title}</h2>
    {text && <p className="mt-4 text-zinc-500 dark:text-zinc-400">{text}</p>}
  </motion.div>;
}

function Card({ children, className = '' }) {
  return <div className={`rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04] ${className}`}>{children}</div>;
}

function ProjectCard({ project }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tags = (project.techStack || '').split(',').map((value) => value.trim()).filter(Boolean);
  return <motion.article
    initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    onMouseMove={(event) => { const r = event.currentTarget.getBoundingClientRect(); setTilt({ x: ((event.clientX - r.left) / r.width - .5) * 5, y: ((event.clientY - r.top) / r.height - .5) * -5 }); }}
    onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    style={{ transform: `perspective(1100px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
    className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/30 transition-all duration-300 hover:border-cyan-400/50 dark:border-white/10 dark:bg-white/[.045] dark:shadow-2xl dark:shadow-black/20"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-cyan-400/10 to-purple-500/10">
      <img src={project.imageUrl} alt={project.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-[#0a0a0f]" />
      <div className="absolute inset-x-4 bottom-4 flex translate-y-4 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <a href={project.liveDemoUrl || project.githubUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-bold text-black"><ExternalLink size={15} />Live Demo</a>
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/75 px-3 py-3 text-sm font-bold text-white ring-1 ring-white/20"><FaGithub />GitHub</a>
      </div>
    </div>
    <div className="p-6"><h3 className="text-xl font-bold">{project.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">{tag}</span>)}</div>
    </div>
  </motion.article>;
}

export default function App() {
  const { dark, toggleTheme } = useTheme();
  const [menu, setMenu] = useState(false), [scrolled, setScrolled] = useState(false), [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState([]), [skills, setSkills] = useState([]), [blogs, setBlogs] = useState([]), [blog, setBlog] = useState(null);
  const [typed, setTyped] = useState(''), [loading, setLoading] = useState(true), [form, setForm] = useState({ name: '', email: '', subject: '', message: '' }), [sending, setSending] = useState(false);
  const phrases = ['Java Full Stack Developer', 'Spring Boot Developer', 'React Developer'];

  useEffect(() => {
    let active = true;
    Promise.all([api.get('/projects'), api.get('/skills'), api.get('/blogs')]).then(([p, s, b]) => {
      if (!active) return; setProjects(p.data); setSkills(s.data); setBlogs(b.data);
    }).catch(() => {
      if (!active) return; setProjects(FALLBACK_PROJECTS); setSkills(FALLBACK_SKILLS.map(([name, category, proficiencyPercent], id) => ({ id, name, category, proficiencyPercent }))); setBlogs([]);
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let phraseIndex = 0, position = 0, deleting = false;
    const timer = setInterval(() => { const word = phrases[phraseIndex]; if (!deleting) { position += 1; setTyped(word.slice(0, position)); if (position === word.length) deleting = true; } else { position -= 1; setTyped(word.slice(0, position)); if (position === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; } } }, 85);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 30); const height = document.documentElement.scrollHeight - window.innerHeight; setProgress(height ? window.scrollY / height * 100 : 0); };
    window.addEventListener('scroll', onScroll); onScroll(); return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const grouped = useMemo(() => skills.reduce((all, skill) => ({ ...all, [skill.category]: [...(all[skill.category] || []), skill] }), {}), [skills]);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenu(false); };
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Please enter valid details.'); return; }
    setSending(true);
    try { await api.post('/contact', form); toast.success('Message sent successfully'); setForm({ name: '', email: '', subject: '', message: '' }); }
    catch (error) { toast.error(error?.response?.data?.message || 'Could not send message.'); }
    finally { setSending(false); }
  };

  const theme = dark ? {
    page: 'bg-[#0a0a0f] text-[#f5f5f5]', section: 'border-white/5 bg-white/[.015]', muted: 'text-zinc-400', header: scrolled ? 'border-white/10 bg-[#0a0a0f]/80' : '', input: 'border-white/10 bg-white/5 text-white', mobile: 'border-white/10 bg-[#0a0a0f]/95'
  } : {
    page: 'bg-slate-50 text-slate-900', section: 'border-slate-200 bg-white/60', muted: 'text-zinc-600', header: scrolled ? 'border-slate-200 bg-white/85' : '', input: 'border-slate-200 bg-white text-slate-900', mobile: 'border-slate-200 bg-white/95'
  };

  return <div className={`min-h-screen overflow-x-hidden ${theme.page}`}>
    <Toaster position="top-right" />
    <div className="fixed left-0 top-0 z-[100] h-1 bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${progress}%` }} />
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all ${theme.header}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={() => go('home')} className="text-xl font-black">PM<span className="text-cyan-500">.</span></button>
        <nav className="hidden items-center gap-7 md:flex">{NAV.map((item) => <button key={item} onClick={() => go(item)} className={`text-sm transition ${theme.muted} hover:text-cyan-500`}>{item[0].toUpperCase() + item.slice(1)}</button>)}<button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-xl border border-zinc-200 p-2 dark:border-white/10">{dark ? <Sun size={17} /> : <Moon size={17} />}</button></nav>
        <button className="md:hidden" onClick={() => setMenu((value) => !value)} aria-label="Open menu">{menu ? <X /> : <Menu />}</button>
      </div>
      {menu && <div className={`border-t px-6 py-3 md:hidden ${theme.mobile}`}>{NAV.map((item) => <button key={item} onClick={() => go(item)} className={`block w-full py-3 text-left ${theme.muted}`}>{item[0].toUpperCase() + item.slice(1)}</button>)}<button onClick={toggleTheme} className={`flex items-center gap-2 py-3 ${theme.muted}`}>{dark ? <Sun size={16} /> : <Moon size={16} />}Toggle theme</button></div>}
    </header>

    <main>
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute left-[-10%] top-[15%] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" /><div className="absolute right-[-10%] bottom-[10%] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
        <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="relative max-w-4xl text-center">
          <p className="mb-5 font-mono text-sm text-cyan-500">&lt;hello world /&gt;</p><h1 className="text-5xl font-black tracking-tight sm:text-7xl">Hi, I'm <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Prashant Maurya</span></h1>
          <p className="mt-7 text-xl sm:text-2xl"><span>{typed}</span><span className="ml-1 animate-pulse text-cyan-500">|</span></p><p className={`mx-auto mt-6 max-w-2xl leading-7 ${theme.muted}`}>B.Tech CSE student crafting reliable Java backends, polished React interfaces, and AI-powered applications.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => go('projects')} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 px-7 py-3.5 font-bold text-black">View Projects <ArrowUpRight className="ml-1 inline" size={17} /></button><a href="/resume.pdf" download className="rounded-2xl border border-zinc-200 bg-white/70 px-7 py-3.5 font-bold dark:border-white/10 dark:bg-white/5">Download Resume</a></div>
          <div className="mt-8 flex justify-center gap-3"><a href="https://github.com/prashantpiyush1111" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-xl border border-zinc-200 p-3 transition hover:-translate-y-1 hover:border-cyan-400/50 dark:border-white/10"><FaGithub /></a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-xl border border-zinc-200 p-3 transition hover:-translate-y-1 hover:border-cyan-400/50 dark:border-white/10"><FaLinkedin /></a><a href="mailto:prashantpiyush1111@gmail.com" aria-label="Email" className="rounded-xl border border-zinc-200 p-3 transition hover:-translate-y-1 hover:border-cyan-400/50 dark:border-white/10"><Mail size={18} /></a></div>
        </motion.div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-24"><SectionTitle eyebrow="About" title="Building with purpose." text="Focused on backend engineering, clean architecture, and practical full-stack products." /><div className="grid gap-7 md:grid-cols-[1.2fr_.8fr]"><Card className="p-8"><p className="text-lg leading-8">I'm Prashant Maurya, a B.Tech Computer Science and Engineering student at IEC College of Engineering and Technology, Greater Noida. I enjoy turning ideas into maintainable full-stack systems with Java, Spring Boot, MySQL and React.</p></Card><Card className="bg-gradient-to-br from-cyan-400/10 to-purple-500/10 p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-500">Education</p><h3 className="mt-4 text-xl font-bold">B.Tech Computer Science & Engineering</h3><p className="mt-2 text-zinc-600 dark:text-zinc-300">IEC College of Engineering and Technology</p><p className="text-zinc-500">Greater Noida · 2023–2027 · AKTU</p></Card></div></section>

      <section id="skills" className={`border-y px-6 py-24 ${theme.section}`}><div className="mx-auto max-w-6xl"><SectionTitle eyebrow="Skills" title="My technical toolkit." /><div className="grid gap-6 md:grid-cols-2">{Object.entries(grouped).map(([category, list]) => <Card key={category} className="p-7"><h3 className="mb-6 text-lg font-bold">{category}</h3><div className="space-y-5">{list.map((skill) => <div key={skill.id || skill.name}><div className="mb-2 flex justify-between text-sm"><span>{skill.name}</span><span className="text-zinc-500">{skill.proficiencyPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.proficiencyPercent}%` }} viewport={{ once: true }} transition={{ duration: .9 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" /></div></div>)}</div></Card>)}</div></div></section>

      <section id="projects" className="mx-auto max-w-6xl px-6 py-24"><SectionTitle eyebrow="Projects" title="Things I've built." text="Selected work across Java, Spring Boot, React, databases and AI." /><div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[16/13] animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" />) : (projects.length ? projects : FALLBACK_PROJECTS).map((project, i) => <ProjectCard project={project} key={project.id || i} />)}</div></section>

      <section id="blog" className={`border-y px-6 py-24 ${theme.section}`}><div className="mx-auto max-w-6xl"><SectionTitle eyebrow="Blog" title="Notes from the build process." /><div className="grid gap-6 md:grid-cols-2">{blogs.length ? blogs.map((item) => <button key={item.id} onClick={() => setBlog(item)} className="text-left"><Card className="overflow-hidden p-0 transition hover:-translate-y-1 hover:border-cyan-400/30"><img src={item.thumbnailUrl} alt={item.title} loading="lazy" className="aspect-video w-full object-cover" /><div className="p-6"><p className="text-xs text-cyan-500">{item.publishedDate}</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.summary}</p></div></Card></button>) : <Card className="p-8 text-center text-zinc-500 md:col-span-2">New Java and Spring Boot articles are coming soon.</Card>}</div></div></section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-24"><SectionTitle eyebrow="Contact" title="Let's build something." text="Have a project, opportunity, or idea? Send a message." /><Card className="mx-auto max-w-3xl p-6 sm:p-8"><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">{[['name','Name','text'],['email','Email','email'],['subject','Subject','text']].map(([field, label, type]) => <label key={field} className={`text-sm ${theme.muted} ${field === 'subject' ? 'sm:col-span-2' : ''}`}>{label}<input required type={type} value={form[field]} onChange={(e) => updateField(field, e.target.value)} className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-cyan-400 ${theme.input}`} /></label>)}<label className={`text-sm ${theme.muted} sm:col-span-2`}>Message<textarea required rows="6" value={form.message} onChange={(e) => updateField('message', e.target.value)} className={`mt-2 w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-cyan-400 ${theme.input}`} /></label><button disabled={sending} className="sm:col-span-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3.5 font-bold text-black disabled:opacity-60">{sending ? 'Sending...' : 'Send Message'}</button></form></Card></section>
    </main>

    <footer className="border-t border-zinc-200 px-6 py-10 dark:border-white/10"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-zinc-500 sm:flex-row"><p>© 2026 Prashant Maurya</p><p>Built with React & Spring Boot</p><div className="flex gap-4"><a href="https://github.com/prashantpiyush1111" target="_blank" rel="noreferrer"><FaGithub /></a><a href="mailto:prashantpiyush1111@gmail.com"><Mail size={16} /></a></div></div></footer>

    <AnimatePresence>{blog && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm" onClick={() => setBlog(null)}><motion.div initial={{ y: 25, scale: .98 }} animate={{ y: 0, scale: 1 }} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-white p-7 text-slate-900 dark:bg-[#111118] dark:text-white"><div className="flex items-start justify-between gap-4"><div><p className="text-xs text-cyan-500">{blog.publishedDate}</p><h3 className="mt-2 text-2xl font-black">{blog.title}</h3></div><button onClick={() => setBlog(null)} aria-label="Close blog"><X /></button></div><p className="mt-6 whitespace-pre-wrap leading-8 text-zinc-700 dark:text-zinc-300">{blog.content}</p></motion.div></motion.div>}</AnimatePresence>
  </div>;
}
