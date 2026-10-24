import { EnvConfig } from "@/components/server-configs/env-config"
import { FilesystemConfig } from "@/components/server-configs/filesystem-config"
import { ObsidianConfig } from "@/components/server-configs/obsidian-config"
import { PostgresConfig } from "@/components/server-configs/postgres-config"
import { SentryConfig } from "@/components/server-configs/sentry-config"
import { SQLiteConfig } from "@/components/server-configs/sqlite-config"
import { TerminalCommand } from "@/components/terminal-command"
import type { MCPServerConfig } from "@/mcp-config"
import { SERVER_CONFIGS } from "@/server-configs"
import { ArrowUpRight, Trash2 } from "lucide-react"

type MCPServerCardProps = {
	serverName: string
	config: MCPServerConfig
	icon?: string
	onUpdate: (name: string, newConfig: MCPServerConfig) => void
	onDelete: (name: string) => void
}

export function MCPServerCard({
	serverName,
	config,
	icon,
	onUpdate,
	onDelete
}: MCPServerCardProps) {
	const args = config.args ?? []
	const handleFilesystemUpdate = (paths: string[]) => {
		const newConfig = {
			...config,
			args: [...args.slice(0, 2), ...paths]
		}
		onUpdate(serverName, newConfig)
	}

	const handlePostgresUpdate = (url: string) => {
		const newConfig = {
			...config,
			args: [...args.slice(0, 2), url]
		}
		onUpdate(serverName, newConfig)
	}

	const handleEnvUpdate = (key: string, value: string) => {
		const newConfig = {
			...config,
			env: {
				...(config.env || {}),
				[key]: value
			}
		}
		onUpdate(serverName, newConfig)
	}

	const handleSqliteUpdate = (dbPath: string) => {
		const newConfig = {
			...config,
			args: [
				"--directory",
				"parent_of_servers_repo/servers/src/sqlite",
				"run",
				"mcp-server-sqlite",
				"--db-path",
				dbPath
			]
		}
		onUpdate(serverName, newConfig)
	}

	const handleObsidianUpdate = (path: string) => {
		const newConfig = {
			...config,
			args: [...args.slice(0, 2), path]
		}
		onUpdate(serverName, newConfig)
	}

	const handleSentryUpdate = (token: string) => {
		const newConfig = {
			...config,
			args: [...args.slice(0, 2), token]
		}
		onUpdate(serverName, newConfig)
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		onDelete(serverName)
	}

	const serverConfig =
		SERVER_CONFIGS[serverName as keyof typeof SERVER_CONFIGS]
	// Transport-by-URL and command-only entries are valid, but do not have the
	// positional arguments required by these built-in server editors.
	const hasEditableArgs = Boolean(config.command) && args.length >= 2
	const isFilesystemServer = hasEditableArgs && serverName === "filesystem"
	const isPostgresServer = hasEditableArgs && serverName === "postgres"
	const isSqliteServer = hasEditableArgs && serverName === "sqlite"
	const isObsidianServer = hasEditableArgs && serverName === "obsidian"
	const isSentryServer = hasEditableArgs && serverName === "sentry"
	const iconUrl = icon || serverConfig?.icon

	return (
		<div className="join join-vertical w-full">
			<div className="collapse collapse-arrow join-item border border-base-300 bg-white p-4">
				<input type="checkbox" defaultChecked />
				<div className="collapse-title">
					<div className="flex items-center">
						<div className="flex items-center gap-2">
							{iconUrl && (
								<img
									src={iconUrl}
									alt={`${serverName} icon`}
									className="w-20 h-12 object-contain"
									onError={(e) => {
										e.currentTarget.style.display = "none"
									}}
								/>
							)}
							<h3 className="text-lg capitalize">{serverName}</h3>
						</div>
					</div>
				</div>
				<div className="collapse-content">
					{isFilesystemServer ? (
						<FilesystemConfig
							initialPaths={
								args.length > 2 ? args.slice(2) : ["/Users/"]
							}
							onUpdate={handleFilesystemUpdate}
						/>
					) : isPostgresServer ? (
						<PostgresConfig
							initialUrl={args[2]}
							onUpdate={handlePostgresUpdate}
						/>
					) : isSqliteServer ? (
						<SQLiteConfig
							initialPath={args[5]}
							onUpdate={handleSqliteUpdate}
						/>
					) : isObsidianServer ? (
						<ObsidianConfig
							initialPath={args[2]}
							onUpdate={handleObsidianUpdate}
						/>
					) : isSentryServer ? (
						<SentryConfig
							initialToken={args[2]}
							onUpdate={handleSentryUpdate}
						/>
					) : serverConfig?.env &&
						Object.keys(serverConfig.env).length > 0 ? (
						<EnvConfig
							env={serverConfig.env}
							initialValues={config.env || {}}
							onUpdate={handleEnvUpdate}
						/>
					) : null}

					{serverConfig?.docsUrl ===
						"https://github.com/cloudflare/mcp-server-cloudflare" && (
						<div className="bg-base-200 rounded-xl p-4 space-y-4">
							<p className="text-sm text-gray-600">
								MCP Manager can't update this server directly,
								please run this terminal command to modify this
								server.
							</p>
							<TerminalCommand
								command={
									serverConfig?.setupCommands?.command ?? ""
								}
							/>
						</div>
					)}
				</div>
				<div className="flex justify-end">
					{serverConfig?.docsUrl && (
						<div className="flex gap-2 mb-4 mr-2">
							<button
								type="button"
								onClick={() =>
									window.open(serverConfig.docsUrl, "_blank")
								}
								className="btn btn-sm btn-secondary"
							>
								<ArrowUpRight className="w-4 h-4" />
								<span>Docs</span>
							</button>
						</div>
					)}
					<div className="flex gap-2 mb-4 mr-4 justify-end">
						<button
							type="button"
							onClick={handleDelete}
							className="btn btn-sm bg-red-50 hover:bg-red-100"
						>
							<Trash2 className="w-4 h-4" />
							<span>Delete</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
