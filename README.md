<h1 align="center">MCP Manager for Claude Desktop</h1>

<p align="center">A desktop application to manage Model Context Protocol (MCP) servers for the Claude Desktop app on MacOS. Just follow the instructions and paste a few commands to give your Claude app instant superpowers.</p>

![MCP Manager for Claude Desktop](https://assets.zue.ai/mcp-manager-hero.png)

[![Trust Score](https://archestra.ai/mcp-catalog/api/badge/quality/zueai/mcp-manager)](https://archestra.ai/mcp-catalog/zueai__mcp-manager)

## What is MCP?

The Model Context Protocol (MCP) enables Claude to access private data, APIs, and other services to answer questions and perform actions on your behalf. Learn more about MCP at:

- [modelcontextprotocol.io](https://modelcontextprotocol.io)
- [Anthropic's MCP Announcement](https://www.anthropic.com/news/model-context-protocol)

## Features

- 🚀 Easy-to-use desktop interface for managing MCP servers
- 🔒 Runs locally - your data never leaves your computer
- ⚡️ Quick setup for popular MCP servers:
  - Apple Notes - Access and search your Apple Notes
  - AWS Knowledge Base - Access and query AWS Knowledge Base for information retrieval
  - Brave Search - Search the web with Brave Search API
  - Browserbase - Let Claude explore the web with Browserbase
  - Cloudflare - Manage your Cloudflare workers and account resources
  - Everart - Interface with Everart API for digital art and design tools
  - Exa - Search the web with Exa
  - Filesystem - Access and manage local filesystem
  - GitHub - Access your GitHub repositories
  - GitLab - Manage GitLab repositories and resources
  - Google Drive - Access and search files in your Google Drive
  - Google Maps - Access Google Maps API for location services
  - Memory - Give Claude memory of previous conversations
  - Obsidian - Read and search files in your Obsidian vault
  - Perplexity - Search the web with Perplexity API
  - PostgreSQL - Connect and interact with PostgreSQL databases
  - Puppeteer - Automate browser interactions
  - Sequential Thinking - Enable step-by-step reasoning
  - Slack - Access your Slack workspace
  - SQLite - Manage SQLite databases
  - Todoist - Access and search your Todoist tasks
  - YouTube Transcript - Access and search YouTube transcripts
- 🛠 Simple configuration of environment variables and server settings
- 📋 One-click copying of terminal commands for installation

## Tech Stack

- **Desktop Framework**: 
  - Electron 29.1.4 with React 18.3.1
  - TypeScript 5.6.2
- **Build Tool**: 
  - Vite 6.0.1
  - Electron Builder 25.1.8
- **UI Components**:
  - TailwindCSS 3.4.16
  - DaisyUI 4.12.14
  - Lucide React 0.468.0 for icons
  - Tiempos Font
- **Code Quality**:
  - Biome 1.9.4
  - ESLint 9.15.0
- **Package Manager**: Bun

## Project Structure

```plaintext
src/
├── components/ # React components
│ ├── server-configs/ # Server-specific configuration components
│ └── ...
├── assets/ # Static assets and fonts
├── App.tsx # Main application component
├── server-configs.ts # MCP server configurations
└── utils.ts # Utility functions
electron/
├── main.ts # Electron main process
└── tsconfig.json # TypeScript config for Electron
```

## Development

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start development:
   ```bash
   bun electron:dev
   ```

3. Build for MacOS:
   ```bash
   rm -rf dist dist-electron # When rebuilding
   bun electron:build # Creates .dmg installer
   ```

4. Additional commands:
   ```bash
   bun check # Run TypeScript checks and Biome formatting
   bun lint # Run ESLint
   ```

## Work to be done

Add preset MCPs:
- Fetch 
- Time-related 
- Sentry 

Contributions to resolve these are welcome!

## Contributing

Contributions are extremely welcome! Please open a PR with new MCP servers or any other improvements to the codebase.

## Disclaimer

This project is not affiliated with Anthropic. All logos are trademarks of their respective owners.

## License

MIT

---
<br/>
<br/>
<p align="center">
<a href="https://zue.ai#gh-light-mode-only">
  <img src="https://assets.zue.ai/logo_zue_purple.svg" alt="zue logo" width="200" height="auto" style="display: block; margin: 0 auto;" />
</a>
<a href="https://zue.ai#gh-dark-mode-only">
  <img src="https://assets.zue.ai/logo_zue_yellow.svg" alt="zue logo" width="200" height="auto" style="display: block; margin: 0 auto;" />
</a>
</p>

<p align="center">
<a href="https://zue.ai/talk-to-us">Contact us</a> for custom AI automation solutions and product development.
</p>