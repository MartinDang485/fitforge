## FitForge

A full-stack workout app for building personal exercise library and grouping exercises into custom workouts. 

**Status:** In active development. Exercise CRUD and workout creation/listing/deletion work end to end. Authentication, row-level security, tests, CI and deployment are currently in development.

Live Demo: Coming Soon

## Features
- **Exercise library:** create, view, edit, and delete exercises (name and body part).
- **Custom workouts:** click *Create Workout*, tick exercises with checkboxes, name the workout, and save it.
- **Workout list:** saved workouts are listed with their exercises and can be deleted.
- **Server-side validation:** the API rejects empty workout names and workouts with no exercises.

## Tech stack

| Layer | Technology |

| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | Next.js route handlers (`app/api/...`) |
| Database | Supabase (hosted Postgres) |
| Supabase client | `@supabase/ssr` + `@supabase/supabase-js` |

## Architecture

The browser never talks to the database directly. Every request goes through a server-side API layer:

```
Browser (React client components)
        │  fetch()
        ▼
Next.js route handlers  (app/api/*/route.ts)
        │  server-side Supabase client (cookies-based)
        ▼
Supabase Postgres

Keeping the database behind route handlers means validation and authorization live on the server, where they can't be bypassed from the browser.

## Frontend Structure

`ExercisePanel` is the parent client component. It owns the shared state (exercises, workouts, selection mode, selected exercise ids, workout name) and passes data and callbacks down to its children:

```
ExercisePanel
├── ExerciseForm   (create an exercise → onCreated refreshes the list)
├── ExerciseList   (edit / delete exercises; checkboxes when selecting)
├── Create-workout controls (name input, Save, Cancel)
└── WorkoutList    (list / delete workouts → onDeleted refreshes the list)
```

State is lifted into the parent so sibling components stay in sync: a child calls a callback prop after a successful request, and the parent re-fetches.

### API routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/exerciseapi` | List all exercises |
| POST | `/api/exerciseapi` | Create an exercise |
| PUT | `/api/exerciseapi/[id]` | Update an exercise |
| DELETE | `/api/exerciseapi/[id]` | Delete an exercise |
| GET | `/api/workoutapi` | List workouts, each with its exercises |
| POST | `/api/workoutapi` | Create a workout from `{ workout: { name, exerciseIds } }` |
| DELETE | `/api/workoutapi/[id]` | Delete a workout |

Status codes: `201` created, `200` success, `400` invalid input, `500` database/unexpected error.

## Design decisions

- **Route handlers instead of direct browser-to-Supabase calls.** This keeps a conventional frontend → API → database architecture and puts validation and authorization on the server.
- **Lifted state.** The panel owns the data and children report changes through callback props, so the exercise list and workout list never go stale.
- **Two-step workout insert.** Creating a workout inserts the `workouts` row first, uses the returned `id` to bulk-insert the `workout_exercises` rows, and deletes the workout again if the second step fails. A Postgres function called through `supabase.rpc` would make this fully atomic and is a possible improvement.
- **Validation on both sides.** The UI disables or blocks bad input for a good user experience; the API re-validates because clients can call it directly.
- **Flattened API response.** `GET /api/workoutapi` reshapes the nested join result into `{ id, name, exercises: [...] }`, so the frontend doesn't need to know a join table exists.


