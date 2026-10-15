const shortcutElements = {
  "paste-and-open-right": document.querySelector("#shortcut-right"),
  "paste-and-open-split": document.querySelector("#shortcut-split")
};
const errorElement = document.querySelector("#error");

function message(key) {
  return chrome.i18n.getMessage(key);
}

function showError(key) {
  errorElement.textContent = message(key);
  errorElement.hidden = false;
}

async function refreshShortcuts() {
  try {
    const commands = await chrome.commands.getAll();
    const shortcuts = new Map(commands.map(({ name, shortcut }) => [name, shortcut]));
    for (const [name, element] of Object.entries(shortcutElements)) {
      element.textContent = shortcuts.get(name) || message("shortcutNotSet");
    }
    errorElement.hidden = true;
  } catch {
    showError("shortcutLoadFailed");
  }
}

document.documentElement.lang = chrome.i18n.getUILanguage();
document.title = `${message("settingsTitle")} · ${message("extensionName")}`;
for (const element of document.querySelectorAll("[data-i18n]")) {
  element.textContent = message(element.dataset.i18n);
}
document.querySelector("#split-support").hidden =
  typeof chrome.tabs.createSplit === "function";

document.querySelector("#open-shortcuts").addEventListener("click", async () => {
  try {
    await chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  } catch {
    showError("shortcutOpenFailed");
  }
});

window.addEventListener("focus", () => void refreshShortcuts());
void refreshShortcuts();
