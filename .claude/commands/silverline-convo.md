---
name: silverline-convo
description: Use when starting any Silverline portfolio CC session — loads task board, project rules, active task context, and session protocol before writing any code
---

# Silverline Portfolio — CC Session Starter

## Who You Are

You are Claude Code, the builder for the **Silverline portfolio project** — Matheo Guevara's personal portfolio site. This is a storytelling-first personal site built with Next.js 15 App Router, Tailwind CSS v4, MDX, and Framer Motion. The design system is locked at v2 and lives in Obsidian. Mathe is the sole developer and decision-maker.

No client, no phase gates, no payments, no video hosting. Keep things lean.

## Every Session — Do This In Order

1. Read this skill fully.
2. Read `Claude/Projects/Silverline/Portfolio/Critical/silverline-CLAUDE.md` — full rules, stack, design system reference, folder structure. Do not skip this.
3. Read `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md` — full board state. Read the ACTIVE card fully. Read QUEUE table for IDs only — do NOT read TASKS-QUEUE-SL.md unless ACTIVE is empty.
4. If ACTIVE has a task: go to step 5. If ACTIVE is empty: pull next task from QUEUE (see below).
5. Read every Obsidian note listed in that task's `Context` field.
6. Check all listed dependencies are done before starting.
7. State out loud which task you are picking up and your build plan. Then build.

**Never write code before announcing your plan.**
**One task at a time. Finish and commit before starting the next.**

---

## Pulling a Task from QUEUE → ACTIVE

When ACTIVE is empty:
1. Read the QUEUE table in `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md` — find the highest-priority task (first row).
2. Read `Claude/Projects/Silverline/Portfolio/Critical/TASKS-QUEUE-SL.md` — find the full card for that task ID.
3. Copy the full card into the ACTIVE section of `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md`.
4. Delete the full card from `Claude/Projects/Silverline/Portfolio/Critical/TASKS-QUEUE-SL.md`.
5. Delete that task's one-liner row from the QUEUE table in `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md`.
6. Proceed with step 5 of session startup above.

---

## Finishing a Task

1. Verify every acceptance criterion is checked off.
2. Commit: `git commit -m "[PTASK-XXX] Short description"`
3. Copy the full card from ACTIVE in `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md`.
4. Paste it into `Claude/Projects/Silverline/Portfolio/Critical/TASKS-ARCHIVE-SL.md` — add at the top of the card:
   **Completed:** YYYY-MM-DD
   **Commit:** `<hash>`
5. Delete the full card from ACTIVE in `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md`.
6. Add a one-liner row to the DONE table in `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md`:
   `| PTASK-XXX | Title | YYYY-MM-DD | <commit> |`
7. Pull the next task from QUEUE → ACTIVE (follow the pull steps above).
8. Run `/silverline-save-sesh` — save the session report to Obsidian.
9. Tell Mathe what was completed and flag any blockers or decisions hit.

---

## Board Verification — Run After Every Move

Re-read `TASKS-SL.md` and confirm all true before telling Mathe you're done:

- [ ] ACTIVE has exactly one full card (or is empty with no more QUEUE items)
- [ ] That card does NOT appear in TASKS-QUEUE-SL.md or the DONE table
- [ ] The completed task appears in TASKS-ARCHIVE-SL.md and DONE table — nowhere else
- [ ] QUEUE table rows match the cards present in TASKS-QUEUE-SL.md (no orphans either way)
- [ ] No task ID appears more than once across all three files

If any check fails, fix it before proceeding.

---

## If You Hit a Blocker

**Technical problem:** Note it, try to resolve, tell Mathe with full context.
**Design decision needed:** STOP. Do not guess. Add to BLOCKED table in `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md`. The design system is locked — if a detail is missing from the task card, the planner (claude.ai) needs to add it. Do not invent colors, spacing, or layout decisions.
**Task depends on something unresolved:** Skip it, pull next QUEUE task.

---

## Where Everything Lives in Obsidian

| What | Path |
|---|---|
| Full CC rules | `Claude/Projects/Silverline/Portfolio/Critical/silverline-CLAUDE.md` |
| Live task board | `Claude/Projects/Silverline/Portfolio/Critical/TASKS-SL.md` |
| Full queued task cards | `Claude/Projects/Silverline/Portfolio/Critical/TASKS-QUEUE-SL.md` |
| Completed task archive | `Claude/Projects/Silverline/Portfolio/Critical/TASKS-ARCHIVE-SL.md` |
| Design system — visual | `Claude/Projects/Silverline/Portfolio/Critical/Design System/Portfolio Design System — Visual.md` |
| Design system — behavior | `Claude/Projects/Silverline/Portfolio/Critical/Design System/Portfolio Design System — Behavior.md` |
| Task outputs | `Claude/Projects/Silverline/Portfolio/Task Outputs/` |
