import React from 'react';
import { render, screen } from '@testing-library/react';
import GlassIcons from './GlassIcons';

const sampleItems = [
  { icon: <span data-testid="icon-scanner">📷</span>, color: 'emerald' as const, label: 'Scanner AI', href: '/scanner' },
  { icon: <span data-testid="icon-pickup">🚛</span>, color: 'teal' as const, label: 'Pickup Sampah', href: '/pickup' },
  { icon: <span data-testid="icon-wallet">💰</span>, color: 'amber' as const, label: 'Eco Wallet', href: '/wallet' },
];

const singleItem = [
  { icon: <span>🔍</span>, color: 'blue' as const, label: 'Only Item', href: '/only' },
];

describe('GlassIcons', () => {
  it('renders all items with labels', () => {
    render(<GlassIcons items={sampleItems} />);
    expect(screen.getByText('Scanner AI')).toBeInTheDocument();
    expect(screen.getByText('Pickup Sampah')).toBeInTheDocument();
    expect(screen.getByText('Eco Wallet')).toBeInTheDocument();
  });

  it('renders icons inside each card', () => {
    render(<GlassIcons items={sampleItems} />);
    expect(screen.getByTestId('icon-scanner')).toBeInTheDocument();
    expect(screen.getByTestId('icon-pickup')).toBeInTheDocument();
    expect(screen.getByTestId('icon-wallet')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GlassIcons items={sampleItems} className="my-grid" />
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('my-grid');
    expect(grid.className).toContain('grid');
  });

  it('renders items as anchor tags with href', () => {
    render(<GlassIcons items={sampleItems} />);
    const scannerLink = screen.getByText('Scanner AI').closest('a');
    expect(scannerLink).toHaveAttribute('href', '/scanner');

    const pickupLink = screen.getByText('Pickup Sampah').closest('a');
    expect(pickupLink).toHaveAttribute('href', '/pickup');
  });

  it('uses default href when none is provided', () => {
    const itemsWithNoHref = [
      { icon: <span>🔍</span>, color: 'blue' as const, label: 'No Link' },
    ];
    render(<GlassIcons items={itemsWithNoHref} />);
    const link = screen.getByText('No Link').closest('a');
    expect(link).toHaveAttribute('href', '#');
  });

  it('renders with compact variant', () => {
    const { container } = render(
      <GlassIcons items={sampleItems} variant="compact" />
    );
    // Compact variant uses smaller padding
    const item = container.querySelector('.group');
    expect(item).toBeInTheDocument();
    expect(item?.className).toContain('p-3');
  });

  it('renders with expanded variant and shows descriptions', () => {
    const itemsWithDesc = [
      {
        icon: <span>A</span>,
        color: 'blue' as const,
        label: 'Test',
        description: 'This is a description',
        href: '/test',
      },
    ];
    render(<GlassIcons items={itemsWithDesc} variant="expanded" />);
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('does not show descriptions in non-expanded variants', () => {
    const itemsWithDesc = [
      {
        icon: <span>A</span>,
        color: 'blue' as const,
        label: 'Test',
        description: 'Hidden description',
        href: '/test',
      },
    ];
    render(<GlassIcons items={itemsWithDesc} variant="compact" />);
    expect(screen.queryByText('Hidden description')).not.toBeInTheDocument();
  });

  it('handles empty items array without crashing', () => {
    const { container } = render(<GlassIcons items={[]} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid).toBeInTheDocument();
    expect(grid.children.length).toBe(0);
  });

  it('renders single item correctly', () => {
    render(<GlassIcons items={singleItem} />);
    expect(screen.getByText('Only Item')).toBeInTheDocument();
    const link = screen.getByText('Only Item').closest('a');
    expect(link).toHaveAttribute('href', '/only');
  });

  it('applies default grid columns (3) when not specified', () => {
    const { container } = render(<GlassIcons items={sampleItems} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-3');
  });

  it('applies 6-column grid layout', () => {
    const { container } = render(
      <GlassIcons items={sampleItems} columns={6} />
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid-cols-2');
    expect(grid.className).toContain('sm:grid-cols-3');
    expect(grid.className).toContain('lg:grid-cols-6');
  });

  it('applies 4-column grid layout', () => {
    const { container } = render(
      <GlassIcons items={sampleItems} columns={4} />
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid-cols-2');
    expect(grid.className).toContain('sm:grid-cols-4');
  });

  it('uses customClass on individual items', () => {
    const itemsWithCustomClass = [
      { icon: <span>A</span>, color: 'blue' as const, label: 'Custom', href: '/c', customClass: 'my-item-class' },
    ];
    const { container } = render(<GlassIcons items={itemsWithCustomClass} />);
    const item = container.querySelector('.my-item-class');
    expect(item).toBeInTheDocument();
  });

  it('renders with colorful={false} (no gradient backgrounds)', () => {
    const { container } = render(
      <GlassIcons items={sampleItems} colorful={false} />
    );
    // Items should still render without gradient (plain color)
    const iconSpans = container.querySelectorAll('.rounded-xl');
    expect(iconSpans.length).toBeGreaterThan(0);
    expect(screen.getByText('Scanner AI')).toBeInTheDocument();
  });

  it('falls back to custom color string when color is not in gradientMapping', () => {
    const itemsWithCustomColor = [
      { icon: <span>A</span>, color: '#ff6600' as any, label: 'Custom Color', href: '/c' },
    ];
    render(<GlassIcons items={itemsWithCustomColor} />);
    expect(screen.getByText('Custom Color')).toBeInTheDocument();
  });
});
