import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionTitle from '../components/SectionTitle';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Mail, ArrowUpRight } from 'lucide-react';

const noop = () => {};
const theme = { muted: 'text-zinc-500' };

describe('portfolio components', () => {
  it('renders a section title', () => {
    render(<SectionTitle eyebrow="Skills" title="My toolkit" text="Built for real projects." />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('My toolkit')).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(<Footer />);
    expect(screen.getByText(/Prashant Maurya/)).toBeInTheDocument();
  });

  it('renders hero identity and primary CTA', () => {
    render(<Hero typed="Java Full Stack Developer" go={noop} FaGithub={() => null} FaLinkedin={() => null} Mail={Mail} ArrowUpRight={ArrowUpRight} theme={theme} />);
    expect(screen.getByText(/Prashant Maurya/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Projects/i })).toBeInTheDocument();
  });
});
