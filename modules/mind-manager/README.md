<div align="center">
  <img src="/public/picture/demo.gif" alt="Mind Manager Demo" width="100%" />
</div>

<br/>
<br>

<div align="center">
  <img src="/public/picture/logo-2.png" alt="Mind Manager Logo" height="145" />
</div>

<br/>
<br>

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES2026-F7DF1E?style=flat-square&logo=javascript" />
  <img alt="Storage" src="https://img.shields.io/badge/Storage-LocalStorage-4FC3F7?style=flat-square" />
  <img alt="Responsive" src="https://img.shields.io/badge/Responsive-Desktop%20%26%20Mobile-34A853?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-00599C?style=flat-square" />
</p>

<br/>

# Mind Manager

A modern frontend knowledge-management workspace for capturing structured notes, reusable code snippets, useful bookmarks, and quick-reference cheat sheets through a clean and responsive interface.

## Overview

Mind Manager is a frontend-only application focused on organizing personal knowledge and reusable resources. It provides dedicated workflows for creating and managing notes, code snippets, bookmarks, and cheat sheets, with shared tagging, search, filtering, sorting, pinning, and category management.

All user data is stored locally in the browser using `LocalStorage`, so the application does not require a backend service or external database for its core workflow.

## Key Features

- Create, edit, pin, and delete notes
- Create, edit, pin, and delete code snippets with syntax highlighting
- Save, edit, pin, and delete bookmarks with URL and domain information
- Create and manage structured cheat sheets with key-value entries
- Organize items with categories and reusable global tags
- Search across titles, descriptions, content, code, URLs, dates, cheat sheet entries, and tags
- Filter and sort items independently for each content type
- View usage and content statistics through an analytics dashboard
- Review activity through weekly, monthly, and yearly analytics views
- Customize light and dark themes
- Import, export, and reset the local workspace data
- Use keyboard shortcuts for navigation and common actions
- Works responsively across desktop and mobile screens
- Keep all workspace data locally in the browser

## Core Functionalities

### Knowledge Item Management

Users can manage four primary content types through the main Mind view:

- Notes for thoughts, documentation, ideas, and knowledge
- Code Snippets for reusable source code and development patterns
- Bookmarks for useful links, documentation, and online resources
- CheatSheets for compact key-value references and quick lookup information

Each content type supports its own categories, filtering and sorting rules while sharing common entity capabilities such as titles, tags, pinning, timestamps, editing, and deletion.

### Search, Filtering, and Organization

The Mind view provides a unified workflow for finding and organizing stored knowledge. Users can:

- search across relevant fields for the active content type
- use multi-word queries and quoted exact phrases
- search by tag using `#tag` syntax
- filter items by category
- filter items by pinned or unpinned state
- sort items by title, creation date, or update date
- pin important items for quick access

### Analytics Dashboard

The analytics section provides visual and summary-based insight into the stored knowledge base. It includes:

- total item counts for Notes, Snippets, Bookmarks, and CheatSheets
- pinned item counts
- activity heatmaps with weekly, monthly, and yearly views
- weekly creation distribution
- module/category distribution
- tag distribution
- storage and entity-size metrics

Charts are rendered with ApexCharts and are generated from the current locally stored workspace data.

### Settings and Theme Control

The app includes configuration options for:

- switching between light and dark themes
- creating, editing, and deleting global tags
- exporting the complete workspace state
- importing previously exported workspace data
- resetting local application data
- viewing and using application-level controls and shortcuts

### Local Knowledge Workspace

Mind Manager is designed as a self-contained local knowledge workspace. Notes, snippets, bookmarks, cheat sheets, tags, and their metadata are normalized before being persisted, allowing the application to maintain a consistent data structure without depending on a remote API or backend.

## Technology Stack

- Vite
- Vanilla JavaScript (ES Modules)
- Tailwind CSS
- ApexCharts
- Shiki
- Tabler Icons
- Custom CSS
- LocalStorage for persistence
- Modular frontend architecture
- Vite PWA plugin

## Project Structure

```text
mind-manager/
├── public/
│   └── picture/
├── src/
│   ├── app/
│   │   ├── app.js
│   │   └── theme.js
│   ├── assets/
│   │   ├── css/
│   │   └── font/
│   ├── components/
│   │   ├── features/
│   │   │   ├── analytics/
│   │   │   ├── mind/
│   │   │   └── settings/
│   │   ├── layout/
│   │   ├── modals/
│   │   ├── shared/
│   │   └── ui/
│   ├── controllers/
│   │   ├── mind/
│   │   └── settings/
│   ├── models/
│   ├── services/
│   ├── utils/
│   │   └── constants/
│   └── views/
│       ├── analytics/
│       └── mind/
├── vendor/
│   └── tabler/
├── index.html
├── jsconfig.json
├── package.json
├── vite.config.js
├── LICENSE
├── README.md
└── .gitignore
```

## Architecture

The project follows a modular frontend architecture where application state, persistence, domain operations, controllers, UI components, and rendering responsibilities are separated into dedicated layers:

- `app/` — application bootstrap and global theme initialization
- `components/` — reusable UI components, feature views, layout elements, modals, and controls
- `controllers/` — interaction handling, navigation, forms, item actions, analytics, settings, and theme workflows
- `models/` — centralized application state and LocalStorage persistence/normalization
- `services/` — domain operations, event communication, state store access, loading, notifications, and theme services
- `utils/` — shared helpers, analytics adapters, code formatting, and application constants
- `views/` — rendering layers for the Mind workspace and Analytics dashboard
- `vendor/` — locally bundled third-party UI assets such as Tabler Icons

The main data flow is based on a centralized state model. Domain changes are handled through controllers and services, persisted through the storage model, and propagated to the UI through the event bus and state manager.

## Demo

The project's visual assets are available in:

```text
/public/picture/logo.png
/public/picture/logo-2.png
```

The application itself can be launched locally using the development commands below.

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd mind-manager
```

Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

1. Open the application in your browser.
2. Create notes, code snippets, bookmarks, or cheat sheets from the Mind view.
3. Add categories and tags to keep knowledge organized.
4. Use search, filters, sorting, and pinning to manage stored items.
5. Open Analytics to review activity and content distribution.
6. Use Settings to manage themes, tags, import/export, and workspace reset operations.

## Data Storage

The application stores its workspace data locally in the browser using `LocalStorage`, under the `mind_manager` storage key. The persisted state includes:

- tags
- notes
- code snippets
- bookmarks
- cheat sheets
- entity metadata such as categories, pin state, tags, and timestamps

Data is normalized when loaded and saved to maintain a consistent structure across the supported entity types.

## Roadmap

Potential future improvements include:

- richer knowledge-base analytics and insights
- more advanced search and filtering capabilities
- additional content types and category systems
- improved import/export and backup workflows
- expanded keyboard shortcuts and productivity controls
- richer code and reference-management capabilities
- continued UI and responsive experience improvements

## License

This project is licensed under the [MIT License](https://github.com/AR2BJ/mind-manager/blob/dev/LICENSE).

## Contributing

Contributions are welcome. If you want to improve the knowledge-management workflow, extend analytics, refine search and organization features, or optimize the architecture, feel free to open a pull request or submit an issue.
