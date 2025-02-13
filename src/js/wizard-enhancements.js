class WizardEnhancements {
    constructor() {
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      // Loading states
      document.addEventListener('htmx:beforeRequest', (e) => {
        const wizard = e.target.closest('.wizard-container');
        if (wizard) {
          wizard.classList.add('wizard-loading');
        }
      });
  
      document.addEventListener('htmx:afterRequest', (e) => {
        const wizard = e.target.closest('.wizard-container');
        if (wizard) {
          wizard.classList.remove('wizard-loading');
        }
      });
  
      // Error handling
      document.addEventListener('htmx:responseError', (e) => {
        const wizard = e.target.closest('.wizard-container');
        if (wizard) {
          this.handleError(wizard, e.detail.xhr);
        }
      });
  
      // Step transitions
      document.addEventListener('htmx:beforeSwap', (e) => {
        const wizard = e.target.closest('.wizard-container');
        if (wizard) {
          wizard.classList.add('wizard-exit', 'wizard-exit-active');
        }
      });
  
      document.addEventListener('htmx:afterSwap', (e) => {
        const wizard = e.target.closest('.wizard-container');
        if (wizard) {
          wizard.classList.add('wizard-enter');
          requestAnimationFrame(() => {
            wizard.classList.add('wizard-enter-active');
            setTimeout(() => {
              wizard.classList.remove('wizard-enter', 'wizard-enter-active');
            }, 300);
          });
        }
      });
    }
  
    handleError(wizard, xhr) {
      // Add shake animation
      wizard.classList.add('error-shake');
      setTimeout(() => wizard.classList.remove('error-shake'), 500);
  
      // Show error toast
      const toast = document.createElement('div');
      toast.className = 'toast toast-error fixed bottom-4 right-4 z-50';
      toast.innerHTML = `
        <div class="alert alert-error">
          <span class="font-medium">Erreur:</span>
          <span>${xhr.status === 422 ? 'Veuillez vérifier vos informations' : 'Une erreur est survenue'}</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    }
  }
  
  // Initialize
  new WizardEnhancements();