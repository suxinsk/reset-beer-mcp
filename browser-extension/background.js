const API_BASE = "https://reset.beer/api/mcp";

// Check for new signals every 15 minutes
chrome.alarms.create("checkSignals", { periodInMinutes: 15 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "checkSignals") return;
  
  const { apiKey } = await chrome.storage.local.get("apiKey");
  if (!apiKey) return;

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: Date.now(), method: "tools/call",
        params: { name: "list_recent_resets", arguments: { hours: 1, limit: 5 } }
      })
    });
    const data = await res.json();
    if (data.error) return;

    const events = JSON.parse(data.result.content[0].text);
    const signalEvents = events.events || [];

    // Notify for new signals not seen before
    const { seenIds } = await chrome.storage.local.get("seenIds");
    const seen = new Set(seenIds || []);

    for (const event of signalEvents) {
      const eventId = `${event.product}:${event.announcedAt}`;
      if (!seen.has(eventId)) {
        seen.add(eventId);
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: `🔔 ${event.product} — Reset Signal`,
          message: event.summary?.slice(0, 200) || "New quota reset signal detected.",
          priority: 2
        });
      }
    }

    await chrome.storage.local.set({ seenIds: Array.from(seen).slice(-100) });
  } catch (e) {
    // Silent fail
  }
});
