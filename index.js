#!/usr/bin/env node
/**
 * Reset Beer MCP Server
 * Query AI quota reset signals from Claude, Cursor, or any MCP client.
 * 
 * Setup:
 *   1. Get an API key at https://reset.beer/en-US/account (Pro required)
 *   2. Set RESET_BEER_API_KEY environment variable
 *   3. Add to your MCP client config
 */

const API_BASE = "https://reset.beer/api/mcp";
const apiKey = process.env.RESET_BEER_API_KEY;

if (!apiKey) {
  console.error("Error: RESET_BEER_API_KEY environment variable is required.");
  console.error("Get your key at https://reset.beer/en-US/account");
  process.exit(1);
}

async function callMcp(method, params = {}) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params })
  });
  return response.json();
}

// CLI usage
const [,, command, ...args] = process.argv;
switch (command) {
  case "resets": {
    const hours = args[0] || "24";
    const result = await callMcp("tools/call", { name: "list_recent_resets", arguments: { hours: Number(hours) } });
    console.log(JSON.stringify(JSON.parse(result.result.content[0].text), null, 2));
    break;
  }
  case "status": {
    const productId = args[0];
    if (!productId) { console.error("Usage: reset-beer-mcp status <product_id>"); process.exit(1); }
    const result = await callMcp("tools/call", { name: "get_product_status", arguments: { productId } });
    console.log(JSON.stringify(JSON.parse(result.result.content[0].text), null, 2));
    break;
  }
  case "products": {
    const result = await callMcp("tools/call", { name: "list_products", arguments: {} });
    console.log(JSON.stringify(JSON.parse(result.result.content[0].text), null, 2));
    break;
  }
  default:
    console.log(`
Reset Beer MCP Server

Usage:
  reset-beer-mcp resets [hours]     List recent quota resets
  reset-beer-mcp status <product>   Get product status
  reset-beer-mcp products           List all tracked products

Environment:
  RESET_BEER_API_KEY                Your API key from reset.beer/account
`);
}
