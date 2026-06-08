import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/observerfriendly/griffin-rss/main";

const LOCAL_BASE = join(__dirname, "..");

const server = new McpServer({
  name: "griffin-rss",
  version: "1.0.0",
});

const registerTool = server.tool.bind(server) as (...args: unknown[]) => void;

const checkBuildTaskSchema: { request: z.ZodString } = {
  request: z.string().describe("The user request to analyze"),
};

async function fetchSkill(skillPath: string): Promise<string> {
  const url = `${GITHUB_RAW_BASE}/${skillPath}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
    return await res.text();
  } catch {
    const localPath = join(LOCAL_BASE, skillPath);
    try {
      return readFileSync(localPath, "utf-8");
    } catch {
      throw new Error(`Could not fetch skill: ${skillPath}`);
    }
  }
}

registerTool(
  "get_governance_framework",
  "Fetch the governance framework. Call this at the start of any build, " +
    "multi-step task, or artifact creation to load the collaborative build " +
    "protocol (blueprint, build, review). For non-trivial work, also call " +
    "get_claude_memory.",
  {},
  async () => {
    const content = await fetchSkill("governance/SKILL.md");
    return { content: [{ type: "text", text: content }] };
  }
);

registerTool(
  "get_claude_memory",
  "Fetch Griff's collaboration memory. Call this alongside governance for " +
    "non-trivial deliverables, planning, drafting, critique, TDC work, or " +
    "tasks where Griff's working preferences should shape the response.",
  {},
  async () => {
    const content = await fetchSkill("memory/SKILL.md");
    return { content: [{ type: "text", text: content }] };
  }
);

registerTool(
  "get_tdc_builder",
  "Fetch the TDC operational playbook. Call this for any TDC task: " +
    "competition ops, winner outreach, exhibition, ceremony, annual book, " +
    "board governance, Type Drives Commerce, or YAMM campaigns.",
  {},
  async () => {
    const content = await fetchSkill("tdc-builder/SKILL.md");
    return { content: [{ type: "text", text: content }] };
  }
);

registerTool(
  "list_skills",
  "List all available skills with descriptions and trigger phrases.",
  {},
  async () => {
    const skills = [
      {
        name: "governance",
        tool: "get_governance_framework",
        description: "Collaborative build framework — blueprint, build, review.",
        triggers: ["make", "build", "create", "finish", "ledger", "spreadsheet", "draft", "artifact"],
      },
      {
        name: "claude-memory",
        tool: "get_claude_memory",
        description: "Griff's collaboration defaults — accuracy, scope, format, calibration.",
        triggers: ["non-trivial work", "planning", "drafting", "critique", "TDC", "workflow"],
      },
      {
        name: "tdc-builder",
        tool: "get_tdc_builder",
        description: "TDC operational playbook — competition ops, outreach, exhibitions, book, board.",
        triggers: ["TDC", "TDC72", "TDC73", "winner", "exhibition", "ceremony", "YAMM", "Slanted"],
      },
    ];
    return { content: [{ type: "text", text: JSON.stringify(skills, null, 2) }] };
  }
);

registerTool(
  "check_build_task",
  "Analyze a request and determine whether governance should activate.",
  checkBuildTaskSchema,
  async (args: { request: string }) => {
    const request = String(args.request);
    const buildTriggers = ["make", "build", "create", "finish", "add", "update",
      "write", "draft", "ledger", "spreadsheet", "document", "artifact", "report",
      "run comps", "pull comps", "outreach", "campaign", "tracker"];
    const tdcTriggers = ["tdc", "tdc72", "tdc73", "winner", "exhibition",
      "ceremony", "yamm", "slanted", "type drives commerce", "board governance",
      "judging", "annual book", "lower-thirds", "indesign"];
    const lower = request.toLowerCase();
    const isBuildTask = buildTriggers.some((t) => lower.includes(t));
    const isTdcTask = tdcTriggers.some((t) => lower.includes(t));
    const isSimpleLookup = !isBuildTask &&
      ["what", "who", "when", "how many", "is ", "does "].some((t) => lower.startsWith(t));
    const result = {
      isBuildTask,
      isTdcTask,
      isSimpleLookup,
      governanceRequired: isBuildTask,
      skillsToLoad: [
        ...(isBuildTask ? ["governance", "claude-memory"] : []),
        ...(isTdcTask ? ["tdc-builder", "claude-memory"] : []),
      ],
      recommendation: isSimpleLookup
        ? "Simple lookup — execute directly."
        : isBuildTask
        ? "Build task — load governance and claude-memory, state plan before executing."
        : "Ambiguous — ask one scoping question before proceeding.",
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("griffin-rss MCP server running");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
