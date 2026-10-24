export type MCPServerConfig = {
	command?: string
	args?: string[]
	env?: Record<string, string>
	url?: string
	headers?: Record<string, string>
	[key: string]: unknown
}

export type MCPConfig = {
	mcpServers: Record<string, MCPServerConfig>
	[key: string]: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value)

const isStringRecord = (value: unknown): value is Record<string, string> =>
	isRecord(value) &&
	Object.values(value).every((item) => typeof item === "string")

export function validateMcpConfig(value: unknown): MCPConfig {
	if (!isRecord(value) || !isRecord(value.mcpServers)) {
		throw new Error("Configuration must contain an mcpServers object")
	}

	for (const [name, server] of Object.entries(value.mcpServers)) {
		if (!isRecord(server)) {
			throw new Error(`Server "${name}" must be an object`)
		}

		const hasCommand =
			typeof server.command === "string" &&
			server.command.trim().length > 0
		const hasUrl =
			typeof server.url === "string" && server.url.trim().length > 0
		if (!hasCommand && !hasUrl) {
			throw new Error(`Server "${name}" needs a command or URL`)
		}
		if ("command" in server && !hasCommand) {
			throw new Error(`Server "${name}" has an invalid command`)
		}
		if ("url" in server && !hasUrl) {
			throw new Error(`Server "${name}" has an invalid URL`)
		}
		if (
			"args" in server &&
			(!Array.isArray(server.args) ||
				!server.args.every((arg) => typeof arg === "string"))
		) {
			throw new Error(
				`Server "${name}" must have an array of string args`
			)
		}
		if ("env" in server && !isStringRecord(server.env)) {
			throw new Error(
				`Server "${name}" must have string environment values`
			)
		}
		if ("headers" in server && !isStringRecord(server.headers)) {
			throw new Error(`Server "${name}" must have string header values`)
		}
	}

	return value as MCPConfig
}

// Export-time path adjustments must never mutate the state held by React.
export function prepareMcpConfigForExport(config: MCPConfig): MCPConfig {
	return {
		...config,
		mcpServers: Object.fromEntries(
			Object.entries(config.mcpServers).map(([name, server]) => {
				if (
					!server.args ||
					(name !== "exa" && name !== "browserbase")
				) {
					return [name, server]
				}

				const args = server.args.map((arg) => {
					if (!arg.includes("index.js")) return arg
					return name === "exa"
						? "$HOME_DIR/mcp-servers/exa-mcp-server-main/build/index.js"
						: "$HOME_DIR/mcp-servers/mcp-server-browserbase-main/browserbase/dist/index.js"
				})
				return [name, { ...server, args }]
			})
		)
	}
}

// Shell-quote the entire JSON, except for the existing generated HOME_DIR paths.
// Quoting is required because values may legitimately contain apostrophes or shell syntax.
export function buildSaveCommand(config: MCPConfig): string {
	const json = JSON.stringify(prepareMcpConfigForExport(config), null, 2)
	const quoted = json
		.replace(/'/g, "'\\''")
		.replace(/\$HOME_DIR/g, "'\"$HOME_DIR\"'")
	return `HOME_DIR="$HOME" && printf '%s\\n' '${quoted}' > "$HOME_DIR/Library/Application Support/Claude/claude_desktop_config.json"`
}
