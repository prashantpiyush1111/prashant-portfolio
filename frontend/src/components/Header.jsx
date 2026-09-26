export default function Header({ nav, menu, setMenu, go, theme, scrolled, themeMode, cycleTheme, dark, Sun, Moon, Monitor, Menu, X }) {
  const ThemeIcon = themeMode === 'system' ? Monitor : dark ? Sun : Moon;
  const writingVaultUrl = import.meta.env.VITE_WRITING_VAULT_URL;
  return <header className={`fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all ${theme.header}`}>
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <button onClick={() => go('home')} className="text-xl font-black">PM<span className="text-cyan-500">.</span></button>
      <nav className="hidden items-center gap-7 md:flex">{nav.map((item) => <button key={item} onClick={() => go(item)} className={`text-sm transition ${theme.muted} hover:text-cyan-500`}>{item[0].toUpperCase() + item.slice(1)}</button>)}{writingVaultUrl && <a href={writingVaultUrl} target="_blank" rel="noreferrer" aria-label="Open Writing Vault" title="Writing Vault" className={`rounded-xl border border-zinc-200 p-2 transition hover:text-cyan-500 dark:border-white/10 ${theme.muted}`}>✍️</a>}<button onClick={cycleTheme} aria-label={`Theme: ${themeMode}. Click to switch`} title={`Theme: ${themeMode}`} className="rounded-xl border border-zinc-200 p-2 dark:border-white/10"><ThemeIcon size={17} /></button></nav>
      <button className="md:hidden" onClick={() => setMenu((value) => !value)} aria-label="Open menu">{menu ? <X /> : <Menu />}</button>
    </div>
    {menu && <div className={`border-t px-6 py-3 md:hidden ${theme.mobile}`}>{nav.map((item) => <button key={item} onClick={() => go(item)} className={`block w-full py-3 text-left ${theme.muted}`}>{item[0].toUpperCase() + item.slice(1)}</button>)}{writingVaultUrl && <a href={writingVaultUrl} target="_blank" rel="noreferrer" onClick={() => setMenu(false)} className={`flex w-full items-center gap-2 py-3 ${theme.muted}`}>✍️ Writing Vault</a>}<button onClick={cycleTheme} className={`flex items-center gap-2 py-3 ${theme.muted}`}><ThemeIcon size={16} />Theme: {themeMode}</button></div>}
  </header>;
}
