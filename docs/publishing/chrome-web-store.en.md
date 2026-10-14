# Chrome Web Store publishing guide

[简体中文](chrome-web-store.md) · English

## 1. Before publishing

- Register a Chrome Web Store developer account and complete its one-time setup.
- Enable two-step verification for the Google account.
- Use the public privacy policy URL: `https://chzhong.github.io/paste-and-go-at-right/privacy.html`.
- Load the Extension from `src/` in Chrome and complete real-world regression testing.

## 2. Build the upload package

```bash
npm run release:prepare
```

This runs tests, validates the manifest, permissions, localization, and icons, and creates:

```text
dist/paste-and-go-at-right-<version>.zip
```

The ZIP contains `manifest.json` at its root and excludes tests, design references, and publishing documentation.

Before every update, increment the versions in `src/manifest.json` and `package.json`, keeping them identical.

## 3. First publication

1. Open the Chrome Web Store Developer Dashboard.
2. Choose **Add new item** and upload the generated ZIP.
3. Enter the copy from `store-listing.en.md` on the Store Listing tab.
4. Upload at least one real screenshot at 1280×800 or 640×400, with square corners and no padding.
5. Upload `store-assets/promo-small.png` as the 440×280 small promotional tile.
6. On Privacy practices, enter the single purpose, permission justifications, and local-data disclosures.
7. Enter the public privacy policy URL.
8. Choose the regions and visibility on Distribution.
9. Add the documented test steps to Test instructions if the dashboard requests them.
10. Submit for review. For the first release, staged/deferred publishing is recommended so the approved draft can be checked before it goes live.

## 4. Screenshot guidance

Store screenshots must show the real user experience rather than a conceptual mockup. Recommended screenshots:

1. The tab context menu while the clipboard contains a URL.
2. The URL open in a new tab immediately to the right.
3. Native Split View on Chrome 155 or later.

Save final screenshots under `store-assets/screenshots/` and commit them. Remove personal tab titles, accounts, bookmarks, and other sensitive information before capture.

During regression testing, temporarily assign the right-side command at `chrome://extensions/shortcuts` and verify that it uses the active tab as its anchor. Keep or clear the shortcut afterward as preferred.

## 5. API upload for later releases (optional)

Use the Dashboard for first-time item creation and listing details. Once the Extension has an ID, Chrome Web Store API v2 can upload updates:

```bash
export CWS_ACCESS_TOKEN='short-lived OAuth access token'
export CWS_PUBLISHER_ID='publisher ID'
export CWS_EXTENSION_ID='extension ID'
scripts/cws-upload.sh
```

This uploads a draft without submitting it. After verifying the draft in the Dashboard, explicitly submit it for review with staged publishing:

```bash
scripts/cws-upload.sh --submit-staged
```

Never commit OAuth client secrets, refresh tokens, access tokens, or extension signing keys. Enable the Chrome Web Store API in a Google Cloud project and follow the official OAuth setup guide.

## 6. Final checklist

- [ ] Tests, validation, and packaging pass.
- [ ] `manifest.json` is at the ZIP root.
- [ ] The version is higher than the current store version.
- [ ] The ZIP contains the 128×128 icon and both locale bundles.
- [ ] At least one real screenshot has a valid size.
- [ ] The small promotional tile is ready.
- [ ] Store copy clearly discloses local clipboard access.
- [ ] Privacy practices, privacy policy, and actual behavior agree.
- [ ] The public privacy policy URL works.
- [ ] Permission justifications cover `clipboardRead`, `contextMenus`, and `offscreen`.
- [ ] The configurable command has been tested through `chrome://extensions/shortcuts`.
- [ ] Two-step verification is enabled on the publisher account.
- [ ] No secrets, tokens, personal data, or unrelated files are included.

## Official references

- [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare)
- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Store listing best practices and image sizes](https://developer.chrome.com/docs/webstore/best-listing)
- [Fill out the privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Chrome Web Store User Data Policy FAQ](https://developer.chrome.com/docs/webstore/user_data)
- [Chrome Web Store API v2](https://developer.chrome.com/docs/webstore/using-api)
