const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "src");
const manifestPath = path.join(source, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8")
);

function check(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function pngDimensions(file) {
  const data = fs.readFileSync(file);
  check(data.subarray(1, 4).toString("ascii") === "PNG", `${file} 不是 PNG`);
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20)
  };
}

check(manifest.manifest_version === 3, "必须使用 Manifest V3");
check(manifest.version === packageJson.version, "manifest 与 package 版本不一致");
check(manifest.default_locale === "en", "默认语言必须为 en");
check(
  manifest.description === "__MSG_extensionDescription__",
  "manifest description 必须使用本地化消息"
);
check(
  manifest.background?.service_worker === "background.js",
  "Service Worker 配置缺失"
);
check(
  manifest.commands?.["paste-and-open-right"]?.description ===
    "__MSG_commandOpenRight__",
  "缺少可配置的右侧打开快捷键命令"
);
check(
  manifest.commands?.["paste-and-open-split"]?.description ===
    "__MSG_commandOpenSplit__",
  "缺少可配置的拆分视图快捷键命令"
);
check(manifest.options_page === "options.html", "缺少设置页面");

const expectedPermissions = ["clipboardRead", "contextMenus", "offscreen"];
check(
  JSON.stringify([...manifest.permissions].sort()) ===
    JSON.stringify(expectedPermissions.sort()),
  "权限集合与已审核的最小权限不一致"
);

for (const size of [16, 32, 48, 128]) {
  const relative = manifest.icons?.[String(size)];
  check(relative, `缺少 ${size}px 图标声明`);
  const file = path.join(source, relative);
  check(fs.existsSync(file), `缺少图标文件：${relative}`);
  const dimensions = pngDimensions(file);
  check(
    dimensions.width === size && dimensions.height === size,
    `${relative} 尺寸应为 ${size}x${size}`
  );
}

for (const file of ["background.js", "offscreen.html", "offscreen.js", "url-utils.js", "options.html", "options.css", "options.js"]) {
  check(fs.existsSync(path.join(source, file)), `缺少运行文件：${file}`);
}

for (const locale of ["en", "zh_CN"]) {
  const messagesPath = path.join(source, "_locales", locale, "messages.json");
  check(fs.existsSync(messagesPath), `缺少语言包：${locale}`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, "utf8"));
  for (const key of [
    "extensionName",
    "extensionDescription",
    "menuOpenRight",
    "menuOpenSplit",
    "commandOpenRight",
    "commandOpenSplit",
    "openSettings",
    "settingsTitle",
    "settingsIntro",
    "shortcutRight",
    "shortcutSplit",
    "shortcutNotSet",
    "shortcutUnavailable",
    "shortcutOpenChrome",
    "shortcutChromeNote",
    "shortcutOpenFailed",
    "shortcutLoadFailed"
  ]) {
    check(messages[key]?.message, `${locale} 缺少消息：${key}`);
  }
  check(
    messages.extensionDescription.message.length <= 132,
    `${locale} extensionDescription 超过 132 字符`
  );
}

console.log(`Extension ${manifest.version}: validation passed`);
