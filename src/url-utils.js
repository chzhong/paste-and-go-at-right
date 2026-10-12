(function exposeUrlNormalizer(root) {
  /**
   * Return a normalized HTTP(S) URL, or null when the clipboard text is not a
   * web URL that Chrome can safely navigate to.
   */
  function normalizeWebUrl(value) {
    if (typeof value !== "string") {
      return null;
    }

    const text = value.trim();
    if (!text || /[\r\n\t]/u.test(text)) {
      return null;
    }

    try {
      const url = new URL(text);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return null;
      }

      return url.href;
    } catch {
      return null;
    }
  }

  root.normalizeWebUrl = normalizeWebUrl;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { normalizeWebUrl };
  }
})(typeof self !== "undefined" ? self : globalThis);
