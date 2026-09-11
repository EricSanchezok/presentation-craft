import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";
import { createDeck } from "../skills/html-presentation-craft/scripts/create-deck.mjs";
import { serve } from "../scripts/serve.mjs";
const root = await mkdtemp(join(tmpdir(), "craft-assets-"));
let browser, server;
try {
  const project = await createDeck(join(root, "deck"));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">${'<rect width="32" height="32" fill="#17669b"/>'.repeat(160)}</svg>`;
  await writeFile(join(project, "src/probe.svg"), svg);
  await writeFile(
    join(project, "src/probe.css"),
    '.probe{background-image:url("./probe.svg");width:32px;height:32px}',
  );
  const main = join(project, "src/main.tsx");
  await writeFile(
    main,
    (await readFile(main, "utf8")) +
      '\nimport picture from "./probe.svg";\nimport "./probe.css";\nconst probe = document.createElement("img");probe.className="probe";probe.src=picture;document.body.append(probe);\n',
  );
  for (const args of [
    ["ci", "--ignore-scripts", "--no-audit", "--no-fund"],
    ["run", "build"],
  ]) {
    const result = spawnSync("npm", args, { cwd: project, encoding: "utf8" });
    assert.equal(result.status, 0, result.stdout + "\n" + result.stderr);
  }
  const live = await serve(join(project, "dist"));
  server = live.server;
  browser = await chromium.launch();
  const page = await browser.newPage();
  const requests = [];
  page.on("request", (r) => {
    if (r.resourceType() !== "document") requests.push(r.url());
  });
  await page.goto(live.url + "/" + encodeURIComponent("演示.html"));
  await page.waitForFunction(() => document.querySelector("img.probe")?.naturalWidth === 32);
  assert.equal(
    await page.locator("img.probe").evaluate((e) => e.src.startsWith("data:image/svg+xml")),
    true,
  );
  assert.equal(
    await page
      .locator("img.probe")
      .evaluate((e) => getComputedStyle(e).backgroundImage.includes("data:image/svg+xml")),
    true,
  );
  assert.deepEqual(requests, []);
  console.log(
    "Imported SVG and CSS image (>4 KB) render in the real bundled HTML without resource requests.",
  );
} finally {
  await browser?.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(root, { recursive: true, force: true });
}
