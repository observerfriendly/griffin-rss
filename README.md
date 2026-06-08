# griffin-rss

Claude skills and MCP server for Griff McCabe's operational workflow.

## Structure

```
griffin-rss/
├── governance/
│   └── SKILL.md          — Collaborative build framework (blueprint, build, review)
├── tdc-builder/
│   └── SKILL.md          — TDC operational playbook
└── mcp-server/
    ├── src/index.ts      — MCP server (TypeScript)
    ├── package.json
    └── tsconfig.json
```

## MCP Setup

```bash
cd mcp-server
npm install
npm run build
```

### Claude Code (~/.claude.json)
```json
{
  "mcpServers": {
    "griffin-rss": {
      "command": "node",
      "args": ["/path/to/griffin-rss/mcp-server/dist/index.js"]
    }
  }
}
```

## Tools
| Tool | Description |
|------|-------------|
| `get_governance_framework` | Fetch governance build protocol |
| `get_tdc_builder` | Fetch TDC operational playbook |
| `list_skills` | List all skills and triggers |
| `check_build_task` | Assess whether governance should activate |

## Updating Skills
Edit `SKILL.md` in any skill folder and push to main.
The MCP server fetches live from GitHub — no rebuild needed.
