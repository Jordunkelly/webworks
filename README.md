# Jordan Kelly Consulting

Production web applications, data systems, and interactive products built and shipped by Jordan Kelly Consulting.

Live at **https://jordunkelly.github.io/webworks/**

## Client & Product Portfolio

Each application lives in its own top level folder and launches through its `index.html`.

| Folder | Product | What it does |
| --- | --- | --- |
| `event-planner/` | Event Planner | Collaborative scheduling platform with calendar UI and persistent shared state. |
| `event-rsvp/` | Event RSVP | Guest RSVP tracker using the Excel API as a serverless backend for zero cost persistence. |
| `pso-drop-charts/` | Drop Rate Dashboard | Filterable, sortable probability tables with live drop calculations, a timer utility, and the Photon Defender game. |
| `last-epoch-planner/` | Build Planner | Character stat simulation and gear planner for Last Epoch S4. |
| `skald/` | Skald | Automotive deal calculator for modeling discounts, incentives, and state tax trade credits. |
| `loveable-unicorns/` | Loveable Unicorns | Mobile first Kindergarten platform across 10 learning and arcade modes covering 26 phoneme sounds, CVC word blending, counting, calendar days, seasons, balloon pop, and candy match with Web Speech API synthesis. |

Shared across portfolio projects: `index.html` (consulting hub), `global-nav.css`, `global-nav.js`.

## Architecture Conventions

* Folder and file names use lowercase `kebab-case`.
* One product per top level folder. The entry point is always `index.html`.
* Product images live in that folder's `assets/` directory.

## Tech Stack

HTML5 · JavaScript · CSS · React · REST APIs · Excel API · Web Speech API · Web Audio API · DataTables

## License

MIT
