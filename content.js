function initSubtitleObserver() {
  const subtitleContainer = document.querySelector(".ytp-caption-window-container");
  if (subtitleContainer) {
    const observer = new MutationObserver(() => {
      const subtitleText = subtitleContainer.innerText.trim();
      if (subtitleText) {
        chrome.runtime.sendMessage({ action: "translate", text: subtitleText }, (response) => {
          if (response && response.translated) {
            showBilingualSubtitle(subtitleText, response.translated);
          }
        });
      }
    });

    observer.observe(subtitleContainer, { childList: true, subtree: true });
  } else {
    // 如果字幕容器还没加载出来，稍后再试
    setTimeout(initSubtitleObserver, 2000);
  }
}

// 初次加载时启动一次
initSubtitleObserver();

function showBilingualSubtitle(original, translated) {
  chrome.storage.sync.get(["subtitleColor", "subtitleFontSize", "subtitleBgColor"], (data) => {
    const color = data.subtitleColor || "yellow";
    const fontSize = data.subtitleFontSize || "25";
    const bgColor = data.subtitleBgColor || "black";

    let customDiv = document.getElementById("custom-subtitle");
    if (!customDiv) {
      customDiv = document.createElement("div");
      customDiv.id = "custom-subtitle";
      customDiv.style.position = "fixed"; // 用 fixed 避免滚动条干扰
      customDiv.style.bottom = "15%";
      customDiv.style.left = "50%";
      customDiv.style.transform = "translateX(-50%)";
      customDiv.style.textAlign = "center";
      customDiv.style.textShadow = "2px 2px 4px black";
      customDiv.style.cursor = "move"; // 鼠标样式提示可拖动
      customDiv.style.zIndex = 9999;   // 保证在视频上层
      document.body.appendChild(customDiv);

      // ---------- 拖拽逻辑 ----------
      let isDragging = false;
      let offsetX = 0, offsetY = 0;

      customDiv.addEventListener("mousedown", (e) => {
        isDragging = true;
        // 清掉 transform，改用绝对位置
        customDiv.style.transform = "";
        offsetX = e.clientX - customDiv.offsetLeft;
        offsetY = e.clientY - customDiv.offsetTop;
        e.preventDefault();
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          customDiv.style.left = (e.clientX - offsetX) + "px";
          customDiv.style.top = (e.clientY - offsetY) + "px";
          customDiv.style.bottom = "auto"; // 防止和 bottom 冲突
        }
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });
    }

    customDiv.style.fontSize = fontSize + "px";
    customDiv.style.color = color;
    customDiv.style.backgroundColor = bgColor;

    // 双语显示：原文 + 翻译
    customDiv.innerHTML = `
      <div>${translated}</div>
    `;
  });
}

function clearCustomSubtitle() {
  const customDiv = document.getElementById("custom-subtitle");
  if (customDiv) {
    customDiv.remove();
    //debug log
    //console.log("Custom subtitle cleared.");
  }
}

// ---------- 新增：监听页面跳转，清理字幕并重启监听 ----------
let lastUrl = location.href;

const urlObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    clearCustomSubtitle();   // 清理旧字幕
    initSubtitleObserver();  // 重新监听新视频的字幕
  }
});

// 监听整个文档的变化，捕捉 URL 更新（SPA 方式）
urlObserver.observe(document, { childList: true, subtree: true });

// 兼容 YouTube 的事件（更精准）
window.addEventListener("yt-navigate-finish", () => {
  clearCustomSubtitle();
  initSubtitleObserver();
});


// periodically monitor result of subtitleContainer && subtitleContainer.innerText.trim() === ''
// if true then the subtitle is disabled by user， then call clearCustomSubtitle
setInterval(() => {
  const subtitleContainer = document.querySelector(".ytp-caption-window-container");
  if (subtitleContainer && subtitleContainer.innerText.trim() === '') {
    clearCustomSubtitle();
  }
}, 1000);

let debounceTimer = null;

observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const subtitleText = subtitleContainer.innerText.trim();
    if (subtitleText && subtitleText !== lastSubtitle) {
      lastSubtitle = subtitleText;
      translateText(subtitleText, (translated) => {
        showBilingualSubtitle(subtitleText, translated);
      });
    }
  }, 300);
});