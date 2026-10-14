# Chrome Web Store 发布方法

简体中文 · [English](chrome-web-store.en.md)

## 1. 发布前准备

- 注册 Chrome Web Store 开发者账号并完成一次性注册流程。
- 为 Google 账号启用两步验证。
- 使用公开隐私政策 URL：`https://chzhong.github.io/paste-and-go-at-right/privacy.html`。
- 在 Chrome 中从 `src/` 加载扩展，完成真实场景回归测试。

## 2. 生成上传包

```bash
npm run release:prepare
```

该命令会运行测试、检查 Manifest/权限/图标，然后创建：

```text
dist/paste-and-go-at-right-<version>.zip
```

ZIP 根目录直接包含 `manifest.json`，不会包含测试、设计参考或发布文档。

每次更新商店版本前，必须先提高 `src/manifest.json` 和 `package.json` 中的版本号，并保持二者一致。

## 3. 首次发布

1. 打开 Chrome Web Store Developer Dashboard。
2. 点击 Add new item，上传生成的 ZIP。
3. 在 Store Listing 填入 `store-listing.zh-CN.md` 中的文案。
4. 上传至少一张真实使用截图；规格为 1280×800 或 640×400、无外边距、方角。
5. 上传 `store-assets/promo-small.png` 作为 440×280 小型宣传图。
6. 在 Privacy practices 填写单一用途、逐项权限理由和本地数据处理披露。
7. 填入公开隐私政策 URL。
8. 在 Distribution 选择发布地区与可见范围。
9. 将文档中的测试步骤填入 Test instructions（若控制台要求）。
10. 提交审核。第一次建议选择 deferred/staged publishing，审核通过后手动检查再发布。

## 4. 截图建议

商店要求截图反映真实用户体验，不能用概念图代替。建议准备：

1. 剪贴板为 URL 时，标签页右键菜单显示打开选项。
2. 网址在右侧新标签页打开后的画面。
3. Chrome 155+ 中原生拆分视图的画面。

发布前把截图保存到 `store-assets/screenshots/` 并提交。避免截图包含个人标签页标题、账号、书签或其他敏感信息。

回归测试时还应在 `chrome://extensions/shortcuts` 为右侧打开命令临时分配按键，确认它以当前活动标签页为基准工作；测试后可保留或清除该按键。

## 5. 后续版本 API 上传（可选）

首次项目创建和商店资料填写建议使用 Dashboard。已有 Extension ID 后，可使用 Chrome Web Store API v2 上传更新：

```bash
export CWS_ACCESS_TOKEN='短期 OAuth 访问令牌'
export CWS_PUBLISHER_ID='发布者 ID'
export CWS_EXTENSION_ID='扩展 ID'
scripts/cws-upload.sh
```

上述命令只上传草稿，不提交审核。确认 Dashboard 中草稿正确后，可显式提交为审核通过后暂存：

```bash
scripts/cws-upload.sh --submit-staged
```

不要把 OAuth 客户端密钥、刷新令牌、访问令牌或扩展签名私钥写入仓库。API 使用前需在 Google Cloud 项目启用 Chrome Web Store API，并按官方指南取得 OAuth 凭据。

## 6. 最终检查清单

- [ ] 测试、校验和打包命令全部通过。
- [ ] ZIP 中的 `manifest.json` 位于根目录。
- [ ] 版本号高于商店当前版本。
- [ ] 128×128 图标已包含在 ZIP 中。
- [ ] 至少一张真实截图符合尺寸要求。
- [ ] 小型宣传图已准备。
- [ ] 商店文案明确披露本地剪贴板读取行为。
- [ ] Privacy practices 与隐私政策、代码行为完全一致。
- [ ] 隐私政策 URL 可公开访问，联系方式已填写。
- [ ] 权限理由覆盖 `clipboardRead`、`contextMenus`、`offscreen`。
- [ ] 可配置快捷键已在 `chrome://extensions/shortcuts` 中验证。
- [ ] 发布账号已启用两步验证。
- [ ] 未包含密钥、令牌、个人数据或无关文件。

## 官方参考

- [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare)
- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Store listing best practices and image sizes](https://developer.chrome.com/docs/webstore/best-listing)
- [Fill out the privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Chrome Web Store User Data Policy FAQ](https://developer.chrome.com/docs/webstore/user_data)
- [Chrome Web Store API v2](https://developer.chrome.com/docs/webstore/using-api)
