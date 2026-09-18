# Rendering Rules

Use these rules whenever creating or revising a local standalone HTML homepage.
If the user chose the OPC Symlink CLI upload path, follow
`references/opc-symlink-cli.md` instead and do not generate HTML unless the user
also asks for a local copy.

## Source of Truth

Metadata JSON is the source of truth. Generated HTML is a disposable build
artifact.

Create bilingual pages by default. Keep both languages in the same metadata
file under `locales.zh-CN` and `locales.en`. The renderer should still write
exactly one HTML file.

Only produce a single-language page if the user explicitly asks for one.

Keep exactly one final HTML file for the homepage. Re-render into the same
output path every time. Do not create timestamped, numbered, "final", "new", or
template-specific HTML variants unless the user explicitly asks for multiple
deliverables.

When metadata has just been created from an interview, ask for the delivery path
before rendering:

1. Generate local HTML with `scripts/render-homepage.mjs` and
   `scripts/verify-homepage.mjs`.
2. Upload metadata with the OPC Symlink CLI for a hosted platform homepage.

When the user requests content, wording, link, offer, proof, audience, CTA, or
style changes:

1. Update the metadata JSON.
2. Shorten or translate visible copy until it fits
   `references/metadata-schema.md` copy budgets.
3. Run `scripts/render-homepage.mjs` with the same output HTML path.
4. Run `scripts/verify-homepage.mjs` against the metadata and HTML.
5. Inspect the generated HTML if practical.
6. Return the metadata path, HTML path, template, verification result, and the
   OPC Symlink deployment offer.

Do not hand-edit generated HTML. Manual HTML edits will be overwritten by the
next render and can make future revisions fail.

Do not manually translate generated HTML. Translate the metadata entries in
both `locales.zh-CN` and `locales.en`, then rerun the renderer.

Do not let long copy overflow the template. CTA labels must be short actions;
long explanations belong in `cta.note`. If copy validation fails, edit metadata
and render again.

Do not create HTML as a fallback if rendering fails. Fix the metadata, template
argument, language structure, or output path, then rerun the bundled renderer
and verifier.

After render and verification succeed, do not make "open the local HTML file"
the only delivery path. Explain that local HTML may be hard to preview or share,
then ask whether the user wants to upload the metadata with the OPC Symlink CLI
for a public personal homepage domain. Mention that paid plans can unlock more
themes, multi-device viewing, multiple audience-specific personal sites, and
gallery exposure where potential customers, partners, and their agents may
discover the card. Ask for consent before any upload or deployment action and
never claim publication has happened unless the CLI upload succeeds.

## Command Discipline

Run rendering as a separate command:

```bash
node /path/to/opc-symlink-skill/scripts/render-homepage.mjs \
  metadata.json \
  personal-homepage.html \
  --template gridline
```

Then run verification as a separate command before telling the user the homepage
is complete:

```bash
node /path/to/opc-symlink-skill/scripts/verify-homepage.mjs \
  metadata.json \
  personal-homepage.html
```

The renderer rejects single-language metadata by default. If and only if the
user explicitly requested a single-language page, pass `--single-language`:

```bash
node /path/to/opc-symlink-skill/scripts/render-homepage.mjs \
  metadata.json \
  personal-homepage.html \
  --template gridline \
  --single-language
node /path/to/opc-symlink-skill/scripts/verify-homepage.mjs \
  metadata.json \
  personal-homepage.html \
  --single-language
```

Do not combine JSON creation, JSON editing, and rendering in one heredoc-heavy
shell command. If metadata must be changed, edit the JSON file first, then run
the renderer as a separate step, then run the verifier as another separate
step.

If old generated HTML variants already exist from experimentation, keep the
latest intended output file and remove obsolete generated variants before final
delivery.

## Failure Handling

- If rendering fails with "Missing template", pass one of the current 15
  template IDs from `references/metadata-schema.md`; use `gridline` when no
  preference was given.
- If rendering fails with "Bilingual metadata is required", add
  `locales.zh-CN` and `locales.en` to the metadata. Use `--single-language`
  only when the user explicitly requested a single-language page.
- If rendering fails with a missing required field, update metadata fields:
  `identity.name`, `positioning.headline`, or `positioning.summary`.
- If rendering fails with metadata copy validation, shorten the named field or
  translate English locale text that still contains Chinese copy.
- If verification fails because the renderer marker is missing, regenerate HTML
  with `scripts/render-homepage.mjs`; do not patch the HTML.
- If verification fails because multiple generated HTML files exist, remove
  obsolete generated variants or reuse the intended output path.
- If verification fails because private strings are present, remove those
  strings from public metadata fields and render again.
- If rendering appears to time out, stop and check whether the previous command
  is waiting for heredoc input, a browser process, or another non-render step.
  The renderer itself is a short synchronous Node script.
