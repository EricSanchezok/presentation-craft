# 实现示例索引

按当前需要的技法选择源码。先在新内容中确定对象、关系、固定参照和变化变量，再复用对应实现；方法选择见 [表达选择与迁移](../../references/visual-decisions.md)。

| 实现需求 | 源码 | 可检查的部分 |
|---|---|---|
| 外观、局部放大与信号叠加 | [anc/deck.tsx](anc/deck.tsx) | 场景尺度切换、部件分工、相关曲线的同步状态 |
| 几何、路径与滤镜联动 | [autofocus/deck.tsx](autofocus/deck.tsx) | 固定参照、几何约束、位置与图像的同步变化 |
| 过程语义与数据比较 | [decision/deck.tsx](decision/deck.tsx) | 对象图与同尺度图表的分工、比较依据与后续行动 |
| 候选范围与分步推导 | [teaching/deck.tsx](teaching/deck.tsx) | 对象、区间、判定记录与完整静态过程 |

需要运行某项示例时，使用 [catalog.json](catalog.json) 中的 id 调用 `create-deck.mjs <新目录> --example <id>`。脚本将对应 deck.tsx 放入新项目的 src，与 starter 的 runtime 配合使用；不要直接在本目录执行 TSX 文件。完整创建流程见 [HTML 实现](../../references/runtime.md)。

可以复用局部组件或状态技法，无需复制整套示例。具体对象、主题、视觉方向和页数由新任务决定；索引没有覆盖的表达形式按内容自行设计。
