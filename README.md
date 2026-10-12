# Paste and Go at Right

一个轻量的 Chrome 扩展：右键点击标签页时，如果剪贴板里是 `http://` 或 `https://` URL，就显示打开菜单；否则不显示。

## 安装

1. 打开 `chrome://extensions/`。
2. 开启右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本项目的 `src/` 目录。

扩展最低支持 Chrome 109。安装时会申请“读取您复制和粘贴的数据”权限，这是判断剪贴板内容是否为 URL 所必需的；内容只在本机处理。

## 使用

1. 复制一个完整网址，例如 `https://example.com/`。
2. 在 Chrome 顶部的任意标签页上点击右键。
3. 点击“在右侧新增标签页并打开”。

新标签页会插入到被右键点击的标签页右侧，并立即切换过去。剪贴板内容只在本机读取，不会发送到网络。

Chrome 155 及以上版本还会提供“在拆分视图粘贴并打开”，把剪贴板网址作为被点击标签页右侧的原生拆分视图打开。Chrome 154 及以下版本尚未向扩展开放创建拆分视图的 API，因此不会显示这一项。

## 图标

扩展图标融合了“剪贴板”和“向右上方打开链接”两个语义，提供 16、32、48 和 128 像素 PNG；Chrome 会使用 16 像素版本作为右键菜单图标。

> Chrome 的 `contextMenus` API 不提供菜单打开前事件，因此扩展会在本机每 500 毫秒检查一次纯文本剪贴板，并在内容变化时创建或移除菜单。点击菜单时还会重新读取并校验一次，避免打开过期内容。

## URL 判定

- 接受完整的 HTTP/HTTPS URL；首尾空白会被忽略。
- 不接受普通文本、缺少协议的网址、多个网址或 `file:`、`javascript:` 等其他协议。

## 开发

项目无需构建即可加载。运行测试：

```bash
npm test
```

目录结构：

```text
src/        Chrome 加载和商店打包所需的完整扩展源码
tests/      Node.js 单元测试与 Service Worker 注册测试
docs/       架构、设计资料与不随扩展发布的参考素材
README.md   项目说明
```

实现说明见 [docs/architecture.md](docs/architecture.md)，图标设计资料见 [docs/icon-design.md](docs/icon-design.md)。

## 发布

运行以下命令完成测试、清单校验并生成 Chrome Web Store ZIP：

```bash
npm run release:prepare
```

发布包输出到 `dist/paste-and-go-at-right-<version>.zip`。完整流程和商店资料见 [docs/publishing/chrome-web-store.md](docs/publishing/chrome-web-store.md)。
