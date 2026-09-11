import type { DeckDefinition, SceneProps } from "./runtime/types";
import { Diagram, Connection, Label } from "./runtime/graphics";
import { useSceneMotion, type ScenePoses } from "./runtime/motion";
import { DocumentGlyph, ClockGlyph, CheckGlyph } from "./runtime/glyphs";
const waiting: ScenePoses = {
  highlight: [{ autoAlpha: 0 }, {}],
  process: [{ autoAlpha: 1 }, { autoAlpha: 0.6 }],
};
function Queue({ step, print }: SceneProps) {
  const ref = useSceneMotion(waiting, step, print);
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="申请材料在队列中等待，再进入处理环节；下方同尺度耗时条显示等待30小时、处理6小时。"
      >
        {(arrow) => (
          <>
            <path d="M43 181H771" stroke="var(--line)" strokeWidth="2" />
            {[72, 180, 288, 396].map((x, i) => (
              <g key={x} opacity={1 - i * 0.12}>
                <DocumentGlyph x={x} y={44 + i * 5} scale={1.3} />
              </g>
            ))}
            <g color="var(--accent)">
              <ClockGlyph x={624} y={58} size={66} />
              <Label x={657} y={159} small anchor="middle">
                材料排队 / 等待补齐
              </Label>
            </g>
            <Connection d="M770 99H868" marker={arrow} />
            <g data-motion="process">
              <rect x="896" y="24" width="165" height="156" rx="16" fill="var(--surface)" />
              <DocumentGlyph x={938} y={39} scale={0.9} checked />
              <Label x={978} y={156} small anchor="middle">
                实际处理
              </Label>
            </g>
            <rect x="55" y="227" width="830" height="62" rx="3" fill="var(--accent)" />
            <rect x="885" y="227" width="166" height="62" rx="3" fill="var(--secondary)" />
            <text x="79" y="268" fill="white" fontSize="25">
              等待 30 h
            </text>
            <text x="968" y="268" fill="white" fontSize="23" textAnchor="middle">
              处理 6 h
            </text>
            <g data-motion="highlight">
              <path d="M55 304V322H885V304" fill="none" stroke="var(--accent)" strokeWidth="2" />
              <Label x={470} y={372} anchor="middle">
                83% 的时间没有推进申请
              </Label>
            </g>
            <Label x={1050} y={395} anchor="end" small>
              长度按耗时比例绘制 · 总计 36 h
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
const options: ScenePoses = { option: [{ autoAlpha: 0.2 }, {}] };
function Options({ step, print }: SceneProps) {
  const ref = useSceneMotion(options, step, print);
  return (
    <div ref={ref}>
      <Diagram label="示例对比：当前36小时，增派处理人员32小时，提前校验20小时">
        {() => (
          <>
            <Label x={235} y={31} small>
              端到端耗时（小时）
            </Label>
            {[0, 12, 24, 36].map((n) => (
              <g key={n}>
                <line x1={235 + n * 18} y1={50} x2={235 + n * 18} y2={280} stroke="var(--line)" />
                <Label x={235 + n * 18} y={325} small anchor="middle">
                  {n}
                </Label>
              </g>
            ))}
            {[
              { n: 36, y: 65, t: "当前流程", cost: "基准" },
              { n: 32, y: 140, t: "增派处理人员", cost: "成本 +20%" },
              { n: 20, y: 215, t: "提前校验材料", cost: "成本 +5%" },
            ].map((p, i) => (
              <g key={p.t} data-motion={i === 2 ? "option" : undefined}>
                <DocumentGlyph x={3} y={p.y + 3} scale={0.48} checked={i === 2} />
                <Label x={210} y={p.y + 31} anchor="end">
                  {p.t}
                </Label>
                <rect
                  x={235}
                  y={p.y}
                  width={p.n * 18}
                  height={46}
                  rx={3}
                  fill={i === 2 ? "var(--accent)" : "var(--secondary)"}
                />
                <Label x={248 + p.n * 18} y={p.y + 31}>
                  {p.n}
                </Label>
                <Label x={970} y={p.y + 31} small>
                  {p.cost}
                </Label>
              </g>
            ))}
          </>
        )}
      </Diagram>
    </div>
  );
}
function Pilot() {
  return (
    <div>
      <Diagram
        viewBox="0 0 1120 410"
        label="符合条件的申请随机分配到当前流程和提前校验流程，在两周试点中比较等待时间，并监测返工率。"
      >
        {(arrow) => (
          <>
            <DocumentGlyph x={32} y={133} scale={1.4} />
            <Label x={80} y={289} anchor="middle" small>
              符合条件的申请
            </Label>
            <Connection d="M137 191H234V96H331" marker={arrow} />
            <Connection d="M234 191V292H331" marker={arrow} />
            <Label x={243} y={197} small>
              随机分组
            </Label>
            <rect x="353" y="26" width="247" height="144" rx="14" fill="var(--surface)" />
            <DocumentGlyph x={374} y={47} scale={0.8} />
            <Label x={528} y={92} anchor="middle">
              当前流程
            </Label>
            <rect
              x="353"
              y="218"
              width="247"
              height="144"
              rx="14"
              fill="var(--surface)"
              stroke="var(--accent)"
            />
            <DocumentGlyph x={374} y={238} scale={0.8} checked />
            <Label x={528} y={284} anchor="middle">
              提前校验
            </Label>
            <path
              d="M613 96H676V292H613M676 192H719"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="2"
              markerEnd={arrow}
            />
            <g color="var(--accent)">
              <ClockGlyph x={746} y={40} size={46} />
            </g>
            <Label x={809} y={74}>
              两周后，比较结果
            </Label>
            <text x="746" y="168" fill="var(--accent)" fontSize="56" fontWeight="700">
              −30%
            </text>
            <Label x={746} y={208} small>
              等待时间目标 · 不是实测收益
            </Label>
            <path d="M746 243H1080" stroke="var(--line)" />
            <CheckGlyph x={746} y={275} size={38} />
            <Label x={805} y={303}>
              返工率不增加
            </Label>
            <Label x={746} y={349} small>
              主要收益与质量护栏同时判断
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
export const deck: DeckDefinition = {
  id: "decision",
  title: "先减少等待，再增加人手",
  subtitle: "业务决策演示 · 全部数字为虚构示例",
  theme: {
    "--paper": "#fffdf9",
    "--ink": "#173e40",
    "--muted": "#576d6b",
    "--accent": "#bd562b",
    "--secondary": "#417e80",
    "--surface": "#f0f5f1",
    "--line": "#c6d4cf",
  },
  slides: [
    {
      id: "诊断",
      title: "慢，主要慢在等待",
      subtitle: "先拆开端到端耗时，才能找到改进对象。",
      duration: 45,
      Scene: Queue,
      layout: "visual",
      beats: [
        { label: "流程耗时", takeaway: "这组数据用于演示分析方法，不代表真实业务。" },
        { label: "定位等待", takeaway: "值得先检验：减少等待能否比增加处理人手更有效？" },
      ],
      notes:
        "这是虚构的申请处理数据。平均三十六小时中，三十小时在等待，六小时是实际处理。等待占比约百分之八十三。这个分解提示一个方向，但并没有证明瓶颈的因果机制；需要进一步检查等待发生在哪个环节。",
      source: { label: "虚构数据集：演示分析方法，非公司业绩" },
    },
    {
      id: "比较",
      title: "把资源投向更大的改进空间",
      subtitle: "同口径比较耗时和投入，再决定先测试什么。",
      duration: 50,
      Scene: Options,
      beats: [
        { label: "基线与增员", takeaway: "不能只看处理速度，还要看端到端时间。" },
        { label: "加入流程方案", takeaway: "在这组假设下，优先测试提前校验材料。" },
      ],
      notes:
        "同样是示例假设，增派人员后耗时三十二小时，成本增加百分之二十；提前校验后耗时二十小时，成本增加百分之五。只有在这些假设成立时，后者才更有吸引力。因此建议首先用小规模试点验证，不能把估计直接当收益承诺。",
      source: { label: "全部选项数值为假设，成本以同一基线比较" },
    },
    {
      id: "行动",
      title: "用两周试点，换一个可靠决定",
      subtitle: "验证主要收益，也监控不能恶化的业务指标。",
      duration: 45,
      Scene: Pilot,
      layout: "visual",
      beats: [{ label: "试点与护栏", takeaway: "试点通过后再讨论扩大投入。" }],
      notes:
        "两周是计划周期。随机分配符合条件的申请，记录完整等待与处理过程。目标是等待时间降低至少百分之三十，同时返工率不增加。样本量需要根据实际波动和业务量确定；这页给决策路径，并不宣称试验已完成。",
      source: { label: "试点计划；目标值不是实测结果" },
    },
  ],
};
