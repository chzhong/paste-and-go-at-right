# GitHub Pages 维护

简体中文 · [English](github-pages.en.md)

项目网站是 `docs/` 中的无构建静态站点，由 `.github/workflows/pages.yml` 部署。

## 首次启用

1. 打开 GitHub 仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中将 **Source** 设为 **GitHub Actions**。
3. 打开 **Actions → Deploy GitHub Pages**，运行工作流；后续修改 `docs/` 并推送到 `main` 会自动部署。

公开地址：

- 主页：`https://chzhong.github.io/paste-and-go-at-right/`
- 隐私政策：`https://chzhong.github.io/paste-and-go-at-right/privacy.html`

## 本地预览

```bash
python3 -m http.server 4173 --directory docs
```

然后打开 `http://127.0.0.1:4173/`。

## 内容结构

- `index.html`：双语产品主页。
- `privacy.html`：可供 Chrome Web Store 使用的双语公开隐私政策。
- `assets/site.css`：响应式视觉样式。
- `assets/site.js`：中英文切换与本地语言偏好。
- `*.md`：项目文档，可由 GitHub 直接阅读。

站点不使用分析、Cookie、外部字体、第三方脚本或远程构建依赖。
