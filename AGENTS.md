# AGENTS.md — KadınGiyim

This repo is a **Claude Code skill collection** (not an application). It provides reusable skill packages that give Claude specialized capabilities. No app code, no package.json, no build system.

## Repo structure

There are two parallel skill directories created by different setups:

- `.Agents/Skill/.claude/skills/<name>/` — skills in the `~/.claude/skills/` location format
- `.Agents/Skill/skills/<name>/` — additional skills (mirrors <https://github.com/eyaprak/skills>)

## Available skills

| Skill | Path | What it does |
|-------|------|-------------|
| **ui-ux-pro-max** | `.Agents/Skill/.claude/skills/ui-ux-pro-max/` | UI/UX design intelligence: 50+ styles, color palettes, font pairings, 9 stacks. Python CLI with CSV-backed search. |
| **senior-backend** | `.Agents/Skill/.claude/skills/senior-backend/` | API scaffolding, DB migration tooling, load testing. Python scripts. |
| **senior-frontend** | `.Agents/Skill/.claude/skills/senior-frontend/` | Component generation, bundle analysis, frontend scaffolding. Python scripts. |
| **frontend-design** | `.Agents/Skill/.claude/skills/frontend-design/` | Creative frontend design skill — bold, non-generic aesthetics. Standalone SKILL.md only. |
| **seo-expert** | `.Agents/Skill/skills/seo-expert/` | End-to-end SEO content pipeline: research → outline approval → writing → quality gate → HTML. Node.js v18+ scripts. |
| **prd-yaz** | `.Agents/Skill/skills/prd-yaz/` | Turkish-language PRD (product requirements document) writer. Guides user through structured questioning → outputs `prd.md`. |

## Key usage notes

- **ui-ux-pro-max** requires Python 3. Trigger via the search CLI: `python3 scripts/search.py "<query>" --design-system`
  - Default stack is `html-tailwind` if user doesn't specify one
  - CSV data files live in `data/` — these are the design knowledge base
- **seo-expert** requires Node.js v18+ (no npm install). Scripts are standalone `.mjs` files.
  - Output goes to `output/[slug]/[slug].html` and `.md`
  - Image generation needs `GOOGLE_GEMINI_API_KEY` (optional, not a blocker)
  - Works in all Claude environments
- **prd-yaz** is entirely Turkish-language. Conversations and output are in Turkish.
  - Uses `AskUserQuestion` for structured decision-making
  - Outputs to `prd.md`
  - Critically: never silently assume decisions even if user says "you decide" — always present options with recommendations
- `.Agents/Skill/skills/.gitignore` ignores `prd-yaz-workspace/` (test output)

## When working in this repo

- Don't look for application entrypoints, tests, or CI — there are none
- Skills are meant to be **copied** to `~/.claude/skills/<name>/` for actual use
- If the task involves building a women's clothing app, use the appropriate skill(s) to guide development
