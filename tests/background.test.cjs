const assert = require("node:assert/strict");
const test = require("node:test");

test("service worker registers using Chrome-supported events", () => {
  const listeners = [];
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
      create(_properties, callback) {
        callback?.();
      },
      remove(_id, callback) {
        callback?.();
      },
      removeAll(callback) {
        callback?.();
      },
      onClicked: event()
    },
    i18n: {
      getMessage: () => ""
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
});
