# Personal Homepage Builder Skill

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
Install the Codex skill from https://github.com/cnzhihao/opc-symlink-skill.
Place the `personal-homepage-builder` skill folder into my Codex skills
directory, usually `~/.codex/skills`, and verify that `SKILL.md`,
`agents/openai.yaml`, `references/metadata-schema.md`, and the scripts are
present.
```

After installation, invoke it with:

```text
Use $personal-homepage-builder to interview me and create a single-page personal card homepage.
```

## License

GNU Affero General Public License v3.0 only. See `LICENSE`.
