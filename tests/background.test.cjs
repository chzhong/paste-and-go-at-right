const assert = require("node:assert/strict");
const test = require("node:test");

test("service worker handles right-tab and Split View shortcuts", async () => {
  const listeners = [];
  const createdMenus = [];
  const createdTabs = [];
  const updatedMenus = [];
  let removeAllCalls = 0;
  const event = () => ({
    addListener(listener) {
      listeners.push(listener);
    }
  });

  global.self = globalThis;
  global.importScripts = (path) => {
    Object.assign(globalThis, require(`../src/${path}`));
  };
  global.clients = { matchAll: async () => [] };
  global.chrome = {
    action: {
      onClicked: event()
    },
    commands: {
      onCommand: event()
    },
    contextMenus: {
      create(properties, callback) {
        createdMenus.push(properties);
        callback?.();
      },
      update(id, properties, callback) {
        updatedMenus.push({ id, ...properties });
        callback?.();
      },
      remove(_id, callback) {
        callback?.();
      },
      removeAll(callback) {
        removeAllCalls += 1;
        callback?.();
      },
      onClicked: event()
    },
    i18n: {
      getMessage: (name) =>
        ({
          menuOpenRight: "Paste and open in new tab to the right",
          menuOpenSplit: "Paste and open in Split View"
        })[name] || ""
    },
    offscreen: {
      createDocument: async () => {}
    },
    runtime: {
      getURL: (path) => `chrome-extension://test/${path}`,
      lastError: undefined,
      openOptionsPage: async () => {},
      onInstalled: event(),
      onMessage: event(),
      onStartup: event(),
      sendMessage: async () => ({ ok: true, text: "https://example.com/" })
    },
    tabs: {
      create: async (properties) => {
        createdTabs.push(properties);
      },
      query: async () => [{ id: 7, index: 2, windowId: 1 }]
    }
  };

  assert.doesNotThrow(() => require("../src/background.js"));
  assert.equal(listeners.length, 6);

  listeners[2]({
    target: "service-worker",
    type: "clipboard-text-changed",
    text: "https://example.com/"
  });

  assert.deepEqual(updatedMenus, [
    {
      id: "paste-and-go-at-right",
      title: "Paste and open in new tab to the right",
      contexts: ["tab"]
    }
  ]);
  assert.deepEqual(createdMenus, []);

  listeners[2]({
    target: "service-worker",
    type: "clipboard-text-changed",
    text: "not a URL"
  });

  assert.equal(removeAllCalls, 1);

  listeners[3]("paste-and-open-right");
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(createdTabs, [
    {
      url: "https://example.com/",
      active: true,
      windowId: 1,
      index: 3
    }
  ]);

  listeners[3]("paste-and-open-split");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(createdTabs.length, 1, "unsupported Split View must not open a normal tab");

  global.chrome.tabs.createSplit = async () => 1;
  listeners[3]("paste-and-open-split");
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(createdTabs[1], {
    url: "https://example.com/",
    active: true,
    windowId: 1,
    splitWithTabId: 7
  });
});
