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

const ICON = "exclamationmark.shield.fill";
const COLOR_LOW = "#88A788";   // 绿
const COLOR_MED = "#D4A017";   // 黄
const COLOR_HIGH = "#C44";     // 红

async function main() {
  const url = "https://my.ippure.com/v1/info";
  const { error, data } = await request("GET", url);

  const title = isChinese() ? "IPPure IP 风险评分" : "IPPure IP Fraud Score";

  if (error || !data) {
    $done({
      title,
      content: isChinese() ? "网络错误" : "Network Error",
      backgroundColor: COLOR_HIGH,
      icon: ICON,
      "icon-color": COLOR_HIGH,
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
      backgroundColor: COLOR_HIGH,
      icon: ICON,
      "icon-color": COLOR_HIGH,
    });
    return;
  }

  const score = json.fraudScore;

  if (score === undefined || score === null) {
    $done({
      title,
      content: isChinese() ? "无评分数据" : "No Score",
      backgroundColor: COLOR_HIGH,
      icon: ICON,
      "icon-color": COLOR_HIGH,
    });
    return;
  }

  let color = COLOR_LOW;
  let levelZh = "低风险";
  let levelEn = "Low Risk";

  if (score >= 40 && score < 70) {
    color = COLOR_MED;
    levelZh = "中风险";
    levelEn = "Medium Risk";
  } else if (score >= 70) {
    color = COLOR_HIGH;
    levelZh = "高风险";
    levelEn = "High Risk";
  }

  const text = isChinese()
    ? `风险评分: ${score}（${levelZh}）`
    : `Fraud Score: ${score} (${levelEn})`;

  $done({
    title,
    content: text,
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
      title: isChinese() ? "IPPure IP 风险评分" : "IPPure IP Fraud Score",
      content: isChinese() ? "脚本错误" : "Script Error",
      backgroundColor: COLOR_HIGH,
      icon: ICON,
      "icon-color": COLOR_HIGH,
    });
  }
})();
