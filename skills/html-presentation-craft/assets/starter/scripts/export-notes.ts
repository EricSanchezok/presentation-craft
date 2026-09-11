import { mkdir, writeFile } from "node:fs/promises";
import { deck } from "../src/deck";
await mkdir("delivery", { recursive: true });
const text =
  `# ${deck.title}\n\n${deck.subtitle}\n\n` +
  deck.slides
    .map(
      (s, i) =>
        `## ${i + 1}. ${s.title}（${s.duration} 秒）\n\n${s.notes}\n\n播放步骤：${s.beats.map((b) => b.label).join(" → ")}\n\n${s.source ? `来源：${s.source.url ? `[${s.source.label}](${s.source.url})` : s.source.label}\n` : ""}`,
    )
    .join("\n");
await writeFile("delivery/讲稿.md", text);
await writeFile(
  "delivery/deck-manifest.json",
  JSON.stringify({ title: deck.title, slides: deck.slides.map(({ Scene, ...s }) => s) }, null, 2),
);
await writeFile(
  "delivery/开始使用.md",
  `# ${deck.title}\n\n解压后双击同目录的 **演示.html**。无需安装 Node。\n\n- 方向键／空格：逐步播放；Home／End：首尾。\n- O：总览；N：讲稿；F：全屏；P：显示或隐藏控件。\n- 屏幕下方可计时、归零、打印。\n- 浏览器若拒绝全屏，使用浏览器自己的全屏命令。\n\n具体已验证环境与限制见随包验证记录。\n`,
);

await writeFile(
  "delivery/验证记录.md",
  `# 验证状态\n\n本文件由构建生成，不代表人工视觉评审。类型检查、lint 与资源结构检查在构建成功后成立；详细结构结果见 asset-report.json。\n\n浏览器播放、关键动画、字体、实际打印和离线打开需要针对当前交付文件检查。完成后用实际结果更新此文件，并注明环境与限制。\n`,
);
