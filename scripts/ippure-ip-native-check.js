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

const ICON = "house.fill";
const COLOR_GREEN = "#88A788";
const COLOR_YELLOW = "#D4A017";
const COLOR_RED = "#C44";

async function main() {
  const url = "https://my.ippure.com/v1/info";
  const { error, data } = await request("GET", url);

  const title = isChinese() ? "IPPure 原生 IP 检查" : "IPPure IP Native Check";

  if (error || !data) {
    $done({
      title,
      content: isChinese() ? "网络错误" : "Network Error",
      backgroundColor: COLOR_RED,
      icon: ICON,
      "icon-color": COLOR_RED,
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
      backgroundColor: COLOR_RED,
      icon: ICON,
      "icon-color": COLOR_RED,
    });
    return;
  }

  const isRes = Boolean(json.isResidential);
  const isBrd = Boolean(json.isBroadcast);

  const resText = isChinese()
    ? (isRes ? "住宅" : "机房")
    : (isRes ? "Residential" : "DC");

  const brdText = isChinese()
    ? (isBrd ? "广播" : "原生")
    : (isBrd ? "Broadcast" : "Native");

  let color = COLOR_GREEN;
  if ((isRes && isBrd) || (!isRes && !isBrd)) {
    color = COLOR_YELLOW;
  }
  if (!isRes && isBrd) {
    color = COLOR_RED;
  }

  $done({
    title,
    content: `${resText} • ${brdText}`,
    backgroundColor: color,
    icon: ICON,
    "icon-color": color,
  });
}

(async () => {
  try {
    await main();
  } catch {
    $done({
      title: isChinese() ? "IPPure 原生 IP 检查" : "IPPure IP Native Check",
      content: isChinese() ? "脚本错误" : "Script Error",
      backgroundColor: COLOR_RED,
      icon: ICON,
      "icon-color": COLOR_RED,
    });
  }
})();
