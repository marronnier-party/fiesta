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

// Leaflet Map component
export const map = (lat = 48.8566, lng = 2.3522, zoom = 13) => ({
  map: null,
  marker: null,
  latitude: lat,
  longitude: lng,
  mapZoom: zoom,

  init() {
    // Import Leaflet dynamically
    import('leaflet').then((L) => {
      // Initialize map
      this.map = L.default.map(this.$el, {
        center: [this.latitude, this.longitude],
        zoom: this.mapZoom,
        scrollWheelZoom: false
      });

      // Add OpenStreetMap tiles
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Add marker if coordinates are provided
      if (this.latitude && this.longitude) {
        this.marker = L.default.marker([this.latitude, this.longitude]).addTo(this.map);
      }

      // Enable scroll zoom on click
      this.map.on('click', () => {
        this.map.scrollWheelZoom.enable();
      });

      // Disable scroll zoom on mouse out
      this.map.on('mouseout', () => {
        this.map.scrollWheelZoom.disable();
      });
    });
  },

  updateMarker(lat, lng) {
    import('leaflet').then((L) => {
      this.latitude = lat;
      this.longitude = lng;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.default.marker([lat, lng]).addTo(this.map);
      }

      this.map.setView([lat, lng], this.mapZoom);
    });
  }
});

// Address Autocomplete with Nominatim
export const addressAutocomplete = (onSelect = null) => ({
  query: '',
  results: [],
  loading: false,
  showResults: false,
  debounceTimer: null,
  selectedIndex: -1,

  async search() {
    clearTimeout(this.debounceTimer);

    if (this.query.length < 3) {
      this.results = [];
      this.showResults = false;
      return;
    }

    this.debounceTimer = setTimeout(async () => {
      this.loading = true;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `format=json&q=${encodeURIComponent(this.query)}&` +
          `addressdetails=1&limit=5`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        this.results = await response.json();
        this.showResults = this.results.length > 0;
      } catch (error) {
        console.error('Geocoding error:', error);
        this.results = [];
      } finally {
        this.loading = false;
      }
    }, 300);
  },

  selectResult(result) {
    this.query = result.display_name;
    this.showResults = false;
    this.selectedIndex = -1;

    // Extract address components
    const address = result.address || {};
    const locationData = {
      display_name: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: address.road || address.pedestrian || '',
      city: address.city || address.town || address.village || '',
      postal_code: address.postcode || '',
      country: address.country || ''
    };

    // Call the onSelect callback if provided
    if (onSelect && typeof onSelect === 'function') {
      onSelect(locationData);
    }

    // Dispatch custom event for component communication
    this.$dispatch('address-selected', locationData);
  },

  handleKeydown(event) {
    if (!this.showResults) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectResult(this.results[this.selectedIndex]);
        }
        break;
      case 'Escape':
        this.showResults = false;
        this.selectedIndex = -1;
        break;
    }
  },

  clear() {
    this.query = '';
    this.results = [];
    this.showResults = false;
    this.selectedIndex = -1;
  }
});
