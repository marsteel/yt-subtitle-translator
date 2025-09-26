// Load stored values and display them on popup open
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["targetLang", "apiKey", "subtitleColor", "subtitleFontSize", "subtitleBgColor"], (data) => {
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
  });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const lang = document.getElementById("targetLang").value;
  const apiKeyInput = document.getElementById("apiKey");

  const targetLang = document.getElementById("targetLang").value.trim();
  const subtitleColor = document.getElementById("subtitleColor").value;
  const subtitleFontSize = document.getElementById("subtitleFontSize").value;
  const subtitleBgColor = document.getElementById("subtitleBgColor").value;
  
  let apiKey = apiKeyInput.value;

  // If the input is all asterisks, keep the stored value
  chrome.storage.sync.get("apiKey", (data) => {
    if (apiKey === "*".repeat(data.apiKey?.length || 0)) {
      apiKey = data.apiKey || "";
    }
    chrome.storage.sync.set({ targetLang: lang, apiKey: apiKey, subtitleColor: subtitleColor, subtitleFontSize: subtitleFontSize, subtitleBgColor: subtitleBgColor }, () => {
      alert("Setting Saved");
    });
  });
});

