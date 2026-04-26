# LockInBro

## Working Agreement

- Build the app phase by phase so each phase can be tested before moving on.
- Before starting a new phase, clarify questions, contradictions, and concerns first.
- Explain larger coding terms in beginner-friendly language.
- Use local mock data first unless a phase explicitly requires a backend.
- Do not run or stop the local development server automatically; provide the commands so the user can run them manually.
- After every phase, provide a checklist of things to test.
- Keep this README updated as product and technical decisions are clarified.

---

## Current Build Decisions

- Current app framework: React Native + Expo.
- Current language: JavaScript.
- Current testing target: browser preview first.
- Current data approach: local mock data only.
- Planned database later: Supabase.
- Supabase should cover most MVP backend needs, including database, authentication, real-time updates, and security rules.
- Do not add Docker for now.
- Do not add a custom backend for now.

### Backend Notes

A custom backend means a separate server owned by this project, such as Node.js/Express or Python/FastAPI, that handles app logic and database requests. For the MVP, Supabase is expected to handle most of that backend responsibility so the app can avoid a separate custom server early on.

---

## Phase Build Log

### Phase 1 — App Shell

- Created the Expo app.
- Added username login.
- Added Home and Friends screens.
- Used browser preview as the first testing target.
- Used local mock data only.

### Phase 2 — Create Request Flow

- Added Create Request screen.
- Added friend selection.
- Added to-do list input.
- Added fake distraction app checklist.
- Added duration selection and optional note.
- Sending a request returns to Home, shows "Request sent!", and displays the new pending request.
- Split project code into `src/screens`, `src/components`, `src/data`, and `src/styles`.

### Phase 3 — Incoming Request + Active Session

- Focus on User 2 receiving a Lock In Request.
- Simulate both sides in one local browser.
- Pending requests are separated into incoming requests that need the current user's action and outgoing requests waiting for a friend.
- Home stays direct by showing requests, active sessions, and app history on the front page.
- "lockin now!" is available as a bottom-right floating action button on Home and stays fixed while scrolling.
- Simulated User 1 accept/decline pop-ups use short status text and disappear automatically after 10 seconds.
- Active session progress uses a simple progress bar plus text for accessibility.
- User 2 can open an incoming request, view details, accept it, or decline it.
- Accepted requests leave Pending Requests and move into Active Lock In Sessions.
- Declined requests leave Pending Requests and move into app history.
- Simulate a User 1 notification when User 2 accepts or declines.

### Phase 4 — User 1 Active Session Controls

- Active session screen supports viewing as User 1 or User 2.
- User 1 can check off tasks during an active session.
- Progress bar and task status update when tasks are checked.
- Completed task rows change color so "done" is visually obvious.
- Accountability friend does not see a current work updates section on the active screen.
- Task completion events are saved as report entries with timestamps.
- App history items can be opened to retrieve session report details later.
- User 1 can emergency cancel, but must confirm first.
- Confirmed emergency cancel removes the session from active sessions, adds it to app history as cancelled, returns Home, and shows a closeable centered "cancelled session" pop-up.
- User 2 does not need wordy notifications for task progress; the progress bar and task status are enough for now.
- User 2 can unlock apps and end the session once all tasks are done.
- Ended sessions leave active sessions, move to app history as completed, and save a report entry.

---

## 1. App Overview

LockInBro is a social accountability productivity app that helps users reduce distractions and stay focused by asking trusted friends to help them stay on task.

Instead of relying on self-control alone, users can send a **Lock In Request** to a friend for accountability support.

The MVP is planned for both **iOS and Android** using a cross-platform framework.

The MVP focuses on **Friend Mode only**.

---

## 2. Core Concept

User 1 wants to focus.

User 1 chooses:

- Apps they want to avoid during the session
- A to-do list
- Maximum session duration

User 1 sends a request to User 2:

**Please help me lock in.**

User 2 accepts the request and becomes the accountability partner.

The session ends when:

- User 2 manually ends it after tasks are completed, or
- Maximum session duration expires, or
- User 1 uses emergency cancel

---

## 3. Core Users

### User 1 — Locked In User

The person trying to focus.

Can:

- Create account
- Add trusted friends
- Choose distraction apps
- Create tasks
- Set max duration
- Send Lock In Requests
- Mark tasks complete
- Request unlock
- Emergency cancel session

### User 2 — Accountability Friend

Trusted friend helping User 1 stay disciplined.

Can:

- Accept friend requests
- Receive Lock In Requests
- View User 1 task list
- View selected distraction apps
- View max duration
- Send reactions
- End session manually

---

## 4. MVP Scope

The MVP will include:

- Username login
- Friend connections
- Lock In Requests
- Soft distraction control sessions
- To-do lists
- Countdown timer
- Quick reactions
- Manual session ending by friend
- Auto end after max duration
- Push notifications
- Session history

---

## 5. Main User Flow

## 5.1 Friend Setup

1. User signs up with username.
2. User adds a friend by username or invite link.
3. Friend accepts request.

---

## 5.2 Create Lock In Request

User 1 selects:

- Friend
- Distraction apps
- To-do list
- Max duration
- Optional note

Then taps:

**Send Lock In Request**

---

## 5.3 Friend Accepts Request

User 2 sees:

- User name
- Tasks
- Distraction apps
- Max duration

User 2 taps **Accept**.

Then:

- Session starts immediately
- Countdown timer begins
- Selected apps become monitored distraction apps

---

## 5.4 During Session

User 1 sees:

- Time remaining
- Tasks remaining
- Session status

User 2 can send quick reactions:

- Lock in bro
- Finish strong
- You got this
- Don’t fold now

---

## 5.5 Completion Flow

1. User 1 completes tasks.
2. User 1 taps **Request Unlock**.
3. User 2 receives notification.
4. User 2 taps **End Session**.

---

## 5.6 Auto End Flow

If User 2 does not respond:

- Session ends automatically when max duration expires.

---

## 5.7 Emergency Cancel

User 1 may emergency cancel anytime.

Session ends immediately.

Friend is notified.

---

## 6. Product Positioning

LockInBro is not a hard phone blocker.

It is a **social accountability app** that helps users focus through trusted friends.

Use cases:

- Studying
- Coding
- Gym discipline
- Work deadlines
- Productivity sprints

---

# Phase 4 — Screens & UI

## 7. Screens

## 7.1 Login Screen

- Username input
- Continue button

---

## 7.2 Home Screen

Shows:

- Current status
- Start Lock In Request
- Previous sessions
- Pending requests

---

## 7.3 Friends Screen

Shows:

- Current friends
- Add friend
- Pending requests
- Remove friend

---

## 7.4 Create Request Screen

Inputs:

- Select friend
- Select distraction apps
- Add tasks
- Choose duration
- Optional note

CTA:

**Send Request**

---

## 7.5 Incoming Request Screen

Shows:

- Sender name
- Tasks
- Apps selected
- Duration

Buttons:

- Accept
- Decline

---

## 7.6 Active Session Screen

Shows:

- Countdown timer
- Task checklist
- Request Unlock button
- Emergency Cancel button

---

## 7.7 Session Review Screen

For User 2:

- Tasks completed
- Time remaining

Buttons:

- End Session
- Keep Going

---

## 7.8 Session Summary Screen

Shows:

- Duration
- Tasks completed
- Break attempts
- Session result

Examples:

- Nice work.
- Discipline found.
- Stayed locked in.

---

# Phase 5 — Technical Decisions

## 8. Tech Stack

Recommended:

- React Native + Expo
- Supabase backend
- Push notifications
- Local state first

---

## 8.1 Platform Behavior

### iOS

Focus on:

- Timers
- Notifications
- Accountability flow

### Android

Same MVP features first.

---

## 8.2 Soft Blocking Definition

Soft blocking means:

- User selects distraction apps
- Session starts
- App sends reminders
- Attempts are tracked
- Friend receives alerts

No OS-level blocking in MVP.

---

## 8.3 Authentication

MVP uses:

- Username only

---

## 8.4 Friend Adding

Methods:

- Username search
- Invite link

---

# Phase 6 — Data Model

## 9. Main Tables

## users

- id
- username
- display_name
- created_at

## friendships

- id
- requester_id
- receiver_id
- status
- created_at

Statuses:

- pending
- accepted
- rejected

## sessions

- id
- user_id
- friend_id
- status
- max_duration_minutes
- created_at
- started_at
- ended_at

Statuses:

- pending
- active
- completed
- expired
- cancelled
- rejected

## session_tasks

- id
- session_id
- task_text
- is_completed

## distraction_apps

- id
- session_id
- app_name
- app_identifier
- platform

## notifications

- id
- user_id
- type
- title
- is_read
- created_at

---

# Phase 7 — Core Backend Actions

## 10. Actions Needed

- Create user
- Send friend request
- Accept friend request
- Remove friend
- Create lock request
- Accept request
- Decline request
- Start timer
- Mark task complete
- Request unlock
- End session
- Auto expire session
- Emergency cancel
- Load session history

---

# Phase 8 — Soft Blocking Logic

## 11. During Session

If User 1 opens distraction apps:

- Show reminder notification
- Log break attempt
- Notify User 2 in real time

Examples:

- Bro lock in.
- Stay focused.
- Don’t fold now.
- Finish strong.

---

## 11.1 Smart Notifications

Send notifications for:

- Session started
- Break attempt detected
- Unlock requested
- Session ended
- Session expired

---

# Phase 9 — Social Retention

## 12. Features

### Quick Reactions

User 2 can send:

- Lock in bro
- Finish strong
- Proud of you

### Unlock Nudges

User 1 may remind User 2 once every 10 minutes.

### Session Summary

Show:

- Duration
- Tasks completed
- Break attempts

---

# Final Build Instructions for Cursor / Codex

## 13. Build This First

Build a React Native + Expo MVP.

Use local mock state first.

Do NOT build:

- Hard blocking
- Payments
- Chat system
- Groups
- AI features
- Complex analytics
- Scheduled sessions

Prioritize:

1. Username login
2. Friend list
3. Create request
4. Accept request
5. Active timer
6. Task checklist
7. Unlock request
8. End session
9. Auto expiry
10. Emergency cancel
11. Session summary

Return:

- Folder structure
- Screen structure
- State model
- Components
- Navigation flow
- Mock data setup
