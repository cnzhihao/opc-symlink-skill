# OPC Symlink Skill

[简体中文](README.zh-CN.md)

An open-source skill that interviews an AI builder, mines local workspace
context, packages the user for a target audience, produces structured profile
metadata, and renders a standalone personal homepage HTML file.

## What It Does

- Scans likely context files such as `user.md`, `memory.md`, `soul.md`,
  profile/about files, product docs, blog posts, and launch notes.
- Scans `memory/` and `memories/` folders, limited to files modified in the
  last 3 months.
- Summarizes discovered context as packaging hypotheses and asks the user to
  confirm the direction and public boundary.
- Runs a deep packaging interview about audience, pain, transformation, offers,
  products, proof, CTA, and privacy boundaries.
- Enforces copy-length budgets for visible metadata fields such as headlines,
  CTA labels, cards, lists, and keywords.
- Produces AI builder profile metadata and a standalone single-page HTML
  homepage.
- Verifies that the HTML came from the bundled mjs renderer instead of manual
  HTML edits.
- Supports three reusable templates: `product-led`, `builder-os`, and
  `proof-first`.
- Generates bilingual Chinese/English output by default in one HTML file using
  `locales.zh-CN` and `locales.en`.

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

The renderer can also be called directly:

```bash
node opc-symlink-skill/scripts/render-homepage.mjs metadata.json homepage.html --template product-led
node opc-symlink-skill/scripts/verify-homepage.mjs metadata.json homepage.html
```

Single-language metadata is rejected by default. Use `--single-language` only
when the user explicitly requests a single-language page, and pass the same flag
to the verifier.

The renderer also rejects overlong visible copy and Chinese text inside the
English locale. Shorten or translate metadata, then render again.

## License

GNU Affero General Public License v3.0 only. See `LICENSE`.
