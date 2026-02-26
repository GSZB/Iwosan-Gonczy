# Iwosan Health Dashboard

A modern, responsive medical dashboard built with React 19 and Vite. The application provides healthcare professionals with an at-a-glance overview of diagnostics, patient statistics, health indices, and upcoming appointments.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Application Overview

### Layout

The app is split into a **collapsible sidebar** and a **scrollable main content area**. The sidebar includes navigation links, an expand/collapse toggle, and an emergency hotlines section. On mobile devices (≤1024px) the sidebar transforms into an off-canvas drawer activated via a hamburger menu in the header, complete with a dismissible overlay.

### Header 

The dropdown was implemented on the user's profile picture, and it includes links to the user's profile, settings, and logout.

### Sidebar

The sidebar is a collapsible navigation menu that includes links to the dashboard, diagnostics, patients, appointments, and settings. It also includes an emergency hotlines section with links to emergency services.
The collapsing was implemented not on a usual way, since the lack of business description from the design source. The user has to click on the expand arrow button, which highlights the button and the sidebar remains open. On toggling, the highlighting disappears and the sidebar collapses, which you can expand again by hovering on the sidebar.

### Dashboard Content

The main content area renders:

- **Welcome section** with the logged-in user's name and a light/dark theme toggle
- **Stat cards** displaying key metrics via interactive Chart.js charts:
  - Diagnostics breakdown (Doughnut chart)
  - Patient demographics (Doughnut + horizontal bar chart)
  - Health index gauge (semi-circle Doughnut)
  - Surgery statistics (semi-circle Doughnut)
  - Lab results (vertical Bar chart)
  - Heartbeat monitor (Line chart simulating an EKG pattern)
  (Since the charts on the design were very specific, I used Chart.js to create similar looking charts, the possibilities to customize the charts are endless)
- **Appointments accordion** listing upcoming patient appointments with expandable detail panels (I decided to implement the accordion in this section, since it was the most obvious UI pattern for this section)

### Theme Switching

Light and dark themes are managed via Redux Toolkit and persisted to `localStorage`. Toggling the theme dispatches a Redux action that updates a `data-theme` attribute on `<body>`, which drives all CSS variable swaps.

## Project Structure

```
src/
├── assets/             # SVG icons and images (centralized via index.js)
├── components/
│   ├── AppointmentsAccordion/   # Expandable appointment list
│   ├── DashboardOverview/       # Main dashboard grid with chart cards
│   ├── Header/                  # Search bar, notifications, profile dropdown
│   ├── Layout/                  # Sidebar + main content wrapper
│   ├── Sidebar/                 # Navigation sidebar with collapse/expand
│   └── StatCard/                # Reusable metric card container
├── store/
│   ├── store.js                 # Redux store configuration
│   └── themeSlice.js            # Theme state (light/dark) with localStorage
├── styles/
│   └── _variables.scss          # CSS custom properties for both themes
├── App.jsx                      # Root component with theme toggle and sections
├── App.scss                     # Welcome section and theme toggle styles
├── index.css                    # Global resets and cross-browser normalization
└── main.jsx                     # Entry point with Redux Provider
```

## Technology Choices

### React 19 + Vite

Vite provides near-instant HMR and fast builds via native ESM. React 19 gives us the latest hooks and rendering optimizations.

### Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)

Chosen for theme state management. While a simple theme toggle could use React Context, Redux Toolkit was adopted because:

- It provides `createSlice` which eliminates boilerplate for reducers and actions
- The store is easily extensible if additional global state is needed (e.g., user auth, notification counts)
- It integrates directly with `localStorage` for theme persistence

### Chart.js + react-chartjs-2

Chosen for data visualization. Chart.js is lightweight (~60KB gzipped), supports Doughnut, Bar, and Line charts out of the box, and renders on `<canvas>` for good performance. The `react-chartjs-2` wrapper provides declarative React components that map directly to Chart.js configurations, avoiding manual DOM manipulation.
All the charts are just mocked charts based on examples found on the internet. The data is not real, the implementation is not unique, since it is just a test project.

### Sass

SCSS is used for component-level styling following BEM methodology. It provides nesting for media queries and pseudo-selectors, which keeps responsive styles co-located with their base rules. All selectors are kept flat at the BEM block/element/modifier level to avoid deep nesting.

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation

- All interactive elements are focusable and operable via keyboard
- Visible `:focus-visible` outlines (2px solid accent color) on every button, link, and input
- The profile dropdown implements **roving tabindex** — Arrow Up/Down navigates between menu items, Escape closes the menu and returns focus to the trigger
- Accordion panels toggle on Enter/Space via native `<button>` elements

### ARIA Attributes

| Component | Attributes |
|---|---|
| **Sidebar** | `<nav>` landmark, `aria-label` on navigation, `role="list"` / `role="listitem"` on link groups |
| **Header dropdown** | `aria-haspopup`, `aria-expanded`, `aria-controls` on trigger; `role="menu"`, `role="menuitem"`, `role="none"` on list structure |
| **Accordion** | `aria-expanded`, `aria-controls` on each toggle button; `role="region"`, `aria-labelledby` on content panels |
| **Theme toggle** | `role="switch"`, `aria-checked`, dynamic `aria-label` reflecting current action |
| **Search input** | `aria-label` for screen reader context |
| **Mobile menu** | `aria-label` on hamburger and close buttons |

### Heading Hierarchy

A single `<h1>` exists on the page (welcome title). All section headings use `<h2>`. The appointments widget title also uses `<h2>` with an `id` linked via `aria-labelledby`.

### Color Contrast

All text/background combinations meet the **4.5:1 minimum contrast ratio**:

| Variable | Light | Dark | Ratio |
|---|---|---|---|
| `--text-primary` on `--bg-primary` | `#212b36` on `#ffffff` | `#ffffff` on `#161c24` | 13.5:1 / 16.0:1 |
| `--text-secondary` on `--bg-primary` | `#637381` on `#ffffff` | `#a3b1bf` on `#161c24` | 5.4:1 / 5.2:1 |
| `--accent-color` on `--bg-primary` | `#0052cc` on `#ffffff` | `#0052cc` on `#161c24` | 4.6:1 / 4.7:1 |

### Cross-Browser Support

- `-webkit-font-smoothing` and `-moz-osx-font-smoothing` for consistent text rendering
- `-webkit-text-size-adjust` and `-ms-text-size-adjust` to prevent mobile text resizing
- `-webkit-tap-highlight-color: transparent` on buttons
- `-webkit-appearance: none` on search inputs to remove native styling
- Firefox scrollbar support via `scrollbar-width` and `scrollbar-color`
- `-webkit-overflow-scrolling: touch` for iOS momentum scrolling
- Vendor-prefixed transitions and transforms for sidebar animations

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| **> 1200px** | Full layout: sidebar + 3-column card grid + appointments sidebar |
| **≤ 1200px** | Appointments sidebar drops below the card grid |
| **≤ 1024px** | Sidebar becomes off-canvas drawer, hamburger menu appears, cards become 2-column |
| **≤ 768px** | Cards stack to single column, welcome section stacks vertically |
