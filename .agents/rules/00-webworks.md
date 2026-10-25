# Webworks

Static portfolio site published on GitHub Pages. One product per top level
folder, each launched by its own `index.html`. No build step.

## Working alongside other agents

More than one agent works in this repository at once (Claude, Antigravity,
Codex, several worktrees). Assume someone else is mid-change.

Every agent shares one board, `C:\DEV\Webworks\.agents\BOARD.md`, by that full
path from any worktree. It is not in git. Read it before you start, put a line
under Active saying what you are doing and which files, and move it to Done or
Parked when you stop. Anything the next agent should know goes under Notes.
Handoff files and status notes do not go anywhere else in the repository.

- If a file you need is claimed on the board, or already modified by someone
  else, say so and stop. Do not "resolve" it by overwriting.
- Stage files by name. Never `git add .`, never `git commit -a`.
- Never run `git checkout`, `git switch`, `git stash`, `git reset`, `git clean`,
  `git rebase` or `git pull` unless you were explicitly asked to.
- Screenshots, samples and one-off scripts go in your own scratchpad, never
  loose in the repository.

## Conventions

- Folder and file names use lowercase `kebab-case`.
- Product images live in that folder's `assets/` directory.
- Loveable Unicorns (`loveable-unicorns/index.html`) is a game for a five year
  old. The unicorn is called Kiki. Keep it picture-first with very little to
  read, and bump the version in both the `<title>` and the header badge on
  every release.
