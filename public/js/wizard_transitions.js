(() => {
  // src/js/wizard_transitions.js
  document.addEventListener("htmx:beforeSwap", function(evt) {
    const target = document.querySelector("#wizard-content");
    if (target) {
      target.classList.add("wizard-step-exit");
      setTimeout(() => {
        target.classList.add("wizard-step-exit-active");
      }, 10);
    }
  });
  document.addEventListener("htmx:afterSwap", function(evt) {
    const target = document.querySelector("#wizard-content");
    if (target) {
      target.classList.add("wizard-step-enter");
      setTimeout(() => {
        target.classList.add("wizard-step-enter-active");
        setTimeout(() => {
          target.classList.remove("wizard-step-enter", "wizard-step-enter-active");
        }, 300);
      }, 10);
    }
  });
  document.addEventListener("htmx:afterRequest", function(evt) {
    if (evt.detail.pathInfo.requestPath.includes("/events/create") && evt.detail.successful) {
      for (let i = 1; i <= 5; i++) {
        localStorage.removeItem(`event-step-${i}`);
      }
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2pzL3dpemFyZF90cmFuc2l0aW9ucy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaHRteDpiZWZvcmVTd2FwJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dpemFyZC1jb250ZW50Jyk7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3dpemFyZC1zdGVwLWV4aXQnKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnd2l6YXJkLXN0ZXAtZXhpdC1hY3RpdmUnKTtcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH0pO1xuICBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaHRteDphZnRlclN3YXAnLCBmdW5jdGlvbihldnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2l6YXJkLWNvbnRlbnQnKTtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnd2l6YXJkLXN0ZXAtZW50ZXInKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnd2l6YXJkLXN0ZXAtZW50ZXItYWN0aXZlJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCd3aXphcmQtc3RlcC1lbnRlcicsICd3aXphcmQtc3RlcC1lbnRlci1hY3RpdmUnKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH0pO1xuICBcbiAgLy8gQ2xlYXIgbG9jYWxTdG9yYWdlIHdoZW4gd2l6YXJkIGNvbXBsZXRlc1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdodG14OmFmdGVyUmVxdWVzdCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQuZGV0YWlsLnBhdGhJbmZvLnJlcXVlc3RQYXRoLmluY2x1ZGVzKCcvZXZlbnRzL2NyZWF0ZScpICYmIFxuICAgICAgICBldnQuZGV0YWlsLnN1Y2Nlc3NmdWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDU7IGkrKykge1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgZXZlbnQtc3RlcC0ke2l9YCk7XG4gICAgICB9XG4gICAgfVxuICB9KTsiXSwKICAibWFwcGluZ3MiOiAiOztBQUFBLFdBQVMsaUJBQWlCLG1CQUFtQixTQUFTLEtBQUs7QUFDdkQsVUFBTSxTQUFTLFNBQVMsY0FBYyxpQkFBaUI7QUFDdkQsUUFBSSxRQUFRO0FBQ1YsYUFBTyxVQUFVLElBQUksa0JBQWtCO0FBQ3ZDLGlCQUFXLE1BQU07QUFDZixlQUFPLFVBQVUsSUFBSSx5QkFBeUI7QUFBQSxNQUNoRCxHQUFHLEVBQUU7QUFBQSxJQUNQO0FBQUEsRUFDRixDQUFDO0FBRUQsV0FBUyxpQkFBaUIsa0JBQWtCLFNBQVMsS0FBSztBQUN4RCxVQUFNLFNBQVMsU0FBUyxjQUFjLGlCQUFpQjtBQUN2RCxRQUFJLFFBQVE7QUFDVixhQUFPLFVBQVUsSUFBSSxtQkFBbUI7QUFDeEMsaUJBQVcsTUFBTTtBQUNmLGVBQU8sVUFBVSxJQUFJLDBCQUEwQjtBQUMvQyxtQkFBVyxNQUFNO0FBQ2YsaUJBQU8sVUFBVSxPQUFPLHFCQUFxQiwwQkFBMEI7QUFBQSxRQUN6RSxHQUFHLEdBQUc7QUFBQSxNQUNSLEdBQUcsRUFBRTtBQUFBLElBQ1A7QUFBQSxFQUNGLENBQUM7QUFHRCxXQUFTLGlCQUFpQixxQkFBcUIsU0FBUyxLQUFLO0FBQzNELFFBQUksSUFBSSxPQUFPLFNBQVMsWUFBWSxTQUFTLGdCQUFnQixLQUN6RCxJQUFJLE9BQU8sWUFBWTtBQUN6QixlQUFTLElBQUksR0FBRyxLQUFLLEdBQUcsS0FBSztBQUMzQixxQkFBYSxXQUFXLGNBQWMsQ0FBQyxFQUFFO0FBQUEsTUFDM0M7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
