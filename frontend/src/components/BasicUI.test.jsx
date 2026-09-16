import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header';
import Card from './Card';

const icons = {
  Sun: () => null,
  Moon: () => null,
  Monitor: () => null,
  Menu: () => null,
  X: () => null,
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
    render(
      <Header
        nav={['projects']}
        menu={false}
        setMenu={setMenu}
        go={go}
        cycleTheme={() => {}}
        themeMode="dark"
        dark={true}
        theme={theme}
        scrolled={false}
        {...icons}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Projects' }));
  });

  it('calls cycleTheme from desktop control', () => {
    let cycled = false;
    render(
      <Header
        nav={[]}
        menu={false}
        setMenu={() => {}}
        go={() => {}}
        cycleTheme={() => { cycled = true; }}
        themeMode="dark"
        dark={true}
        theme={theme}
        scrolled={false}
        {...icons}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Theme: dark. Click to switch' }));
    expect(cycled).toBe(true);
  });
});
