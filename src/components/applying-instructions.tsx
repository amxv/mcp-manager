import { TerminalCommand } from "@/components/terminal-command"
import { type MCPConfig, buildSaveCommand } from "@/mcp-config"
import { SERVER_CONFIGS } from "@/server-configs"

type ApplyingInstructionsProps = {
	jsonContent: MCPConfig
}

export function ApplyingInstructions({
	jsonContent
}: ApplyingInstructionsProps) {
	const serversNeedingSetup = Object.keys(jsonContent.mcpServers).filter(
		(serverType) =>
			SERVER_CONFIGS[serverType as keyof typeof SERVER_CONFIGS]
				?.setupCommands
	)

	return (
		<div className="join join-vertical w-full">
			<div className="collapse collapse-arrow join-item border border-base-300 bg-white mb-16 p-4">
				<input type="checkbox" />
				<h2 className="collapse-title text-xl font-tiempos-regular my-4">
					Apply your changes
				</h2>
				<div className="collapse-content space-y-4">
					<div className="bg-base-200 rounded-xl p-4">
						<h3 className="text-lg font-tiempos-regular">
							Step 1: Install Node.js and uv by running these
							commands (if not already installed)
						</h3>
						<div className="space-y-4 mt-4">
							<TerminalCommand
								command={
									'curl -fsSL https://fnm.vercel.app/install | bash && source ~/.zshrc && eval "$(fnm env --use-on-cd --shell zsh)" >> ~/.zshrc && source ~/.zshrc && fnm use --install-if-missing 22 && node -v'
								}
							/>
							If the command above fails, install Node.js by
							downloading the installer from{" "}
							<a
								href="https://nodejs.org/en/download/prebuilt-installer"
								target="_blank"
								rel="noopener noreferrer"
								className="link link-primary"
							>
								https://nodejs.org/en/download/prebuilt-installer
							</a>
							<TerminalCommand
								command={
									"curl -LsSf https://astral.sh/uv/install.sh | sh && source $HOME/.cargo/env && uv python install"
								}
							/>
						</div>
					</div>

					<div className="bg-base-200 rounded-xl p-4">
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-tiempos-regular mb-4">
									Step 2: Save your MCP servers to Claude by
									running:
								</h3>
								<TerminalCommand
									command={buildSaveCommand(jsonContent)}
								/>
							</div>
						</div>
					</div>

					{serversNeedingSetup.length > 0 && (
						<div className="bg-base-200 rounded-xl p-4">
							<h3 className="text-lg font-tiempos-regular mb-4">
								Step 3: Some servers require additional setup.
								Run the following commands:
							</h3>
							{serversNeedingSetup.map((serverType) => (
								<div key={serverType} className="mb-4">
									<p className="text-md mb-2">
										{serverType.charAt(0).toUpperCase() +
											serverType.slice(1)}
										:
									</p>
									<TerminalCommand
										command={
											SERVER_CONFIGS[
												serverType as keyof typeof SERVER_CONFIGS
											]?.setupCommands?.command || ""
										}
									/>
								</div>
							))}
						</div>
					)}

					<div className="bg-base-200 rounded-xl p-4 mt-4">
						<h3 className="text-lg font-tiempos-regular">
							Step {serversNeedingSetup.length > 0 ? "4" : "3"}:
							Restart Claude.app
						</h3>
					</div>
				</div>
			</div>
		</div>
	)
}
