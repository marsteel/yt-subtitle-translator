chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // First-time installation / 首次安装
    // Open disclaimer page to ensure user reads important information
    // 打开免责声明页面，确保用户阅读重要信息
    const disclaimerUrl = "https://yt-subtitle-translator.magang.net/disclaimer.html";
    chrome.tabs.create({ url: disclaimerUrl });

    // Show notification / 显示通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/128x128.png",
      title: chrome.i18n.getMessage("extensionName") || "感谢安装 - Thank you for installing",
      message: "请阅读免责声明并设置API Key。Please read the disclaimer and set up your API Key.",
    });
  } else if (details.reason === "update") {
    // Extension updated / 更新时通知用户
    const previousVersion = details.previousVersion;
    const currentVersion = chrome.runtime.getManifest().version;

    // Show notification for major updates
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/128x128.png",
      title: chrome.i18n.getMessage("updateNotificationTitle") || "扩展已更新 - Extension Updated",
      message: chrome.i18n.getMessage("updateNotificationMessage") || "新增完整多提供商支持！现在原生支持 Anthropic Claude 和 Google Gemini。Added full multi-provider support! Now natively supports Anthropic Claude and Google Gemini.",
      buttons: [
        { title: chrome.i18n.getMessage("viewChangelog") || "查看更新日志 - View Changelog" }
      ]
    });

    // Open changelog page for major version updates (e.g., 1.5.x -> 1.6.0)
    if (previousVersion && previousVersion.startsWith("1.5")) {
      const changelogUrl = "https://yt-subtitle-translator.magang.net/changelog.html";
      chrome.tabs.create({ url: changelogUrl });
    }
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // Open changelog page
    const changelogUrl = "https://yt-subtitle-translator.magang.net/changelog.html";
    chrome.tabs.create({ url: changelogUrl });
  }
});

// Provider adapters for different AI services
// 不同AI服务的提供商适配器
const providerAdapters = {
  // OpenAI and OpenAI-compatible providers (Azure, DeepSeek, Ollama, etc.)
  // OpenAI 及兼容提供商（Azure、DeepSeek、Ollama 等）
  openai: {
    buildRequest: (text, targetLang, model) => ({
      model: model,
      messages: [
        { role: "system", content: `你是一个字幕翻译助手，把用户的字幕翻译成${targetLang}，保持简洁自然。` },
        { role: "user", content: text }
      ]
    }),
    parseResponse: (data) => {
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response format');
      }
      return data.choices[0].message.content.trim();
    },
    getHeaders: (apiKey) => ({
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }),
    getEndpoint: (baseEndpoint, apiKey) => baseEndpoint
  },

  // Azure OpenAI uses the same format as OpenAI
  // Azure OpenAI 使用与 OpenAI 相同的格式
  azure: {
    buildRequest: (text, targetLang, model) =>
      providerAdapters.openai.buildRequest(text, targetLang, model),
    parseResponse: (data) =>
      providerAdapters.openai.parseResponse(data),
    getHeaders: (apiKey) => ({
      "api-key": apiKey,
      "Content-Type": "application/json"
    }),
    getEndpoint: (baseEndpoint, apiKey) => baseEndpoint
  },

  // DeepSeek uses OpenAI-compatible format
  // DeepSeek 使用 OpenAI 兼容格式
  deepseek: {
    buildRequest: (text, targetLang, model) =>
      providerAdapters.openai.buildRequest(text, targetLang, model),
    parseResponse: (data) =>
      providerAdapters.openai.parseResponse(data),
    getHeaders: (apiKey) =>
      providerAdapters.openai.getHeaders(apiKey),
    getEndpoint: (baseEndpoint, apiKey) => baseEndpoint
  },

  // Anthropic Claude
  anthropic: {
    buildRequest: (text, targetLang, model) => ({
      model: model,
      max_tokens: 1024,
      messages: [
        { role: "user", content: text }
      ],
      system: `你是一个字幕翻译助手，把用户的字幕翻译成${targetLang}，保持简洁自然。`
    }),
    parseResponse: (data) => {
      if (!data?.content?.[0]?.text) {
        throw new Error('Invalid API response format');
      }
      return data.content[0].text.trim();
    },
    getHeaders: (apiKey) => ({
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    }),
    getEndpoint: (baseEndpoint, apiKey) => baseEndpoint
  },

  // Google Gemini
  gemini: {
    buildRequest: (text, targetLang, model) => ({
      contents: [
        {
          parts: [
            { text: text }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          { text: `你是一个字幕翻译助手，把用户的字幕翻译成${targetLang}，保持简洁自然。` }
        ]
      }
    }),
    parseResponse: (data) => {
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response format');
      }
      return data.candidates[0].content.parts[0].text.trim();
    },
    getHeaders: (apiKey) => ({
      "Content-Type": "application/json"
    }),
    getEndpoint: (baseEndpoint, apiKey) => `${baseEndpoint}?key=${apiKey}`
  },

  // Custom provider defaults to OpenAI-compatible format
  // 自定义提供商默认使用 OpenAI 兼容格式
  custom: {
    buildRequest: (text, targetLang, model) =>
      providerAdapters.openai.buildRequest(text, targetLang, model),
    parseResponse: (data) =>
      providerAdapters.openai.parseResponse(data),
    getHeaders: (apiKey) =>
      providerAdapters.openai.getHeaders(apiKey),
    getEndpoint: (baseEndpoint, apiKey) => baseEndpoint
  }
};

async function translate(text, targetLang, apiKey, apiEndpoint, modelName, provider) {
  const endpoint = apiEndpoint || "https://api.openai.com/v1/chat/completions";
  const model = modelName || "gpt-4o-mini";
  const providerType = provider || "openai";

  // Get the appropriate adapter, fallback to OpenAI if provider not found
  // 获取适当的适配器，如果找不到提供商则回退到 OpenAI
  const adapter = providerAdapters[providerType] || providerAdapters.openai;

  try {
    const requestBody = adapter.buildRequest(text, targetLang, model);
    const headers = adapter.getHeaders(apiKey);
    const finalEndpoint = adapter.getEndpoint(endpoint, apiKey);

    const response = await fetch(finalEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    // Check HTTP status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText;
      throw new Error(`API Error (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    return adapter.parseResponse(data);

  } catch (error) {
    console.error('Translation error:', error);

    // Return user-friendly error messages
    const errorMsg = error.message || String(error);

    if (errorMsg.includes('quota') || errorMsg.includes('insufficient_quota')) {
      return chrome.i18n.getMessage('errorQuotaExceeded') || '[Translation failed: API quota exceeded]';
    } else if (errorMsg.includes('invalid_api_key') || errorMsg.includes('Incorrect API key') || errorMsg.includes('401')) {
      return chrome.i18n.getMessage('errorInvalidApiKey') || '[Translation failed: Invalid API key, please check settings]';
    } else if (errorMsg.includes('rate_limit') || errorMsg.includes('429')) {
      return chrome.i18n.getMessage('errorRateLimit') || '[Translation failed: Too many requests, please try again later]';
    } else if (errorMsg.includes('content_filter')) {
      return chrome.i18n.getMessage('errorContentFilter') || '[Translation failed: Content filtered]';
    } else if (errorMsg.includes('Invalid API response format')) {
      return chrome.i18n.getMessage('errorInvalidResponse') || '[Translation failed: Invalid API response format]';
    } else if (errorMsg.includes('500') || errorMsg.includes('502') || errorMsg.includes('503')) {
      return chrome.i18n.getMessage('errorServerError') || '[Translation failed: Server error, please try again later]';
    } else {
      return chrome.i18n.getMessage('errorTranslationFailed') || '[Translation failed: Please check API settings]';
    }
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "translate") {
    chrome.storage.sync.get(["targetLang", "apiKey", "apiEndpoint", "modelName", "provider"], (res) => {
      if (!res.apiKey) {
        const notSetMsg = chrome.i18n.getMessage("apiKeyNotSet") || "[未设置 API Key]";
        sendResponse({ translated: notSetMsg });
        return;
      }

      // Use async IIFE to handle async translate function
      // 使用异步立即执行函数来处理异步翻译
      (async () => {
        try {
          const translated = await translate(
            msg.text,
            res.targetLang || "zh",
            res.apiKey,
            res.apiEndpoint,
            res.modelName,
            res.provider
          );
          sendResponse({ translated });
        } catch (error) {
          console.error("Translation error:", error);
          sendResponse({ translated: `[翻译错误: ${error.message}]` });
        }
      })();
    });
    return true; // 保持异步
  }
});
