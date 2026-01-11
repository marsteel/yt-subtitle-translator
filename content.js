// ========== 全局变量 ==========
let lastSubtitle = '';
let debounceTimer = null;
let maxWaitTimer = null;
let observer = null;

// ========== 辅助函数：检测句子是否完成 ==========
function isSentenceComplete(text) {
  // 检测中英文句子结束标点
  const sentenceEndings = /[.!?。！？]$/;
  return sentenceEndings.test(text.trim());
}

// ========== 初始化字幕监听器 ==========
function initSubtitleObserver() {
  const subtitleContainer = document.querySelector(".ytp-caption-window-container");

  if (!subtitleContainer) {
    // 如果字幕容器还没加载出来，稍后再试
    setTimeout(initSubtitleObserver, 2000);
    return;
  }

  // 如果已经有观察器在运行，先断开
  if (observer) {
    observer.disconnect();
  }

  // 创建新的观察器
  observer = new MutationObserver(() => {
    const subtitleText = subtitleContainer.innerText.trim();

    // 如果字幕为空或与上次相同，跳过
    if (!subtitleText || subtitleText === lastSubtitle) {
      return;
    }

    // 清除之前的防抖定时器
    clearTimeout(debounceTimer);
    clearTimeout(maxWaitTimer);

    // 检查是否是完整句子
    const isComplete = isSentenceComplete(subtitleText);

    if (isComplete) {
      // 如果检测到句子结束标点，立即翻译
      performTranslation(subtitleText);
    } else {
      // 否则使用防抖机制
      // 短延迟：等待字幕稳定（500ms）
      debounceTimer = setTimeout(() => {
        performTranslation(subtitleText);
      }, 500);

      // 最大等待时间：防止长句子等待过久（2000ms）
      maxWaitTimer = setTimeout(() => {
        clearTimeout(debounceTimer);
        performTranslation(subtitleText);
      }, 2000);
    }
  });

  // 开始观察字幕容器
  observer.observe(subtitleContainer, {
    childList: true,
    subtree: true
  });
}

// ========== 执行翻译 ==========
function performTranslation(text) {
  // 更新最后翻译的字幕
  lastSubtitle = text;

  // 发送翻译请求
  chrome.runtime.sendMessage(
    { action: "translate", text: text },
    (response) => {
      if (response && response.translated) {
        showBilingualSubtitle(text, response.translated);
      }
    }
  );
}

// ========== 显示双语字幕 ==========
function showBilingualSubtitle(original, translated) {
  chrome.storage.sync.get(["subtitleColor", "subtitleFontSize", "subtitleBgColor"], (data) => {
    const color = data.subtitleColor || "yellow";
    const fontSize = data.subtitleFontSize || "25";
    const bgColor = data.subtitleBgColor || "black";

    let customDiv = document.getElementById("custom-subtitle");
    if (!customDiv) {
      customDiv = document.createElement("div");
      customDiv.id = "custom-subtitle";
      customDiv.style.position = "fixed";
      customDiv.style.bottom = "15%";
      customDiv.style.left = "50%";
      customDiv.style.transform = "translateX(-50%)";
      customDiv.style.textAlign = "center";
      customDiv.style.textShadow = "2px 2px 4px black";
      customDiv.style.cursor = "move";
      customDiv.style.zIndex = 9999;
      document.body.appendChild(customDiv);

      // 拖拽逻辑
      let isDragging = false;
      let offsetX = 0, offsetY = 0;

      customDiv.addEventListener("mousedown", (e) => {
        isDragging = true;
        customDiv.style.transform = "";
        offsetX = e.clientX - customDiv.offsetLeft;
        offsetY = e.clientY - customDiv.offsetTop;
        e.preventDefault();
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          customDiv.style.left = (e.clientX - offsetX) + "px";
          customDiv.style.top = (e.clientY - offsetY) + "px";
          customDiv.style.bottom = "auto";
        }
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });
    }

    customDiv.style.fontSize = fontSize + "px";
    customDiv.style.color = color;
    customDiv.style.backgroundColor = bgColor;

    // 双语显示：翻译
    customDiv.innerHTML = `<div>${translated}</div>`;
  });
}

// ========== 清除自定义字幕 ==========
function clearCustomSubtitle() {
  const customDiv = document.getElementById("custom-subtitle");
  if (customDiv) {
    customDiv.remove();
  }

  // 清除定时器
  clearTimeout(debounceTimer);
  clearTimeout(maxWaitTimer);

  // 重置状态
  lastSubtitle = '';
}

// ========== 初次加载时启动 ==========
initSubtitleObserver();

// ========== 监听页面跳转 ==========
let lastUrl = location.href;

const urlObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    clearCustomSubtitle();
    initSubtitleObserver();
  }
});

urlObserver.observe(document, { childList: true, subtree: true });

// 兼容 YouTube 的事件
window.addEventListener("yt-navigate-finish", () => {
  clearCustomSubtitle();
  initSubtitleObserver();
});

// ========== 定期检测字幕是否被用户禁用 ==========
setInterval(() => {
  const subtitleContainer = document.querySelector(".ytp-caption-window-container");
  if (subtitleContainer && subtitleContainer.innerText.trim() === '') {
    clearCustomSubtitle();
  }
}, 1000);