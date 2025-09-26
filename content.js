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
    const fontSize = data.subtitleFontSize || "25px";
    const bgColor = data.subtitleBgColor || "black";

  let customDiv = document.getElementById("custom-subtitle");
  if (!customDiv) {
    customDiv = document.createElement("div");
    customDiv.id = "custom-subtitle";
    customDiv.style.position = "absolute";
    customDiv.style.bottom = "15%";
    //customDiv.style.width = "100%";
    // width dynamically adjust to subtitle width and center
    customDiv.style.left = "50%";
    customDiv.style.transform = "translateX(-50%)";
    customDiv.style.display = "inline-block";
    customDiv.style.textAlign = "center";
    customDiv.style.fontSize = "25px";
    customDiv.style.color = "yellow";
    customDiv.style.textShadow = "2px 2px 4px black";
    document.body.appendChild(customDiv);
  }

  customDiv.style.fontSize = fontSize + "px";
  customDiv.style.color = color;
  customDiv.style.backgroundColor = bgColor;

  customDiv.innerHTML = `<span>${translated}</span>`;

});
}

function clearCustomSubtitle() {
  const customDiv = document.getElementById("custom-subtitle");
  if (customDiv) {
    customDiv.remove();
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


// clearCustomSubtitle when caption is disabled by keyboard shortcut
document.addEventListener('keydown', (event) => {
  if (event.key === 'c' || event.key === 'C') { // 'c' key toggles captions on YouTube
    setTimeout(() => {
      const subtitleContainer = document.querySelector(".ytp-caption-window-container");
      if (subtitleContainer && subtitleContainer.innerText.trim() === '') {
        clearCustomSubtitle();
      }
    }, 500); // Delay to allow caption state to update
  }
});

// clearCustomSubtitle when caption is disabled by mouse click caption button
document.querySelector('.ytp-subtitles-button').addEventListener('click', () => {
  setTimeout(() => {
      const subtitleContainer = document.querySelector(".ytp-caption-window-container");
      if (subtitleContainer && subtitleContainer.innerText.trim() === '') {
        clearCustomSubtitle();
      }
    }, 500); // Delay to allow caption state to update
});

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