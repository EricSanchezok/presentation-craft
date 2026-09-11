# HTML 实现

仅在创建项目、调整底座或处理交付时读取。使用现有项目时保留有效结构；使用本底座时遵循下列接口。设计方法不要求所有演示使用相同组件或构图。

## 创建项目

Node 版本与依赖以 [package.json](../assets/starter/package.json) 为准。从已解析的 skill 路径创建一个不存在的项目目录：

```sh
node /path/to/html-presentation-craft/scripts/create-deck.mjs /path/to/new-project
cd /path/to/new-project
npm ci
npm run dev
```

脚本复制独立 starter 和 lockfile，拒绝覆盖已有目标。需要借鉴已实现的行为时，可加 `--example <id>`；id 与源码见 [示例索引](../assets/examples/README.md)。

## 内容与构图接口

以 [类型定义](../assets/starter/src/runtime/types.ts) 为接口来源，在 `src/deck.tsx` 中维护同一份页面、讲稿、来源、时长与步骤数据。每页 id 唯一，beats 至少一项且从 0 开始；不另外维护页数或最大步骤数组。

Scene 接收 step 和 print，按内容组织 SVG／DOM。打印默认使用最后一步；需要保留其他信息时指定 printStep 或实现独立静态构图。

通过 theme 的 paper、ink、muted、accent、secondary、surface、line 与 font-display 变量设置视觉语言。底座默认 16:9 等比舞台，Diagram 默认 viewBox 为 1120×370，可显式替换；layout 可选 standard 或 visual，后者扩大主视觉区域。需要其他构图或画幅时调整对应布局和静态版，不把页面内容硬塞进默认区域。

[图形组件](../assets/starter/src/runtime/graphics.tsx) 提供标注、连接、分组面板和坐标轴；[glyphs](../assets/starter/src/runtime/glyphs.tsx) 提供小型语义符号。具体图表、对象、界面、公式及其组合由 Scene 实现。

## 动画接口

将 `useSceneMotion(poses, step, print)` 返回的 ref 绑定到场景根节点。poses 以 data-motion 名称为键，每个目标至少一个状态；目标名需在场景内存在，可对应一组元素。状态表保持稳定，避免计时或无关渲染重启动画。

Pose 支持 x、y、scale、rotation、autoAlpha、时间线起点 at 和 SVG 属性 attr。CSS 变换与透明度的缺省值恢复原位、原比例与可见；超出目标状态数量时延续最后状态。每步中断旧时间线，首次进入、减少动态效果或打印直接设置完整目标；卸载时清理 GSAP context。固定坐标放在子层，动画变换放在外层，避免互相覆盖。

### SVG 属性状态

使用 attr 改变路径 d、几何或滤镜属性。同一目标的各状态必须包含相同属性键；纯属性目标不施加 CSS 变换。例如：

```ts
const poses = {
  detail: [{ attr: { stdDeviation: 4 } }, { attr: { stdDeviation: 0 } }],
  marker: [{ x: 0 }, { x: 60 }],
};
```

路径插值要求相同命令结构；拓扑不同时先转换为一致结构或采用替换过渡，该接口不提供任意路径变形算法。使用 React useId 为 SVG defs 生成独立 id，避免播放与打印副本冲突。根节点 data-motion-settled 达到 true 时表示本步完成，可用于自动化等待。

## 播放接口

深链接使用 `#slide=1&step=0`，页码从 1 开始、步骤从 0 开始。非法数值会归一到有效范围，外部 hash 变化同步到播放器。

方向键、PageUp／PageDown 逐步进退，空格前进；Home／End 到首尾，O 总览，N 讲稿，F 全屏，P 隐藏或恢复控件。计时手动开始，可暂停和归零。模态对话框管理键盘焦点，关闭后恢复触发按钮；浏览器拒绝全屏时回退到隐藏控件。

## 素材与离线构建

通过 ES import 引入图片，通过 CSS 相对 url 引入字体，使用 Vite 的导入图内嵌资源。默认系统字体无网络请求，但不保证跨操作系统字形一致；需要固定字体时提供有使用许可且覆盖最终文案的资源。

执行 `npm run build`：类型与 lint 检查 → 从同一 deck 导出讲稿与元数据 → Vite 构建 → 封装为 `dist/演示.html`。同目录包含使用说明、来源、许可和验证状态；接收者不需要 Node。`ASSETS.md` 维护项目素材说明，随构建复制。

单文件构建不支持依赖 public 绝对路径、外部样式、运行时资源请求或拆分模块；打包器拒绝直接 srcset、iframe、object 和 CSS @import。需要视频或在线演示时另选符合交付要求的封装方式。正常来源链接可保留。

构建检查资源引用，不能静态证明任意脚本不会联网。按 [质量与交付](quality-delivery.md) 检查实际文件和行为；不把构建生成的验证说明直接当成运行验收结果。
