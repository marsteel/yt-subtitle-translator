# YouTube双语字幕翻译助手

![GitHub License](https://img.shields.io/github/license/marsteel/yt-subtitle-translator)
![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/mklfmioimlpfejandkbnnnfbojflimco)
[![](https://img.shields.io/badge/dynamic/json?label=edge%20add-on&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fiigbejclmmandbleldjpoomjdnlgcnod)](https://microsoftedge.microsoft.com/addons/detail/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B/iigbejclmmandbleldjpoomjdnlgcnod)

## 📖 文档

完整文档请访问：[https://yt-subtitle-translator.magang.net/](https://yt-subtitle-translator.magang.net/)

## 实时翻译字幕，显示双语字幕

YouTube双语字幕翻译助手让你在观看 YouTube 视频时轻松显示第二条字幕。

本扩展支持多种AI服务商（OpenAI、Azure、Anthropic、Google Gemini、DeepSeek等），使用你的 API Key 实时解析视频字幕内容，为你生成辅助字幕显示，帮助更好理解视频内容。

## ✨ 主要功能

### 核心功能
- 🎬 **双语字幕显示** - 在 YouTube 视频上显示第二条翻译字幕
- 🔒 **隐私安全** - API Key 保存在浏览器本地，不会上传到任何第三方服务器
- 🎨 **自定义样式** - 可调整字幕颜色、字体大小、背景颜色
- 🖱️ **可拖动字幕** - 字幕位置可以自由拖动调整

### v1.6.0 新功能 (2026-01-17)
- 🚀 **完整多提供商支持** - 原生支持多个AI服务商的专用API格式
  - ✅ **Anthropic Claude** - 使用原生 Anthropic API
  - ✅ **Google Gemini** - 使用原生 Google Gemini API
  - ✅ **OpenAI** - 官方 OpenAI API
  - ✅ **Azure OpenAI** - 微软 Azure 托管的 OpenAI
  - ✅ **DeepSeek** - DeepSeek AI（OpenAI 兼容）
  - ✅ **自定义端点** - 支持任何 OpenAI 兼容的 API（包括 Ollama 本地模型）
- 🔧 **提供商适配器架构** - 易于扩展，未来可轻松添加更多AI服务商
- 📢 **智能更新通知** - 主要版本更新时自动通知用户并提供更新日志链接

### v1.3.0 功能 (2026-01-09)
- 🧪 **API端点测试** - 测试连接按钮，在保存前验证API端点配置
- 🎯 **AI服务商快速选择** - 下拉菜单提供多个AI服务商预设
  - OpenAI
  - Azure OpenAI
  - Anthropic (Claude)
  - Google Gemini
  - DeepSeek
  - 自定义端点
- 🤖 **智能模型匹配** - 根据选择的服务商自动填充适当的模型名称
- 🔍 **智能服务商检测** - 根据存储的端点URL自动检测并显示当前服务商

### v1.2.0 功能
- 🌍 **国际化支持** - 界面支持中英文双语，根据浏览器语言自动切换
- 🔧 **自定义API端点** - 支持任意OpenAI兼容的API端点
- ⚙️ **模型配置** - 可自定义用于翻译的AI模型名称
- 🎨 **高级UI设计** - 渐变、阴影和流畅动画的现代化界面

## 📥 安装

### 从应用商店安装（推荐）
- [Chrome Web Store](https://chromewebstore.google.com/detail/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B/mklfmioimlpfejandkbnnnfbojflimco?authuser=0&hl=en)
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/youtube%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B/iigbejclmmandbleldjpoomjdnlgcnod)

### 手动安装
[加载未打包的扩展程序](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn)

## 🚀 使用方式

1. **安装扩展**后，点击扩展图标打开设置面板
2. **配置AI服务**：
   - 输入你的 API Key
   - 选择AI服务商（或使用自定义端点）
   - 设置目标语言（如：中文、英语、日语等）
   - 可选：调整字幕样式（颜色、字体大小、背景）
3. **高级设置**（可选）：
   - 自定义API端点URL
   - 自定义模型名称
   - 点击"测试连接"验证配置
4. **保存设置**
5. 打开任意 YouTube 视频，开启字幕功能，翻译字幕将自动显示

### 支持的AI服务商

| 服务商 | 默认模型 | API格式 | 说明 |
|--------|---------|---------|------|
| OpenAI | gpt-4o-mini | 原生 | 官方OpenAI服务 |
| Azure OpenAI | gpt-4 | 原生 | 微软Azure托管的OpenAI |
| Anthropic | claude-3-5-sonnet-20241022 | 原生 | Claude AI，使用专用API格式 |
| Google Gemini | gemini-2.0-flash-exp | 原生 | Google最新AI模型，使用专用API格式 |
| DeepSeek | deepseek-chat | OpenAI兼容 | DeepSeek AI |
| 自定义 | - | OpenAI兼容 | 任意OpenAI兼容端点（包括Ollama） |

**API格式说明：**
- **原生** - 使用该服务商的专用API格式，完全兼容所有特性
- **OpenAI兼容** - 使用OpenAI API格式，适用于大多数兼容服务

## 📝 注意事项

- ✅ 需要提供有效的 API Key 才能使用本扩展
- ✅ 本扩展仅在 YouTube 视频页面生效
- ✅ 视频本身需要有原始字幕才可以生成翻译字幕
- ✅ API Key 仅保存在浏览器本地，不会上传到任何服务器

## 🌍 常见语言代码参考

完整语言代码列表请访问：[语言代码参考页](https://yt-subtitle-translator.magang.net/languages-zh.html)

| 语言       | ISO 639-1 | 语言       | ISO 639-1 |
|------------|-----------|------------|-----------|
| 中文（简体） | `zh`      | 中文（繁体） | `zh-TW`   |
| 英语       | `en`      | 日语       | `ja`      |
| 韩语       | `ko`      | 法语       | `fr`      |
| 德语       | `de`      | 西班牙语   | `es`      |
| 葡萄牙语   | `pt`      | 意大利语   | `it`      |
| 俄语       | `ru`      | 阿拉伯语   | `ar`      |
| 印地语     | `hi`      | 泰语       | `th`      |
| 越南语     | `vi`      | 印尼语     | `id`      |
| 土耳其语   | `tr`      |            |           |

## 📄 许可证

MIT License

## 🔗 相关链接

- [项目主页](https://yt-subtitle-translator.magang.net/)
- [隐私政策](https://yt-subtitle-translator.magang.net/privacy-zh.html)
- [更新日志](https://yt-subtitle-translator.magang.net/changelog-zh.html)
- [GitHub仓库](https://github.com/marsteel/yt-subtitle-translator)
