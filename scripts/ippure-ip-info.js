async function request(method, params) {
  return new Promise((resolve) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

function isChinese() {
  const lang = (($environment && $environment.language) || "").toLowerCase();
  return lang.startsWith("zh");
}

const ICON = "network";
const ICON_COLOR_OK = "#5AC8FA";
const ICON_COLOR_ERR = "#C44";

async function main() {
  const url = "https://my.ippure.com/v1/info";
  const { error, data } = await request("GET", url);

  const title = isChinese() ? "IPPure IP 信息" : "IPPure IP Info";

  if (error || !data) {
    $done({
      title,
      content: isChinese() ? "网络错误" : "Network Error",
      backgroundColor: ICON_COLOR_ERR,
      icon: ICON,
      "icon-color": ICON_COLOR_ERR,
    });
    return;
  }

  let json;
  try {
    json = JSON.parse(data);
  } catch {
    $done({
      title,
      content: isChinese() ? "无效 JSON" : "Invalid JSON",
      backgroundColor: ICON_COLOR_ERR,
      icon: ICON,
      "icon-color": ICON_COLOR_ERR,
    });
    return;
  }

  let location = json.city || json.region || json.country || "";
  let org = json.asOrganization || "";

  if (!location) location = isChinese() ? "未知区域" : "Unknown";
  if (!org) org = isChinese() ? "未知运营商" : "Unknown";

  const text = `${location} - ${org}`;

  $done({
    title,
    content: text,
    backgroundColor: "#88A788",
    icon: ICON,
    "icon-color": ICON_COLOR_OK,
  });
}

(async () => {
  try {
    await main();
  } catch {
    $done({
      title: isChinese() ? "IPPure IP 信息" : "IPPure IP Info",
      content: isChinese() ? "脚本错误" : "Script Error",
      backgroundColor: ICON_COLOR_ERR,
      icon: ICON,
      "icon-color": ICON_COLOR_ERR,
    });
  }
})();
