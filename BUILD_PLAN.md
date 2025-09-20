# Interactive Guides MVP — Work Plan (Living Document)

Author: Lead Engineer  
Date: 2025-09-20  
Scope: Local-only development (no GitHub). Data stored as JSON file inside project. MVP supports text-only guides.

---

## 1) Objectives and Constraints
- Build a 3-part system: Backend API, Admin SPA ("Studio"), Viewer SPA ("Stage").
- Single local monorepo with npm workspaces; all code and data are local.
- MVP data store: JSON file located under the server package.
- Development ports: server 3001, admin 3000, viewer 3002.

## 2) Architecture Overview
- Decoupled, three-tier architecture communicating via REST API.
  - Backend (Node/Express): business logic, validation, persistence.
  - Admin (React SPA): creation and management UI for guides.
  - Viewer (React SPA): fast, read-only rendering of a single guide.

## 3) Monorepo Structure (Local-Only)
```
interactive-guides-platform/
├─ package.json              (workspaces)
├─ README.md                 (local run instructions)
├─ BUILD_PLAN.md             (this document)
└─ packages/
   ├─ server/
   │  └─ src/
   │     ├─ api/            (routes)
   │     ├─ controllers/    (business logic)
   │     ├─ models/         (schema/types if needed)
   │     ├─ data/           (local JSON store lives here)
   │     │  └─ guides.json
   │     ├─ db.js           (file I/O helpers)
   │     └─ server.js       (entry)
   ├─ client-admin/
   │  └─ src/
   │     ├─ components/
   │     ├─ pages/
   │     ├─ services/       (API calls)
   │     ├─ contexts/       (state)
   │     ├─ hooks/
   │     ├─ App.jsx
   │     └─ main.jsx
   └─ client-viewer/
      └─ src/
         ├─ components/
         ├─ pages/
         ├─ services/
         ├─ App.jsx
         └─ main.jsx
```

## 4) Authoritative Data Model (JSON)
Used consistently across backend and both frontends.
```json
{
  "_id": "string",
  "title": "string",
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "sections": [
        {
          "id": "string",
          "title": "string",
          "content": "string"
        }
      ]
    }
  ]
}
```

Keys:
- `_id`: unique guide id
- `chapters[].id`: unique chapter id
- `chapters[].sections[].id`: unique section id

## 5) Backend (Server) — Requirements
- Stack: Node.js, Express.js, CORS.
- Storage: local JSON file `packages/server/src/data/guides.json`.
- API endpoints:
  - GET `/api/guides` → list of guides (only `_id`, `title`).
  - GET `/api/guides/:id` → full guide JSON.
  - POST `/api/guides` → create guide.
  - PUT `/api/guides/:id` → update guide.
  - DELETE `/api/guides/:id` → delete guide.
- Middleware: `express.json()`, `cors()`.
- Port: 3001.

Data access module (`db.js`) responsibilities:
- `getAllGuides()` → returns array of `{ _id, title }`.
- `getGuideById(id)`.
- `createGuide(guide)` → validates schema; persists.
- `updateGuide(id, guide)` → validates; persists.
- `deleteGuide(id)`.

Validation:
- Ensure required fields exist and are strings.
- Ensure ids are unique per guide (best-effort for MVP).
- Return `404` when guide not found; `400` for invalid payload.

Persistence details:
- Read–modify–write on `guides.json` using atomic write pattern.
- Auto-create file with `[]` if missing.

Sample seed (for local dev):
```json
[
  {
    "_id": "6328a5e9f1a2b3c4d5e6f7a8",
    "title": "New Employee Onboarding Guide",
    "chapters": [
      {
        "id": "chap_17f3",
        "title": "Chapter 1: Company Introduction",
        "sections": [
          {
            "id": "sec_a9b1",
            "title": "Our Vision",
            "content": "Welcome to the company! Our vision is to lead the market..."
          },
          {
            "id": "sec_c4d2",
            "title": "Organizational Structure",
            "content": "The company is divided into the following departments..."
          }
        ]
      },
      {
        "id": "chap_9a2e",
        "title": "Chapter 2: Systems & Tools",
        "sections": [
          {
            "id": "sec_b8e7",
            "title": "Logging into Monday.com",
            "content": "1. Go to company.monday.com\n2. Use the login credentials..."
          }
        ]
      }
    ]
  }
]
```

Definition of Done (Backend):
- All endpoints implemented with error handling.
- JSON file auto-created if missing; CRUD works end-to-end.
- CORS enabled for admin and viewer origins.
- Start script runs server at 3001 and logs endpoint base.

## 6) Viewer App ("Stage") — Requirements
- Stack: React + Vite, `react-router-dom`.
- Route: `/guides/:guideId` → renders `GuideViewPage`.
- Data fetching: `GET http://localhost:3001/api/guides/:guideId` with loading/error states.
- UI layout: two columns — main content (75%), right sidebar (25%).
- Sidebar: chapter titles linking to `#<chapter.id>`.
- Content: guide title, chapters with sections.
- Interactivity: sections collapsed by default using `<details>/<summary>`.
- Accessibility: semantic headings, keyboard navigation, visible focus.

Components:
- `ChapterNav.jsx`: renders chapter links.
- `ChapterDisplay.jsx`: renders a chapter and its sections.
- `SectionDisplay.jsx`: renders one section with `<details>`.

Definition of Done (Viewer):
- Route resolves and renders by guide id.
- Anchor navigation to chapters works.
- Sections toggle open/closed.
- Basic responsiveness on narrow widths.

## 7) Admin App ("Studio") — Requirements
- Stack: React + Vite, `react-router-dom`, `axios` (or fetch).
- Layout: persistent left sidebar + main editor pane.
- State model: single editor state; no API calls per keystroke.
- Sidebar behavior:
  - On mount: `GET /api/guides`.
  - Highlight selected guide.
  - “Create New Guide” clears editor to empty draft.
- Editor features:
  - Edit guide title.
  - Add/remove/reorder chapters.
  - Add/remove/reorder sections within a chapter.
  - Edit chapter/section titles and section content.
  - Client-side ID generation (e.g., `Date.now()`/UUID) for new items.
- Save behavior:
  - If `_id` absent → `POST /api/guides`.
  - If `_id` present → `PUT /api/guides/:id`.
  - Show success/failure feedback.
- API services (`services/api.js`):
  - `getGuides`, `getGuide(id)`, `createGuide`, `updateGuide`, `deleteGuide`.

Definition of Done (Admin):
- Full CRUD via UI with clear feedback.
- Accurate create vs update handling.
- Predictable editor state updates.
- Error surfaces to user (toast/inline).

## 8) Environment, Scripts, and Local Running
- No GitHub integration; local only.
- Node: LTS (>=18).
- Root `package.json` scripts:
  - `dev:server` → start server on 3001 (nodemon optional).
  - `dev:admin` → Vite dev on 3000.
  - `dev:viewer` → Vite dev on 3002.
  - `dev:all` → optional using `concurrently`/`npm-run-all`.
- Config: dev API base `http://localhost:3001` (or per-app `.env`).

## 9) Implementation Tasks (with Outputs & DoD)
1. Initialize local monorepo (no remotes)
   - Output: workspace folders; workspaces configured.
   - DoD: Workspaces resolve and install.

2. Scaffold Server
   - Output: `src/{api,controllers,models,data,db.js,server.js}` + `guides.json`.
   - DoD: Server runs on 3001; healthcheck logs.

3. Implement `db.js`
   - Output: robust CRUD helpers with atomic writes; auto-create file.
   - DoD: CRUD unit tested manually against file.

4. Implement Controllers and Routes
   - Output: REST endpoints wired with proper status codes.
   - DoD: 200/201/204/400/404 used correctly.

5. Seed Sample Data
   - Output: `guides.json` populated.
   - DoD: Viewer/Admin can fetch seeded guide.

6. Scaffold Viewer
   - Output: Vite app with routing and components.
   - DoD: Renders guide; anchors and accordions work.

7. Scaffold Admin
   - Output: Vite app with sidebar, editor, services.
   - DoD: Create/update/delete via UI.

8. Developer Experience
   - Output: Root scripts to run apps locally.
   - DoD: Each app starts with a single command.

9. Documentation (Local)
   - Output: README with setup, scripts, troubleshooting.
   - DoD: New engineer runs stack in <10 minutes.

## 10) Manual E2E Verification Checklist
- Start server/admin/viewer.
- Viewer: open `/guides/<seeded-id>`; verify sidebar links and section toggles.
- Admin: list guides; load seeded; edit and save; verify changes in viewer.
- Admin: create new guide; add chapters/sections; save; verify viewer.
- Admin: delete a guide; verify disappearance and 404 on viewer.

## 11) Risks and Mitigations
- File write collisions → Atomic writes and simple in-process lock.
- Data corruption on crash → Optional `.bak` before writes.
- Inconsistent IDs from admin → Backend validates/regenerates as needed.

## 12) Acceptance Criteria (MVP Complete)
- Backend: CRUD stable on `guides.json`, proper codes, CORS configured.
- Admin: Full CRUD, clear feedback, stable editor state.
- Viewer: Accurate rendering and navigation by guide id.
- Local DX: Clear scripts and README, no external services.
- E2E: Admin edits reflect in viewer after save.

## 13) Execution Order (Recommended)
1) Initialize monorepo and scripts  
2) Backend storage and API  
3) Seed data  
4) Viewer app  
5) Admin app  
6) E2E verification  
7) README polish

## 14) Change Log
- 2025-09-20: Initial plan created (local-only scope; JSON storage).
- 2025-09-20: **UPDATED STORAGE ARCHITECTURE** - Changed from single `guides.json` file to individual guide files in `data/guides/` directory with separate `index.json` for performance and scalability. Backend implementation completed and tested.
- 2025-09-20: **MVP COMPLETED** - All phases implemented successfully:
  - ✅ Monorepo scaffolding with npm workspaces
  - ✅ Backend API with local JSON storage (distributed architecture)
  - ✅ Viewer app with Monday.com design and RTL support
  - ✅ Admin app with full CRUD functionality and professional UI
  - ✅ Home page editor feature with copy link functionality
  - ✅ E2E testing and bug fixes documented
  - ✅ Comprehensive README and documentation
  - ✅ Production-ready with npm scripts and health checks

---

This is a living document. Update sections and the change log as implementation progresses.


