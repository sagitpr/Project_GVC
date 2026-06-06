import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BorderGlow from './BorderGlow';

// Mock getBoundingClientRect with a fixed size container
const mockGetBoundingClientRect = jest.fn(() => ({
  width: 300,
  height: 200,
  top: 0,
  left: 0,
  right: 300,
  bottom: 200,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}));

beforeEach(() => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(mockGetBoundingClientRect);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('BorderGlow', () => {
  it('renders children correctly', () => {
    render(
      <BorderGlow>
        <span data-testid="child">Content</span>
      </BorderGlow>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Content');
  });

  it('applies custom className', () => {
    const { container } = render(
      <BorderGlow className="custom-class">
        <span>Content</span>
      </BorderGlow>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
    expect(wrapper.className).toContain('relative');
    expect(wrapper.className).toContain('overflow-hidden');
  });

  it('renders absolute-positioned overlay elements for glow and border', () => {
    const { container } = render(
      <BorderGlow>
        <span>Content</span>
      </BorderGlow>
    );
    // After mount, should have glow layers (absolute positioned)
    const absoluteDivs = container.querySelectorAll('.absolute');
    expect(absoluteDivs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders glow overlay and border elements after mount', () => {
    const { container } = render(
      <BorderGlow>
        <span>Content</span>
      </BorderGlow>
    );

    // Should have glow overlay (pointer-events-none, z-10)
    const glowOverlay = container.querySelector('.z-10');
    expect(glowOverlay).toBeInTheDocument();

    // Should have border ring (z-0)
    const borderRing = container.querySelector('.z-0');
    expect(borderRing).toBeInTheDocument();

    // Should have inner content wrapper (z-20)
    const contentWrapper = container.querySelector('.z-20');
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveTextContent('Content');
  });

  it('accepts custom backgroundColor and borderRadius props', () => {
    const { container } = render(
      <BorderGlow backgroundColor="#ff0000" borderRadius={24}>
        <span>Content</span>
      </BorderGlow>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(wrapper.style.borderRadius).toBe('24px');
  });

  it('applies custom colors array', () => {
    const { container } = render(
      <BorderGlow colors={['#ff0000', '#00ff00', '#0000ff']}>
        <span>Content</span>
      </BorderGlow>
    );
    const borderRing = container.querySelector('.z-0') as HTMLElement;
    // Border should have a semi-transparent color
    expect(borderRing).toBeInTheDocument();
  });

  it('handles mouse move and updates glow state', () => {
    const { container } = render(
      <BorderGlow edgeSensitivity={50} glowIntensity={1}>
        <span>Content</span>
      </BorderGlow>
    );

    const wrapper = container.firstChild as HTMLElement;

    // Fire mouse move near the top-left corner (close to edge)
    fireEvent.mouseMove(wrapper, { clientX: 5, clientY: 5 });

    // The glow overlay should have opacity > 0 after hover near edge
    const glowOverlay = container.querySelector('.z-10') as HTMLElement;
    const opacity = parseFloat(glowOverlay.style.opacity);
    expect(opacity).toBeGreaterThan(0);
  });

  it('handles mouse leave and resets glow', () => {
    const { container } = render(
      <BorderGlow>
        <span>Content</span>
      </BorderGlow>
    );

    const wrapper = container.firstChild as HTMLElement;

    // First move mouse to trigger glow
    fireEvent.mouseMove(wrapper, { clientX: 5, clientY: 5 });

    // Then leave
    fireEvent.mouseLeave(wrapper);

    const glowOverlay = container.querySelector('.z-10') as HTMLElement;
    expect(glowOverlay.style.opacity).toBe('0');
  });

  it('does not glow when mouse is far from edges', () => {
    const { container } = render(
      <BorderGlow edgeSensitivity={30} glowIntensity={1}>
        <span>Content</span>
      </BorderGlow>
    );

    const wrapper = container.firstChild as HTMLElement;

    // Fire mouse move in the center (far from edges)
    fireEvent.mouseMove(wrapper, { clientX: 150, clientY: 100 });

    const glowOverlay = container.querySelector('.z-10') as HTMLElement;
    const opacity = parseFloat(glowOverlay.style.opacity);
    expect(opacity).toBe(0);
  });

  it('uses glowColor for default configuration', () => {
    const { container } = render(
      <BorderGlow glowColor="200 70 60">
        <span>Content</span>
      </BorderGlow>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
  });
});
