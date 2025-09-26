async function translate(text, targetLang, apiKey) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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
    chrome.storage.sync.get(["targetLang", "apiKey"], async (res) => {
      if (!res.apiKey) {
        sendResponse({ translated: "[未设置 API Key]" });
        return;
      }
      const translated = await translate(msg.text, res.targetLang || "zh", res.apiKey);
      sendResponse({ translated });
    });
    return true; // 保持异步
  }
});
