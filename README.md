# reset-beer-mcp

> MCP server for [Reset Beer](https://reset.beer) — AI quota reset tracking + price change monitoring.

## Claude Desktop Config
```json
{
  "mcpServers": {
    "reset-beer": {
      "url": "https://reset.beer/api/mcp",
      "headers": { "Authorization": "Bearer rb_your_key" }
    }
  }
}
```

## Tools
| Tool | Description |
|------|-------------|
| `list_recent_resets` | Query recent AI quota reset events |
| `get_product_status` | Get latest event for a product |
| `list_products` | List all tracked AI products |
| `list_price_changes` | Query recent price drops and increases |

## License
MIT
