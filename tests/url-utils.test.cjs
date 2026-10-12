const assert = require("node:assert/strict");
const test = require("node:test");

const { normalizeWebUrl } = require("../src/url-utils.js");

test("accepts and normalizes complete HTTP(S) URLs", () => {
  assert.equal(normalizeWebUrl(" https://example.com/path?q=1 \n"), "https://example.com/path?q=1");
  assert.equal(normalizeWebUrl("HTTP://EXAMPLE.COM"), "http://example.com/");
});

test("rejects text, incomplete addresses, and unsafe protocols", () => {
  assert.equal(normalizeWebUrl("hello"), null);
  assert.equal(normalizeWebUrl("example.com"), null);
  assert.equal(normalizeWebUrl("javascript:alert(1)"), null);
  assert.equal(normalizeWebUrl("file:///tmp/example"), null);
  assert.equal(normalizeWebUrl("https://one.example\nhttps://two.example"), null);
  assert.equal(normalizeWebUrl("   "), null);
});
