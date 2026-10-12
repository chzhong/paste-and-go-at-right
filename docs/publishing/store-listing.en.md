# Chrome Web Store listing copy (English)

[简体中文](store-listing.zh-CN.md) · English

## Name

Paste and Go at Right

## Short description

Open a clipboard URL in a new tab to the right or in Chrome Split View. All processing stays on your device.

## Detailed description

Paste and Go at Right removes repetitive steps for people who frequently copy and open URLs.

Copy a complete HTTP or HTTPS URL, then right-click any tab:

- open the URL in a new tab immediately to the right;
- on Chrome 155 and later, open it directly in native Split View;
- when the clipboard is not a URL, keep the related menu hidden.

Privacy first: clipboard text is read and validated temporarily on the device. It is never uploaded, stored, or shared. The extension has no account system, telemetry, advertising, or analytics.

## Suggested category

Productivity

## Single-purpose statement

Open an HTTP/HTTPS URL from the clipboard through Chrome's tab context menu.

## Permission justifications

### clipboardRead

Reads the local plain-text clipboard to determine whether it contains an HTTP/HTTPS URL and whether the menu should be displayed. It reads the URL again when the user chooses an action. Content is not stored or transmitted.

### contextMenus

Provides **Paste and open in new tab to the right** and, when supported, **Paste and open in Split View** in Chrome's tab context menu.

### offscreen

A Manifest V3 Service Worker cannot access the DOM clipboard API directly, so the extension needs a local offscreen document. The document does not load remote content.

## Data disclosure guidance

The Extension locally processes clipboard text. Chrome requires accurate disclosure even when data stays on the device. Based on the options shown in the Developer Dashboard at submission time, disclose at least the categories that correspond to clipboard text, such as website content or user-provided content, and certify that the data:

- is used only for the Extension's single purpose;
- is not sold or used for advertising or credit assessment;
- is not transferred to third parties;
- is not persisted;
- is handled in compliance with the Limited Use requirements.

The final selections must match the Developer Dashboard's current fields and the Extension's actual behavior.

## Test instructions

1. Copy `https://example.com/`.
2. Wait up to one second, then right-click any tab in Chrome's tab strip.
3. Confirm that the open action appears and opens the URL in a new tab to the right.
4. On Chrome 155+, confirm that the Split View action is available.
5. Copy ordinary text, wait up to one second, and confirm that the menu disappears.

No account or test credentials are required.
