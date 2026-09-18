# OPC Symlink CLI

Use this reference when the user chooses to publish metadata through OPC
Symlink or update an existing hosted homepage.

## Contract

The CLI uploads profile metadata JSON. It does not upload generated HTML. The
website stores the metadata and renders the public homepage with its current
portfolio template library.

The website, CLI, and bundled local renderer use the same 15 template IDs:

`gridline`, `split-signal`, `cozy-archive`, `handwritten`, `quiet-product`,
`fireline`, `tile-playground`, `night-director`, `pattern-field`,
`continuous-axis`, `three-column`, `pixel-arcade`, `copy-collage`, `ink-hover`,
and `grainy-lab`.

If no template is supplied, the platform uses `gridline`. Do not pass an old
or invented name and do not silently fall back to another design.

To fetch the live template list with style descriptions, run:

```bash
opc-symlink templates
```

or fetch `GET https://opcsymlink.com/api/templates` (login-free JSON:
`templates[].id` / `name` / `description`, plus `default` and `notes`). This
works on CLI ≥ 0.3.1 and requires no network on the caller's part beyond the
single GET. If the list cannot be fetched, omit `style.template` from the
metadata and omit `--template` from the upload — the platform applies its
default template. Never invent or guess an ID.

If an upload is rejected with `Invalid template` naming an embedded
`style.template`, do not retry the same payload: re-fetch the live list, pick
a listed ID (or omit the field), fix the metadata, and upload again.

## Install

The package and binary are both named `opc-symlink`:

```bash
npm install -g opc-symlink@latest
opc-symlink --help
npm view opc-symlink version
```

If a global install is not available, use:

```bash
npx opc-symlink@latest --help
```

If `opc-symlink --help` does not show the 15 current template IDs or the
commands below, the binary is stale. Reinstall the latest package, or run the
`npx` form directly; do not work around a stale binary with raw HTTP calls.

Before login or upload, validate the metadata without generating HTML:

```bash
node /path/to/opc-symlink-skill/scripts/validate-metadata.mjs \
  metadata.json \
  --template quiet-product
```

The preflight checks the bilingual structure, current template ID, copy
budgets, full URL schemes, and the 256 KB hosted upload limit.

## Complete command surface

```bash
opc-symlink login [--host https://opcsymlink.com] [--no-open]
opc-symlink upload <metadata-json-file> [--slug my-name] [--template gridline] [--title "My profile"]
opc-symlink suggest <slug> <suggestion-json-file>
opc-symlink suggest --homepage-id <id> <suggestion-json-file>
opc-symlink current-work suggest <slug> <current-work-json-file>
opc-symlink current-work export <slug> [--out current-work-history.json]
opc-symlink list
opc-symlink pull <slug> [--out metadata.json]
opc-symlink search <keyword> [--limit 10] [--sort best] [--tag tag] [--offer offer] [--audience audience] [--location location] [--language language] [--product-status status] [--out results.json]
opc-symlink profile <slug> [slug ...] [--out profiles.json] (alias: view)
opc-symlink whoami
opc-symlink logout
```

Most authenticated commands use the host stored during login. Use
`--host <url>` when a command targets a local or staging server. `login` also
accepts `OPC_SYMLINK_HOST` when `--host` is omitted.

## Login

Run:

```bash
opc-symlink login
```

The CLI requests a device code, prints a verification URL and user code, then
polls until the user approves the request in the browser. It opens the browser
automatically unless `--no-open` is passed. The local access token is stored in
`~/.opc-symlink/config.json`; the directory and file are created with private
permissions.

Do not treat `authorization_pending` as a failed login. It means the browser
approval is still waiting. The device code expires; rerun `login` if it does.

## Create a homepage

Prepare metadata that follows `references/metadata-schema.md`, then run:

```bash
opc-symlink upload metadata.json --slug your-name --template quiet-product
```

Optional flags:

```bash
opc-symlink upload metadata.json \
  --slug your-name \
  --template grainy-lab \
  --title "Public profile title"
```

Upload behavior:

- The request body contains metadata JSON plus optional slug, template, and
  title fields.
- The server accepts metadata JSON only and rejects an HTML field/upload.
- An explicit unknown hosted template is rejected; it must not silently fall
  back to another style.
- When both `--template` and `style.template` are present, they must be the
  same current ID; a mismatch is rejected before a homepage is created.
- Non-empty URLs must use `http://`, `https://`, `mailto:`, or `tel:`. Bare
  domains such as `example.com` are rejected by the website API.
- If `--slug` is omitted, the platform generates a slug from the account name
  or email.
- Upload creates a new homepage. If the slug already exists, the server
  returns a conflict and tells the user to use `suggest`.
- A successful response includes the public URL, slug, and selected template.
- The metadata JSON request is limited to 256 KB.

Keep the selected template consistent: when `--template` is supplied, set the
same ID in `style.template` in the metadata. Omitting the flag uses the
platform default, `gridline`.

## Update a homepage through review

For normal homepage changes, prepare a suggestion JSON file and submit it:

```bash
opc-symlink suggest your-name suggestion.json
```

The suggestion file is a structured object with fields such as:

```json
{
  "type": "metadata",
  "title": "Clarify the positioning",
  "summary": "Short explanation of the proposed change.",
  "affectedPaths": ["positioning.headline"],
  "affectedSections": ["positioning"],
  "rawContent": { "reason": "Optional source context" },
  "proposedPatch": {
    "positioning": {
      "headline": "A shorter public headline"
    }
  }
}
```

The response includes the suggestion status. Depending on the homepage
permission mode, the server may apply the update automatically; otherwise the
owner must review and apply or reject it in the Dashboard. The CLI does not
directly overwrite a published homepage.

Use the homepage slug for the normal form. When only a homepage UUID is
available, use the `--homepage-id` form shown in the command surface.

## Current Work

`Current Work` is a first-class hosted section for active projects, operating
status, availability, dated updates, and public links. Prepare a JSON object
matching the schema in `references/metadata-schema.md`:

```json
{
  "updatedAt": "2026-08-26",
  "headline": "Building the next version",
  "summary": "A short public update.",
  "status": {
    "availability": "selective",
    "note": "Open to two focused projects."
  },
  "items": [],
  "updates": []
}
```

Submit it through the specialized command:

```bash
opc-symlink current-work suggest your-name current-work.json
```

This creates a `current_work` suggestion with `currentWork` as its proposed
patch. The CLI prints the suggestion ID, slug, status, and current quota. The
update may be applied automatically according to the homepage permission mode;
otherwise it remains pending until Dashboard review.

Export stored Current Work history when the plan allows it:

```bash
opc-symlink current-work export your-name
opc-symlink current-work export your-name --out current-work-history.json
```

The export contains the slug, export time, entitlement summary, and stored
updates with normalized data, raw content, status, and lifecycle timestamps.

The website, not the CLI, decides whether an update can be submitted or
exported. Always report the quota returned by the CLI instead of hard-coding
plan limits; those limits can change independently of this Skill. Agents
should omit the server-maintained `currentWork.history` field from update
files.

## Inspect and manage local access

List the current user's hosted homepages:

```bash
opc-symlink list
```

Pull one homepage's stored metadata:

```bash
opc-symlink pull your-name
opc-symlink pull your-name --out metadata.json
```

Search public profiles and inspect one or more profiles:

```bash
opc-symlink search "AI automation" --limit 10 --sort best
opc-symlink search "AI automation" --tag agents --out search-results.json
opc-symlink profile your-name
opc-symlink profile your-name another-name --out profiles.json
```

`search` accepts `--limit`, `--sort`, `--tag`, `--offer`, `--audience`,
`--location`, `--language`, and `--product-status`. `profile` accepts one to
ten slugs per invocation and is also available as the `view` alias. Both
commands can use `--host`; `--out` writes JSON instead of printing it.

Check the authenticated account:

```bash
opc-symlink whoami
```

Clear the local token configuration:

```bash
opc-symlink logout
```

`logout` clears the local CLI configuration. It does not revoke a remote token
on the server.

## Procedure

1. Choose one current template ID. Use `gridline` when the user has not
   specified a preference, and keep it consistent with `style.template`.
2. Save metadata JSON to a clear path and run
   `scripts/validate-metadata.mjs metadata.json --template <template>`.
3. Check availability with `opc-symlink --help`. If the installed CLI is stale
   or does not show the current commands/templates, upgrade it with
   `npm install -g opc-symlink@latest` or use `npx opc-symlink@latest`.
4. Run `login` if the CLI reports that the user is not logged in.
5. Run `upload` only for a new homepage. Capture its returned URL, slug, and
   template.
6. For an existing homepage, use `suggest`, or use `current-work suggest` for
   the Current Work section.
7. Report the command, metadata path, result, and any assumptions without
   exposing access tokens.

## Failure handling

- `Not logged in. Run: opc-symlink login`: authenticate, then retry.
- `File not found`: fix the path; do not recreate metadata from memory.
- `Invalid profile metadata`: correct the JSON according to
  `references/metadata-schema.md`.
- `Metadata exceeds the 256 KB upload limit`: remove private or unnecessary
  content and retry.
- `Invalid template`: choose one of the 15 current template IDs listed above.
- `Homepage already exists`: stop using `upload`; submit a suggestion.
- `HTML uploads are no longer accepted`: upload metadata JSON only.
- `401 Unauthorized`: check login and host; do not print or share the token.
- Network or host errors: retry once if transient. Use `--host <url>` for a
  local or staging server.

## Output

Return:

- The metadata JSON path.
- The CLI command used, without secrets.
- The public URL and slug if upload succeeded.
- The selected current template.
- Suggestion ID and the status returned for update submissions, including
  whether the update was auto-applied or needs Dashboard review.
- Current Work quota or export path when relevant.
- Any assumptions, missing proof, or fields rejected by the platform.
