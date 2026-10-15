# Architecture

[简体中文](architecture.md) · English

## Runtime components

- `src/background.js`: Manifest V3 Service Worker that maintains tab context-menu items, handles keyboard commands, and creates tabs.
- `src/offscreen.html` / `src/offscreen.js`: local offscreen document that reads the plain-text clipboard with the `clipboardRead` permission.
- `src/url-utils.js`: accepts complete HTTP/HTTPS URLs and rejects other protocols and multiline content.
- `src/options.html` / `src/options.js`: shows both shortcut assignments and a link to Chrome's shortcut settings.
- `src/manifest.json`: permissions, version, localization, Service Worker, commands, options page, homepage, and icon declarations.

## Data flow

1. The offscreen document reads the local plain-text clipboard every 500 milliseconds.
2. It sends an internal extension message only when the clipboard text changes.
3. The Service Worker checks whether the text is an HTTP/HTTPS URL and creates or removes the tab menu accordingly.
4. When the user chooses a menu action or invokes the configurable shortcut, the extension reads and validates the clipboard again, then opens the URL in a tab to the right or in native Split View.

Clipboard text is never persisted, logged, or transmitted over the network.

## Compatibility

- Base feature: Chrome 109+.
- Two configurable shortcuts: registered through `chrome.commands` and assigned by the user at `chrome://extensions/shortcuts`. The options page can read assignments, but Chrome does not expose an extension API for changing them.
- Native Split View: Chrome 155+, enabled through feature detection.
- Chrome's `contextMenus` API has no before-show event, so local polling is required to keep the menu hidden when the clipboard is not a URL.
