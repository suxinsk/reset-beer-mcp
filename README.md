# Reset Beer MCP Server

> MCP (Model Context Protocol) server for [Reset Beer](https://reset.beer) — AI quota reset tracking.

Query AI quota reset signals directly from Claude, Cursor, or any MCP-compatible AI assistant.

## Setup

1. Get your API key at [reset.beer/account](https://reset.beer/en-US/account) (Pro required)
2. Set the environment variable:
```bash
export RESET_BEER_API_KEY="rb_your_key_here"
```

3. Add to your MCP client config:

### Claude Desktop
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

### Cursor
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
| `list_recent_resets` | List recent AI quota reset events (filter by hours, product, limit) |
| `get_product_status` | Get the latest reset event for a specific product |
| `list_products` | List all 15+ tracked AI products |

## Supported Products

OpenAI Codex, ChatGPT Work, Claude/Claude Code, Google Gemini, xAI Grok, DeepSeek, Kimi/Moonshot, Alibaba Qwen, Zhipu GLM, Volcengine Ark/Doubao, OpenRouter, Cursor, MiniMax, Tencent Hunyuan, Baidu Qianfan

## Pricing

- **Free**: Daily digest email
- **Pro**: $9.99 one-time — near-realtime alerts + MCP access

## License

MIT
