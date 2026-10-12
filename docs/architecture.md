# 架构说明

## 运行组件

- `src/background.js`：Manifest V3 Service Worker，维护标签页右键菜单并创建新标签页。
- `src/offscreen.html` / `src/offscreen.js`：本地 offscreen 文档，通过 `clipboardRead` 权限读取纯文本剪贴板。
- `src/url-utils.js`：仅接受完整的 HTTP/HTTPS URL，拒绝其他协议和多行内容。
- `src/manifest.json`：权限、版本、Service Worker 与图标声明。

## 数据流

1. offscreen 文档每 500 毫秒在本机读取一次纯文本剪贴板。
2. 仅当内容发生变化时，才通过扩展内部消息通知 Service Worker。
3. Service Worker 判断内容是否为 HTTP/HTTPS URL，并相应创建或移除标签页菜单。
4. 用户点击菜单时再次读取和校验，随后在右侧标签页或原生拆分视图中打开。

剪贴板内容不会写入存储、日志或发送到网络。

## 兼容性

- 基础功能：Chrome 109+。
- 原生拆分视图：Chrome 155+，通过特性检测启用。
- Chrome 的 `contextMenus` API 不提供菜单显示前事件，因此需要本地轮询来满足“非 URL 时不显示菜单”的交互要求。
