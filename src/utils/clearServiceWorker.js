// Utility to clear cached service workers
export const clearServiceWorker = async () => {
  try {
    // Unregister any existing service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service worker unregistered');
      }
    }
    
    // Clear cache storage
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache storage cleared');
    }
    
    console.log('Service worker cleanup completed');
  } catch (error) {
    console.error('Error clearing service worker:', error);
  }
};

// Function to prevent chrome-extension caching
export const preventChromeExtensionCaching = () => {
  // Override fetch to prevent caching chrome-extension URLs
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('chrome-extension://')) {
      console.warn('Blocked chrome-extension request:', url);
      return Promise.reject(new Error('Chrome extension requests not supported'));
    }
    return originalFetch(url, options);
  };
}; 