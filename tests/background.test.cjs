const assert = require("node:assert/strict");
const test = require("node:test");

test("service worker registers using Chrome-supported events", () => {
  const listeners = [];
  const createdMenus = [];
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
      onInstalled: event(),
      onMessage: event(),
      onStartup: event(),
      sendMessage: async () => ({ ok: true, text: "" })
    },
    tabs: {
      create: async () => {}
    }
  };

  assert.doesNotThrow(() => require("../src/background.js"));
  assert.equal(listeners.length, 4);

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
});
