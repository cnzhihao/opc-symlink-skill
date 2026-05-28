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
npx skills add cnzhihao/opc-symlink-skill -y -g
```

Or ask an AI coding agent to run the non-interactive installer:

```text
Help me install opc-symlink-skill by running:
npx skills add cnzhihao/opc-symlink-skill -y -g
```

After installation, invoke it with:

```text
Use $opc-symlink-skill to interview me and create a single-page personal card homepage.
```

## License

GNU Affero General Public License v3.0 only. See `LICENSE`.
