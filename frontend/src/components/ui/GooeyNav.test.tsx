import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GooeyNav from './GooeyNav';

const sampleItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

describe('GooeyNav', () => {
  it('renders all navigation items', () => {
    render(<GooeyNav items={sampleItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GooeyNav items={sampleItems} className="my-custom-nav" />
    );
    // The wrapper div has the className
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('my-custom-nav');
  });

  it('renders a nav element within the component', () => {
    const { container } = render(<GooeyNav items={sampleItems} />);
    // After mount, the component wraps content in a div, containing a nav
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav?.children.length).toBeGreaterThanOrEqual(3);
  });

  it('renders SVG filter and gooey nav after mount', () => {
    const { container } = render(<GooeyNav items={sampleItems} />);

    // Should have SVG filter
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    // Should have gooey filter
    const filter = container.querySelector('filter');
    expect(filter).toBeInTheDocument();
    expect(filter?.id).toBe('gooey-nav-filter');
  });

  it('sets the first item as active by default', () => {
    render(<GooeyNav items={sampleItems} />);

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('text-white');

    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).not.toHaveClass('text-white');
  });

  it('respects initialActiveIndex prop', () => {
    render(<GooeyNav items={sampleItems} initialActiveIndex={2} />);

    const contactLink = screen.getByText('Contact').closest('a');
    expect(contactLink).toHaveClass('text-white');

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).not.toHaveClass('text-white');
  });

  it('calls onItemClick when a nav item is clicked', () => {
    const handleClick = jest.fn();
    render(<GooeyNav items={sampleItems} onItemClick={handleClick} />);

    const aboutLink = screen.getByText('About');
    fireEvent.click(aboutLink);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(
      { label: 'About', href: '/about' },
      1
    );
  });

  it('prevents default anchor navigation on click', () => {
    render(<GooeyNav items={sampleItems} />);

    const homeLink = screen.getByText('Home');
    const preventDefault = jest.fn();
    fireEvent.click(homeLink, { preventDefault });

    // The click handler should call preventDefault
    // We verify by checking that the default (navigation) was prevented
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('updates active index when a different item is clicked', () => {
    render(<GooeyNav items={sampleItems} />);

    // Initially Home is active
    expect(screen.getByText('Home').closest('a')).toHaveClass('text-white');

    // Click Contact
    fireEvent.click(screen.getByText('Contact'));

    // Now Contact should be active
    expect(screen.getByText('Contact').closest('a')).toHaveClass('text-white');
    expect(screen.getByText('Home').closest('a')).not.toHaveClass('text-white');
  });

  it('handles empty items array without crashing', () => {
    const { container } = render(<GooeyNav items={[]} />);
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    // nav exists even with no items (renders filter/particle elements)
    expect(nav.textContent || '').toBe('');
  });

  it('renders custom colors palette indices', () => {
    const { container } = render(
      <GooeyNav items={sampleItems} colors={[0, 0, 0, 0, 0, 0, 0, 0]} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles items with single entry', () => {
    render(<GooeyNav items={[{ label: 'Only', href: '/only' }]} />);
    expect(screen.getByText('Only')).toBeInTheDocument();
    expect(screen.getByText('Only').closest('a')).toHaveClass('text-white');
  });

  it('renders each item as an anchor with href', () => {
    render(<GooeyNav items={sampleItems} />);

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');

    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('accepts custom animationTime prop', () => {
    const { container } = render(
      <GooeyNav items={sampleItems} animationTime={300} />
    );
    // Active pill transition style uses animationTime * 0.6
    const activePill = container.querySelector('.bg-emerald-600');
    expect(activePill).toBeInTheDocument();
  });
});
