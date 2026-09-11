import type { DeckDefinition, SceneProps } from "./runtime/types";
import { Diagram, Label, Connection } from "./runtime/graphics";
import { useSceneMotion, type ScenePoses } from "./runtime/motion";

function Ear({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="none"
      stroke="var(--ink)"
      strokeWidth="3.4"
      strokeLinecap="round"
    >
      <path
        d="M27 114C25 94 0 79 2 47C4 8 51-9 72 18C96 49 75 72 58 82C43 91 53 111 37 117C32 119 29 118 27 114Z"
        fill="#e8cbb5"
      />
      <path d="M26 74C11 44 29 19 50 27C74 37 61 61 46 65M30 50C55 40 61 73 36 88" />
    </g>
  );
}
function Headphones() {
  return (
    <g strokeLinejoin="round">
      <path
        d="M116 247V163C116 23 338 23 338 163V247"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="27"
      />
      <path d="M131 164C131 50 323 50 323 164" fill="none" stroke="#5a9299" strokeWidth="10" />
      <path d="M110 173V252M343 173V252" stroke="#b4cbd0" strokeWidth="13" />
      <g transform="rotate(9 117 263)">
        <rect x="88" y="209" width="49" height="114" rx="23" fill="var(--ink)" />
        <rect x="128" y="215" width="25" height="102" rx="12" fill="#6f9fa4" />
      </g>
      <g transform="rotate(-9 337 263)">
        <rect x="320" y="209" width="49" height="114" rx="23" fill="var(--ink)" />
        <rect x="304" y="215" width="25" height="102" rx="12" fill="#6f9fa4" />
        <circle cx="352" cy="240" r="3" fill="#bddbdb" />
      </g>
      <path d="M360 268v21" stroke="#b8d4d5" strokeWidth="3" />
    </g>
  );
}
const ingress: ScenePoses = {
  waves: [{ autoAlpha: 0.22 }, {}],
  earPoint: [{ autoAlpha: 0 }, {}],
  seal: [{}, { autoAlpha: 0.6 }],
};
function Arrival({ step, print }: SceneProps) {
  const ref = useSceneMotion(ingress, step, print);
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="完整头戴式耳机与局部耳罩剖面：外界噪声仍会传到耳边，耳垫提供被动隔音。"
      >
        {(arrow) => (
          <>
            <ellipse cx="228" cy="356" rx="148" ry="10" fill="var(--line)" opacity=".4" />
            <Headphones />
            <Label x={228} y={396} anchor="middle" small>
              耳罩提供物理隔离
            </Label>
            <path
              d="M369 249L461 122M369 292L461 336"
              stroke="var(--line)"
              strokeDasharray="5 6"
              fill="none"
            />
            <rect x="468" y="64" width="610" height="292" rx="24" fill="var(--surface)" />
            <Label x={496} y={102} small>
              观察耳罩内部
            </Label>
            <g data-motion="seal">
              <rect x="719" y="126" width="34" height="174" rx="17" fill="var(--ink)" />
              <rect x="752" y="122" width="43" height="40" rx="13" fill="#73a1a5" />
              <rect x="752" y="269" width="43" height="40" rx="13" fill="#73a1a5" />
            </g>
            <path
              d="M970 138C932 117 884 132 878 187V305"
              fill="none"
              stroke="#d3ad8f"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <Ear x={838} y={157} scale={1.05} />
            <g data-motion="waves" fill="none" stroke="var(--accent)" strokeWidth="3">
              <path d="M534 181Q568 217 534 253M565 166Q612 217 565 269M598 152Q660 217 598 283" />
              <path d="M649 218H827" strokeDasharray="6 6" markerEnd={arrow} />
            </g>
            <g data-motion="earPoint">
              <circle cx="893" cy="220" r="6" fill="var(--secondary)" />
              <path d="M899 220H1028V259" fill="none" stroke="var(--secondary)" strokeWidth="2" />
              <Label x={1028} y={291} anchor="end" small>
                耳边仍有噪声
              </Label>
            </g>
            <Label x={592} y={330} small anchor="middle">
              外界声波
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
const routing: ScenePoses = {
  capture: [{ autoAlpha: 0.2 }, {}, {}],
  control: [{ autoAlpha: 0.2 }, {}, {}],
  response: [{ autoAlpha: 0.12 }, { autoAlpha: 0.12 }, {}],
};
function Cutaway({ step, print }: SceneProps) {
  const ref = useSceneMotion(routing, step, print);
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="简化前馈主动降噪路径：外侧麦克风采集噪声，控制器计算，扬声器产生控制声，耳边声压相叠加。"
      >
        {(arrow) => (
          <>
            <path
              d="M350 77Q304 77 304 125V298Q304 342 350 342H675Q714 342 714 302V119Q714 77 675 77Z"
              fill="var(--surface)"
              stroke="var(--line)"
              strokeWidth="2"
            />
            <rect x="700" y="72" width="49" height="72" rx="21" fill="#739a9f" />
            <rect x="700" y="278" width="49" height="72" rx="21" fill="#739a9f" />
            <Label x={470} y={390} small anchor="middle">
              耳罩剖面 · 简化前馈结构
            </Label>
            <g fill="none" stroke="var(--accent)" strokeWidth="3">
              <path d="M95 164Q147 210 95 256M128 143Q204 210 128 277M165 125Q252 210 165 295" />
            </g>
            <Label x={162} y={345} anchor="middle" small>
              环境噪声
            </Label>
            <g data-motion="capture">
              <rect x="288" y="171" width="38" height="73" rx="17" fill="var(--accent)" />
              <path
                d="M300 186h13M300 197h13M300 208h13M300 219h13"
                stroke="white"
                strokeWidth="2"
              />
              <path d="M326 207H409" stroke="var(--accent)" strokeWidth="3" markerEnd={arrow} />
              <path d="M308 167V40H245" stroke="var(--muted)" fill="none" />
              <Label x={236} y={46} anchor="end">
                01 采集
              </Label>
            </g>
            <g data-motion="control">
              <rect
                x="421"
                y="157"
                width="118"
                height="100"
                rx="7"
                fill="var(--paper)"
                stroke="var(--accent)"
                strokeWidth="3"
              />
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={i}
                  d={`M${437 + i * 21} 145v12M${437 + i * 21} 257v12`}
                  stroke="var(--accent)"
                  strokeWidth="3"
                />
              ))}
              <path
                d="M443 223l14-22 14 9 19-27 28 20"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
              />
              <Label x={480} y={112} anchor="middle">
                02 计算
              </Label>
            </g>
            <g data-motion="response">
              <Connection d="M550 207H609" marker={arrow} accent />
              <path
                d="M620 170H640L678 140V275L640 244H620Z"
                fill="#dc9d70"
                stroke="var(--secondary)"
                strokeWidth="3"
              />
              <path
                d="M695 172Q730 207 695 243M717 158Q767 207 717 258"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="3"
              />
              <Label x={741} y={46} anchor="middle">
                03 发出控制声
              </Label>
              <path d="M671 137V65H742" fill="none" stroke="var(--secondary)" />
            </g>
            <Ear x={833} y={145} scale={1.35} />
            <circle cx="899" cy="223" r="7" fill="var(--secondary)" />
            <Label x={891} y={350} anchor="middle" small>
              在耳边叠加
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
function wave(y: number, amplitude: number, phase = 0) {
  return Array.from(
    { length: 97 },
    (_, i) =>
      `${i ? "L" : "M"}${430 + i * 6.4} ${(y + Math.sin((i / 96) * Math.PI * 6 + phase) * amplitude).toFixed(2)}`,
  ).join(" ");
}
function controlWave(residual: number) {
  return Array.from({ length: 97 }, (_, i) => {
    const angle = (i / 96) * Math.PI * 6;
    return `${i ? "L" : "M"}${430 + i * 6.4} ${(200 - Math.sin(angle) * 34 + Math.sin(angle + 0.3) * residual).toFixed(2)}`;
  }).join(" ");
}
const interference: ScenePoses = {
  controlSignal: [
    { attr: { d: controlWave(0) } },
    { attr: { d: controlWave(0) } },
    { attr: { d: controlWave(8) } },
  ],
  anti: [{ autoAlpha: 0.14 }, {}, {}],
  sum: [
    { attr: { d: wave(320, 34) } },
    { attr: { d: wave(320, 0) } },
    { attr: { d: wave(320, 8, 0.3) } },
  ],
  imperfect: [{ autoAlpha: 0 }, { autoAlpha: 0 }, {}],
};
function Superposition({ step, print }: SceneProps) {
  const ref = useSceneMotion(interference, step, print);
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="示意声压随时间变化：原噪声与反相信号理想相消；真实系统存在时延与误差，仍有残余。"
      >
        {() => (
          <>
            <circle cx="182" cy="187" r="113" fill="var(--surface)" />
            <Ear x={127} y={107} scale={1.3} />
            <circle cx="194" cy="205" r="7" fill="var(--secondary)" />
            <path d="M205 205H312V320H393" fill="none" stroke="var(--line)" strokeWidth="2" />
            <Label x={182} y={344} anchor="middle">
              看耳边的声压
            </Label>
            <Label x={182} y={378} anchor="middle" small>
              同一位置 · 同一时间尺度
            </Label>
            {[80, 200, 320].map((y, i) => (
              <g key={y}>
                <path d={`M424 ${y}H1065`} stroke="var(--line)" />
                <Label x={400} y={y + 7} anchor="end" small>
                  {["噪声", "控制声", "叠加"][i]}
                </Label>
              </g>
            ))}
            <path
              data-series="noise"
              d={wave(80, 34)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
            />
            <g data-motion="anti">
              <path
                data-motion="controlSignal"
                d={controlWave(0)}
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="3"
              />
              <text x="739" y="146" fontSize="25" fill="var(--muted)">
                ＋
              </text>
            </g>
            <text x="739" y="265" fontSize="25" fill="var(--muted)">
              ＝
            </text>
            <path
              data-motion="sum"
              d={wave(320, 34)}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="3"
            />
            <g data-motion="imperfect">
              <path d="M850 320H1045" stroke="var(--secondary)" strokeDasharray="5 5" />
              <Label x={1050} y={371} anchor="end" small>
                理想相消：零线；实际：仍有残余
              </Label>
            </g>
            <Label x={430} y={28} small>
              相对声压（示意，非测量数据）
            </Label>
            <Label x={1060} y={399} small anchor="end">
              时间 →
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
const source = {
  label: "机制参考：Bose · How do noise cancelling headphones work?",
  url: "https://www.bose.com/stories/how-do-noise-cancelling-headphones-work",
};
export const deck: DeckDefinition = {
  id: "anc",
  title: "耳机如何让噪声安静下来",
  subtitle: "主动降噪 · 三分钟科学解释",
  theme: {
    "--paper": "#f7faf7",
    "--ink": "#213c41",
    "--muted": "#5a7174",
    "--accent": "#176d78",
    "--secondary": "#b26d3c",
    "--surface": "#e7f0ed",
    "--line": "#bfd2cf",
  },
  slides: [
    {
      id: "声从哪里来",
      title: "戴上耳机，噪声仍然会到达耳边",
      subtitle: "耳罩能隔离一部分声音，主动降噪处理的是传到耳边的声压。",
      layout: "visual",
      duration: 45,
      Scene: Arrival,
      source,
      beats: [
        { label: "看见耳机", takeaway: "先区分两件事：物理隔音，以及主动产生控制声。" },
        { label: "追踪噪声", takeaway: "问题变得具体：怎样减少耳边实际出现的噪声？" },
      ],
      notes:
        "从日常经验开始：戴上耳机，并不是所有噪声都会消失。耳垫的密封提供被动隔音。这张剖面只强调环境噪声仍可到达耳边，并非声传播仿真。下一页进入主动降噪机制。",
    },
    {
      id: "耳罩里的协作",
      title: "采集噪声，计算，再发出控制声",
      subtitle: "麦克风、控制器与扬声器，构成一条主动响应路径。",
      layout: "visual",
      duration: 65,
      Scene: Cutaway,
      source,
      beats: [
        { label: "定位部件", takeaway: "每个部件各司其职，耳边的结果由整条声学路径决定。" },
        { label: "采集与计算", takeaway: "麦克风采集信号，控制器估计需要发出的控制声。" },
        { label: "扬声器响应", takeaway: "扬声器产生声音，使它与噪声在耳边发生叠加。" },
      ],
      notes:
        "这是简化前馈结构，不代表所有耳机的完整电路。外侧麦克风测得环境信号，控制器考虑传输路径并驱动扬声器。真实产品可能同时使用内部麦克风反馈与自适应滤波。不要把麦克风画成发声部件，也不要暗示只要把采样波形取负就总能消除噪声。",
    },
    {
      id: "声压怎样相加",
      title: "用声音减弱声音，而不是制造绝对安静",
      subtitle: "相反的声压可以抵消；实际效果取决于匹配精度和系统响应。",
      layout: "visual",
      duration: 70,
      Scene: Superposition,
      source,
      beats: [
        { label: "只有噪声", takeaway: "先观察同一位置的声压，再讨论叠加。" },
        { label: "理想相消", takeaway: "理想条件：幅度匹配、相位相反，在这个位置相消。" },
        { label: "真实边界", takeaway: "主动降噪通常更擅长稳定的低频噪声，仍需被动隔音配合。" },
      ],
      notes:
        "曲线是解释叠加的示意图，没有单位标定，也不是性能测量。先展示理想反相抵消，再展示实际残余，打印态同时标出理想零线和残余。误差可能来自时延、路径变化与控制能力限制。持续低频声通常更容易控制，突发尖锐声更困难。边界参考：https://www.bose.com/stories/what-is-active-noise-cancellation 。",
    },
  ],
};
