---
name: opc-symlink-skill
description: Interview a user, mine workspace context, confirm a public-facing personal narrative, produce structured JSON metadata, and generate a standalone single-page personal homepage or personal card. Use when the user wants an agent to understand who they are, what they do, their products, company, partners, customers, public achievements, positioning, bio, profile, personal introduction, calling card, or personal homepage.
---

# OPC Symlink Skill

## Overview

Use this skill to help a user turn scattered context and natural-language
answers into a confirmed public profile, JSON metadata, and a standalone HTML
personal homepage.

Always treat workspace memory as unverified raw material. Summarize it as
hypotheses, ask the user to confirm or correct it, then interview progressively
until the public-facing profile is coherent and safe to publish.

## Workflow

1. Scan context.
2. Summarize findings for confirmation.
3. Interview in short adaptive rounds.
4. Draft and confirm the metadata.
5. Render the personal homepage.
6. Deliver the JSON and HTML path, with any unresolved assumptions.

## Scan Context

Run the scanner from the current workspace unless the user points elsewhere:

```bash
node /path/to/opc-symlink-skill/scripts/scan-context.mjs . --json
```

Look especially for files named like `user.md`, `memory.md`, `soul.md`,
`profile.md`, `about.md`, `bio.md`, `README.md`, blog posts, docs, product
descriptions, pitch notes, and public launch notes.

Also scan directories named `memory` or `memories`, but only use files modified
within the last 3 months. Treat older memory files as stale unless the user
explicitly asks to include a longer history.

Use scanner output to decide which files to read. Do not read secrets, env
files, private keys, credential stores, dependency folders, build artifacts, or
large unrelated files. If a file appears sensitive, ask before using it.

## Confirm Before Interviewing

Even when strong memory files are found, show a concise confirmation summary
before asking deeper questions:

- "Here is what I infer about you..."
- "Here is what seems public or product-facing..."
- "Here is what I am unsure about..."
- "What should I correct, remove, or keep private?"

If no useful files are found, say that the workspace did not provide enough
personal context and begin the interview from first principles.

## Interview Style

Ask 2-4 questions per round. Prefer natural language over forms. Adapt the next
questions to the user's answers instead of walking through a rigid checklist.

Cover these areas over several rounds:

- Identity: name, preferred title, location/timezone if public, languages.
- Positioning: who the user helps, what they are unusually good at, tone.
- Work: current role, company, products, services, open-source or public work.
- Proof: launches, metrics, customer outcomes, notable collaborations.
- Audience: ideal partners, customers, communities, hiring or investment fit.
- Offers: what visitors can ask for, buy, join, follow, or collaborate on.
- Links: website, GitHub, X/Twitter, LinkedIn, email, scheduling, docs.
- Boundaries: details that must stay private or should be softened.
- Design: visual mood, language, density, and whether to use a photo/avatar.

Stop interviewing when the profile is specific enough to produce a credible
homepage. Do not keep asking for optional details if the user has already given
enough material.

## Metadata

Before rendering HTML, create a JSON object that follows
`references/metadata-schema.md`. Show the user a readable summary first and ask
for confirmation on public claims, private details, and calls to action.

Keep claims truthful. If proof is vague, phrase it as direction or focus rather
than achievement. Do not invent partners, customers, metrics, logos, titles, or
credentials.

## Render Homepage

Save the confirmed metadata as JSON, then render:

```bash
node /path/to/opc-symlink-skill/scripts/render-homepage.mjs \
  metadata.json \
  personal-homepage.html
```

The renderer creates a standalone HTML file with embedded CSS and metadata. If
the user has a frontend repository and asks for integration, adapt the content
to that stack instead of using the standalone renderer.

After rendering, inspect the HTML in a browser when practical. Check that text
does not overflow, links are correct, private content is absent, and the first
viewport clearly communicates who the user is and why visitors should care.

## Output

Return:

- The final metadata JSON or the path to it.
- The generated HTML file path.
- A short note listing assumptions or missing information.

Prefer the user's language. If the user writes in Chinese, interview and write
the homepage in Chinese unless they request another language.
