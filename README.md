# Joke Teller Remote MCP Server on Cloudflare (Without Auth)

This example deploys a remote MCP server on Cloudflare Workers that tells jokes! Anyone can connect to get a random joke, pick a joke type, or list available joke types—no authentication needed.

## 🚀 Get started

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-repo-here)

Your MCP server will be deployed to a URL like: `remote-mcp-server-jokes.<your-account>.workers.dev/sse`

Or use the command line to get started locally:

```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

## How it works

- **/sse** and **/mcp** endpoints expose MCP tools for telling jokes.
- Tools:
  - `tell_joke`: Tells a random joke
  - `tell_typed_joke`: Tells a joke of a specific type—try types like "general", "knock-knock", or "dad"
  - `list_joke_types`: Lists all available joke types

## Usage Examples

### Using curl (streamed response):

```
curl -N -H 'Accept: text/event-stream' \
  -X POST \
  'https://remote-mcp-server-jokes.<your-account>.workers.dev/sse' \
  -d '{"tool": "tell_joke"}'
```

### Using Claude or AI Playground

- Go to https://playground.ai.cloudflare.com/
- Enter your deployed MCP server URL (e.g., `remote-mcp-server-jokes.<your-account>.workers.dev/sse`)
- Use the tool list, select `tell_joke` or `tell_typed_joke`, and enjoy!

## Add more jokes

To add new jokes or types, just extend the `jokes` array in `src/index.ts`.

---

- No authentication required
- Fast, streaming responses
- Great for demos or as an AI plugin for fun interactions
