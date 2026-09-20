import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, Moon, Sun, Menu, X, ExternalLink, ArrowUpRight, Monitor } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import api from './api/axios';
import { useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SectionTitle from './components/SectionTitle';
import Card from './components/Card';
import NotFound from './pages/NotFound';

const LazyBlog = lazy(() => import('./components/Blog'));
const LazyCommandPalette = lazy(() => import('./components/CommandPalette'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const NAV = ['home', 'about', 'experience', 'skills', 'projects', 'blog', 'contact'];
const FALLBACK_SKILLS = [
  ['Java', 'Backend', 90], ['Spring Boot', 'Backend', 85], ['Spring Security', 'Backend', 75],
  ['JWT', 'Backend', 75], ['Hibernate/JPA', 'Backend', 80], ['MySQL', 'Database', 85],
  ['React.js', 'Frontend', 75], ['Git', 'Tools', 85], ['Maven', 'Tools', 80], ['Postman', 'Tools', 80]
];
const FALLBACK_PROJECTS = [
  { id: 1, title: 'AI-Driven Sales Forecasting', description: 'AI-powered sales forecasting platform with business intelligence dashboards and predictive insights.', techStack: 'Java, Spring Boot, MySQL, React, Python, FastAPI', githubUrl: 'https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting', liveDemoUrl: 'https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting', imageUrl: '/projects/ai-sales-forecasting.png', imageLqipUrl: '/projects/ai-sales-forecasting-lqip.jpg' },
  { id: 2, title: 'RAG Educational Assistant', description: 'Educational assistant that retrieves relevant knowledge and generates grounded answers from learning resources.', techStack: 'Java, Spring Boot, React, Python, RAG, Qdrant', githubUrl: 'https://github.com/prashantpiyush1111/rag-educational-system', liveDemoUrl: 'https://github.com/prashantpiyush1111/rag-educational-system', imageUrl: '/projects/rag-educational-assistant.png', imageLqipUrl: '/projects/rag-educational-assistant-lqip.jpg' },
  { id: 3, title: 'Task Management System', description: 'Jira-style task management system with assignments, role-based permissions, deadlines, and collaboration.', techStack: 'Java, Spring Boot, MySQL, React, JWT', githubUrl: 'https://github.com/prashantpiyush1111/task-management-system', liveDemoUrl: 'https://github.com/prashantpiyush1111/task-management-system', imageUrl: '/projects/task-management-system.png', imageLqipUrl: '/projects/task-management-system-lqip.jpg' }
];

function HomePage() {
  const { dark, theme: themeMode, cycleTheme } = useTheme();
  const [menu, setMenu] = useState(false), [scrolled, setScrolled] = useState(false), [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState([]), [skills, setSkills] = useState([]), [blogs, setBlogs] = useState([]), [achievements, setAchievements] = useState([]), [blog, setBlog] = useState(null), [githubActivity, setGithubActivity] = useState(null);
  const [typed, setTyped] = useState(''), [loading, setLoading] = useState(true), [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' }), [sending, setSending] = useState(false);
  const phrases = ['Java Full Stack Developer', 'Spring Boot Developer', 'React Developer'];

  useEffect(() => {
    let active = true;
    const requests = [api.get('/projects'), api.get('/skills'), api.get('/blogs'), api.get('/achievements')];
    Promise.allSettled(requests).then(([p, s, b, a]) => {
      if (!active) return;
      if (p.status === 'fulfilled') setProjects(p.value.data); else setProjects(FALLBACK_PROJECTS);
      if (s.status === 'fulfilled') setSkills(s.value.data); else setSkills(FALLBACK_SKILLS.map(([name, category, proficiencyPercent], id) => ({ id, name, category, proficiencyPercent })));
      if (b.status === 'fulfilled') setBlogs(b.value.data); else setBlogs([]);
      if (a.status === 'fulfilled') setAchievements(a.value.data); else setAchievements([]);
    }).finally(() => active && setLoading(false));
    api.get('/github/activity').then(({ data }) => active && setGithubActivity(data)).catch(() => {});
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
    if (form.website.trim()) return;
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Please enter valid details.'); return; }
    setSending(true);
    try { await api.post('/contact', form); toast.success('Message sent successfully'); setForm({ name: '', email: '', subject: '', message: '', website: '' }); }
    catch (error) { toast.error(error?.response?.data?.message || 'Could not send message.'); }
    finally { setSending(false); }
  };

  const theme = dark ? { page: 'bg-[#0a0a0f] text-[#f5f5f5]', muted: 'text-zinc-400', header: scrolled ? 'border-white/10 bg-[#0a0a0f]/80' : '', input: 'border-white/10 bg-white/5 text-white', mobile: 'border-white/10 bg-[#0a0a0f]/95' } : { page: 'bg-slate-50 text-slate-900', muted: 'text-zinc-600', header: scrolled ? 'border-slate-200 bg-white/85' : '', input: 'border-slate-200 bg-white text-slate-900', mobile: 'border-slate-200 bg-white/95' };

  return <div className={`min-h-screen overflow-x-hidden ${theme.page}`}>
    <Helmet><title>Prashant Maurya | Java Full Stack Developer</title><meta name="description" content="Prashant Maurya — Java Full Stack Developer specializing in Java, Spring Boot, React, MySQL and AI projects." /></Helmet>
    <Toaster position="top-right" />
    <Suspense fallback={null}><LazyCommandPalette go={go} /></Suspense>
    <div className="fixed left-0 top-0 z-[100] h-1 bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${progress}%` }} />
    <Header nav={NAV} menu={menu} setMenu={setMenu} go={go} theme={theme} scrolled={scrolled} themeMode={themeMode} cycleTheme={cycleTheme} dark={dark} Sun={Sun} Moon={Moon} Monitor={Monitor} Menu={Menu} X={X} />
    <main>
      <Hero typed={typed} go={go} FaGithub={FaGithub} FaLinkedin={FaLinkedin} Mail={Mail} ArrowUpRight={ArrowUpRight} theme={theme} />
      <About SectionTitle={SectionTitle} Card={Card} />
      <Experience SectionTitle={SectionTitle} achievements={achievements} loading={loading} />
      <Skills SectionTitle={SectionTitle} Card={Card} grouped={grouped} loading={loading} githubActivity={githubActivity} />
      <Projects SectionTitle={SectionTitle} loading={loading} projects={projects} fallbackProjects={FALLBACK_PROJECTS} FaGithub={FaGithub} ExternalLink={ExternalLink} />
      <LazyBlog SectionTitle={SectionTitle} Card={Card} blogs={blogs} blog={blog} setBlog={setBlog} />
      <Contact SectionTitle={SectionTitle} Card={Card} theme={theme} form={form} updateField={updateField} submit={submit} sending={sending} />
    </main>
    <Footer />
  </div>;
}

function AppRoutes() {
  const location = useLocation();
  const sentPaths = useRef(new Set());
  useEffect(() => {
    if (sentPaths.current.has(location.pathname)) return;
    sentPaths.current.add(location.pathname);
    api.post('/analytics/pageview', { path: location.pathname }).catch(() => {});
  }, [location.pathname]);
  return <AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .2 }}><Routes location={location}><Route path="/" element={<HomePage />} /><Route path="/projects/:id" element={<Suspense fallback={<div className="min-h-screen p-10 text-center">Loading…</div>}><ProjectDetails /></Suspense>} /><Route path="/blog/:id" element={<Suspense fallback={<div className="min-h-screen p-10 text-center">Loading…</div>}><BlogDetails /></Suspense>} /><Route path="*" element={<NotFound />} /></Routes></motion.div></AnimatePresence>;
}

export default function App() { return <AppRoutes />; }
