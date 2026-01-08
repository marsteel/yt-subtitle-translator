# YouTube双语字幕翻译助手 - 文档站点

本目录包含YouTube双语字幕翻译助手的GitHub Pages站点。

## 页面

- **index.html** - 主页，包含功能介绍和导航链接
- **privacy.html** - 隐私政策页面
- **changelog.html** - 版本历史和更新日志
- **CNAME** - 自定义域名配置（yt-subtitle-translator.magang.net）

## GitHub Pages设置

GitHub Pages已配置为使用自定义域名：

```
yt-subtitle-translator.magang.net
```

### 启用GitHub Pages

1. 进入GitHub仓库设置
2. 点击 **Settings** → **Pages**
3. 在"Source"下选择：
   - **Branch**: `main`
   - **Folder**: `/docs`
4. 点击 **Save**

### 自定义域名

CNAME文件已配置，确保您的DNS设置正确：

```
CNAME记录: yt-subtitle-translator.magang.net → marsteel.github.io
```

## 站点URL

- **自定义域名**: https://yt-subtitle-translator.magang.net/
- **GitHub域名**: https://marsteel.github.io/yt-subtitle-translator/

## 本地测试

使用Python的内置HTTP服务器进行本地测试：

```bash
cd docs
python3 -m http.server 8000
```

然后在浏览器中打开 http://localhost:8000

## 更新内容

只需编辑HTML文件并提交/推送到GitHub，站点将自动更新。

## 语言

所有页面均使用中文（简体）编写，匹配扩展的目标用户群体。
