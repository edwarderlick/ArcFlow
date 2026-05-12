/**
 * Fix for "Cannot set property fetch of #<Window> which has only a getter"
 * This error occurs when a library tries to assign to window.fetch in an environment
 * where it's a read-only getter (like some iframe sandboxes).
 */
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    if (originalFetch) {
      // Try to make it writable
      Object.defineProperty(window, 'fetch', {
        value: originalFetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    try {
      // If we can't make it a value, try to define a setter that doesn't throw
      const originalFetch = window.fetch;
      Object.defineProperty(window, 'fetch', {
        get: () => originalFetch,
        set: () => { /* ignore attempts to overwrite */ },
        configurable: true,
        enumerable: true
      });
    } catch (e2) {
      // Last resort: if we can't do anything, the environment is extremely locked down
      console.warn('Could not polyfill window.fetch protection');
    }
  }
}

export {};
