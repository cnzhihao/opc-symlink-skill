# Metadata Schema

Use this shape for the public profile JSON. Omit empty optional fields rather
than filling them with placeholders.

```json
{
  "locale": "zh-CN",
  "identity": {
    "name": "Public name",
    "pronouns": "",
    "title": "Short public title",
    "location": "",
    "avatar": ""
  },
  "positioning": {
    "headline": "One-line positioning statement",
    "tagline": "Short memorable line",
    "summary": "One concise paragraph",
    "keywords": ["AI", "product", "automation"]
  },
  "work": {
    "company": {
      "name": "",
      "role": "",
      "description": "",
      "website": ""
    },
    "products": [
      {
        "name": "",
        "description": "",
        "url": "",
        "status": "live|building|concept|private"
      }
    ],
    "services": [
      {
        "name": "",
        "description": "",
        "audience": ""
      }
    ]
  },
  "proof": {
    "publicHighlights": ["Published project, launch, talk, article, or result"],
    "metrics": ["Only confirmed metrics"],
    "partners": ["Only public or user-approved partners"],
    "customers": ["Only public or user-approved customers"],
    "testimonials": [
      {
        "quote": "",
        "person": "",
        "role": ""
      }
    ]
  },
  "collaboration": {
    "lookingFor": ["Customers", "partners", "hiring", "investors"],
    "bestFit": "Who should contact the user",
    "callToAction": "Primary action text"
  },
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com/example"
    }
  ],
  "contact": {
    "email": "",
    "preferred": "",
    "calendar": ""
  },
  "style": {
    "voice": "warm|precise|bold|quiet|technical|editorial",
    "visualMood": "clean, modern, product-focused",
    "accentColor": "#2563eb"
  },
  "privacy": {
    "exclude": ["Private facts to omit"],
    "approvalNotes": "What the user explicitly confirmed"
  }
}
```

Validation rules:

- Require `identity.name`, `positioning.headline`, and `positioning.summary`.
- Include at least one contact route or link unless the user requests otherwise.
- Use arrays for repeatable content, even when there is only one item.
- Store only user-confirmed public facts in `proof.partners`,
  `proof.customers`, `proof.metrics`, and `proof.testimonials`.
- Keep `privacy.exclude` out of the rendered homepage.
