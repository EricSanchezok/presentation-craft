import { chromium } from "playwright";
import { mkdir, readFile, writeFile, cp } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { serve } from "../scripts/serve.mjs";
const root = process.cwd(),
  artifacts = resolve(root, "artifacts");
await mkdir(artifacts, { recursive: true });
const { server, url } = await serve(resolve(root, "outputs"));
const browser = await chromium.launch();
const report = [];
try {
  const selected = process.argv.slice(2);
  const catalog = JSON.parse(
    await readFile(
      resolve(root, "skills/html-presentation-craft/assets/examples/catalog.json"),
      "utf8",
    ),
  );
  const names = selected.length ? selected : catalog.map((p) => p.id);
  if (names.some((n) => !catalog.some((p) => p.id === n))) throw new Error("Unknown example");
  for (const name of names) {
    const metadata = JSON.parse(
      await readFile(resolve(root, "outputs/examples", name, "deck-manifest.json"), "utf8"),
    );
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage(),
      errors = [],
      resources = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.resourceType() !== "document") resources.push(request.url());
    });
    const entry = `${url}/examples/${name}/${encodeURIComponent("演示.html")}`;
    await page.goto(entry);
    await page.waitForSelector(".live-stage .stage");
    const states = metadata.slides.flatMap((s, i) =>
      s.beats.map((_, j) => ({ slide: i + 1, step: j })),
    );
    async function state(p) {
      await page.waitForFunction((p) => {
        const s = document.querySelector(".live-stage .stage");
        return (
          s?.getAttribute("data-slide") === String(p.slide) &&
          s?.getAttribute("data-step") === String(p.step)
        );
      }, p);
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".live-stage [data-motion-settled]")].every(
          (e) => e.dataset.motionSettled === "true",
        ),
      );
    }
    async function bounds() {
      return page.evaluate(() => {
        const stage = document.querySelector(".live-stage .stage"),
          box = stage.getBoundingClientRect(),
          bad = [];
        for (const e of stage.querySelectorAll("h1,p,text")) {
          let hidden = false;
          for (let a = e; a && a !== stage; a = a.parentElement) {
            const c = getComputedStyle(a);
            if (c.visibility === "hidden" || Number(c.opacity) < 0.03) hidden = true;
          }
          if (hidden) continue;
          const b = e.getBoundingClientRect();
          if (
            b.left < box.left - 2 ||
            b.right > box.right + 2 ||
            b.top < box.top - 2 ||
            b.bottom > box.bottom + 2
          )
            bad.push(e.textContent);
        }
        return bad;
      });
    }
    for (let i = 0; i < states.length; i++) {
      await state(states[i]);
      assert.deepEqual(await bounds(), [], `${name} forward ${i}: text outside stage`);
      await page.screenshot({
        path: resolve(artifacts, `${name}-${states[i].slide}-${states[i].step}.png`),
      });
      if (i < states.length - 1) await page.keyboard.press("ArrowRight");
    }
    const preview = catalog.find((p) => p.id === name).preview;
    await page.goto(entry + `#slide=${preview.slide}&step=${preview.step}`);
    await state(preview);
    await mkdir(resolve(root, "examples/previews"), { recursive: true });
    await page
      .locator(".live-stage")
      .screenshot({ path: resolve(root, "examples/previews", `${name}.png`) });
    await mkdir(resolve(root, "outputs/previews"), { recursive: true });
    await cp(
      resolve(root, "examples/previews", `${name}.png`),
      resolve(root, "outputs/previews", `${name}.png`),
    );
    await page.goto(entry + `#slide=${states.at(-1).slide}&step=${states.at(-1).step}`);
    await page.setViewportSize({ width: 1280, height: 720 });
    for (let i = states.length - 1; i >= 0; i--) {
      await state(states[i]);
      assert.deepEqual(await bounds(), [], `${name} reverse ${i}`);
      if (i > 0) await page.keyboard.press("ArrowLeft");
    }
    // External deep link restoration and interrupted motion converge to direct-entry poses.
    const middle = states[Math.floor(states.length / 2)];
    await page.goto(entry + `#slide=${middle.slide}&step=${middle.step}`);
    await state(middle);
    const snapshot = () =>
      page.locator(".live-stage [data-motion]").evaluateAll((nodes) =>
        nodes.map((e) => ({
          name: e.dataset.motion,
          transform: getComputedStyle(e).transform,
          visibility: getComputedStyle(e).visibility,
          opacity: getComputedStyle(e).opacity,
          attributes: Object.fromEntries(
            [...e.attributes]
              .filter((a) => !["style", "transform"].includes(a.name))
              .map((a) => [a.name, a.value]),
          ),
        })),
      );
    const expected = await snapshot();
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(80);
    await page.keyboard.press("ArrowRight");
    await state(middle);
    assert.deepEqual(await snapshot(), expected, `${name} interrupted state`);
    // Every direct entry must render independently, including complete SVG target attributes.
    for (const p of states) {
      await page.goto(entry + `#slide=${p.slide}&step=${p.step}`);
      await state(p);
      assert.deepEqual(await bounds(), []);
    }
    if (name === "anc") {
      await page.goto(entry + "#slide=3&step=2");
      await state({ slide: 3, step: 2 });
      const waves = await page.evaluate(() => {
        const values = (selector) =>
          [
            ...document
              .querySelector(`.live-stage ${selector}`)
              .getAttribute("d")
              .matchAll(/[-+]?(?:\d*\.)?\d+/g),
          ].map((m) => Number(m[0]));
        return {
          noise: values('[data-series="noise"]'),
          control: values('[data-motion="controlSignal"]'),
          sum: values('[data-motion="sum"]'),
        };
      });
      for (let i = 1; i < waves.sum.length; i += 2)
        assert.ok(
          Math.abs(waves.noise[i] - 80 + (waves.control[i] - 200) - (waves.sum[i] - 320)) < 0.025,
          "plotted pressure signals must add to the displayed residual",
        );
    }
    if (name === "autofocus") {
      await page.goto(entry + "#slide=2&step=0");
      const initial = await page.locator('.live-stage [data-motion="rays"]').getAttribute("d");
      await page.keyboard.press("ArrowRight");
      await state({ slide: 2, step: 1 });
      const target = await snapshot();
      assert.notEqual(
        await page.locator('.live-stage [data-motion="rays"]').getAttribute("d"),
        initial,
      );
      assert.equal(
        await page.locator('.live-stage [data-motion="detail"]').getAttribute("stdDeviation"),
        "0",
      );
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(110);
      const transitioning = await page
        .locator('.live-stage [data-motion="detail"]')
        .getAttribute("stdDeviation");
      assert.ok(Number(transitioning) > 0 && Number(transitioning) < 4);
      await page.keyboard.press("ArrowRight");
      await state({ slide: 2, step: 1 });
      assert.deepEqual(await snapshot(), target, "interrupted rays, lens and blur converge");
    }
    await page.keyboard.press("n");
    await page.locator("dialog[open]").waitFor();
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => !!document.activeElement.closest("dialog")), true);
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .getByRole("button", { name: "讲稿 N" })
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await page.keyboard.press("o");
    await page.locator("dialog[open] .overview").waitFor();
    // A delayed native close event from the previous panel must not close the reopened one.
    await page.locator("dialog").dispatchEvent("close");
    await page.locator("dialog[open] .overview button").last().click();
    await state({ slide: metadata.slides.length, step: 0 });
    await page.getByRole("button", { name: "开始计时", exact: true }).click();
    await page.waitForTimeout(1100);
    assert.match(
      await page.getByRole("button", { name: "暂停计时", exact: true }).innerText(),
      /0:01/,
    );
    await page.getByRole("button", { name: "重置计时" }).click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(40);
    const reduced = await snapshot();
    await page.waitForTimeout(650);
    assert.deepEqual(await snapshot(), reduced, `${name} reduced motion changes after target`);
    await page.setViewportSize({ width: 705, height: 780 });
    assert.deepEqual(await bounds(), []);
    await page.screenshot({ path: resolve(artifacts, `${name}-small.png`) });
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: resolve(artifacts, `${name}.pdf`),
      preferCSSPageSize: true,
      printBackground: true,
    });
    await page.emulateMedia({ media: "screen" });
    await context.setOffline(true);
    await page.keyboard.press("End");
    await state(states.at(-1));
    await page.keyboard.press("Home");
    await state(states[0]);
    assert.deepEqual(errors, [], `${name} browser errors`);
    assert.deepEqual(resources, [], `${name} network dependencies`);
    report.push({
      name,
      slides: metadata.slides.length,
      states: states.length,
      forward1080: true,
      reverse720: true,
      directEntry: true,
      interruption: true,
      dialogFocus: true,
      timer: true,
      reducedMotion: true,
      smallViewport: true,
      pdfGenerated: true,
      offlineAfterLoad: true,
      resourceRequests: resources.length,
      fileProtocol:
        "Not exercised: this environment previously refused file navigation; no bypass used.",
    });
    await writeFile(
      resolve(root, "outputs/examples", name, "验证记录.md"),
      `# 本示例的实际验证\n\nChromium：${metadata.slides.length} 页、${states.length} 状态，1080p 正向、720p 反向、逐状态直接进入、打断恢复、减少动态效果、讲稿焦点、总览与计时检查通过。705px 窗口无文字越界。生成打印 PDF；视觉评审的详细记录见仓库 docs/verification.md。\n\nHTTP 加载后无附加资源请求，载入后断网导航通过。未执行文件协议直接打开验证；未验证 Safari、Firefox、Windows 或现场投影。系统字体可能产生跨平台差异。\n`,
    );
    await context.close();
  }
  await writeFile(
    resolve(
      artifacts,
      selected.length ? `browser-report-${selected.join("-")}.json` : "browser-report.json",
    ),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
