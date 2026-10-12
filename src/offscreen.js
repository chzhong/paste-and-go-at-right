const clipboard = document.querySelector("#clipboard");
let previousText = null;

function readClipboardText() {
  clipboard.value = "";
  clipboard.focus();
  clipboard.select();

  const succeeded = document.execCommand("paste");
  const text = succeeded ? clipboard.value : "";

  clipboard.value = "";
  return { ok: succeeded, text };
}

function reportClipboardWhenChanged() {
  const result = readClipboardText();
  const text = result.ok ? result.text : "";

  if (text === previousText) {
    return;
  }

  previousText = text;
  chrome.runtime.sendMessage(
    {
      target: "service-worker",
      type: "clipboard-text-changed",
      text
    },
    () => chrome.runtime.lastError
  );
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (
    message?.target !== "offscreen" ||
    message.type !== "read-clipboard-text"
  ) {
    return false;
  }

  try {
    sendResponse(readClipboardText());
  } catch (error) {
    sendResponse({
      ok: false,
      text: "",
      error: error instanceof Error ? error.message : String(error)
    });
  }

  return true;
});

reportClipboardWhenChanged();
setInterval(reportClipboardWhenChanged, 500);
