---
name: silverline-save-sesh
description: Use at the end of every Silverline portfolio CC session to save a structured report to Obsidian Task Outputs before closing
---

# Silverline Portfolio — CC Session Report

Run this at the end of every working session — even if the task isn't complete.
Use the Obsidian `write_note` tool to save.

---

## How to Save

**Tool:** Direct file write to the Obsidian vault on disk.
**Vault path:** `C:\Users\mathe\Documents\Obsidian Vault\Claude\Projects\Silverline\Portfolio\Task Outputs\`
**Filename:** `[DATE] [PTASK-XXX] — [short title].md`
**Date format:** YYYY-MM-DD
**Example:** `C:\Users\mathe\Documents\Obsidian Vault\Claude\Projects\Silverline\Portfolio\Task Outputs\2026-05-06 PTASK-001 — Project Scaffold.md`

## Frontmatter

```
---
date: YYYY-MM-DD
tags:
  - project-silverline
  - cc-output
  - task-output
project: Silverline
task_id: PTASK-XXX
task_status: done | in-progress | blocked
summary: One sentence — what was accomplished this session.
---
```

---

## Report Structure

Use exactly these sections in this order:

### # [DATE] [PTASK-XXX] — [Task Title]

### ## What Was Done
Concrete description of everything built or changed this session.
Be specific — file names, component names, config changes, commands run.
Mathe should be able to reconstruct exactly what happened from this section alone.

### ## Files Created / Modified
List every file touched. Format:
- `path/to/file.ts` — created | modified | deleted — what it does

### ## Commits
List every commit made this session. Format:
- `abc1234` — [PTASK-XXX] description

### ## Problems Encountered
Any errors, unexpected behavior, or friction. Include: what the problem was, how it was diagnosed, how it was resolved (or not).
If unresolved, flag clearly with ⚠️.

### ## Decisions Made Independently
Any small implementation decisions CC made without being explicitly told — library choices, naming conventions, workarounds.
Flag anything that touches the design system — even small deviations must be noted.

### ## Blockers & Flags for Planner
🚩 [BLOCKER/QUESTION/DECISION NEEDED]: description — what needs to be decided and by whom.
If no blockers: write "Nothing to flag."

### ## Task Status
- If **DONE:** state all acceptance criteria passed + final commit hash
- If **IN-PROGRESS:** state what % complete, what remains, estimated next session scope
- If **BLOCKED:** state exactly what is blocking

### ## Next Session
Either:
- Continue this task from: [specific point]
- Task complete — pull [PTASK-XXX] from QUEUE

### ## Related
Scan `Task Outputs` first, then sibling Portfolio folders, for genuinely related notes — same task ID, predecessor/successor sessions, same topic. Add 1–3 wikilinks. Never link randomly just to fill the section. Format:
- [[note title]]

---

## Rules

- Never skip a section — write "Nothing to report" if a section is empty.
- Be specific. "Set up fonts" is useless. "Installed next/font/google, loaded Archivo with weights 400/600/700/800/900 and variable --font-archivo, applied to html element in app/layout.tsx" is useful.
- If something was tried and failed, document it — saves the next session from repeating the mistake.
- Run before closing, even if the task isn't done.
- If a design system rule was violated — even accidentally — flag it clearly in Decisions Made Independently so the planner can catch it.
- Always add a `## Related` section — minimum 1 link, maximum 3. Scan Task Outputs first, then sibling folders. Link only notes that share the same task, topic, or session chain (e.g. predecessor session, same PTASK, design system notes touched).
