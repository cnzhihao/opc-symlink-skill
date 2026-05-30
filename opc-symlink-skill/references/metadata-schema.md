# AI Builder Metadata Schema

Use this schema for AI builder style OPC personal homepages. Omit empty
optional fields rather than filling them with placeholders.

The JSON is an internal implementation artifact. Ask the user to confirm the
packaging direction and public boundary, not the raw JSON.

Language rules:

- Generate Chinese and English content as two separate metadata sets when the
  user wants a multilingual homepage.
- Put shared non-language-specific data at the top level.
- Put localized copy under `locales.zh-CN` and `locales.en`.
- Do not mix Chinese content with English template labels. The renderer
  localizes template UI by locale.

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
    "template": "product-led|builder-os|proof-first",
    "voice": "sharp|warm|technical|editorial|premium",
    "visualMood": "product-led, credible, modern",
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
- For multilingual homepages, require these fields inside each localized entry
  in `locales`.
- Prefer `cta.primary` for booking a conversation unless the user chooses
  another conversion goal.
- Use arrays for repeatable content, even when there is only one item.
- Store only user-confirmed public facts in `proof.cases`, `proof.metrics`,
  `proof.testimonials`, and `proof.credibility`.
- Keep `privacy.exclude` and `privacy.approvalNotes` out of rendered HTML.
- Legacy metadata with `work.products`, `work.services`,
  `proof.publicHighlights`, and top-level `links` may be rendered as fallback,
  but new metadata should use this schema.
