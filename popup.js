// Initialize i18n
function initI18n() {
  // Set text content for elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const messageName = element.getAttribute('data-i18n');
    const message = chrome.i18n.getMessage(messageName);
    if (message) {
      element.textContent = message;
    }
  });

  // Set placeholder for elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const messageName = element.getAttribute('data-i18n-placeholder');
    const message = chrome.i18n.getMessage(messageName);
    if (message) {
      element.placeholder = message;
    }
  });
}

// Toggle advanced settings
document.addEventListener("DOMContentLoaded", () => {
  // Initialize i18n first
  initI18n();

  // Advanced settings toggle
  const advancedToggle = document.getElementById("advancedToggle");
  const advancedContent = document.getElementById("advancedContent");
  const advancedArrow = document.getElementById("advancedArrow");

  advancedToggle.addEventListener("click", () => {
    advancedContent.classList.toggle("show");
    advancedArrow.classList.toggle("expanded");
  });

  // Provider selection with endpoint presets
  const providerSelect = document.getElementById("providerSelect");
  const apiEndpointInput = document.getElementById("apiEndpoint");
  const modelNameInput = document.getElementById("modelName");

  const providerEndpoints = {
    "openai": "https://api.openai.com/v1/chat/completions",
    "azure": "https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT/chat/completions?api-version=2024-02-15-preview",
    "anthropic": "https://api.anthropic.com/v1/messages",
    "gemini": "https://generativelanguage.googleapis.com/v1beta/models",
    "deepseek": "https://api.deepseek.com/v1/chat/completions"
  };

  const providerModels = {
    "openai": "gpt-4o-mini",
    "azure": "gpt-4",
    "anthropic": "claude-3-5-sonnet-20241022",
    "gemini": "gemini-2.0-flash-exp",
    "deepseek": "deepseek-chat"
  };

  providerSelect.addEventListener("change", (e) => {
    const selectedProvider = e.target.value;
    if (selectedProvider !== "custom" && providerEndpoints[selectedProvider]) {
      apiEndpointInput.value = providerEndpoints[selectedProvider];
      modelNameInput.value = providerModels[selectedProvider];
      apiEndpointInput.disabled = false;
    } else if (selectedProvider === "custom") {
      apiEndpointInput.disabled = false;
      apiEndpointInput.focus();
    }
  });

  // Load stored values and display them on popup open
  chrome.storage.sync.get([
    "targetLang", "apiKey", "subtitleColor", "subtitleFontSize", "subtitleBgColor",
    "apiEndpoint", "modelName", "provider"
  ], (data) => {
    if (data.targetLang) {
      document.getElementById("targetLang").value = data.targetLang;
    }
    if (data.apiKey) {
      // Display asterisks for API key
      document.getElementById("apiKey").value = "*".repeat(data.apiKey.length);
    }
    if (data.subtitleColor) {
      document.getElementById("subtitleColor").value = data.subtitleColor;
    }
    if (data.subtitleFontSize) {
      document.getElementById("subtitleFontSize").value = data.subtitleFontSize;
    }
    if (data.subtitleBgColor) {
      document.getElementById("subtitleBgColor").value = data.subtitleBgColor;
    }
    // Load custom endpoint settings
    if (data.apiEndpoint) {
      document.getElementById("apiEndpoint").value = data.apiEndpoint;

      // Detect provider based on endpoint if provider is not explicitly set
      // 如果未明确设置提供商，则根据端点检测提供商
      const endpoint = data.apiEndpoint;
      let detectedProvider = data.provider || "custom";

      if (!data.provider) {
        // Auto-detect provider from endpoint URL
        if (endpoint.includes("api.openai.com")) {
          detectedProvider = "openai";
        } else if (endpoint.includes("openai.azure.com")) {
          detectedProvider = "azure";
        } else if (endpoint.includes("api.anthropic.com")) {
          detectedProvider = "anthropic";
        } else if (endpoint.includes("generativelanguage.googleapis.com")) {
          detectedProvider = "gemini";
        } else if (endpoint.includes("api.deepseek.com")) {
          detectedProvider = "deepseek";
        }
      }

      document.getElementById("providerSelect").value = detectedProvider;
    } else if (data.provider) {
      // If provider is set but no endpoint, use the provider value
      document.getElementById("providerSelect").value = data.provider;
    }
    if (data.modelName) {
      document.getElementById("modelName").value = data.modelName;
    }
  });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const lang = document.getElementById("targetLang").value;
  const apiKeyInput = document.getElementById("apiKey");

  const targetLang = document.getElementById("targetLang").value.trim();
  const subtitleColor = document.getElementById("subtitleColor").value;
  const subtitleFontSize = document.getElementById("subtitleFontSize").value;
  const subtitleBgColor = document.getElementById("subtitleBgColor").value;
  const apiEndpoint = document.getElementById("apiEndpoint").value.trim() || "https://api.openai.com/v1/chat/completions";
  const modelName = document.getElementById("modelName").value.trim() || "gpt-4o-mini";
  const provider = document.getElementById("providerSelect").value;

  let apiKey = apiKeyInput.value;

  // If the input is all asterisks, keep the stored value
  chrome.storage.sync.get("apiKey", (data) => {
    if (apiKey === "*".repeat(data.apiKey?.length || 0)) {
      apiKey = data.apiKey || "";
    }
    chrome.storage.sync.set({
      targetLang: lang,
      apiKey: apiKey,
      subtitleColor: subtitleColor,
      subtitleFontSize: subtitleFontSize,
      subtitleBgColor: subtitleBgColor,
      apiEndpoint: apiEndpoint,
      modelName: modelName,
      provider: provider
    }, () => {
      alert(chrome.i18n.getMessage('settingSaved'));
    });
  });
});

// Test API endpoint button
document.getElementById("testEndpointBtn").addEventListener("click", async () => {
  const apiKeyInput = document.getElementById("apiKey").value;
  const endpoint = document.getElementById("apiEndpoint").value.trim() || "https://api.openai.com/v1/chat/completions";
  const model = document.getElementById("modelName").value.trim() || "gpt-4o-mini";
  const testStatus = document.getElementById("testStatus");
  const testBtn = document.getElementById("testEndpointBtn");

  // Get API key from storage or input
  chrome.storage.sync.get("apiKey", async (data) => {
    let apiKey = apiKeyInput;

    // If input shows asterisks, use stored key
    if (apiKeyInput.startsWith("*")) {
      apiKey = data.apiKey || "";
    }

    // Check if API key is set
    if (!apiKey) {
      testStatus.style.display = "block";
      testStatus.style.color = "#dc2626";
      testStatus.textContent = chrome.i18n.getMessage("apiKeyNotSet") || "[未设置 API Key]";
      return;
    }

    // Show testing status
    testBtn.disabled = true;
    testBtn.textContent = chrome.i18n.getMessage("testingEndpoint") || "测试中...";
    testStatus.style.display = "block";
    testStatus.style.color = "#6b7280";
    testStatus.textContent = "";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "user", content: "Hello" }
          ],
          max_tokens: 5
        })
      });

      if (response.ok) {
        testStatus.style.color = "#10b981";
        testStatus.textContent = chrome.i18n.getMessage("testSuccess") || "✓ 连接成功！";
      } else {
        const errorData = await response.json().catch(() => ({}));
        testStatus.style.color = "#dc2626";
        testStatus.textContent = `${chrome.i18n.getMessage("testFailed") || "✗ 连接失败"}: ${response.status} ${errorData.error?.message || response.statusText}`;
      }
    } catch (error) {
      testStatus.style.color = "#dc2626";
      testStatus.textContent = `${chrome.i18n.getMessage("testFailed") || "✗ 连接失败"}: ${error.message}`;
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = chrome.i18n.getMessage("testEndpoint") || "测试连接";
    }
  });
});

