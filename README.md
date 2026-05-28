# OPC Symlink Skill

[简体中文](README.zh-CN.md)

An open-source Codex skill that interviews a user, mines local workspace
context, confirms public-facing facts, produces structured profile metadata,
and renders a standalone personal homepage HTML file.

## What It Does

- Scans likely context files such as `user.md`, `memory.md`, `soul.md`,
  profile/about files, product docs, blog posts, and launch notes.
- Scans `memory/` and `memories/` folders, limited to files modified in the
  last 3 months.
- Summarizes discovered context as hypotheses and asks the user to confirm,
  correct, or remove private details.
- Runs a progressive natural-language interview about identity, work,
  products, company, partners, customers, proof, links, and collaboration goals.
- Produces public profile JSON metadata and a standalone single-page HTML
  personal card.

## Install

Install with the skills CLI:

```bash
npx skills add https://github.com/cnzhihao/opc-symlink-skill
```

Or ask an AI coding agent to install it:

```text
Help me install opc-symlink-skill. Clone
https://github.com/cnzhihao/opc-symlink-skill to
~/.claude/skills/opc-symlink-skill, then verify that
opc-symlink-skill/SKILL.md, opc-symlink-skill/agents/,
opc-symlink-skill/references/, and opc-symlink-skill/scripts/
exist.
```

After installation, invoke it with:

```text
Use $opc-symlink-skill to interview me and create a single-page personal card homepage.
```

## License

GNU Affero General Public License v3.0 only. See `LICENSE`.
