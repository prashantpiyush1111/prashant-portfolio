import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header';
import Card from './Card';

const icons = {
  Sun: () => null, Moon: () => null, Menu: () => null, X: () => null,
};

const theme = { muted: 'text-zinc-400', header: '', mobile: 'bg-white', input: 'bg-white' };

describe('portfolio components', () => {
  it('renders card content', () => {
    render(<Card>Build reliable software</Card>);
    expect(screen.getByText('Build reliable software')).toBeInTheDocument();
  });

  it('navigates from the header and closes mobile menu', () => {
    const go = (id) => expect(id).toBe('projects');
    const setMenu = (updater) => expect(updater(true)).toBe(false);
    render(<Header nav={['projects']} menu={false} setMenu={setMenu} go={go} toggleTheme={() => {}} dark={true} theme={theme} scrolled={false} {...icons} />);
    fireEvent.click(screen.getByRole('button', { name: 'Projects' }));
  });

  it('calls theme toggle from desktop control', () => {
    let toggled = false;
    render(<Header nav={[]} menu={false} setMenu={() => {}} go={() => {}} toggleTheme={() => { toggled = true; }} dark={true} theme={theme} scrolled={false} {...icons} />);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(toggled).toBe(true);
  });
});
