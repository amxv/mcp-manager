import { describe, expect, test } from "bun:test"
import { spawnSync } from "node:child_process"
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import {
	buildSaveCommand,
	prepareMcpConfigForExport,
	validateMcpConfig
} from "../src/mcp-config"

describe("MCP config input validation", () => {
	const invalidContainers: unknown[] = [
		null,
		[],
		{},
		{ mcpServers: null },
		{ mcpServers: [] },
		{ mcpServers: "invalid" },
		{ mcpServers: 4 },
		{ mcpServers: true }
	]

	for (const [index, value] of invalidContainers.entries()) {
		test(`rejects malformed root/container ${index + 1}`, () => {
			expect(() => validateMcpConfig(value)).toThrow()
		})
	}

	const invalidServers: unknown[] = [
		null,
		[],
		"server",
		{},
		{ args: ["-y"] },
		{ command: null },
		{ command: "" },
		{ command: "npx", args: null },
		{ command: "npx", args: "-y" },
		{ command: "npx", args: ["-y", 42] },
		{ command: "npx", env: [] },
		{ command: "npx", env: { TOKEN: false } },
		{ command: "npx", env: null },
		{ url: "" },
		{ url: "https://example.test/mcp", headers: { TOKEN: 1 } }
	]

	for (const [index, server] of invalidServers.entries()) {
		test(`rejects malformed server entry ${index + 1}`, () => {
			expect(() =>
				validateMcpConfig({ mcpServers: { filesystem: server } })
			).toThrow(/filesystem/)
		})
	}

	const validConfigs = [
		{ mcpServers: {} },
		{ mcpServers: { synthetic: { command: "mock", args: [] } } },
		{ mcpServers: { bare: { command: "npx" } } },
		{
			mcpServers: {
				remote: {
					type: "http",
					url: "https://example.test/mcp",
					headers: { Authorization: "Bearer placeholder" }
				}
			},
			globalShortcut: "Ctrl+M"
		},
		{
			mcpServers: {
				filesystem: {
					command: "npx",
					args: [
						"-y",
						"@modelcontextprotocol/server-filesystem",
						"/tmp"
					],
					env: { FOO: "" },
					disabled: false
				},
				custom: { command: "/opt/custom/server", args: ["--flag"] }
			},
			preferences: { theme: "dark" }
		}
	]

	for (const [index, value] of validConfigs.entries()) {
		test(`accepts legitimate config ${index + 1} without dropping settings`, () => {
			expect(validateMcpConfig(value)).toEqual(value)
		})
	}
})

describe("MCP config export", () => {
	test("keeps root settings and never mutates the imported configuration", () => {
		const original = validateMcpConfig({
			mcpServers: {
				exa: {
					command: "node",
					args: ["exa-mcp-server/build/index.js"]
				},
				browserbase: {
					command: "node",
					args: [
						"mcp-server-browserbase-main/browserbase/dist/index.js"
					]
				},
				remote: { url: "https://example.test/mcp" }
			},
			cloudflare: { account: "unchanged" },
			preferences: { theme: "dark" }
		})
		const before = JSON.stringify(original)
		const prepared = prepareMcpConfigForExport(original)

		expect(JSON.stringify(original)).toBe(before)
		expect(prepared.cloudflare).toEqual({ account: "unchanged" })
		expect(prepared.preferences).toEqual({ theme: "dark" })
		expect(prepared.mcpServers.remote).toEqual({
			url: "https://example.test/mcp"
		})
		expect(prepared.mcpServers.exa.args).toEqual([
			"$HOME_DIR/mcp-servers/exa-mcp-server-main/build/index.js"
		])
		expect(prepared.mcpServers.browserbase.args).toEqual([
			"$HOME_DIR/mcp-servers/mcp-server-browserbase-main/browserbase/dist/index.js"
		])
	})

	test("quotes shell metacharacters safely and writes complete JSON into a test home", () => {
		const home = mkdtempSync(join(tmpdir(), "mcp-manager-test-"))
		try {
			const marker = join(home, "command-was-executed")
			const suspiciousValue = `normal'; touch '${marker}'; echo '\n$DOLLAR and é`
			const config = validateMcpConfig({
				mcpServers: {
					custom: {
						command: "npx",
						args: ["-y", "custom"],
						env: { VALUE: suspiciousValue }
					},
					exa: { command: "node", args: ["build/index.js"] }
				},
				preferences: { theme: "dark" }
			})
			const target = join(
				home,
				"Library/Application Support/Claude/claude_desktop_config.json"
			)
			mkdirSync(dirname(target), { recursive: true })
			const result = spawnSync("sh", ["-c", buildSaveCommand(config)], {
				encoding: "utf8",
				env: { ...process.env, HOME: home }
			})
			expect(result.status).toBe(0)
			expect(existsSync(marker)).toBe(false)
			const saved = JSON.parse(readFileSync(target, "utf8"))
			expect(saved.mcpServers.custom.env.VALUE).toBe(suspiciousValue)
			expect(saved.mcpServers.exa.args).toEqual([
				`${home}/mcp-servers/exa-mcp-server-main/build/index.js`
			])
			expect(saved.preferences).toEqual({ theme: "dark" })
		} finally {
			rmSync(home, { recursive: true, force: true })
		}
	})
})
