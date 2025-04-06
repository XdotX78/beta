// Font loader utility
export function loadFonts() {
  if (typeof window === 'undefined') {
    return; // Skip on server-side
  }

  // Use the Font Loading API if available
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('1em "Inter"'),
      document.fonts.load('1em "Fira Mono"')
    ])
      .then(() => {
        document.documentElement.classList.add('fonts-loaded');
        console.log('Fonts loaded successfully: Inter and Fira Mono');
      })
      .catch(error => {
        console.warn('Font loading failed:', error);
      });
  }
} 