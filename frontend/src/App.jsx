import { useEffect, useMemo, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, Moon, Sun, Menu, X, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from './api/axios';
import { useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SectionTitle from './components/SectionTitle';
import Card from './components/Card';

const NAV = ['home', 'about', 'skills', 'projects', 'blog', 'contact'];
const FALLBACK_SKILLS = [
  ['Java', 'Backend', 90], ['Spring Boot', 'Backend', 85], ['Spring Security', 'Backend', 75],
  ['JWT', 'Backend', 75], ['Hibernate/JPA', 'Backend', 80], ['MySQL', 'Database', 85],
  ['React.js', 'Frontend', 75], ['Git', 'Tools', 85], ['Maven', 'Tools', 80], ['Postman', 'Tools', 80]
];
const FALLBACK_PROJECTS = [
  { title: 'AI-Driven Sales Forecasting', description: 'AI-powered sales forecasting platform with business intelligence dashboards and predictive insights.', techStack: 'Java, Spring Boot, MySQL, React, Python, FastAPI', githubUrl: 'https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting', liveDemoUrl: 'https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { title: 'RAG Educational Assistant', description: 'Educational assistant that retrieves relevant knowledge and generates grounded answers from learning resources.', techStack: 'Java, Spring Boot, React, Python, RAG, Qdrant', githubUrl: 'https://github.com/prashantpiyush1111/rag-educational-system', liveDemoUrl: 'https://github.com/prashantpiyush1111/rag-educational-system', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Task Management System', description: 'Jira-style task management system with assignments, role-based permissions, deadlines, and collaboration.', techStack: 'Java, Spring Boot, MySQL, React, JWT', githubUrl: 'https://github.com/prashantpiyush1111/task-management-system', liveDemoUrl: 'https://github.com/prashantpiyush1111/task-management-system', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80' }
];

export default function App() {
  const { dark, toggleTheme } = useTheme();
  const [menu, setMenu] = useState(false), [scrolled, setScrolled] = useState(false), [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState([]), [skills, setSkills] = useState([]), [blogs, setBlogs] = useState([]), [blog, setBlog] = useState(null);
  const [typed, setTyped] = useState(''), [loading, setLoading] = useState(true), [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' }), [sending, setSending] = useState(false);
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
    if (form.website.trim()) { toast.success('Message sent successfully'); return; }
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Please enter valid details.'); return; }
    setSending(true);
    try { await api.post('/contact', form); toast.success('Message sent successfully'); setForm({ name: '', email: '', subject: '', message: '', website: '' }); }
    catch (error) { toast.error(error?.response?.data?.message || 'Could not send message.'); }
    finally { setSending(false); }
  };

  const theme = dark ? { page: 'bg-[#0a0a0f] text-[#f5f5f5]', muted: 'text-zinc-400', header: scrolled ? 'border-white/10 bg-[#0a0a0f]/80' : '', input: 'border-white/10 bg-white/5 text-white', mobile: 'border-white/10 bg-[#0a0a0f]/95' } : { page: 'bg-slate-50 text-slate-900', muted: 'text-zinc-600', header: scrolled ? 'border-slate-200 bg-white/85' : '', input: 'border-slate-200 bg-white text-slate-900', mobile: 'border-slate-200 bg-white/95' };

  return <div className={`min-h-screen overflow-x-hidden ${theme.page}`}>
    <Toaster position="top-right" />
    <div className="fixed left-0 top-0 z-[100] h-1 bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${progress}%` }} />
    <Header nav={NAV} menu={menu} setMenu={setMenu} go={go} toggleTheme={toggleTheme} dark={dark} theme={theme} Sun={Sun} Moon={Moon} Menu={Menu} X={X} />
    <main>
      <Hero typed={typed} go={go} FaGithub={FaGithub} FaLinkedin={FaLinkedin} Mail={Mail} ArrowUpRight={ArrowUpRight} theme={theme} />
      <About SectionTitle={SectionTitle} Card={Card} />
      <Skills SectionTitle={SectionTitle} Card={Card} grouped={grouped} />
      <Projects SectionTitle={SectionTitle} loading={loading} projects={projects} fallbackProjects={FALLBACK_PROJECTS} FaGithub={FaGithub} ExternalLink={ExternalLink} />
      <Blog SectionTitle={SectionTitle} Card={Card} blogs={blogs} blog={blog} setBlog={setBlog} />
      <Contact SectionTitle={SectionTitle} Card={Card} theme={theme} form={form} updateField={updateField} submit={submit} sending={sending} />
    </main>
    <Footer />
  </div>;
}
