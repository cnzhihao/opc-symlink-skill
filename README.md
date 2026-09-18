# OPC Symlink Skill

[简体中文](README.zh-CN.md)

An open-source skill that interviews an AI builder, mines local workspace
context, packages the user for a target audience, produces structured profile
metadata, then either renders a standalone personal homepage HTML file or
uploads metadata to OPC Symlink through the CLI for a hosted homepage.

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
- Produces AI builder profile metadata, then asks the user to choose between
  local HTML generation and OPC Symlink CLI upload.
- For local HTML, verifies that the HTML came from the bundled mjs renderer
  instead of manual HTML edits.
- For OPC Symlink CLI, uploads metadata JSON with `opc-symlink upload` so the
  platform can render a hosted homepage from its template library.
- Supports `currentWork` metadata for active work, availability, updates, and
  reviewable Current Work history.
- Uses the same 15 current portfolio template IDs for local preview metadata
  and hosted CLI publishing: `gridline`, `split-signal`, `cozy-archive`,
  `handwritten`, `quiet-product`, `fireline`, `tile-playground`,
  `night-director`, `pattern-field`, `continuous-axis`, `three-column`,
  `pixel-arcade`, `copy-collage`, `ink-hover`, and `grainy-lab`.
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
node opc-symlink-skill/scripts/render-homepage.mjs metadata.json homepage.html --template gridline
node opc-symlink-skill/scripts/verify-homepage.mjs metadata.json homepage.html
```

Single-language metadata is rejected by default. Use `--single-language` only
when the user explicitly requests a single-language page, and pass the same flag
to the verifier.

The renderer also rejects overlong visible copy and Chinese text inside the
English locale. Shorten or translate metadata, then render again.

For a hosted upload, preflight metadata without generating HTML:

```bash
node opc-symlink-skill/scripts/validate-metadata.mjs metadata.json --template quiet-product
```

Run the bundled regression checks with:

```bash
node --test opc-symlink-skill/evals/render-homepage.test.mjs
```

To publish through OPC Symlink instead of generating local HTML, use the CLI:

```bash
npm install -g opc-symlink@latest
opc-symlink login
opc-symlink upload metadata.json --slug your-name --template quiet-product
opc-symlink suggest your-name suggestion.json
opc-symlink suggest --homepage-id homepage-id suggestion.json
opc-symlink current-work suggest your-name current-work.json
opc-symlink current-work export your-name --out current-work-history.json
opc-symlink list
opc-symlink pull your-name --out metadata.json
opc-symlink search "AI automation" --limit 10 --sort best
opc-symlink profile your-name --out profile.json
opc-symlink whoami
opc-symlink logout
```

The CLI uploads metadata JSON, not HTML. `upload` creates a new homepage;
updates use `suggest` or `current-work suggest` and may be applied
automatically according to the homepage permission mode, otherwise they wait
for Dashboard review. Read
`opc-symlink-skill/references/opc-symlink-cli.md` for the full contract.

## License

GNU Affero General Public License v3.0 only. See `LICENSE`.
