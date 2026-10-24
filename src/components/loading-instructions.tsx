import { TerminalCommand } from "@/components/terminal-command"
import { Check, XCircle } from "lucide-react"
import type { ChangeEvent } from "react"

interface LoadingInstructionsProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	onJsonInput: (e: ChangeEvent<HTMLTextAreaElement>) => void
	uploadStatus: "idle" | "success" | "error"
	uploadError: string | null
}

export function LoadingInstructions({
	isOpen,
	onOpenChange,
	onJsonInput,
	uploadStatus,
	uploadError
}: LoadingInstructionsProps) {
	const command =
		"test -f ~/Library/Application\\ Support/Claude/claude_desktop_config.json && pbcopy < ~/Library/Application\\ Support/Claude/claude_desktop_config.json || (echo '{\\n  \"mcpServers\": {}\\n}' | tee ~/Library/Application\\ Support/Claude/claude_desktop_config.json | pbcopy)"

	return (
		<div className="join join-vertical w-full">
			<div className="collapse collapse-arrow join-item border border-base-300 bg-white p-4">
				<input
					type="checkbox"
					checked={isOpen}
					onChange={(e) => onOpenChange(e.target.checked)}
					aria-label="MacOS Instructions"
				/>
				<h2 className="collapse-title text-xl my-4">
					MacOS Instructions
				</h2>
				<div className="collapse-content">
					<div className="prose">
						<div className="space-y-6">
							<div className="bg-base-200 rounded-xl p-4">
								<div className="space-y-4">
									<h3 className="text-lg font-tiempos-regular">
										Step 1: Run this terminal command to
										copy your current MCP config to the
										clipboard.
									</h3>
									<p className="text-sm opacity-80">
										If you've never used MCP before, this
										will create a blank config file and copy
										its contents.
									</p>

									<TerminalCommand command={command} />
								</div>
							</div>

							<div className="bg-base-200 rounded-xl p-4">
								<div>
									<h3 className="text-lg font-tiempos-regular mb-4">
										Step 2: Paste your config below.
									</h3>
									<textarea
										className="textarea textarea-bordered w-full h-16 font-mono"
										placeholder="Paste the copied JSON content here..."
										onChange={onJsonInput}
									/>
									{uploadStatus === "success" && (
										<div className="mt-2 flex items-center text-primary">
											<Check className="w-5 h-5" />
											<span className="ml-2">
												Valid MCP Configuration
											</span>
										</div>
									)}
									{uploadStatus === "error" && (
										<div
											role="alert"
											className="mt-2 flex items-center text-error"
										>
											<XCircle className="w-5 h-5" />
											<span className="ml-2">
												Error:{" "}
												{uploadError ??
													"Invalid configuration"}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
