# YouTube双语字幕翻译助手

![GitHub License](https://img.shields.io/github/license/marsteel/yt-subtitle-translator)
![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/mklfmioimlpfejandkbnnnfbojflimco)
[![](https://img.shields.io/badge/dynamic/json?label=edge%20add-on&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fiigbejclmmandbleldjpoomjdnlgcnod)]([https://microsoftedge.microso](https://microsoftedge.microsoft.com/addons/detail/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B/iigbejclmmandbleldjpoomjdnlgcnod))


## 实时翻译字幕，显示双语字幕

YouTube双语字幕翻译助手让你在观看 YouTube 视频时轻松显示第二条字幕。

本扩展使用你的 OpenAI API Key，实时解析视频字幕内容，为你生成辅助字幕显示，帮助更好理解视频内容。


## 主要功能：

在 YouTube 视频上显示第二条翻译字幕

使用自己的 OpenAI API Key，保证隐私与安全。 Key保留着在用户浏览器本地

简单易用，无需额外账户

## 安装

直接安装 [Chrome Web Store](https://chromewebstore.google.com/detail/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B/mklfmioimlpfejandkbnnnfbojflimco?authuser=0&hl=en)

直接安装 [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B/iigbejclmmandbleldjpoomjdnlgcnod)

或[加载未打包的扩展程序](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn)

## 使用方式：

安装扩展后，在扩展设置中输入你的 OpenAI API Key，设置需要翻译成的目标语言（中文简体为zh），建议文档底部的常见语言代码表（ISO 639-1）

打开任意 YouTube 视频，当字幕功能开启，第二条字幕将在OpenAI完成翻译后自动显示。

字幕位置可以拖动

## 注意事项：

用户需要提供有效的 OpenAI API Key 才能使用本扩展。

本扩展仅在 YouTube 视频页面生效。

视频本身需要有原始字幕才可以生成第二条字幕。


## 已知问题

视频全屏模式时字幕被拖拽到过低位置，退出全屏后字幕有时无法正常显示。此问题主要出现在使用绝对定位的字幕 DIV，导致无法自适应不同屏幕尺寸。

临时解决方法：切换到全屏模式后可拖动字幕到合适位置，再切回默认视图。

## 🌍 常见语言代码表（ISO 639-1）

| 语言       | 代码 | 语言       | 代码 |
|------------|------|------------|------|
| 中文（简体） | `zh`   | 中文（繁体） | `zh-TW` |
| 英语       | `en`   | 日语       | `ja`   |
| 韩语       | `ko`   | 法语       | `fr`   |
| 德语       | `de`   | 西班牙语   | `es`   |
| 葡萄牙语   | `pt`   | 意大利语   | `it`   |
| 俄语       | `ru`   | 阿拉伯语   | `ar`   |
| 印地语     | `hi`   | 泰语       | `th`   |
| 越南语     | `vi`   | 印尼语     | `id`   |
| 土耳其语   | `tr`   |
