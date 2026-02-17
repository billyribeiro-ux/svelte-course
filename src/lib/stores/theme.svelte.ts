class ThemeStore {
  current: 'light' | 'dark' = $state('dark');

  toggle() {
    this.current = this.current === 'light' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', this.current);
      localStorage.setItem('theme', this.current);
    }
  }

  init() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.current = stored || (prefersDark ? 'dark' : 'light');
    }
  }
}

export const theme = new ThemeStore();
