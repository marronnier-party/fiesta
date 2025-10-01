// Alpine.js reusable components

// Notification system
export const notification = () => ({
  visible: false,
  message: '',
  type: 'info', // 'success', 'error', 'warning', 'info'

  show(message, type = 'info') {
    this.message = message;
    this.type = type;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 5000);
  },

  hide() {
    this.visible = false;
  }
});

// Modal system
export const modal = () => ({
  open: false,

  toggle() {
    this.open = !this.open;
  },

  close() {
    this.open = false;
  }
});

// Dropdown system
export const dropdown = () => ({
  open: false,

  toggle() {
    this.open = !this.open;
  },

  close() {
    this.open = false;
  }
});

// Tabs system
export const tabs = (defaultTab = 0) => ({
  activeTab: defaultTab,

  setTab(index) {
    this.activeTab = index;
  },

  isActive(index) {
    return this.activeTab === index;
  }
});

// Collapsible sections
export const collapsible = (initialState = false) => ({
  expanded: initialState,

  toggle() {
    this.expanded = !this.expanded;
  }
});
