import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CommandPalette from '../components/CommandPalette';
import ProjectDetails from '../pages/ProjectDetails';
import BlogDetails from '../pages/BlogDetails';

const get = vi.fn();
const post = vi.fn();
vi.mock('../api/axios', () => ({ default: { get, post } }));
vi.mock('../context/ThemeContext', () => ({ useTheme: () => ({ theme: 'dark', cycleTheme: vi.fn() }) }));

describe('advanced portfolio features', () => {
  beforeEach(() => { get.mockReset(); post.mockReset(); });

  it('opens command palette and navigates to a selected command', () => {
    const go = vi.fn();
    render(<CommandPalette go={go} />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Go to Projects/i }));
    expect(go).toHaveBeenCalledWith('projects');
  });

  it('loads project details and renders GitHub stats plus gallery', async () => {
    get.mockImplementation((url) => url.includes('github-stats')
      ? Promise.resolve({ data: { stars: 12, updatedAt: '2026-09-10T00:00:00Z' } })
      : Promise.resolve({ data: { id: 1, title: 'Portfolio API', description: 'A project', techStack: 'Java, Spring Boot', githubUrl: 'https://github.com/example/repo', imageUrl: 'one.jpg', imageUrls: ['one.jpg', 'two.jpg'] } }));
    render(<HelmetProvider><MemoryRouter initialEntries={['/projects/1']}><Routes><Route path="/projects/:id" element={<ProjectDetails />} /></Routes></MemoryRouter></HelmetProvider>);
    expect(await screen.findByRole('heading', { name: 'Portfolio API' })).toBeInTheDocument();
    expect(screen.getByText('12 stars')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('loads blog details and renders markdown content', async () => {
    get.mockResolvedValue({ data: { id: 2, title: 'Spring Tips', summary: 'Tips', publishedDate: '2026-09-05', content: '## Clean APIs\n\nUse **services** for business logic.' } });
    render(<HelmetProvider><MemoryRouter initialEntries={['/blog/2']}><Routes><Route path="/blog/:id" element={<BlogDetails />} /></Routes></MemoryRouter></HelmetProvider>);
    expect(await screen.findByRole('heading', { name: 'Spring Tips' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Clean APIs')).toBeInTheDocument());
    expect(screen.getByText('services')).toBeInTheDocument();
  });
});
