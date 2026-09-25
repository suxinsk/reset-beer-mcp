const API_BASE = "https://reset.beer/api/mcp";
const PRO_CHECK = "https://reset.beer/api/billing/status";

let apiKey = null;

// Load saved API key on open
chrome.storage.local.get(["apiKey", "plan"], (result) => {
  if (result.apiKey) {
    apiKey = result.apiKey;
    checkPlanAndLoadSignals();
  } else {
    showApiKeySetup();
  }
});

function showApiKeySetup() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
    <div class="apikey-section">
      <p>Enter your Reset Beer Pro API key to receive real-time quota reset signals.</p>
      <input class="apikey-input" type="text" id="apiKeyInput" placeholder="rb_your_api_key" />
      <button class="apikey-btn" id="saveKey">Connect</button>
      <div class="error-msg" id="errorMsg" style="display:none;"></div>
      <p style="margin-top:12px;font-size:11px;opacity:0.5;">
        Get your key at <a href="https://reset.beer/en-US/account" target="_blank" style="color:var(--amber-450);">reset.beer/account</a>
      </p>
    </div>
  `;
  document.getElementById("saveKey").addEventListener("click", saveApiKey);
  document.getElementById("apiKeyInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveApiKey();
  });
}

async function saveApiKey() {
  const input = document.getElementById("apiKeyInput");
  const key = input.value.trim();
  const errEl = document.getElementById("errorMsg");
  errEl.style.display = "none";

  if (!key.startsWith("rb_")) {
    errEl.textContent = "Invalid key format. Keys start with rb_";
    errEl.style.display = "block";
    return;
  }

  // Validate key against MCP endpoint
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} })
    });
    const data = await res.json();
    if (data.result) {
      apiKey = key;
      chrome.storage.local.set({ apiKey: key });
      checkPlanAndLoadSignals();
    } else {
      errEl.textContent = data.error?.message || "Invalid key";
      errEl.style.display = "block";
    }
  } catch (e) {
    errEl.textContent = "Connection failed. Try again.";
    errEl.style.display = "block";
  }
}

async function checkPlanAndLoadSignals() {
  // Check plan via billing status API
  try {
    const res = await fetch(PRO_CHECK);
    // This endpoint requires auth session, not API key
    // For extension, we'll use MCP tool response to infer plan
  } catch {}

  // Load signals
  await loadSignals();
}

async function loadSignals() {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 2, method: "tools/call",
        params: { name: "list_recent_resets", arguments: { hours: 24, limit: 20 } }
      })
    });
    const data = await res.json();
    
    if (data.error) {
      showError(data.error.message);
      return;
    }

    const events = JSON.parse(data.result.content[0].text);
    renderSignals(events.events || []);
  } catch (e) {
    showError("Failed to load signals. Check your connection.");
  }
}

function renderSignals(events) {
  const main = document.getElementById("mainContent");
  
  if (events.length === 0) {
    main.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🍺</div>
        <div class="empty-text">No quota reset signals in the last 24 hours.<br>All clear — go build something.</div>
      </div>
    `;
    return;
  }

  const html = `
    <div class="signals">
      ${events.map(event => `
        <div class="signal-item ${event.evidence === 'official_signal' ? 'urgent' : ''}">
          <div class="signal-dot ${event.evidence === 'official_confirmed' ? 'confirmed' : 'signal'}"></div>
          <div class="signal-content">
            <div class="signal-product">${event.product}</div>
            <div class="signal-summary">${event.summary}</div>
            <div class="signal-meta">
              <span class="signal-time">${new Date(event.announcedAt).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
              <span class="signal-badge ${event.evidence === 'official_confirmed' ? 'official' : 'signal-level'}">${event.evidence}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
  main.innerHTML = html;
}

function showError(msg) {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
    <div class="empty">
      <div class="empty-icon">⚠️</div>
      <div class="empty-text">${msg}</div>
      <button class="apikey-btn" style="margin-top:16px;max-width:200px;" onclick="location.reload()">Retry</button>
    </div>
  `;
}
