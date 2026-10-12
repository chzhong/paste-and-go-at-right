importScripts("url-utils.js");

const MENU_OPEN_RIGHT = "paste-and-go-at-right";
const MENU_OPEN_SPLIT = "paste-and-go-in-split-view";
const OFFSCREEN_DOCUMENT = "offscreen.html";

let creatingOffscreenDocument = null;
let menuShouldExist = false;

function message(name, fallback) {
  return chrome.i18n.getMessage(name) || fallback;
}

function supportsSplitView() {
  return typeof chrome.tabs.createSplit === "function";
}

function showMenus() {
  if (menuShouldExist) {
    return;
  }

  menuShouldExist = true;
  chrome.contextMenus.create(
    {
      id: MENU_OPEN_RIGHT,
      title: message("menuOpenRight", "Paste and open in new tab to the right"),
      contexts: ["tab"]
    },
    () => chrome.runtime.lastError
  );

  if (supportsSplitView()) {
    chrome.contextMenus.create(
      {
        id: MENU_OPEN_SPLIT,
        title: message("menuOpenSplit", "Paste and open in Split View"),
        contexts: ["tab"]
      },
      () => chrome.runtime.lastError
    );
  }
}

function hideMenus() {
  if (!menuShouldExist) {
    return;
  }

  menuShouldExist = false;
  chrome.contextMenus.removeAll(() => chrome.runtime.lastError);
}

function updateMenuForClipboard(text) {
  if (self.normalizeWebUrl(text)) {
    showMenus();
  } else {
    hideMenus();
  }
}

async function ensureOffscreenDocument() {
  const documentUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT);
  const extensionClients = await clients.matchAll();

  if (extensionClients.some((client) => client.url === documentUrl)) {
    return;
  }

  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT,
      reasons: ["CLIPBOARD"],
      justification: "在本机检查剪贴板是否包含网址，以决定是否显示标签页菜单"
    });
  }

  try {
    await creatingOffscreenDocument;
  } finally {
    creatingOffscreenDocument = null;
  }
}

async function initialize() {
  menuShouldExist = false;
  await new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      chrome.runtime.lastError;
      resolve();
    });
  });

  try {
    await ensureOffscreenDocument();
  } catch (error) {
    console.error("无法启动本地剪贴板读取：", error);
  }
}

async function readClipboardText() {
  await ensureOffscreenDocument();
  const response = await chrome.runtime.sendMessage({
    target: "offscreen",
    type: "read-clipboard-text"
  });

  return response?.ok ? response.text : "";
}

chrome.runtime.onInstalled.addListener(() => void initialize());
chrome.runtime.onStartup.addListener(() => void initialize());

chrome.runtime.onMessage.addListener((message) => {
  if (
    message?.target === "service-worker" &&
    message.type === "clipboard-text-changed"
  ) {
    updateMenuForClipboard(message.text);
  }

  return false;
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    (info.menuItemId !== MENU_OPEN_RIGHT &&
      info.menuItemId !== MENU_OPEN_SPLIT) ||
    !tab
  ) {
    return;
  }

  void (async () => {
    try {
      const text = await readClipboardText();
      const url = self.normalizeWebUrl(text);

      if (!url) {
        hideMenus();
        return;
      }

      if (
        info.menuItemId === MENU_OPEN_SPLIT &&
        supportsSplitView() &&
        typeof tab.id === "number"
      ) {
        await chrome.tabs.create({
          url,
          active: true,
          windowId: tab.windowId,
          splitWithTabId: tab.id
        });
      } else {
        await chrome.tabs.create({
          url,
          active: true,
          windowId: tab.windowId,
          index: tab.index + 1
        });
      }
    } catch (error) {
      console.error("无法打开剪贴板中的网址：", error);
    }
  })();
});
