---
name: html-presentation-craft
description: Create, revise, critique, and package HTML presentations with audience-led narrative, explanatory diagrams, coordinated animation, and offline playback. Use for HTML slides and talks; ordinary websites and editable PPTX use other workflows.
---

# HTML Presentation Craft

把材料变成观众能够跟随的演示：先确定理解与判断，再把它落实到内容、图形和播放节奏。支持学术、商业、教学、产品介绍、汇报；不固定页数、故事结构或美术风格。

## 进入任务

先阅读已有材料、演示源码、品牌参考和用户反馈。确认受众、用途（现场讲述／独立阅读／教学互动）、时长、主要观点、交付方式与已锁定部分；能从材料确定的信息不重复询问。方向性缺失才提问，普通取舍自主完成。

- **新制作**：简报 → 叙事 → 分镜 → 视觉方向 → 场景实现 → 排练与验收。
- **改稿或精修**：先诊断内容、视觉或行为中的实际问题，保留已经有效及用户锁定的部分。只运行相关环节。
- **评审**：给出可见证据、对理解的影响、修正优先级，不擅自实施修改。
- **打包**：复核最终版本与入口，按 [交付检查](references/quality-delivery.md) 验证。

无需为每个内部阶段索取确认；按用户授权继续。中间产物随任务规模简化，小幅改动不要求完整策划文档。

## 内容到画面的工作契约

每页在分镜中明确：表达任务、观众带走的判断、主要视觉及其含义、每一步新增的理解、讲稿与时长、必要出处。分镜是设计依据，不是要求展示在幻灯片上的字段清单。

1. 先让叙事能够口头讲通。适用时用结论式标题，让图解释依据，把细节放进讲稿；开场、练习和悬念页可以使用问题或邀请。
2. 先识别对象与结构，再根据要表达的关系选图。每个节点、连线、位置、颜色和尺度应有含义；文字加箭头并不自动成为机制图；用可辨认的轮廓、相关内部结构与状态线索构成场景。
3. 设计一套契合场合的视觉约束，在不同页面保持字体、间距和语义颜色一致，同时为不同任务采用不同构图。
4. 动画以完整信息状态为单位。对象、标签、连线和周边强调一起变化；每个停留点都能独立讲述，直接跳入也成立。
5. 准确表达作者的判断和野心。事实、推断、假设、目标保持可辨，不能用自信的语气替代证据，也不把研究计划写成已完成成果。
6. 以实际画面验收。溢出检查、构建成功和截图数量都不证明演示清楚；同时检查阅读路径、关系准确性与现场节奏。

## 按需参考

| 遇到的工作 | 阅读 |
|---|---|
| 整理材料、选故事结构、改讲稿 | [任务与叙事](references/narrative.md) |
| 图示、曲线、照片或文生图选择 | [视觉解释](references/visual-explanation.md) |
| 风格、布局、字体、中英文换行 | [构图与排版](references/composition.md) |
| 分步动画、回退和静态版本 | [动作与状态](references/motion.md) |
| 新建项目、组件、素材与脚本 | [HTML 实现](references/runtime.md) |
| 排练、审查、离线与压缩包 | [质量与交付](references/quality-delivery.md) |
| 具体取舍和失败模式 | [视觉设计案例](references/visual-decisions.md) |

不默认读取全部参考，不依赖其他设计 skill。工具缺失时保留设计契约，用当前可用方式完成；无法验证的项目写明限制。

## 创建 HTML 项目

已有项目优先沿用。新项目使用此 skill 内的 [starter](assets/starter/)，其中含独立依赖清单、运行脚本和一个中性流程场景。另有 [四套完整示例](assets/examples/README.md) 随 skill 一起安装，可用 `--example anc` 等选项创建：

```sh
node /path/to/html-presentation-craft/scripts/create-deck.mjs /absolute/output/project
cd /absolute/output/project
npm ci
npm run dev
```

`create-deck` 要求目标不存在，避免覆盖已有作品。修改 `src/deck.tsx` 和主题；先阅读 [运行接口](references/runtime.md)。构建得到 `dist/演示.html`，最终接收者无需 Node 或开发服务器。

## 完成交付

交付最终 HTML、讲稿、素材来源、使用说明及验证记录；用户要求时打包源码。压缩包只有一个明确的演示入口，避免把旧版和新版混在一起。报告完成的验证和实际限制，不把未运行的浏览器／打印／离线检查记为通过。发布站点和安装到全局技能目录按用户要求执行，不由制作演示自动触发。
