import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Experience from '../components/Experience';

const SectionTitle = ({ title }) => <h2>{title}</h2>;

describe('Experience', () => {
  it('renders achievement cards from API data', () => {
    render(<Experience SectionTitle={SectionTitle} loading={false} achievements={[{ id: 1, title: 'Hackathon', description: 'Built a working prototype.', date: '2026-08-01', type: 'hackathon' }]} />);
    expect(screen.getByRole('heading', { name: 'Milestones that shaped my journey.' })).toBeInTheDocument();
    expect(screen.getByText('Hackathon')).toBeInTheDocument();
    expect(screen.getByText('Built a working prototype.')).toBeInTheDocument();
  });
});
