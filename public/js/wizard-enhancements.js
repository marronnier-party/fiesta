(() => {
  // src/js/wizard-enhancements.js
  var WizardEnhancements = class {
    constructor() {
      this.setupEventListeners();
    }
    setupEventListeners() {
      document.addEventListener("htmx:beforeRequest", (e) => {
        const wizard = e.target.closest(".wizard-container");
        if (wizard) {
          wizard.classList.add("wizard-loading");
        }
      });
      document.addEventListener("htmx:afterRequest", (e) => {
        const wizard = e.target.closest(".wizard-container");
        if (wizard) {
          wizard.classList.remove("wizard-loading");
        }
      });
      document.addEventListener("htmx:responseError", (e) => {
        const wizard = e.target.closest(".wizard-container");
        if (wizard) {
          this.handleError(wizard, e.detail.xhr);
        }
      });
      document.addEventListener("htmx:beforeSwap", (e) => {
        const wizard = e.target.closest(".wizard-container");
        if (wizard) {
          wizard.classList.add("wizard-exit", "wizard-exit-active");
        }
      });
      document.addEventListener("htmx:afterSwap", (e) => {
        const wizard = e.target.closest(".wizard-container");
        if (wizard) {
          wizard.classList.add("wizard-enter");
          requestAnimationFrame(() => {
            wizard.classList.add("wizard-enter-active");
            setTimeout(() => {
              wizard.classList.remove("wizard-enter", "wizard-enter-active");
            }, 300);
          });
        }
      });
    }
    handleError(wizard, xhr) {
      wizard.classList.add("error-shake");
      setTimeout(() => wizard.classList.remove("error-shake"), 500);
      const toast = document.createElement("div");
      toast.className = "toast toast-error fixed bottom-4 right-4 z-50";
      toast.innerHTML = `
        <div class="alert alert-error">
          <span class="font-medium">Erreur:</span>
          <span>${xhr.status === 422 ? "Veuillez v\xE9rifier vos informations" : "Une erreur est survenue"}</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5e3);
    }
  };
  new WizardEnhancements();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2pzL3dpemFyZC1lbmhhbmNlbWVudHMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNsYXNzIFdpemFyZEVuaGFuY2VtZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIFxuICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICAvLyBMb2FkaW5nIHN0YXRlc1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaHRteDpiZWZvcmVSZXF1ZXN0JywgKGUpID0+IHtcbiAgICAgICAgY29uc3Qgd2l6YXJkID0gZS50YXJnZXQuY2xvc2VzdCgnLndpemFyZC1jb250YWluZXInKTtcbiAgICAgICAgaWYgKHdpemFyZCkge1xuICAgICAgICAgIHdpemFyZC5jbGFzc0xpc3QuYWRkKCd3aXphcmQtbG9hZGluZycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdodG14OmFmdGVyUmVxdWVzdCcsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHdpemFyZCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy53aXphcmQtY29udGFpbmVyJyk7XG4gICAgICAgIGlmICh3aXphcmQpIHtcbiAgICAgICAgICB3aXphcmQuY2xhc3NMaXN0LnJlbW92ZSgnd2l6YXJkLWxvYWRpbmcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIFxuICAgICAgLy8gRXJyb3IgaGFuZGxpbmdcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2h0bXg6cmVzcG9uc2VFcnJvcicsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHdpemFyZCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy53aXphcmQtY29udGFpbmVyJyk7XG4gICAgICAgIGlmICh3aXphcmQpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKHdpemFyZCwgZS5kZXRhaWwueGhyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIFxuICAgICAgLy8gU3RlcCB0cmFuc2l0aW9uc1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaHRteDpiZWZvcmVTd2FwJywgKGUpID0+IHtcbiAgICAgICAgY29uc3Qgd2l6YXJkID0gZS50YXJnZXQuY2xvc2VzdCgnLndpemFyZC1jb250YWluZXInKTtcbiAgICAgICAgaWYgKHdpemFyZCkge1xuICAgICAgICAgIHdpemFyZC5jbGFzc0xpc3QuYWRkKCd3aXphcmQtZXhpdCcsICd3aXphcmQtZXhpdC1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIFxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaHRteDphZnRlclN3YXAnLCAoZSkgPT4ge1xuICAgICAgICBjb25zdCB3aXphcmQgPSBlLnRhcmdldC5jbG9zZXN0KCcud2l6YXJkLWNvbnRhaW5lcicpO1xuICAgICAgICBpZiAod2l6YXJkKSB7XG4gICAgICAgICAgd2l6YXJkLmNsYXNzTGlzdC5hZGQoJ3dpemFyZC1lbnRlcicpO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB3aXphcmQuY2xhc3NMaXN0LmFkZCgnd2l6YXJkLWVudGVyLWFjdGl2ZScpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHdpemFyZC5jbGFzc0xpc3QucmVtb3ZlKCd3aXphcmQtZW50ZXInLCAnd2l6YXJkLWVudGVyLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICBcbiAgICBoYW5kbGVFcnJvcih3aXphcmQsIHhocikge1xuICAgICAgLy8gQWRkIHNoYWtlIGFuaW1hdGlvblxuICAgICAgd2l6YXJkLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLXNoYWtlJyk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHdpemFyZC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvci1zaGFrZScpLCA1MDApO1xuICBcbiAgICAgIC8vIFNob3cgZXJyb3IgdG9hc3RcbiAgICAgIGNvbnN0IHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAndG9hc3QgdG9hc3QtZXJyb3IgZml4ZWQgYm90dG9tLTQgcmlnaHQtNCB6LTUwJztcbiAgICAgIHRvYXN0LmlubmVySFRNTCA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWVycm9yXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJmb250LW1lZGl1bVwiPkVycmV1cjo8L3NwYW4+XG4gICAgICAgICAgPHNwYW4+JHt4aHIuc3RhdHVzID09PSA0MjIgPyAnVmV1aWxsZXogdlx1MDBFOXJpZmllciB2b3MgaW5mb3JtYXRpb25zJyA6ICdVbmUgZXJyZXVyIGVzdCBzdXJ2ZW51ZSd9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIGA7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvYXN0KTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdG9hc3QucmVtb3ZlKCksIDUwMDApO1xuICAgIH1cbiAgfVxuICBcbiAgLy8gSW5pdGlhbGl6ZVxuICBuZXcgV2l6YXJkRW5oYW5jZW1lbnRzKCk7Il0sCiAgIm1hcHBpbmdzIjogIjs7QUFBQSxNQUFNLHFCQUFOLE1BQXlCO0FBQUEsSUFDckIsY0FBYztBQUNaLFdBQUssb0JBQW9CO0FBQUEsSUFDM0I7QUFBQSxJQUVBLHNCQUFzQjtBQUVwQixlQUFTLGlCQUFpQixzQkFBc0IsQ0FBQyxNQUFNO0FBQ3JELGNBQU0sU0FBUyxFQUFFLE9BQU8sUUFBUSxtQkFBbUI7QUFDbkQsWUFBSSxRQUFRO0FBQ1YsaUJBQU8sVUFBVSxJQUFJLGdCQUFnQjtBQUFBLFFBQ3ZDO0FBQUEsTUFDRixDQUFDO0FBRUQsZUFBUyxpQkFBaUIscUJBQXFCLENBQUMsTUFBTTtBQUNwRCxjQUFNLFNBQVMsRUFBRSxPQUFPLFFBQVEsbUJBQW1CO0FBQ25ELFlBQUksUUFBUTtBQUNWLGlCQUFPLFVBQVUsT0FBTyxnQkFBZ0I7QUFBQSxRQUMxQztBQUFBLE1BQ0YsQ0FBQztBQUdELGVBQVMsaUJBQWlCLHNCQUFzQixDQUFDLE1BQU07QUFDckQsY0FBTSxTQUFTLEVBQUUsT0FBTyxRQUFRLG1CQUFtQjtBQUNuRCxZQUFJLFFBQVE7QUFDVixlQUFLLFlBQVksUUFBUSxFQUFFLE9BQU8sR0FBRztBQUFBLFFBQ3ZDO0FBQUEsTUFDRixDQUFDO0FBR0QsZUFBUyxpQkFBaUIsbUJBQW1CLENBQUMsTUFBTTtBQUNsRCxjQUFNLFNBQVMsRUFBRSxPQUFPLFFBQVEsbUJBQW1CO0FBQ25ELFlBQUksUUFBUTtBQUNWLGlCQUFPLFVBQVUsSUFBSSxlQUFlLG9CQUFvQjtBQUFBLFFBQzFEO0FBQUEsTUFDRixDQUFDO0FBRUQsZUFBUyxpQkFBaUIsa0JBQWtCLENBQUMsTUFBTTtBQUNqRCxjQUFNLFNBQVMsRUFBRSxPQUFPLFFBQVEsbUJBQW1CO0FBQ25ELFlBQUksUUFBUTtBQUNWLGlCQUFPLFVBQVUsSUFBSSxjQUFjO0FBQ25DLGdDQUFzQixNQUFNO0FBQzFCLG1CQUFPLFVBQVUsSUFBSSxxQkFBcUI7QUFDMUMsdUJBQVcsTUFBTTtBQUNmLHFCQUFPLFVBQVUsT0FBTyxnQkFBZ0IscUJBQXFCO0FBQUEsWUFDL0QsR0FBRyxHQUFHO0FBQUEsVUFDUixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVBLFlBQVksUUFBUSxLQUFLO0FBRXZCLGFBQU8sVUFBVSxJQUFJLGFBQWE7QUFDbEMsaUJBQVcsTUFBTSxPQUFPLFVBQVUsT0FBTyxhQUFhLEdBQUcsR0FBRztBQUc1RCxZQUFNLFFBQVEsU0FBUyxjQUFjLEtBQUs7QUFDMUMsWUFBTSxZQUFZO0FBQ2xCLFlBQU0sWUFBWTtBQUFBO0FBQUE7QUFBQSxrQkFHTixJQUFJLFdBQVcsTUFBTSwwQ0FBdUMseUJBQXlCO0FBQUE7QUFBQTtBQUdqRyxlQUFTLEtBQUssWUFBWSxLQUFLO0FBQy9CLGlCQUFXLE1BQU0sTUFBTSxPQUFPLEdBQUcsR0FBSTtBQUFBLElBQ3ZDO0FBQUEsRUFDRjtBQUdBLE1BQUksbUJBQW1COyIsCiAgIm5hbWVzIjogW10KfQo=
