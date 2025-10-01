# Fiesta

A family event management platform built with [Lucky](https://luckyframework.org) and Crystal.

## About

Fiesta is a comprehensive event management system designed for organizing family gatherings and events. It features:

- **Event Management**: Create and manage events with locations, dates, and guest lists
- **Guest Management**: Track RSVPs, dietary restrictions, and plus-ones
- **Task Organization**: Assign and track tasks with categories (food, decorations, logistics, etc.)
- **Advanced Features**:
  - Event templates for recurring celebrations
  - Polling system for scheduling and decisions
  - Secret Santa organization
  - Event messaging and notifications
  - Budget tracking and expense splitting
  - Event activities tracking
  - Comments system
  - Check-in mode for event day
  - Weather forecasts integration

## Tech Stack

- **Backend**: Crystal with Lucky Framework (v1.4.0)
- **Database**: PostgreSQL with Avram ORM (v1.4.0)
- **Frontend**:
  - htmx 2.0 - Server-driven AJAX interactions
  - Alpine.js 3.15 - Lightweight client-side reactivity
  - TailwindCSS - Utility-first CSS
  - DaisyUI - Tailwind component library
  - Bun - Fast JavaScript runtime and bundler
- **UI Components**: Custom component system with 20+ reusable UI components
- **Authentication**: Authentic gem with JWT support
- **Email**: Carbon with SendGrid adapter
- **I18n**: Multi-language support (English, French)

## Architecture

### Interactive UI with htmx + Alpine.js

Fiesta leverages modern, lightweight frontend libraries for rich interactivity without heavy JavaScript frameworks:

**htmx 2.0 Features:**
- Inline guest status updates without page reloads
- Real-time polling for guest statistics (auto-updates every 30s)
- Collapsible task cards with comment sections
- Dependent dropdown forms (dynamic guest filtering)
- Optimistic UI updates for instant feedback

**Alpine.js Features:**
- Client-side search filtering
- Modal dialogs with native `<dialog>` element
- Inline editing for event details (click-to-edit)
- Dropdown menus and collapsible sections
- Toast notifications

**Performance:**
- 6ms JavaScript builds with Bun (58x faster than yarn)
- 0.89 MB bundle size
- Progressive enhancement - works without JavaScript
- Server-rendered with minimal client-side code

For implementation details, see [HTMX_ALPINE_INTEGRATION_PLAN.md](HTMX_ALPINE_INTEGRATION_PLAN.md)

### Component System

Fiesta uses a comprehensive UI component library for consistent design and maintainability:

- **31+ pages refactored** to use the component system
- **~530+ lines of code eliminated** through component reuse
- **~52+ helper methods removed** by centralizing logic
- **100% consistency** across all user-facing pages

Key components include:
- `UI::FormInput`, `UI::FormTextarea`, `UI::FormSelect` - Form controls
- `UI::PageHeader`, `UI::SectionHeader` - Page structure
- `UI::StatusBadge`, `UI::Avatar`, `UI::InfoRow` - Data display
- `UI::EmptyState`, `UI::Alert`, `UI::StatsWidget` - User feedback
- `UI::SearchBox`, `UI::FilterTabs`, `UI::CheckboxList` - Interactions
- `UI::Modal`, `UI::ConfirmDialog` - Native dialog-based modals
- `UI::InlineEdit` - Click-to-edit fields with htmx
- `UI::LoadingSpinner`, `UI::ToastContainer` - Loading states and notifications

**Interactive Components:**
- `Guests::GuestRow` - htmx-powered status updates
- `Tasks::TaskCard` - Alpine collapsible with optimistic UI
- `UI::DependentSelect` - htmx dependent dropdowns

For details, see [docs/REFACTORING_SUMMARY.md](docs/REFACTORING_SUMMARY.md)

### Setting up the project

#### Prerequisites

- [Crystal](https://crystal-lang.org/install/) - Programming language
- [PostgreSQL](https://www.postgresql.org/download/) - Database
- [Bun](https://bun.sh/) - JavaScript runtime and bundler (fast alternative to Node.js)

#### Installation

1. [Install required dependencies](https://luckyframework.org/guides/getting-started/installing#install-required-dependencies)
1. Install Bun: `curl -fsSL https://bun.sh/install | bash`
1. Update database settings in `config/database.cr`
1. Run `script/setup`
1. Run `lucky dev` to start the app

The app will be available at `http://localhost:5000`

### Using Docker for development

1. [Install Docker](https://docs.docker.com/engine/install/)
1. Run `docker compose up`

The Docker container will boot all of the necessary components needed to run your Lucky application.
To configure the container, update the `docker-compose.yml` file, and the `docker/development.dockerfile` file.


### Learning Lucky

Lucky uses the [Crystal](https://crystal-lang.org) programming language. You can learn about Lucky from the [Lucky Guides](https://luckyframework.org/guides/getting-started/why-lucky).
