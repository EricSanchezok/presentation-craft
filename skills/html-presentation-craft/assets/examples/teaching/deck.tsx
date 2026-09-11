import type { DeckDefinition, SceneProps } from "./runtime/types";
import { Diagram, Connection, Label } from "./runtime/graphics";
import { useSceneMotion, type ScenePoses } from "./runtime/motion";
const remaining = [
  [1, 16],
  [9, 16],
  [9, 12],
  [11, 12],
  [11, 11],
];
const numberPoses: ScenePoses = Object.fromEntries(
  Array.from({ length: 16 }, (_, i) => [
    `n${i + 1}`,
    remaining.map(([a, b]) => ({
      autoAlpha: i + 1 >= a && i + 1 <= b ? 1 : 0.14,
      y: i + 1 >= a && i + 1 <= b ? 0 : 14,
    })),
  ]),
);
const bracket = (a: number, b: number) =>
  `M${35 + (a - 1) * 65} 210V229H${35 + (b - 1) * 65 + 55}V210`;
const searchPoses: ScenePoses = {
  ...numberPoses,
  interval: remaining.map(([a, b]) => ({ attr: { d: bracket(a, b) } })),
  pointer: [8, 8, 12, 10, 11].map((n) => ({ x: (n - 8) * 65 })),
};
function Numbers({ step, print }: SceneProps) {
  const ref = useSceneMotion(searchPoses, step, print);
  const prompts = [
    "从 1 到 16，秘密数字是哪一个？",
    "大于 8 吗？是。",
    "大于 12 吗？不是。",
    "大于 10 吗？是。",
    "大于 11 吗？不是。",
  ];
  return (
    <div ref={ref}>
      <Diagram viewBox="0 0 1120 410" label={`通过阈值问题逐次缩小有序候选区间。${prompts[step]}`}>
        {() => (
          <>
            <Label x={35} y={39}>
              {print ? "四次判定，定位秘密数字 11" : prompts[step]}
            </Label>
            <g data-motion="pointer">
              <path
                d="M540 65v28m-6-7 6 7 6-7"
                stroke="var(--secondary)"
                strokeWidth="3"
                fill="none"
              />
            </g>
            {Array.from({ length: 16 }, (_, i) => (
              <g key={i} data-motion={`n${i + 1}`}>
                <rect x={35 + i * 65} y="111" width="55" height="77" rx="8" fill="var(--accent)" />
                <path
                  d={`M${44 + i * 65} 121H${80 + i * 65}`}
                  stroke="white"
                  opacity=".25"
                  strokeWidth="2"
                />
                <text x={62.5 + i * 65} y="159" fill="white" fontSize="25" textAnchor="middle">
                  {i + 1}
                </text>
              </g>
            ))}
            <path
              data-motion="interval"
              d={bracket(1, 16)}
              stroke="var(--accent)"
              fill="none"
              strokeWidth="2.5"
            />
            <Label x={35} y={285}>
              剩余 {remaining[step][1] - remaining[step][0] + 1} 个候选
            </Label>
            <Label x={1071} y={285} anchor="end" small>
              已完成 {step} 次阈值判定
            </Label>
            {["1–16", "9–16", "9–12", "11–12", "11"].map((label, i) => (
              <g key={label} opacity={print || i <= step ? 1 : 0.22}>
                <rect
                  x={35 + i * 222}
                  y="335"
                  width="139"
                  height="41"
                  rx="20"
                  fill="var(--surface)"
                  stroke="var(--line)"
                />
                <text x={104 + i * 222} y="363" textAnchor="middle" fontSize="21" fill="var(--ink)">
                  {label}
                </text>
                {i < 4 && (
                  <>
                    <path
                      d={`M${179 + i * 222} 355H${250 + i * 222}`}
                      stroke="var(--accent)"
                      strokeWidth="2"
                    />
                    <text
                      x={215 + i * 222}
                      y="331"
                      fontSize="16"
                      textAnchor="middle"
                      fill="var(--muted)"
                    >
                      {[">8 是", ">12 否", ">10 是", ">11 否"][i]}
                    </text>
                  </>
                )}
              </g>
            ))}
          </>
        )}
      </Diagram>
    </div>
  );
}
function Split() {
  return (
    <div>
      <Diagram
        viewBox="0 0 1120 410"
        label="二分搜索树：在中间值处分割，两个互斥分支覆盖所有候选；高亮秘密数字11的完整路径。"
      >
        {(arrow) => (
          <>
            <Label x={28} y={38}>
              每一次分支，都对应一个是非问题
            </Label>
            <rect x="460" y="63" width="200" height="54" rx="9" fill="var(--accent)" />
            <text x="560" y="99" fill="white" fontSize="26" textAnchor="middle">
              1 — 16
            </text>
            <Connection d="M520 125L286 188" marker={arrow} />
            <Connection d="M600 125L833 188" marker={arrow} accent />
            <Label x={375} y={138} small anchor="middle">
              ≤ 8
            </Label>
            <Label x={743} y={138} small anchor="middle">
              {"> 8"}
            </Label>
            {[
              { x: 166, n: "1 — 8", active: false },
              { x: 754, n: "9 — 16", active: true },
            ].map((p) => (
              <g key={p.n}>
                <rect
                  x={p.x}
                  y="202"
                  width="200"
                  height="54"
                  rx="9"
                  fill={p.active ? "var(--accent)" : "var(--surface)"}
                  stroke="var(--line)"
                />
                <text
                  x={p.x + 100}
                  y="238"
                  textAnchor="middle"
                  fill={p.active ? "white" : "var(--muted)"}
                  fontSize="25"
                >
                  {p.n}
                </text>
              </g>
            ))}
            <path d="M204 267L132 315M320 267L391 315" stroke="var(--line)" strokeWidth="2" />
            <path d="M800 267L716 315" stroke="var(--accent)" strokeWidth="2.5" />
            <path d="M908 267L989 315" stroke="var(--line)" strokeWidth="2" />
            {["1–4", "5–8", "9–12", "13–16"].map((n, i) => (
              <g key={n}>
                <rect
                  x={[65, 328, 652, 926][i]}
                  y="323"
                  width="126"
                  height="49"
                  rx="7"
                  fill={i === 2 ? "var(--accent)" : "var(--surface)"}
                />
                <text
                  x={[128, 391, 715, 989][i]}
                  y="355"
                  textAnchor="middle"
                  fontSize="23"
                  fill={i === 2 ? "white" : "var(--muted)"}
                >
                  {n}
                </text>
              </g>
            ))}
            <Label x={708} y={290} anchor="middle" small>
              ≤ 12
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
const general: ScenePoses = { answer: [{ autoAlpha: 0 }, {}] };
function Transfer({ step, print }: SceneProps) {
  const ref = useSceneMotion(general, step, print);
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="候选点阵从16到32再到64；候选范围每翻倍，只需增加一层二分判定。"
      >
        {() => (
          <>
            {[16, 32, 64].map((n, j) => (
              <g key={n} transform={`translate(${35 + j * 375} 0)`}>
                <Label x={140} y={31} anchor="middle">
                  {n} 个候选
                </Label>
                {Array.from({ length: n }, (_, i) => (
                  <rect
                    key={i}
                    x={32 + (i % 8) * 28}
                    y={61 + Math.floor(i / 8) * 20}
                    width="17"
                    height="12"
                    rx="3"
                    fill="var(--accent)"
                    opacity={0.58 + Math.floor(i / 8) * 0.05}
                  />
                ))}
                <g data-motion="answer">
                  <path
                    d={Array.from(
                      { length: 4 + j },
                      (_, i) => `${i ? "L" : "M"}${52 + i * 31} ${244 + i * 17}h22`,
                    ).join(" ")}
                    stroke="var(--secondary)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <Label x={140} y={397} anchor="middle">
                    {4 + j} 次阈值判定
                  </Label>
                </g>
              </g>
            ))}
            <path d="M344 72v277M718 72v277" stroke="var(--line)" />
            <text x="344" y="55" textAnchor="middle" fill="var(--secondary)" fontSize="20">
              ×2
            </text>
            <text x="718" y="55" textAnchor="middle" fill="var(--secondary)" fontSize="20">
              ×2
            </text>
          </>
        )}
      </Diagram>
    </div>
  );
}
export const deck: DeckDefinition = {
  id: "teaching",
  title: "问对一个问题，就少一半可能",
  subtitle: "二分思想 · 互动教学",
  theme: {
    "--paper": "#fbf8ff",
    "--ink": "#3d3155",
    "--muted": "#6b607d",
    "--accent": "#7650aa",
    "--secondary": "#bf7e2e",
    "--surface": "#f2ecf9",
    "--line": "#d8cbe8",
  },
  slides: [
    {
      id: "试一试",
      title: "16 个数字，4 个问题",
      subtitle: "只回答“是”或“不是”，找到藏起来的数字。",
      duration: 90,
      Scene: Numbers,
      layout: "visual",
      beats: remaining.map((_, i) => ({
        label: i === 0 ? "提出挑战" : `第 ${i} 次判定`,
        takeaway:
          i === 4 ? "秘密数字是 11。关键在于每次排除一半。" : "先给观众预测的时间，再揭示回答。",
      })),
      notes:
        "假设数字是从一到十六中的某个整数。先让观众预测需要问几个是非问题。依次问：大于八吗？是。大于十二吗？不是。大于十吗？是。大于十一吗？不是。这样范围逐步缩小到十一。这里计数的是阈值的是非判定，不是直接猜中数字的次数。每次翻页前留出观察和预测时间。",
      source: { label: "原创二分教学示例；问题均为阈值判定" },
    },
    {
      id: "找规律",
      title: "每个问题，都让范围减半",
      subtitle: "不逐个猜答案，而是选择能排除大量可能的问题。",
      duration: 45,
      Scene: Split,
      layout: "visual",
      beats: [{ label: "抽象规律", takeaway: "前提：候选范围有序，回答能够划分范围。" }],
      notes:
        "把刚才的过程抽象出来。选择中间值，问秘密数字是否更大。无论回答是哪一个，剩余候选都在一半范围里。对于奇数个候选，只能尽量平分。这个方法依赖有序范围与可信的是非回答。",
      source: { label: "过程图；两条分支互斥且覆盖全部候选" },
    },
    {
      id: "迁移",
      title: "范围翻倍，只多问一次",
      subtitle: "如果换成 32 个、64 个候选数，分别需要多少次？",
      duration: 60,
      Scene: Transfer,
      layout: "visual",
      beats: [
        { label: "预测新任务", takeaway: "先预测，再检验自己是否掌握了方法。" },
        { label: "揭示并解释", takeaway: "二分判定次数随候选数的对数增长。" },
      ],
      notes:
        "让观众先给出预测。十六个候选四次，三十二个五次，六十四个六次。因为一次判定能把新增加的一倍候选重新减回原来的规模。一般的候选数 N，理想二分阈值判定需要向上取整的 log2 N 次。这里的任务是用是非问题定位一个数，不混同于其他定义的查找比较次数。",
      source: { label: "精确示例：2 的整数次幂，按二分阈值判定计数" },
    },
  ],
};
