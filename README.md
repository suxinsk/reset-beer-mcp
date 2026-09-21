# @reset-beer/mcp

> MCP (Model Context Protocol) server for [Reset Beer](https://reset.beer) — AI quota reset tracking across 15+ products.

Query AI quota reset signals directly from Claude, Cursor, or any MCP-compatible AI assistant.

## Quick Start

```bash
npm install -g @reset-beer/mcp
export RESET_BEER_API_KEY="rb_your_key_here"
reset-beer-mcp resets
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "reset-beer": {
      "command": "npx",
      "args": ["-y", "@reset-beer/mcp"],
      "env": { "RESET_BEER_API_KEY": "rb_your_key_here" }
    }
  }
}
```

## Cursor Config

Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "reset-beer": {
      "url": "https://reset.beer/api/mcp",
      "headers": { "Authorization": "Bearer rb_your_key_here" }
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `list_recent_resets` | List recent AI quota reset events |
| `get_product_status` | Get latest reset event for a product |
| `list_products` | List all tracked AI products |

## Supported Products

OpenAI Codex, ChatGPT Work, Claude/Claude Code, Google Gemini, xAI Grok, DeepSeek, Kimi/Moonshot, Alibaba Qwen, Zhipu GLM, Volcengine Ark, OpenRouter, Cursor, MiniMax, Tencent Hunyuan, Baidu Qianfan

## Get an API Key

1. Sign up at [reset.beer](https://reset.beer)
2. Upgrade to Pro ($9.99 one-time, lifetime access)
3. Generate key at [reset.beer/account](https://reset.beer/en-US/account)

## License

MIT
