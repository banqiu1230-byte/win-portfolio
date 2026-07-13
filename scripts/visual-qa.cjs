const { chromium } = require("playwright");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const url = "http://127.0.0.1:5178/";

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const errors = [];

  async function capture(name, viewport, action) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`${name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
    await page.goto(url, { waitUntil: "networkidle" });
    if (action) await action(page);
    await page.screenshot({
      path: path.join(root, "public", "qa", `${name}.png`),
      fullPage: !name.startsWith("detail-"),
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(`${name}: ${page.url()} overflow=${overflow}`);
    await page.close();
  }

  await capture("implementation-1440", { width: 1440, height: 1000 });
  await capture("implementation-1024", { width: 1024, height: 900 }, async (page) => {
    await page.getByRole("button", { name: "工作", exact: true }).click();
    await page.waitForTimeout(500);
  });
  await capture("implementation-390", { width: 390, height: 844 });
  await capture("implementation-dark-1440", { width: 1440, height: 1000 }, async (page) => {
    await page.getByRole("button", { name: "切换到深色模式" }).click();
    await page.waitForTimeout(380);
  });
  await capture("detail-temu-1440", { width: 1440, height: 1000 }, async (page) => {
    await page.getByRole("button", { name: "打开TEMU 售后体验系统案例" }).click();
    await page.waitForTimeout(520);
  });

  const behaviorPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await behaviorPage.goto(url, { waitUntil: "networkidle" });
  const cardGeometry = await behaviorPage.locator("[data-project-id]").evaluateAll((cards) => cards.map((card) => ({
    media: Math.round(card.querySelector(".project-media").getBoundingClientRect().height),
    copy: Math.round(card.querySelector(".project-copy").getBoundingClientRect().height),
  })));
  const mediaHeights = cardGeometry.map(({ media }) => media);
  const copyHeights = cardGeometry.map(({ copy }) => copy);
  if (Math.max(...mediaHeights) - Math.min(...mediaHeights) > 1 || Math.max(...copyHeights) - Math.min(...copyHeights) > 1) {
    throw new Error(`project card sections are misaligned: ${JSON.stringify(cardGeometry)}`);
  }
  const initialTemuTop = await behaviorPage.locator("[data-project-id=temu]").evaluate((card) => card.getBoundingClientRect().top);
  await behaviorPage.getByRole("button", { name: "工作", exact: true }).click();
  await behaviorPage.waitForTimeout(120);
  const filterMotion = await behaviorPage.locator("[data-project-id=temu]").evaluate((card) => ({
    top: card.getBoundingClientRect().top,
    height: card.getBoundingClientRect().height,
    transform: getComputedStyle(card).transform,
  }));
  if (filterMotion.transform === "none" || filterMotion.height > 650 || filterMotion.top >= initialTemuTop) {
    throw new Error(`filter transition unstable: ${JSON.stringify({ initialTemuTop, ...filterMotion })}`);
  }
  await behaviorPage.waitForTimeout(360);
  for (const label of ["关于", "工作", "支线项目", "全部"]) {
    await behaviorPage.getByRole("button", { name: label, exact: true }).click();
    await behaviorPage.waitForTimeout(480);
  }
  for (const project of ["TEMU 售后体验系统", "设计系统建设", "拼小圈红包增长设计", "多多视频消息体系", "AI 设计探索", "多多 Emoji"]) {
    await behaviorPage.getByRole("button", { name: `打开${project}案例` }).click();
    await behaviorPage.waitForTimeout(480);
    await behaviorPage.getByRole("button", { name: "关闭项目详情" }).click();
    await behaviorPage.waitForTimeout(480);
  }
  console.log(`interactions: filters=4 projects=6 passed; filter-motion=${Math.round(initialTemuTop)}px→${Math.round(filterMotion.top)}px`);

  const temuCard = behaviorPage.getByRole("button", { name: "打开TEMU 售后体验系统案例" });
  await temuCard.scrollIntoViewIfNeeded();
  await behaviorPage.evaluate(() => window.scrollBy(0, -120));
  const beforeDetail = await behaviorPage.evaluate(() => ({
    scrollY: window.scrollY,
    clientWidth: document.documentElement.clientWidth,
  }));
  await temuCard.click();
  await behaviorPage.waitForTimeout(520);
  const openDetailWidth = await behaviorPage.evaluate(() => document.documentElement.clientWidth);
  await behaviorPage.getByRole("button", { name: "关闭项目详情" }).click();
  await behaviorPage.waitForTimeout(520);
  const afterDetail = await behaviorPage.evaluate(() => ({
    scrollY: window.scrollY,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (openDetailWidth !== beforeDetail.clientWidth || afterDetail.clientWidth !== beforeDetail.clientWidth) {
    throw new Error(`detail width shifted: ${beforeDetail.clientWidth} -> ${openDetailWidth} -> ${afterDetail.clientWidth}`);
  }
  if (Math.abs(afterDetail.scrollY - beforeDetail.scrollY) > 2) {
    throw new Error(`detail scroll restore failed: ${beforeDetail.scrollY} -> ${afterDetail.scrollY}`);
  }

  await temuCard.click();
  await behaviorPage.waitForTimeout(520);
  await behaviorPage.goBack({ waitUntil: "domcontentloaded" });
  await behaviorPage.waitForTimeout(520);
  const afterBack = await behaviorPage.evaluate(() => ({ hash: window.location.hash, scrollY: window.scrollY }));
  if (afterBack.hash || Math.abs(afterBack.scrollY - beforeDetail.scrollY) > 2) {
    throw new Error(`browser back restore failed: hash=${afterBack.hash} scroll=${afterBack.scrollY}`);
  }
  console.log(`motion-stability: width=${beforeDetail.clientWidth}px scroll=${beforeDetail.scrollY}px restored`);

  await behaviorPage.getByRole("button", { name: "切换到深色模式" }).click();
  await behaviorPage.waitForTimeout(380);
  if (await behaviorPage.evaluate(() => document.documentElement.dataset.theme) !== "dark") {
    throw new Error("dark theme toggle failed");
  }
  await behaviorPage.reload({ waitUntil: "networkidle" });
  if (await behaviorPage.evaluate(() => document.documentElement.dataset.theme) !== "dark") {
    throw new Error("dark theme persistence failed");
  }
  await behaviorPage.getByRole("button", { name: "打开联系方式" }).click();
  const contactDialog = behaviorPage.getByRole("dialog", { name: "联系我" });
  await contactDialog.waitFor({ state: "visible" });
  const contactText = await contactDialog.innerText();
  if (!contactText.includes("KISS_WIN") || !contactText.includes("13772150131") || !contactText.includes("banqiu1230@gmail.com")) {
    throw new Error("contact details are incomplete");
  }
  for (const label of ["微信", "电话", "邮箱"]) {
    await contactDialog.getByRole("button", { name: `复制${label}` }).click();
    await behaviorPage.locator(".copy-toast.is-visible").waitFor({ state: "visible" });
    const toastText = await behaviorPage.locator(".copy-toast.is-visible").innerText();
    if (!toastText.includes("已复制到剪贴板")) throw new Error("copy toast feedback is missing");
  }
  await contactDialog.locator(".contact-modal-close").click();
  console.log("theme-contact: dark persistence, contact modal, and copy actions passed");
  await behaviorPage.close();

  const sourcePath = path.join(root, "public", "qa", "mchiu-source-desktop-top.png");
  const implementationPath = path.join(root, "public", "qa", "implementation-1440.png");
  const source = await sharp(sourcePath).resize(720, 500, { fit: "cover", position: "top" }).png().toBuffer();
  const implementation = await sharp(implementationPath).resize(720, 500, { fit: "cover", position: "top" }).png().toBuffer();
  await sharp({ create: { width: 1440, height: 500, channels: 3, background: "#efede9" } })
    .composite([{ input: source, left: 0, top: 0 }, { input: implementation, left: 720, top: 0 }])
    .png()
    .toFile(path.join(root, "public", "qa", "source-vs-implementation.png"));

  console.log(`console-errors=${errors.length}`);
  errors.forEach((error) => console.log(error));
  await browser.close();
  process.exitCode = errors.length ? 1 : 0;
})();
