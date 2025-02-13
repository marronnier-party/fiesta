document.addEventListener('htmx:beforeSwap', function(evt) {
    const target = document.querySelector('#wizard-content');
    if (target) {
      target.classList.add('wizard-step-exit');
      setTimeout(() => {
        target.classList.add('wizard-step-exit-active');
      }, 10);
    }
  });
  
  document.addEventListener('htmx:afterSwap', function(evt) {
    const target = document.querySelector('#wizard-content');
    if (target) {
      target.classList.add('wizard-step-enter');
      setTimeout(() => {
        target.classList.add('wizard-step-enter-active');
        setTimeout(() => {
          target.classList.remove('wizard-step-enter', 'wizard-step-enter-active');
        }, 300);
      }, 10);
    }
  });
  
  // Clear localStorage when wizard completes
  document.addEventListener('htmx:afterRequest', function(evt) {
    if (evt.detail.pathInfo.requestPath.includes('/events/create') && 
        evt.detail.successful) {
      for (let i = 1; i <= 5; i++) {
        localStorage.removeItem(`event-step-${i}`);
      }
    }
  });