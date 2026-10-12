# Paste and Go at Right Privacy Policy

[简体中文](privacy-policy.md) · English

Last updated: October 12, 2026

Paste and Go at Right (the “Extension”) has one purpose: to let users open a URL from their clipboard through Chrome's tab context menu.

## Data handled

The Extension reads plain-text clipboard content locally on the user's device to determine whether it is a complete HTTP or HTTPS URL. When the user selects a menu action, the Extension reads and validates the clipboard again and asks Chrome to open that URL.

Clipboard content may contain user data. The Extension processes the current plain-text value only as needed to provide this visible feature.

## Storage, transmission, and sharing

- The Extension does not save clipboard content to local storage, files, logs, or databases.
- The Extension does not send clipboard content or usage data to the developer, advertisers, analytics services, or any third party.
- The Extension contains no account system, telemetry, analytics, advertising, or remotely hosted code.
- The Extension does not sell user data or allow humans to read user data.

When a user chooses to open a URL, Chrome visits it as normal browser navigation. The destination website's own privacy policy governs its data practices.

## Permission use

- `clipboardRead`: reads the local plain-text clipboard to decide whether to display the menu and to obtain the URL when the user selects an action.
- `contextMenus`: provides actions in the tab context menu.
- `offscreen`: provides local clipboard access because a Manifest V3 Service Worker has no DOM.

## Retention and deletion

The Extension does not persist user data, so there is no server-side or local user-data store to delete. Uninstalling the Extension removes its code and settings.

## Chrome Web Store Limited Use

The Extension's use of user data complies with the Chrome Web Store User Data Policy, including the Limited Use requirements. Data is used only for the clearly disclosed single purpose and is not used for advertising, profiling, credit assessment, resale, or unrelated purposes.

## Changes

If the Extension's data practices change, this policy and the Chrome Web Store disclosures will be updated before the changed version is released.

## Contact

For privacy or support questions, contact the maintainers through [GitHub Issues](https://github.com/chzhong/paste-and-go-at-right/issues). Do not post clipboard content or other sensitive information in a public issue.

> This document describes the Extension's current behavior and is not legal advice.
