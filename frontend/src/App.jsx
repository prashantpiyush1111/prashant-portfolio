import { useEffect, useState } from 'react'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load projects')
        return response.json()
      })
      .then(setProjects)
      .catch(() => setError('Projects could not be loaded right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <section id="projects" className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">Selected Work</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
            <p className="mt-4 max-w-2xl text-slate-400">A selection of full-stack and AI-powered products I have built.</p>
          </div>
          <ArrowUpRight className="hidden h-8 w-8 text-slate-700 sm:block" />
        </div>

        {loading && <p className="text-slate-400">Loading projects...</p>}
        {error && <p className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-slate-700">
                <div className="aspect-[16/10] overflow-hidden bg-slate-800">
                  <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.techStack.split(',').map((tech) => (
                      <span key={tech} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                    {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
                      <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                        <ExternalLink className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
