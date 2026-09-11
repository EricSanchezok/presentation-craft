# 可运行的场景示例

这是随 skill 分发的原始源码。每个 `deck.tsx` 会被复制到新项目的 `src/`，使用 starter 的 `runtime/`；不要直接在本目录运行这些 TSX 文件。[catalog.json](catalog.json) 是示例身份、标题与预览状态的唯一目录。

| 示例 | 源码 | 学习重点 |
|---|---|---|
| ANC 耳机 | [anc/deck.tsx](anc/deck.tsx) | 实物外观、剖面、声压叠加、理想与实际边界 |
| 相机自动对焦 | [autofocus/deck.tsx](autofocus/deck.tsx) | 光路、镜片、焦点、模糊滤镜的同步状态 |
| 业务决策 | [decision/deck.tsx](decision/deck.tsx) | 对象流程与同尺度图表、试点与指标 |
| 二分教学 | [teaching/deck.tsx](teaching/deck.tsx) | 候选卡片、区间、分支与静态完整过程 |

在 skill 根目录运行：

```sh
node scripts/create-deck.mjs /absolute/new-demo --example anc
cd /absolute/new-demo
npm ci
npm run dev
npm run build
```

把 `anc` 换成目录中的其他 id 即可。创建目标必须不存在。没有 `--example` 时使用中性的申请流程示例。四套源码包含各自讲稿、步骤与来源，复制安装 skill 后不需要另一个仓库。

## 如何借鉴

先阅读 [视觉设计案例](../../references/visual-decisions.md)，再看对应源码。耳机与相机的主题部件属于场景，不必加入通用图标库。保留数据定义和完整状态的契约，为新内容重新构图；不要仅替换名词就把声学剖面用于其他机制。
