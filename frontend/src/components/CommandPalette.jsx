import { useEffect, useState } from 'react';
import { Command, Download, Mail, Moon, UserRound, BriefcaseBusiness } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ACTIONS = [
  { id: 'projects', label: 'Go to Projects', icon: BriefcaseBusiness },
  { id: 'contact', label: 'Go to Contact', icon: Mail },
  { id: 'about', label: 'Go to About', icon: UserRound },
  { id: 'theme', label: 'Toggle theme', icon: Moon },
  { id: 'resume', label: 'Download resume', icon: Download },
];

export default function CommandPalette({ go }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { cycleTheme, theme } = useTheme();

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;
  const visible = ACTIONS.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));
  const run = (id) => {
    setOpen(false); setQuery('');
    if (id === 'theme') return cycleTheme();
    if (id === 'resume') return window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
    go(id);
  };

  return <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 p-5 pt-[15vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
    <div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111118]" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-white/10"><Command size={18} className="text-zinc-400" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a command…" className="w-full bg-transparent py-4 outline-none" /></div>
      <div className="p-2">{visible.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => run(id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-zinc-100 dark:hover:bg-white/10"><Icon size={17} /><span>{label}</span>{id === 'theme' && <span className="ml-auto text-xs text-zinc-400">{theme}</span>}</button>)}{!visible.length && <p className="px-3 py-6 text-center text-sm text-zinc-500">No commands found.</p>}</div>
    </div>
  </div>;
}
