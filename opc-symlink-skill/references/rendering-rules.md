# Rendering Rules

Use these rules whenever creating or revising a homepage.

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

When the user requests content, wording, link, offer, proof, audience, CTA, or
style changes:

1. Update the metadata JSON.
2. Run `scripts/render-homepage.mjs` with the same output HTML path.
3. Inspect the generated HTML if practical.
4. Return the metadata path and HTML path.

Do not hand-edit generated HTML. Manual HTML edits will be overwritten by the
next render and can make future revisions fail.

Do not manually translate generated HTML. Translate the metadata entries in
both `locales.zh-CN` and `locales.en`, then rerun the renderer.

## Command Discipline

Run rendering as a separate command:

```bash
node /path/to/opc-symlink-skill/scripts/render-homepage.mjs \
  metadata.json \
  personal-homepage.html \
  --template product-led
```

The renderer rejects single-language metadata by default. If and only if the
user explicitly requested a single-language page, pass `--single-language`:

```bash
node /path/to/opc-symlink-skill/scripts/render-homepage.mjs \
  metadata.json \
  personal-homepage.html \
  --template product-led \
  --single-language
```

Do not combine JSON creation, JSON editing, and rendering in one heredoc-heavy
shell command. If metadata must be changed, edit the JSON file first, then run
the renderer as a separate step.

If old generated HTML variants already exist from experimentation, keep the
latest intended output file and remove obsolete generated variants before final
delivery.

## Failure Handling

- If rendering fails with "Missing template", pass `--template product-led`,
  `--template builder-os`, or `--template proof-first`.
- If rendering fails with "Bilingual metadata is required", add
  `locales.zh-CN` and `locales.en` to the metadata. Use `--single-language`
  only when the user explicitly requested a single-language page.
- If rendering fails with a missing required field, update metadata fields:
  `identity.name`, `positioning.headline`, or `positioning.summary`.
- If rendering appears to time out, stop and check whether the previous command
  is waiting for heredoc input, a browser process, or another non-render step.
  The renderer itself is a short synchronous Node script.
