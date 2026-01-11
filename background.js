chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // First-time installation / 首次安装
    // Open disclaimer page to ensure user reads important information
    // 打开免责声明页面，确保用户阅读重要信息
    const disclaimerUrl = chrome.runtime.getURL("docs/disclaimer.html");
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
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/128x128.png",
      title: "扩展已更新 - Extension Updated",
      message: "新增i18n支持和自定义API端点。Added i18n support and custom API endpoints.",
    });
  }
});

async function translate(text, targetLang, apiKey, apiEndpoint, modelName) {
  const endpoint = apiEndpoint || "https://api.openai.com/v1/chat/completions";
  const model = modelName || "gpt-4o-mini";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: `你是一个字幕翻译助手，把用户的字幕翻译成${targetLang}，保持简洁自然。` },
        { role: "user", content: text }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "translate") {
    chrome.storage.sync.get(["targetLang", "apiKey", "apiEndpoint", "modelName"], async (res) => {
      if (!res.apiKey) {
        const notSetMsg = chrome.i18n.getMessage("apiKeyNotSet") || "[未设置 API Key]";
        sendResponse({ translated: notSetMsg });
        return;
      }
      try {
        const translated = await translate(
          msg.text,
          res.targetLang || "zh",
          res.apiKey,
          res.apiEndpoint,
          res.modelName
        );
        sendResponse({ translated });
      } catch (error) {
        console.error("Translation error:", error);
        sendResponse({ translated: `[翻译错误: ${error.message}]` });
      }
    });
    return true; // 保持异步
  }
});
