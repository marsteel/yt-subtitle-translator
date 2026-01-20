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

/**
 * Load and apply dark mode based on system preference
 * Automatically detects and follows system theme
 */
function loadDarkMode() {
  // Check if system prefers dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply system preference
  if (prefersDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Listen for system theme changes and update in real-time
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}

// Toggle advanced settings
document.addEventListener("DOMContentLoaded", () => {
  // Initialize i18n first
  initI18n();

  // Load and apply dark mode
  loadDarkMode();

  // Smart API key detection
  const apiKeyInput = document.getElementById("apiKey");
  if (apiKeyInput) {
    apiKeyInput.addEventListener("input", handleApiKeyInput);
  }


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
    "gemini": "gemini-2.5-flash",
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
      // Show inline success message on button
      const saveBtn = document.getElementById('saveBtn');
      const originalText = saveBtn.textContent;
      saveBtn.textContent = '✓ ' + chrome.i18n.getMessage('settingSaved');
      saveBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

      setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
      }, 2000);
    });
  });
});

// Test API endpoint button
document.getElementById("testEndpointBtn").addEventListener("click", async () => {
  const apiKeyInput = document.getElementById("apiKey").value;
  const endpoint = document.getElementById("apiEndpoint").value.trim() || "https://api.openai.com/v1/chat/completions";
  const model = document.getElementById("modelName").value.trim() || "gpt-4o-mini";
  const provider = document.getElementById("providerSelect").value || "openai";
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
      // Build provider-specific request
      let requestBody, headers, testEndpoint;

      if (provider === "gemini") {
        // Gemini format
        testEndpoint = `${endpoint}/${model}:generateContent?key=${apiKey}`;
        headers = { "Content-Type": "application/json" };
        requestBody = {
          contents: [{ parts: [{ text: "Hello" }] }]
        };
      } else if (provider === "anthropic") {
        // Anthropic format
        testEndpoint = endpoint;
        headers = {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        };
        requestBody = {
          model: model,
          max_tokens: 10,
          messages: [{ role: "user", content: "Hello" }]
        };
      } else if (provider === "azure") {
        // Azure OpenAI format
        testEndpoint = endpoint;
        headers = {
          "api-key": apiKey,
          "Content-Type": "application/json"
        };
        requestBody = {
          model: model,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5
        };
      } else {
        // OpenAI, DeepSeek, and other OpenAI-compatible formats
        testEndpoint = endpoint;
        headers = {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        };
        requestBody = {
          model: model,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5
        };
      }

      const response = await fetch(testEndpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody)
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


/**
 * Detect AI provider from API key patterns
 * 根据 API Key 的特征模式识别 AI 服务商
 * 
 * @param {string} key - The API key to analyze
 * @returns {string|null} - Provider name or null if not detected
 */
function detectProviderFromKey(key) {
  key = key.trim();

  // Ignore empty keys or masked keys (asterisks)
  if (!key || key.startsWith('*')) return null;

  // Anthropic Claude: sk-ant-
  if (key.startsWith('sk-ant-')) return 'anthropic';

  // OpenAI Project keys: sk-proj-
  if (key.startsWith('sk-proj-')) return 'openai';

  // Google Gemini: AIzaSy
  if (key.startsWith('AIzaSy')) return 'gemini';

  // DeepSeek: sk- followed by exactly 30 hex characters (total 32)
  if (key.startsWith('sk-') && key.length === 32) {
    const hexPart = key.substring(3);
    if (/^[0-9a-fA-F]{30}$/.test(hexPart)) {
      return 'deepseek';
    }
  }

  // OpenAI standard keys: sk- with length > 40
  if (key.startsWith('sk-') && key.length > 40) {
    return 'openai';
  }

  return null;
}

/**
 * Handle API key input and auto-detect provider
 * 处理 API Key 输入并自动检测服务商
 * 
 * @param {Event} e - Input event
 */
function handleApiKeyInput(e) {
  const key = e.target.value;
  const detectedProvider = detectProviderFromKey(key);
  const detectionStatus = document.getElementById("detectionStatus");

  if (detectedProvider) {
    const providerSelect = document.getElementById("providerSelect");
    const modelNameInput = document.getElementById("modelName");

    // Only update provider and trigger change if it's different
    // This respects user's current configuration when provider matches
    if (providerSelect && providerSelect.value !== detectedProvider) {
      providerSelect.value = detectedProvider;

      // Trigger change event to auto-fill endpoint and model
      providerSelect.dispatchEvent(new Event('change'));

      console.log(`[Smart Detection] Auto-switched to provider: ${detectedProvider}`);
    } else {
      console.log(`[Smart Detection] Detected provider matches current selection: ${detectedProvider}`);
    }

    // Always show inline notification when a provider is detected
    // This provides confirmation feedback to the user
    if (detectionStatus && modelNameInput) {
      const providerNames = {
        'openai': 'OpenAI',
        'anthropic': 'Anthropic (Claude)',
        'gemini': 'Google Gemini',
        'deepseek': 'DeepSeek'
      };

      const providerName = providerNames[detectedProvider] || detectedProvider;
      const modelName = modelNameInput.value || 'default';

      detectionStatus.style.display = 'block';
      detectionStatus.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      detectionStatus.style.color = 'white';
      detectionStatus.style.border = 'none';
      detectionStatus.innerHTML = `
        <strong>✓ ${chrome.i18n.getMessage('detectedProvider', [providerName])}</strong><br>
        ${chrome.i18n.getMessage('defaultModelSet')} <code style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">${modelName}</code><br>
        <span style="font-size: 12px; opacity: 0.9;">${chrome.i18n.getMessage('checkAdvancedSettings')}</span>
      `;

      // Auto-hide after 8 seconds
      setTimeout(() => {
        if (detectionStatus) {
          detectionStatus.style.display = 'none';
        }
      }, 8000);
    }
  } else if (detectionStatus && key.length > 10 && !key.startsWith('*')) {
    // Show warning if key doesn't match any pattern
    detectionStatus.style.display = 'block';
    detectionStatus.style.background = '#fef3c7';
    detectionStatus.style.color = '#92400e';
    detectionStatus.style.border = '1px solid #fbbf24';
    detectionStatus.innerHTML = `
      <strong>⚠️ 无法自动识别服务商</strong><br>
      <span style="font-size: 12px;">请手动在下方选择 AI 服务商</span>
    `;

    setTimeout(() => {
      if (detectionStatus) {
        detectionStatus.style.display = 'none';
      }
    }, 5000);
  }
}
