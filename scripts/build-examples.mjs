import { cp, mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createDeck } from "../skills/html-presentation-craft/scripts/create-deck.mjs";
const root = fileURLToPath(new URL("../", import.meta.url));
const catalog = JSON.parse(
  await readFile(
    resolve(root, "skills/html-presentation-craft/assets/examples/catalog.json"),
    "utf8",
  ),
);
for (const { id: name } of catalog) {
  const output = resolve(root, "outputs/examples", name);
  await mkdir(output, { recursive: true });
  const source = resolve(output, "source");
  // This exact directory contains generated example builds only.
  await rm(source, { recursive: true, force: true });
  await createDeck(source, name);
  for (const args of [
    ["ci", "--ignore-scripts", "--no-audit", "--no-fund"],
    ["run", "build"],
  ]) {
    const result = spawnSync("npm", args, { cwd: source, stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status || 1);
  }
  for (const file of [
    "演示.html",
    "讲稿.md",
    "开始使用.md",
    "素材来源.md",
    "验证记录.md",
    "asset-report.json",
    "deck-manifest.json",
    "THIRD_PARTY.md",
    "licenses",
  ])
    await cp(resolve(source, "dist", file), resolve(output, file), { recursive: true });
}
await mkdir(resolve(root, "outputs/previews"), { recursive: true });
for (const { id } of catalog) {
  try {
    await cp(
      resolve(root, "examples/previews", `${id}.png`),
      resolve(root, "outputs/previews", `${id}.png`),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
await writeFile(
  resolve(root, "outputs/index.html"),
  `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Presentation Craft · 示例画廊</title><style>
*{box-sizing:border-box}body{font:17px/1.65 system-ui;margin:0;color:#253d43;background:#f5f5ef}main{max-width:1230px;margin:6vh auto;padding:28px}header{padding:0 0 34px;border-bottom:1px solid #cbd1c9;margin-bottom:34px}.eyebrow{letter-spacing:.18em;font-size:12px;color:#536f6c}h1{font-size:clamp(36px,5vw,64px);letter-spacing:-.035em;margin:12px 0}header p{max-width:720px;color:#5a706e}section{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px}a{display:block;text-decoration:none;color:inherit;border:1px solid #d7dcd3;border-radius:12px;overflow:hidden;background:#fff}a:focus-visible{outline:3px solid #176d78;outline-offset:5px}img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#e7ece8}article{padding:20px 25px 24px}h2{font-size:25px;margin:7px 0}article p{color:#5a706e;font-size:15px;margin:8px 0 0}small{letter-spacing:.07em}footer{margin-top:30px;color:#607570;font-size:14px}@media(max-width:740px){section{grid-template-columns:1fr}main{padding:22px}}
</style><main><header><div class="eyebrow">HTML PRESENTATION CRAFT</div><h1>把想法讲清楚，也画清楚。</h1><p>四个独立主题，四种视觉解释。看对象怎样变成场景，再看场景怎样支持讲述。</p></header><section>${catalog.map((p) => `<a href="examples/${p.id}/演示.html"><img src="previews/${p.id}.png" alt="${p.title}的示例画面"><article><small style="color:${p.color}">${p.genre}</small><h2>${p.title}</h2><p>${p.description}</p></article></a>`).join("")}</section><footer>方向键逐步播放 · N 查看讲稿 · O 总览 · F 全屏 · P 隐藏控件。示例包含独立来源说明与静态打印构图。</footer></main></html>`,
);
