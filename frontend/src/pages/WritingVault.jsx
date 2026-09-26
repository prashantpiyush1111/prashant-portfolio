import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = (import.meta.env.VITE_WRITING_API || 'http://localhost:9899/api').replace(/\/$/, '');
const EMPTY = { title: '', type: 'SHAYARI', content: '', isPublic: false };

export default function WritingVault() {
  const [mode, setMode] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('writingToken'));
  const [role, setRole] = useState(localStorage.getItem('writingRole'));
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (token) load(role === 'OWNER' ? 'private' : 'public'); }, [token, role]);

  async function load(kind) {
    setBusy(true);
    try {
      const r = await fetch(API + '/writings/' + kind, { headers: { Authorization: 'Bearer ' + token } });
      if (r.status === 401) return logout();
      if (!r.ok) throw new Error();
      setItems(await r.json());
    } catch { setError('Could not load writings. Check the backend connection.'); }
    finally { setBusy(false); }
  }

  async function access(path, body) {
    setBusy(true); setError('');
    try {
      const r = await fetch(API + '/access/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return setError(data.error || 'Invalid access details');
      localStorage.setItem('writingToken', data.accessToken);
      localStorage.setItem('writingRole', data.role);
      setToken(data.accessToken); setRole(data.role);
      setMode(data.role === 'OWNER' ? 'dashboard' : 'library');
    } catch { setError('Unable to connect to the writing service.'); }
    finally { setBusy(false); }
  }

  async function save(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const r = await fetch(editing ? API + '/writings/' + editing : API + '/writings', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(form)
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Save failed');
      setForm(EMPTY); setEditing(null); await load('private');
    } catch (e2) { setError(e2.message || 'Could not save writing.'); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (!window.confirm('Delete this writing?')) return;
    setBusy(true);
    try {
      const r = await fetch(API + '/writings/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) throw new Error();
      await load('private');
    } catch { setError('Could not delete this writing.'); }
    finally { setBusy(false); }
  }

  async function logout() {
    if (token) await fetch(API + '/access/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + token } }).catch(() => {});
    localStorage.removeItem('writingToken'); localStorage.removeItem('writingRole');
    setToken(null); setRole(null); setItems([]); setMode('home');
  }

  const type = (editing ? form.type : items[0]?.type || 'NOTE').toLowerCase();

  return <main className={'writing-vault ' + (token ? type : 'home')}>
    <style>{CSS}</style>
    <header className="wv-header">
      <Link to="/" className="wv-brand">Writing Vault</Link>
      {token ? <button className="wv-ghost" onClick={logout}>{role === 'OWNER' ? 'Logout' : 'Exit'}</button> : <Link to="/" className="wv-ghost">Portfolio</Link>}
    </header>

    {!token && <section className="wv-hero">
      <span className="wv-eyebrow">WRITING VAULT</span>
      <h1>Your words.<br /><i>Your space.</i></h1>
      <p>A private place for shayari, stories and everything you want to remember.</p>
      <div className="wv-actions"><button onClick={() => setMode('owner')}>Owner Login</button><button className="wv-ghost" onClick={() => setMode('public')}>Public Access</button></div>
      {mode === 'owner' && <Login title="Owner Login" fields={['username', 'password']} onSubmit={(v) => access('owner', v)} error={error} busy={busy} close={() => setMode('home')} />}
      {mode === 'public' && <Login title="Enter 4-digit code" fields={['code']} onSubmit={(v) => access('public', v)} error={error} busy={busy} close={() => setMode('home')} />}
    </section>}

    {token && role === 'OWNER' && <section className="wv-dashboard">
      <div><span className="wv-eyebrow">{editing ? 'EDIT' : 'CREATE'}</span><h2>{editing ? 'Edit writing.' : 'Write something.'}</h2>
        <form onSubmit={save}>
          <input placeholder="Title" maxLength="120" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>SHAYARI</option><option>STORY</option><option>NOTE</option></select>
          <textarea placeholder="Write here..." maxLength="50000" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          <label><input type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} /> Make public</label>
          <div className="wv-actions"><button disabled={busy}>{busy ? 'Saving…' : editing ? 'Update' : 'Save Writing'}</button>{editing && <button type="button" className="wv-ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}</div>
          {error && <small>{error}</small>}
        </form>
      </div>
      <Library items={items} owner busy={busy} onEdit={x => { setEditing(x.id); setForm({ title: x.title, type: x.type, content: x.content, isPublic: x.public }); }} onDelete={remove} />
    </section>}

    {token && role !== 'OWNER' && <Library items={items} publicView busy={busy} />}
  </main>;
}

function Login({ title, fields, onSubmit, error, busy, close }) {
  const [values, setValues] = useState({});
  return <div className="wv-card wv-login"><button type="button" className="wv-close wv-ghost" onClick={close}>×</button><h2>{title}</h2>
    <form onSubmit={e => { e.preventDefault(); onSubmit(values); }}>
      {fields.map(f => <input key={f} type={f === 'password' ? 'password' : 'text'} inputMode={f === 'code' ? 'numeric' : undefined} maxLength={f === 'code' ? 4 : undefined} pattern={f === 'code' ? '[0-9]{4}' : undefined} placeholder={f === 'code' ? '4-digit code' : f} onChange={e => setValues({ ...values, [f]: e.target.value })} required />)}
      <button disabled={busy}>{busy ? 'Checking…' : 'Continue'}</button>{error && <small>{error}</small>}
    </form>
  </div>;
}

function Library({ items, publicView, owner, onEdit, onDelete, busy }) {
  return <section className="wv-library"><div className="wv-library-head"><span className="wv-eyebrow">{publicView ? 'PUBLIC WRITINGS' : 'YOUR WRITINGS'}</span><span className="wv-muted">{items.length} {items.length === 1 ? 'writing' : 'writings'}</span></div>
    {busy && !items.length ? <p className="wv-muted">Loading…</p> : !items.length ? <p className="wv-muted">Nothing here yet.</p> : items.map(x => <article className={'wv-entry ' + x.type.toLowerCase()} key={x.id}><span>{x.type}</span><h3>{x.title}</h3><p>{x.content}</p><em>{x.public ? 'Public' : 'Private'}</em>{owner && <div className="wv-actions"><button className="wv-ghost" onClick={() => onEdit(x)}>Edit</button><button className="wv-ghost" onClick={() => onDelete(x.id)}>Delete</button></div>}</article>)}
  </section>;
}

const CSS = `
.writing-vault{min-height:100vh;padding:28px;box-sizing:border-box;font-family:Inter,system-ui,sans-serif;color:#201c19;background:#f6f1ea}.writing-vault *{box-sizing:border-box}.writing-vault.home{display:grid;place-items:center}.writing-vault.shayari{background:radial-gradient(circle at 50% 0,#f1dfd0,#f7f1e9 45%,#eee5dc)}.writing-vault.story{background:#fbfaf7}.writing-vault.note{background:linear-gradient(135deg,#f5f1e8,#ece7dc)}.wv-header{display:flex;justify-content:space-between;align-items:center;max-width:1100px;margin:auto}.wv-brand{font-weight:800;color:inherit;text-decoration:none}.wv-hero{max-width:760px;text-align:center}.wv-eyebrow{font-size:11px;letter-spacing:.22em;font-weight:800;opacity:.55}.wv-hero h1{font-size:clamp(48px,8vw,96px);line-height:.9;margin:20px 0}.wv-hero h1 i{font-family:Georgia,serif;font-weight:400}.wv-hero p{max-width:520px;margin:0 auto 28px;color:#6c6259;font-size:18px}.wv-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}.wv-card{background:#fffaf4;border:1px solid #e5d8ca;border-radius:22px;padding:24px;box-shadow:0 20px 60px #00000010}.wv-login{position:fixed;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:min(390px,calc(100% - 32px));z-index:10}.wv-login h2{margin-top:0}.wv-close{position:absolute;right:14px;top:14px;padding:6px 11px}.wv-dashboard{max-width:1100px;margin:60px auto;display:grid;grid-template-columns:1fr 1fr;gap:40px}.wv-dashboard h2{font-size:46px;margin:10px 0 25px}.wv-library{max-width:1100px;margin:60px auto}.wv-library-head{display:flex;justify-content:space-between}.wv-entry{padding:25px 0;border-bottom:1px solid #d9cfc5}.wv-entry h3{font:36px Georgia,serif;margin:8px 0}.wv-entry p{white-space:pre-wrap;line-height:1.8;color:#514941}.wv-entry span,.wv-entry em{font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.55}.wv-entry.shayari{text-align:center;padding:40px 20px}.wv-entry.shayari p{font-size:20px;line-height:2.1;font-style:italic}.wv-entry.story{max-width:700px;margin:auto}.wv-entry.story h3{font-size:40px}.wv-entry.note{max-width:760px;margin:auto}.wv-muted{color:#8b7e72}.writing-vault form{display:grid;gap:12px}.writing-vault input,.writing-vault textarea,.writing-vault select{width:100%;border:1px solid #d9cabc;border-radius:12px;padding:13px;background:#fff;color:inherit;font:inherit}.writing-vault textarea{min-height:190px;resize:vertical}.writing-vault button{border:0;border-radius:999px;padding:12px 20px;background:#241f1b;color:white;font-weight:700;cursor:pointer}.writing-vault .wv-ghost{background:transparent;color:inherit;border:1px solid #cdbfb1}.writing-vault button:disabled{opacity:.55;cursor:not-allowed}.writing-vault small{display:block;margin-top:4px}@media(max-width:760px){.writing-vault{padding:20px}.wv-dashboard{grid-template-columns:1fr}.wv-dashboard h2{font-size:36px}.wv-library-head{gap:10px}.wv-entry h3{font-size:30px}}
`;
