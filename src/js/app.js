/* eslint no-console:0 */

// Rails UJS - Required for DELETE, POST, PUT links
import Rails from "@rails/ujs";
Rails.start();

// htmx 2.0
import htmx from 'htmx.org';
window.htmx = htmx;

// Alpine.js
import Alpine from 'alpinejs';
import * as components from './alpine/components';

window.Alpine = Alpine;

// Register Alpine components
Alpine.data('notification', components.notification);
Alpine.data('modal', components.modal);
Alpine.data('dropdown', components.dropdown);
Alpine.data('tabs', components.tabs);
Alpine.data('collapsible', components.collapsible);
Alpine.data('map', components.map);
Alpine.data('addressAutocomplete', components.addressAutocomplete);

// Custom htmx configuration for performance
htmx.config.historyCacheSize = 20;
htmx.config.timeout = 30000;
htmx.config.refreshOnHistoryMiss = true;
htmx.config.defaultSwapDelay = 0; // Immediate swap for better perceived performance
htmx.config.defaultSettleDelay = 20; // Fast settle for smoother transitions

// Disable cache busting for better caching
htmx.config.getCacheBusterParam = false;

// Global htmx event handlers
document.body.addEventListener('htmx:configRequest', (event) => {
  // Add CSRF token to all htmx requests
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrf) {
    event.detail.headers['X-CSRF-Token'] = csrf;
  }

  // Add cache control headers for GET requests
  if (event.detail.verb === 'get') {
    // Cache stats requests for 30 seconds
    if (event.detail.path.includes('/guest_stats')) {
      event.detail.headers['Cache-Control'] = 'max-age=30';
    }
    // Cache other GET requests for 5 minutes
    else {
      event.detail.headers['Cache-Control'] = 'max-age=300';
    }
  }
});

// Show loading indicators
document.body.addEventListener('htmx:beforeRequest', (event) => {
  const indicator = event.target.querySelector('.htmx-indicator');
  if (indicator) indicator.classList.remove('hidden');
});

document.body.addEventListener('htmx:afterRequest', (event) => {
  const indicator = event.target.querySelector('.htmx-indicator');
  if (indicator) indicator.classList.add('hidden');
});

// Error handling with toast notification
document.body.addEventListener('htmx:responseError', (event) => {
  console.error('htmx error:', event.detail);
  window.dispatchEvent(new CustomEvent('add-toast', {
    detail: {
      message: 'An error occurred. Please try again.',
      type: 'error'
    }
  }));
});

// Success notification on common actions
document.body.addEventListener('htmx:afterSwap', (event) => {
  const successMessage = event.detail.xhr.getResponseHeader('X-Success-Message');
  if (successMessage) {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        message: successMessage,
        type: 'success'
      }
    }));
  }
});

// Start Alpine (will be configured with components later)
Alpine.start();
