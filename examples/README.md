# 示例与评审任务

可运行源码全部位于 [skill 的示例目录](../skills/html-presentation-craft/assets/examples/README.md)。这里保存独立简报与生成的预览，用于评审表达是否迁移到不同题材。

| 任务 | 简报 | 评审重点 |
|---|---|---|
| 主动降噪耳机 | [科学解释](anc/brief.md) | 实物到剖面再到波形，理想与实际边界 |
| 相机自动对焦 | [技术机制](autofocus/brief.md) | 光学参照稳定，几何与图像联动 |
| 申请处理决策 | [业务汇报](decision/brief.md) | 过程对象、可比尺度、明确行动 |
| 二分思想 | [互动教学](teaching/brief.md) | 候选空间、预测停顿、完整推导 |

`npm run examples` 创建独立项目并构建；`npm run preview` 启动本地画廊。`npm run test:browser` 按 catalog 的预览状态更新本目录图片，并生成逐状态截图与打印 PDF。截图只能用于检查，不能单独证明视觉质量。

每个交付目录只有一个播放入口 `演示.html`，另有 `讲稿.md`、`开始使用.md`、`素材来源.md` 与许可说明。源码不在接收者压缩包中重复保存，它已完整包含在 skill 压缩包内。
