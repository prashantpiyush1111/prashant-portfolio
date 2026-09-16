import '@testing-library/jest-dom/vitest';

class IntersectionObserverMock {
  constructor(callback) { this.callback = callback; }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock;
