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

  // Load stored values and display them on popup open
  chrome.storage.sync.get([
    "targetLang", "apiKey", "subtitleColor", "subtitleFontSize", "subtitleBgColor",
    "apiEndpoint", "modelName"
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
      modelName: modelName
    }, () => {
      alert(chrome.i18n.getMessage('settingSaved'));
    });
  });
});
