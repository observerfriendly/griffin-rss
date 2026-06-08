# griffin-rss

Claude skills and MCP server for Griff McCabe's operational workflow.

## Structure

```
griffin-rss/
├── governance/
│   └── SKILL.md          — Collaborative build framework (blueprint, build, review)
├── memory/
│   └── SKILL.md          — Griff's collaboration defaults and Claude memory
├── python-reference/
│   └── SKILL.md          — Curated Python ops toolkit
├── tdc-builder/
│   └── SKILL.md          — TDC operational playbook
├── src/
│   └── index.ts          — MCP server (TypeScript)
├── package.json
└── tsconfig.json
```

## MCP Setup

```bash
npm install
npm run build
```

### Claude Code (~/.claude.json)
```json
{
  "mcpServers": {
    "griffin-rss": {
      "command": "node",
      "args": ["/Users/griffinmccabe/Desktop/griffin-rss/dist/index.js"]
    }
  }
}
```

## Tools
| Tool | Description |
|------|-------------|
| `get_governance_framework` | Fetch governance build protocol |
| `get_claude_memory` | Fetch Griff's collaboration memory |
| `get_python_reference` | Fetch curated Python ops toolkit |
| `get_tdc_builder` | Fetch TDC operational playbook |
| `list_skills` | List all skills and triggers |
| `check_build_task` | Assess whether governance should activate |

## Updating Skills
Edit `SKILL.md` in any skill folder and push to main.
The MCP server fetches live from GitHub — no rebuild needed.
