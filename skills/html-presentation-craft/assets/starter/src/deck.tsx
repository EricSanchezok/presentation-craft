import type { DeckDefinition, SceneProps } from "./runtime/types";
import { Diagram, Connection, Label } from "./runtime/graphics";
import { DocumentGlyph, CheckGlyph } from "./runtime/glyphs";
import { useSceneMotion, type ScenePoses } from "./runtime/motion";
const poses: ScenePoses = {
  document: [{}, { x: 300 }, { x: 620 }],
  check: [{ autoAlpha: 0 }, {}, {}],
  complete: [{ autoAlpha: 0.18 }, { autoAlpha: 0.18 }, {}],
};
function Workflow({ step, print }: SceneProps) {
  const ref = useSceneMotion(poses, step, print);
  return (
    <div ref={ref}>
      <Diagram label="一份申请从提交到材料校验，再进入完成状态；打印同时保留三阶段的对象。">
        {(arrow) => (
          <>
            {[
              { x: 85, label: "提交申请" },
              { x: 385, label: "校验材料" },
              { x: 705, label: "确认完成" },
            ].map((p) => (
              <g key={p.x}>
                <rect
                  x={p.x}
                  y="40"
                  width="235"
                  height="226"
                  rx="15"
                  fill="var(--surface)"
                  stroke="var(--line)"
                />
                <Label x={p.x + 118} y={309} anchor="middle">
                  {p.label}
                </Label>
              </g>
            ))}
            <Connection d="M330 154H372" marker={arrow} />
            <Connection d="M630 154H692" marker={arrow} />
            {print && (
              <>
                <DocumentGlyph x={165} y={85} scale={1.3} />
                <DocumentGlyph x={465} y={85} scale={1.3} checked />
              </>
            )}
            <g data-motion="document">
              <DocumentGlyph x={165} y={85} scale={1.3} />
            </g>
            <g data-motion="check">
              <path
                d="M540 215h-68m0 0 8-8m-8 8 8 8"
                stroke="var(--secondary)"
                fill="none"
                strokeWidth="3"
              />
            </g>
            <g data-motion="complete">
              <CheckGlyph x={873} y={198} size={39} />
            </g>
          </>
        )}
      </Diagram>
    </div>
  );
}
export const deck: DeckDefinition = {
  id: "workflow",
  title: "让材料在提交时就准备好",
  subtitle: "原创流程示例 · 替换为你的主题与证据",
  slides: [
    {
      id: "流程",
      title: "把校验放进流程，而不是留到最后",
      subtitle: "用同一份申请的状态变化，说明三个环节怎样协作。",
      Scene: Workflow,
      duration: 60,
      beats: [
        { label: "提交", takeaway: "先识别对象与状态，再决定页面上需要哪些图形。" },
        { label: "校验", takeaway: "在当前环节完成检查，让下一步有明确的输入。" },
        { label: "完成", takeaway: "对象、路径与状态标记共同解释过程。" },
      ],
      notes:
        "这是流程表达的起点，不是通用叙事模板。申请文档提供识别线索；位置和状态共同解释变化。打印同时保留三个阶段。请根据材料重写主张、步骤与示意图，并补齐真实证据。",
      source: { label: "原创流程示意，无实测数据" },
    },
  ],
};
