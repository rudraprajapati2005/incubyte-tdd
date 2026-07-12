import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure a clean DOM between tests.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia; several components/hooks (or libraries
// they depend on) probe it for prefers-reduced-motion etc.
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}
