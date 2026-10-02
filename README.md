<div align="center">
  <img src="/public/picture/logo-2.png" alt="Life Orchestrator logo" height="145" />
</div>

<br />

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES2026-F7DF1E?style=flat-square&logo=javascript" />
  <img alt="Architecture" src="https://img.shields.io/badge/Architecture-Modular-4FC3F7?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-00599C?style=flat-square" />
</p>

# Life Orchestrator

Life Orchestrator is a collection of modular productivity applications for planning, focus, task management, habit tracking, and knowledge organization. The repository also contains shared packages and an orchestration layer for cross-module analytics.

## Applications

The standalone applications are located in `modules/`:

| Application       | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `habit-tracker`   | Create and track habits                                    |
| `life-planner`    | Organize life areas and plans                              |
| `mind-manager`    | Manage notes and knowledge                                 |
| `task-manager`    | Organize and track tasks                                   |
| `time-manager`    | Focus sessions and time management                         |
| `finance-manager` | Finance module directory; currently contains public assets |

Most application modules have their own `package.json`, Vite configuration, and README. Refer to the relevant module README for app-specific details.

## Repository Structure

```text
life-orchestrator/
├── modules/
│   ├── finance-manager/
│   ├── habit-tracker/
│   ├── life-planner/
│   ├── mind-manager/
│   ├── task-manager/
│   └── time-manager/
├── orchestrator/
│   └── src/
│       ├── components/
│       ├── engine/
│       └── index.js
├── packages/
│   ├── core-store/
│   ├── event-bus/
│   └── ui-theme/
├── public/
│   └── picture/
├── index.html
├── orchestrator.html
├── package.json
└── vite.config.js
```

Each app keeps its own source code under `modules/<app-name>/src/`. Shared functionality and orchestration-related code are kept outside the app modules.

## Shared Packages and Orchestration

- `packages/core-store/` — shared state and storage package.
- `packages/event-bus/` — event bus and related event/storage utilities.
- `packages/ui-theme/` — shared UI theme assets.
- `orchestrator/src/engine/` — aggregation, analytics, and insight-related logic.
- `orchestrator/src/components/` — dashboard and analytics components.

## Technology

- Vite
- Vanilla JavaScript
- Custom CSS
- Modular frontend architecture
- Browser-based storage where implemented by an application

## Getting Started

To run an application, use its own project directory. For example:

```bash
cd modules/habit-tracker
npm install
npm run dev
```

Replace `habit-tracker` with another app directory to run a different module. Available commands may differ by module; check its `package.json` and README.

To run the repository-level project, check the root `package.json` for its available scripts.

## Build

From the directory of the application you want to build:

```bash
npm run build
```

Check that module's `package.json` for the available build and preview scripts.

## Data and Privacy

Storage behavior is implemented at the application or shared-package level. Data may be stored in the browser for modules that use local storage; check each module's documentation for details.

## License

This project is licensed under the [MIT License](https://github.com/AR2BJ/life-orchestrator/blob/master/LICENSE).

## Contributing

Contributions are welcome. To contribute:

1. Open an issue to discuss a significant change before starting work.
2. Create a branch for your changes.
3. Follow the existing structure and conventions of the affected module or package.
4. Run the relevant checks or build scripts listed in its `package.json`.
5. Submit a pull request with a clear summary of the changes.
