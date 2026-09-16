<div align="center">
  <img src="/public/picture/demo.gif" alt="Life Planner Demo" width="100%" />
</div>

<br/>
<br>

<div align="center">
  <img src="/public/picture/logo-2.png" alt="Life Planner Logo" height="145" />
</div>

<br/>
<br>

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES2026-F7DF1E?style=flat-square&logo=javascript" />
  <img alt="Storage" src="https://img.shields.io/badge/Storage-LocalStorage-4FC3F7?style=flat-square" />
  <img alt="Responsive" src="https://img.shields.io/badge/Responsive-Desktop%20%26%20Mobile-34A853?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-00599C?style=flat-square" />
</p>

<br/>

# Life Planner

A modern productivity-oriented planner web app for organizing tasks, managing daily commitments, reviewing activity, and tracking progress through a clean and responsive interface.

## Overview

Life Planner is a frontend-only application focused on personal planning and daily organization. It gives users a structured way to create and manage plans, review them through a calendar and analytics view, and keep everything accessible without needing a backend service.

All user data is stored locally in the browser using `LocalStorage`, making the app fast, private, and easy to use.

## Key Features

- Create, edit, complete, and delete plans
- Organize plans in a structured planner flow
- View activity in a calendar-based overview
- Track performance with analytics and reporting views
- Use autocomplete and combobox-based inputs for faster planning
- Customize theme and app settings
- Import, export, and reset saved data
- Works responsively on desktop and mobile screens
- Store planning data locally for a lightweight personal workflow

## Core Functionalities

### Planner and Plan Management

Users can manage daily plans through a dedicated planner interface with actions for:

- adding new plans
- editing existing entries
- deleting or completing plans
- organizing plan-related actions and quick updates

### Calendar View

The app includes a calendar layer to help users review plans by date and time, making it easier to organize long-term routines and daily schedules.

### Analytics Dashboard

The analytics section provides visual and summary-based insight into planning activity and progress. It helps users understand patterns in their workload and time usage.

### Settings and Theme Control

The app includes configuration options for:

- theme switching
- reset actions
- import/export of saved state
- general personal preference settings

### Auto-Logging and Productivity Support

The app includes productivity-related automation features such as automatic plan logging, helping reduce manual effort when tracking activity and progress.

## Technology Stack

- Vite
- Vanilla JavaScript
- Custom CSS
- Font Awesome
- LocalStorage for persistence
- Modular frontend architecture

## Project Structure

```text
life-planner/
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
│   │   │   ├── planner/
│   │   │   └── settings/
│   │   ├── layout/
│   │   ├── modals/
│   │   ├── shared/
│   │   └── ui/
│   ├── controllers/
│   │   ├── planner/
│   │   └── settings/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── views/
│       ├── analytics/
│       ├── calendar/
│       └── planner/
├── vendor/
│   └── fontawesome/
├── index.html
├── jsconfig.json
├── package.json
├── vite.config.js
├── LICENSE
├── README.md
├── .gitignore
└── public/
```

## Architecture

The project follows a modular frontend design with responsibilities separated into clear layers:

- `app/` — app bootstrap and global theme configuration
- `components/` — UI blocks and feature-specific modules
- `controllers/` — user interactions, event handling, and workflow logic
- `models/` — state and storage definitions
- `services/` — business logic, notifications, store access, and automation
- `views/` — rendering layers for planner, calendar, and analytics
- `utils/` — helper functions and constants

This structure keeps the codebase clean, maintainable, and easier to extend over time.

## Demo

A visual demonstration of the app is available in:

```text
/public/picture/demo.gif
/public/picture/logo-2.png
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd life-planner
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

1. Open the app in your browser.
2. Create your plans and commitments.
3. Review them in the calendar and planner views.
4. Use analytics to understand your progress and activity.
5. Customize settings and theme based on your preference.

## Data Storage

The application stores data locally in the browser using `LocalStorage`, including:

- plans
- app state
- settings
- theme preferences
- saved local data for planning workflow

## Roadmap

Potential future improvements include:

- richer analytics and insights
- advanced plan filtering and search
- drag-and-drop plan organization
- reminders and notifications
- improved import/export workflows
- expanded customization options

## License

This project is licensed under the [MIT License](https://github.com/AR2BJ/life-planner/blob/dev/LICENSE).

## Contributing

Contributions are welcome. If you want to improve the planner UX, extend analytics, refine the calendar flow, or optimize the architecture, feel free to open a pull request or submit an issue.
