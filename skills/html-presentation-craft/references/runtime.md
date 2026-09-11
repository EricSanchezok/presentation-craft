# HTML 实现（参考）

## 创建与本地运行

从 skill 目录运行 `node scripts/create-deck.mjs /absolute/new-project`，进入新目录后执行 `npm ci`、`npm run dev`。目标必须不存在；已有项目沿用其结构。Node 版本要求见 starter 的 package.json。依赖固定并带独立 lockfile，不需要任何外部项目或服务端。

## 内容契约

[类型定义](../assets/starter/src/runtime/types.ts) 是唯一接口来源。DeckDefinition 含 title、subtitle、theme 与 slides；SlideDefinition 含唯一 id、标题、可选副标题、讲稿、秒数、beats、Scene、可选 printStep、layout 与来源。beats 至少一项，第一步为索引 0。示例源码在 [deck.tsx](../assets/starter/src/deck.tsx)。

在同一份数据中修改标题、步骤和讲稿；不要另外维护页数、最大步骤或演讲时长数组。Scene 接收 step 和 print，可据此组织定制 SVG／DOM。打印默认选择最后一步，若该步缺少重要前提，指定 printStep 或在 print 模式绘制完整构图。

## 构图与主题

通过 theme 中的 CSS 变量定义 paper、ink、muted、accent、secondary、surface、line 以及 font-display。默认舞台 16:9，几何按舞台缩放。Diagram 默认使用 1120×370 的 SVG，可传入 viewBox；SlideDefinition 的 layout 可选 standard 或 visual，后者扩大主视觉区域。可以替换场景布局，不必把所有页面放入三列。图形基础组件负责标注、连接、面板与坐标轴；glyphs 提供实际使用的小型文件、时钟和完成符号。主题剖面保留在对应场景中，实际机制由内容决定。

## 动画契约

useSceneMotion 接收以 data-motion 名称为键的状态表。每个目标有一组 Pose，支持 x、y、scale、rotation、autoAlpha 、时间线起点 at 和 SVG 属性 attr；缺省值恢复为未位移、原比例、完全可见。超过某目标的状态数量时延续最后状态；至少一项。相同名称可选择一组关联对象。状态表保持稳定，通常在组件外定义，避免计时或无关渲染重启动画。

返回 ref 绑定到场景根节点。目标存在性在运行时检查；每步中断旧时间线，首次进入／减少动态效果／打印直接设置完整目标。SVG 对象的固定坐标放在子层，动画变换放在外层，以免互相覆盖。作用域清理使用 GSAP context，不依赖全局选择器。

## 播放接口

URL 使用 `#slide=1&step=0`，页码从 1、步骤从 0 开始。非法数值归一到有效范围，外部 hash 变化也会同步。方向键与 PageUp／PageDown 逐步进退，空格前进；Home／End 到首尾，O 总览，N 讲稿，F 全屏，P 隐藏／恢复控件。计时需手动开始，可暂停与归零。

使用浏览器原生 dialog 和边界 Tab 循环管理模态焦点；打开讲稿时导航不继续翻页，关闭后恢复触发按钮。全屏遭浏览器拒绝时隐藏控件并说明回退方式。

## 素材与构建

用 ES import 引入图片，字体用 CSS 相对 url，引入的资源由 Vite 内嵌。不要依赖 public 绝对路径、运行时 fetch、远程 iframe 或拆分模块。来源链接允许使用正常 URL。默认系统字体栈不产生网络请求，但不保证各操作系统字形一致；固定排版需要合法自托管字体，并在改稿后检查字符覆盖。

`npm run build` 先检查类型与 lint，从同一 deck 生成讲稿与元数据，再构建并封装为 `dist/演示.html`。同目录包含讲稿、使用说明、素材来源和结构检查记录。`scripts/bundle.mjs` 使用 HTML 与 CSS 解析器检查资源；它不能静态证明任意 JavaScript 不发网络请求，因此仍须做实际播放检查。

支持的离线资源通过 Vite 的导入图处理；直接 srcset、iframe、object 和 CSS @import 会被拒绝，以免默默生成有缺失的包。大量视频／在线 demo 的交付方式应单独约定。

## 验证

starter 的 `npm run check` 检查 TypeScript 和源码 lint；`npm run build` 检查打包。行为与视觉按 [交付检查](quality-delivery.md) 执行，仓库的自动浏览器测试是维护底座的工具，使用 skill 时不要求某个特定浏览器插件。


## SVG 属性状态

`attr` 可以改变路径 `d`、几何属性以及滤镜的 `stdDeviation`。同一目标所有状态必须包含相同的属性键，缺失会报错。纯属性目标不施加 CSS 变换，避免给滤镜节点添加无效 transform。示例：

```ts
const poses = {
  detail: [{ attr: { stdDeviation: 4 } }, { attr: { stdDeviation: 0 } }],
  lens: [{ x: 0 }, { x: 60 }],
};
```

路径数值插值要求两端具有相同的命令结构；不同拓扑先重新采样为同结构，或选择淡入切换。该接口不提供任意路径变形算法。滤镜和复杂路径有绘制成本，只在机制需要时使用。场景根节点的 `data-motion-settled` 在达到目标时为 true，可用于自动化等待。SVG defs 的 id 用 React useId 生成，避免屏幕、打印副本冲突。

完整案例可用 `create-deck.mjs <新目录> --example <id>` 创建；目录见 [随包示例](../assets/examples/README.md)。
