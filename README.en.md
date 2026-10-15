# Paste and Go at Right

[简体中文](README.md) · English

[Project website](https://chzhong.github.io/paste-and-go-at-right/) · [Privacy policy](https://chzhong.github.io/paste-and-go-at-right/privacy.html)

A lightweight Chrome extension that shows tab context-menu actions only when the clipboard contains a complete `http://` or `https://` URL.

## Install for development

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project's `src/` directory.

The base feature supports Chrome 109 and later. Chrome requests permission to read copied and pasted data because the extension must determine whether the clipboard contains a URL. Clipboard processing stays on the device.

## Use

1. Copy a complete URL such as `https://example.com/`.
2. Right-click any tab in Chrome's tab strip.
3. Choose **Paste and open in new tab to the right**.

The new tab is inserted immediately to the right of the tab you clicked and becomes active.

Chrome 155 and later also provide **Paste and open in Split View**, which opens the URL in Chrome's native Split View. Earlier versions do not expose the required extension API, so this action remains hidden.

Click the extension's toolbar icon to open its settings page. It shows the current assignments for **open in a new tab to the right** and **open in Split View**, with a link to Chrome's shortcut settings. Neither command has a preset key. The Split View shortcut can only create a split on Chrome 155 or later.

## Privacy

Chrome does not provide a context-menu event immediately before a menu opens. To keep the action hidden for non-URLs, the extension checks the local plain-text clipboard every 500 milliseconds and updates the menu only when the content changes. It validates the clipboard again when an action is clicked.

Clipboard content is never stored, logged, or sent over the network. See the [privacy policy](docs/privacy-policy.en.md).

## URL rules

- Accepts complete HTTP and HTTPS URLs; surrounding whitespace is ignored.
- Rejects ordinary text, addresses without a protocol, multiple URLs, and protocols such as `file:` or `javascript:`.

## Development

No build step is required for local loading. Run the tests with:

```bash
npm test
```

```text
src/        Complete extension source loaded by Chrome and packaged for the store
tests/      Node.js unit tests and Service Worker registration test
docs/       Architecture, design, privacy, and publishing documentation
README.md   Chinese project overview
README.en.md English project overview
```

See [architecture](docs/architecture.en.md), [icon design](docs/icon-design.en.md), and [GitHub Pages maintenance](docs/github-pages.en.md). The extension name, description, context menus, and command description automatically follow Chrome's Chinese or English locale.

## Release

Run tests, validate the manifest and assets, and generate the Chrome Web Store ZIP:

```bash
npm run release:prepare
```

The package is written to `dist/paste-and-go-at-right-<version>.zip`. See the [Chrome Web Store publishing guide](docs/publishing/chrome-web-store.en.md).
