import { FaGithub } from 'react-icons/fa';
import { Mail, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-6 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-zinc-500 sm:flex-row">
        <p>© 2026 Prashant Maurya</p>
        <p>Built with React & Spring Boot</p>

        <div className="flex items-center gap-4">
          <a
            href="http://localhost:8080/api/blogs/rss"
            aria-label="Subscribe via RSS"
            className="inline-flex items-center gap-1 hover:text-cyan-500"
          >
            <Rss size={16} /> RSS
          </a>

          <a
            href="https://github.com/prashantpiyush1111"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="mailto:prashantpiyush1111@gmail.com"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}