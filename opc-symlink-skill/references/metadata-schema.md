# AI Builder Metadata Schema

Use this schema for AI builder style OPC personal homepages. Omit empty
optional fields rather than filling them with placeholders.

The JSON is an internal implementation artifact. Ask the user to confirm the
packaging direction and public boundary, not the raw JSON.

Language rules:

- Generate Chinese and English content as two separate metadata sets by default.
- Only omit one language when the user explicitly asks for a single-language
  homepage.
- Put shared non-language-specific data at the top level.
- Put localized copy under `locales.zh-CN` and `locales.en`.
- Do not mix Chinese content with English template labels. The renderer
  localizes template UI by locale.
- The current OPC Symlink template IDs are shared by the website, CLI, and
  bundled local renderer: `gridline`, `split-signal`, `cozy-archive`,
  `handwritten`, `quiet-product`, `fireline`, `tile-playground`,
  `night-director`, `pattern-field`, `continuous-axis`, `three-column`,
  `pixel-arcade`, `copy-collage`, `ink-hover`, and `grainy-lab`.
- Use the exact template ID in `style.template` and in
  `opc-symlink upload --template`. Do not use aliases or stale template names.
- To get the current template list at runtime instead of relying on this
  document, run `opc-symlink templates` (CLI ≥ 0.3.1) or fetch
  `GET https://opcsymlink.com/api/templates` (login-free JSON with
  `templates[].id`, `default`, and `notes`). If the list cannot be obtained,
  omit `style.template` entirely — the platform falls back to its default
  template; never guess an ID.
- Top-level visible copy (the blocks outside `locales`: `identity`,
  `positioning`, `audience`, `transformation`, `offers`, `products`, `proof`,
  `builderStack`, `content`, `cta`) is validated as the English fallback:
  it must not contain CJK (Chinese/Japanese/Korean) characters. The renderer
  rejects it with `contains Chinese/Japanese/Korean characters in the English
  locale`. Write the top-level blocks in English and put Chinese copy in
  `locales.zh-CN`.
- English locale visible copy must not contain Chinese sentences. Translate or
  transliterate names, products, proof, offers, and audience text.

Visible copy budgets:

| Field | Chinese limit | English limit |
| --- | ---: | ---: |
| `identity.name` | 12 | 28 |
| `identity.title` | 18 | 40 |
| `positioning.headline` | 28 | 70 |
| `positioning.tagline` | 20 | 56 |
| `positioning.summary` | 90 | 180 |
| `positioning.differentiator` | 50 | 120 |
| `audience.primary` | 28 | 70 |
| `audience.painPoints[]` | 26 | 80 |
| `audience.desiredOutcomes[]` | 26 | 80 |
| `audience.notFor[]` | 24 | 70 |
| `transformation.from/to/mechanism` | 36 | 90 |
| `offers[].name` | 18 | 46 |
| `offers[].outcome/description` | 36 | 90 |
| `products[].name` | 18 | 46 |
| `products[].value/description` | 36 | 90 |
| `proof.cases[].name` | 20 | 52 |
| `proof.cases[].problem/result` | 34 | 90 |
| `proof.publicProjects[]/credibility[]/metrics[]` | 30 | 90 |
| `cta.primary.label` | 8 | 22 |
| `cta.secondary.label` | 8 | 22 |
| `cta.note` | 36 | 90 |
| `currentWork.headline` | 28 | 70 |
| `currentWork.summary` | 90 | 180 |
| `currentWork.status.label` | 18 | 40 |
| `currentWork.status.note` | 36 | 90 |
| `currentWork.items[].title` | 24 | 52 |
| `currentWork.items[].summary` | 80 | 180 |
| `currentWork.items[].tags[]` | 12 | 28 |
| `currentWork.updates[].date` | 24 | 40 |
| `currentWork.updates[].title` | 28 | 70 |
| `currentWork.updates[].summary` | 90 | 180 |
| `currentWork.*.links[].label` | 18 | 40 |
| `positioning.keywords[]` | 12 | 28 |

If a field is too long, rewrite metadata before rendering. Do not rely on HTML
wrapping or truncation to fix overlong copy.

```json
{
  "locale": "zh-CN",
  "locales": {
    "zh-CN": {
      "identity": {
        "name": "公开姓名",
        "title": "AI 构建者 / OPC 操作者"
      },
      "positioning": {
        "headline": "我帮助 ... 构建 AI 系统",
        "summary": "中文公开介绍",
        "keywords": ["AI Agent", "自动化", "产品构建"]
      },
      "cta": {
        "primary": {
          "label": "预约沟通",
          "url": "mailto:hello@example.com"
        }
      }
    },
    "en": {
      "identity": {
        "name": "Public name",
        "title": "AI Builder / OPC Operator"
      },
      "positioning": {
        "headline": "I build AI systems that help ...",
        "summary": "English public introduction",
        "keywords": ["AI agents", "automation", "product builder"]
      },
      "cta": {
        "primary": {
          "label": "Book a conversation",
          "url": "mailto:hello@example.com"
        }
      }
    }
  },
  "identity": {
    "name": "Public name",
    "title": "AI builder / OPC operator",
    "avatar": "",
    "location": "",
    "languages": ["Chinese", "English"]
  },
  "positioning": {
    "headline": "I build AI systems that help ...",
    "tagline": "Short memorable line",
    "summary": "One clear paragraph for public use",
    "differentiator": "Why this builder is meaningfully different",
    "keywords": ["AI agents", "automation", "product builder"]
  },
  "audience": {
    "primary": "Who this homepage should attract",
    "segments": ["Founders", "B2B teams", "AI-native operators"],
    "painPoints": ["What they struggle with now"],
    "desiredOutcomes": ["What they want instead"],
    "notFor": ["Visitors or work types to avoid"]
  },
  "transformation": {
    "from": "Current state of the audience",
    "to": "Better state after working with the user",
    "mechanism": "How the user creates that change"
  },
  "offers": [
    {
      "name": "AI workflow advisory",
      "type": "call|advisory|delivery|training|co-build|product",
      "audience": "Who it is for",
      "outcome": "What changes for the buyer",
      "description": "Short offer explanation",
      "ctaLabel": "Book a call",
      "url": ""
    }
  ],
  "products": [
    {
      "name": "Product name",
      "status": "live|building|private|concept",
      "audience": "Who should use it",
      "value": "What it helps them do",
      "description": "Short product explanation",
      "url": ""
    }
  ],
  "proof": {
    "cases": [
      {
        "name": "Case or project name",
        "problem": "What was hard",
        "result": "What improved",
        "url": ""
      }
    ],
    "publicProjects": ["Public launch, repo, demo, article, or tool"],
    "metrics": ["Only confirmed metrics"],
    "testimonials": [
      {
        "quote": "",
        "person": "",
        "role": ""
      }
    ],
    "credibility": ["Confirmed credentials, communities, clients, talks"]
  },
  "builderStack": {
    "tools": ["OpenAI", "Cloudflare Workers", "Next.js"],
    "agentCapabilities": ["Research agents", "workflow automation"],
    "automationCapabilities": ["CRM automation", "content pipelines"],
    "technicalTags": ["TypeScript", "MCP", "RAG"]
  },
  "content": {
    "featured": [
      {
        "title": "Public post or demo",
        "type": "article|video|repo|demo|talk",
        "url": ""
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/example"
      }
    ]
  },
  "currentWork": {
    "updatedAt": "2026-08-26",
    "headline": "What I am working on now",
    "summary": "A short public description of the current focus.",
    "status": {
      "label": "Selective",
      "availability": "selective",
      "note": "Open to two focused projects."
    },
    "items": [
      {
        "id": "project-id",
        "title": "Project or system",
        "summary": "What is being built or operated.",
        "status": "building",
        "updatedAt": "2026-08-26",
        "tags": ["AI", "automation"],
        "links": [{ "label": "Read more", "url": "https://example.com" }]
      }
    ],
    "updates": [
      {
        "id": "update-id",
        "date": "2026-08-26",
        "title": "Shipped a public milestone",
        "summary": "A short update that is safe to publish.",
        "relatedItemId": "project-id",
        "links": []
      }
    ]
  },
  "cta": {
    "primary": {
      "label": "Book a conversation",
      "url": "mailto:hello@example.com"
    },
    "secondary": {
      "label": "View product",
      "url": ""
    },
    "note": "Best next step for qualified visitors"
  },
  "style": {
    "template": "gridline",
    "voice": "sharp|warm|technical|editorial|premium",
    "visualMood": "editorial, credible, modern",
    "accentColor": "#2563eb"
  },
  "privacy": {
    "exclude": ["Private facts to omit"],
    "approvalNotes": "What the user explicitly allowed to publish"
  }
}
```

Validation rules:

- Require `identity.name`, `positioning.headline`, and `positioning.summary`.
- Require `locales.zh-CN` and `locales.en` by default. For explicit
  single-language homepages, require `identity.name`, `positioning.headline`,
  and `positioning.summary` in the single metadata object.
- For bilingual homepages, require `identity.name`, `positioning.headline`, and
  `positioning.summary` inside each localized entry in `locales`.
- Prefer `cta.primary` for booking a conversation unless the user chooses
  another conversion goal.
- Use arrays for repeatable content, even when there is only one item.
- Store only user-confirmed public facts in `proof.cases`, `proof.metrics`,
  `proof.testimonials`, and `proof.credibility`.
- Keep visible copy within the budgets above. The renderer and verifier fail
  hard on overlong copy instead of truncating it.
- Every non-empty URL must be a full URL with an `http://`, `https://`,
  `mailto:`, or `tel:` scheme. Bare domains such as `example.com` are not
  valid hosted metadata; normalize them before rendering or upload.
- `style.template` must be one of the 15 current template IDs above. The same
  ID is passed to the local renderer and the hosted CLI. An unsupported name
  must fail loudly instead of falling back to another design.
- `currentWork.status.availability` must be one of `open`, `selective`, `busy`,
  or `closed`; item status must be one of `exploring`, `building`, `shipping`,
  `operating`, or `paused`.
- `currentWork.history` is server-maintained metadata. Agents should normally
  omit it from update files; the website fills visibility, retention, and export
  fields when a suggestion is applied.
- Keep `privacy.exclude` and `privacy.approvalNotes` out of rendered HTML.
- Legacy metadata with `work.products`, `work.services`,
  `proof.publicHighlights`, and top-level `links` may be rendered as fallback,
  but new metadata should use this schema.
