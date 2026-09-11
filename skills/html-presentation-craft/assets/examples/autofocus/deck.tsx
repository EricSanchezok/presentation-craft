import { useId } from "react";
import type { DeckDefinition, SceneProps } from "./runtime/types";
import { Diagram, Label } from "./runtime/graphics";
import { useSceneMotion, type ScenePoses } from "./runtime/motion";
function Target() {
  return (
    <g>
      <rect width="240" height="160" fill="#ede6d9" />
      <circle cx="188" cy="36" r="19" fill="#d69b52" />
      <path d="M0 151L80 38L164 160H0Z" fill="#5c7372" />
      <path d="m49 81 31-43 32 46-29-17Z" fill="#faf6e9" />
      <path d="M113 160L174 77L240 160Z" fill="#99a7a0" />
      <path d="M10 143H232" stroke="#344e50" strokeWidth="3" />
      <path
        d="M188 151V100M177 119l11 7 13-14M182 109l6 5"
        stroke="#344e50"
        strokeWidth="3"
        fill="none"
      />
    </g>
  );
}
function Camera() {
  return (
    <g strokeLinejoin="round">
      <path
        d="M51 139H116L143 108H232L253 139H324Q346 139 346 163V310Q346 332 324 332H61Q39 332 39 310V162Q39 139 51 139Z"
        fill="var(--ink)"
      />
      <rect x="56" y="166" width="52" height="139" rx="15" fill="#576665" />
      <rect x="143" y="119" width="84" height="18" rx="4" fill="#5d7170" />
      <rect x="267" y="119" width="38" height="17" rx="5" fill="#485c5c" />
      <circle cx="317" cy="171" r="5" fill="var(--accent)" />
      {[84, 72, 59, 45].map((radius, i) => (
        <circle
          key={radius}
          cx="208"
          cy="238"
          r={radius}
          fill={["#7c8b87", "#263d42", "#425c61", "#1f343a"][i]}
          stroke="#a1afa7"
          strokeWidth={i === 1 ? 2 : 1}
        />
      ))}
      <path
        d="M179 207Q218 184 244 223"
        stroke="#8caeaa"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="218" cy="230" r="15" fill="#aac7b7" opacity=".23" />
      <path d="M137 237H150M266 237H279" stroke="#d3d7c9" strokeWidth="3" />
    </g>
  );
}
const clarify: ScenePoses = {
  blur: [{ attr: { stdDeviation: 5 } }, { attr: { stdDeviation: 0 } }],
  lock: [{ autoAlpha: 0.35 }, {}],
};
function Viewfinder({ step, print }: SceneProps) {
  const ref = useSceneMotion(clarify, step, print);
  const id = `view-${useId().replace(/:/g, "")}`;
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="同一相机面对同一山景，对焦从模糊变为清晰，取景内容不变。"
      >
        {() => (
          <>
            <ellipse cx="196" cy="355" rx="155" ry="10" fill="var(--line)" opacity=".4" />
            <Camera />
            <path d="M358 240H429" stroke="var(--line)" strokeWidth="2" strokeDasharray="5 5" />
            <defs>
              <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur data-motion="blur" stdDeviation="5" />
              </filter>
              <clipPath id={`${id}-clip`}>
                <rect width="240" height="160" rx="3" />
              </clipPath>
            </defs>
            <rect x="448" y="42" width="606" height="346" rx="19" fill="var(--ink)" />
            <g transform="translate(481 57) scale(2.23 1.97)" clipPath={`url(#${id}-clip)`}>
              <g filter={`url(#${id})`}>
                <Target />
              </g>
            </g>
            <g data-motion="lock" fill="none" stroke="var(--accent)" strokeWidth="4">
              <path d="M663 133h-20v20M818 133h20v20M643 273v20h20M838 273v20h-20" />
            </g>
            <rect x="912" y="71" width="112" height="32" rx="6" fill="var(--ink)" />
            <text x="968" y="94" textAnchor="middle" fontSize="18" fill="#fff">
              {step ? "合焦" : "搜索中"}
            </text>
            <Label x={196} y={394} anchor="middle" small>
              同一物体 · 同一取景
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
const lensX = [535, 595];
function rayPath(x: number) {
  const f = x + 260;
  return [145, 255]
    .map((y) => `M255 ${y}L${x} ${y}L855 ${200 + ((y - 200) * (f - 855)) / (f - x)}`)
    .join(" ");
}
const optics: ScenePoses = {
  lens: lensX.map((x) => ({ x: x - 535 })),
  rays: lensX.map((x) => ({ attr: { d: rayPath(x) } })),
  focus: lensX.map((x) => ({ attr: { cx: x + 260 } })),
  detail: [{ attr: { stdDeviation: 4 } }, { attr: { stdDeviation: 0 } }],
};
function Optics({ step, print }: SceneProps) {
  const ref = useSceneMotion(optics, step, print);
  const id = `optic-${useId().replace(/:/g, "")}`;
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="薄透镜、远物的简化光路：移动镜片，让会聚点落在固定感光面上，同时图像变清晰。"
      >
        {() => (
          <>
            <path
              d="M348 106H688V71H896V329H688V294H348Z"
              fill="var(--surface)"
              stroke="var(--line)"
              strokeWidth="2"
            />
            <path d="M221 200H922" stroke="var(--line)" strokeDasharray="5 6" />
            <path d="M260 121h-50M260 280h-50" stroke="var(--line)" />
            <Label x={93} y={184}>
              远处物体
            </Label>
            <Label x={93} y={219} small>
              入射近似平行
            </Label>
            <rect x="850" y="113" width="10" height="174" rx="4" fill="var(--ink)" />
            <path
              d="M861 124h13M861 139h13M861 154h13M861 169h13M861 184h13M861 199h13M861 214h13M861 229h13M861 244h13M861 259h13M861 274h13"
              stroke="var(--ink)"
            />
            <g data-motion="lens">
              <path
                d="M535 115Q494 200 535 285Q576 200 535 115Z"
                fill="#b8d4cf"
                fillOpacity=".65"
                stroke="var(--secondary)"
                strokeWidth="2.5"
              />
              <path d="M535 92v21M535 287v20" stroke="var(--secondary)" strokeWidth="3" />
            </g>
            <path
              data-motion="rays"
              d={rayPath(535)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
            />
            <circle data-motion="focus" cx="795" cy="200" r="6" fill="var(--accent)" />
            <path
              d="M508 338H622m-9-7 9 7-9 7m-96-14-9 7 9 7"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="2"
            />
            <Label x={565} y={384} anchor="middle" small>
              镜片位置可调
            </Label>
            <Label x={855} y={384} small anchor="middle">
              感光面固定
            </Label>
            <defs>
              <filter id={id}>
                <feGaussianBlur data-motion="detail" stdDeviation="4" />
              </filter>
              <clipPath id={`${id}-clip`}>
                <rect width="240" height="160" />
              </clipPath>
            </defs>
            <g transform="translate(938 148) scale(.6)" clipPath={`url(#${id}-clip)`}>
              <g filter={`url(#${id})`}>
                <Target />
              </g>
            </g>
            <Label x={1008} y={285} anchor="middle" small>
              {step ? "边缘清楚" : "边缘模糊"}
            </Label>
            <Label x={363} y={48} small>
              镜头剖面 · 薄透镜近似
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
const positions = [430, 690, 842, 690];
const ys = [270, 96, 182, 96];
const blurs = [4, 0, 2.2, 0];
const search: ScenePoses = {
  point: positions.map((x, i) => ({ attr: { cx: x, cy: ys[i] } })),
  line: positions.map((x) => ({ attr: { x1: x, x2: x } })),
  detail: blurs.map((n) => ({ attr: { stdDeviation: n } })),
  scanLens: positions.map((x) => ({ x: (x - 430) * 0.12 })),
};
function Contrast({ step, print }: SceneProps) {
  const ref = useSceneMotion(search, step, print);
  const id = `contrast-${useId().replace(/:/g, "")}`;
  return (
    <div ref={ref}>
      <Diagram
        viewBox="0 0 1120 410"
        label="对比度自动对焦示意：扫描镜头位置，清晰度上升后下降，再返回峰值附近锁定。"
      >
        {() => (
          <>
            <rect x="17" y="42" width="300" height="308" rx="19" fill="var(--surface)" />
            <defs>
              <filter id={id}>
                <feGaussianBlur data-motion="detail" stdDeviation="4" />
              </filter>
              <clipPath id={`${id}-clip`}>
                <rect width="240" height="160" />
              </clipPath>
            </defs>
            <g transform="translate(47 66)" clipPath={`url(#${id}-clip)`}>
              <g filter={`url(#${id})`}>
                <Target />
              </g>
            </g>
            <path d="M83 269H250M83 315H250" stroke="var(--line)" strokeWidth="4" />
            <g data-motion="scanLens">
              <rect x="125" y="258" width="24" height="68" rx="8" fill="var(--secondary)" />
              <path d="M137 267v48" stroke="white" strokeWidth="2" />
            </g>
            <Label x={166} y={383} anchor="middle" small>
              镜头位置与画面同步变化
            </Label>
            <path d="M395 52V327H1065" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
            <Label x={395} y={30} small>
              局部图像对比度（示意）
            </Label>
            <Label x={1065} y={379} small anchor="end">
              镜头位置 →
            </Label>
            <path
              d="M415 281L430 270Q560 96 690 96Q760 96 842 182Q950 260 1045 285"
              fill="none"
              stroke="var(--line)"
              strokeWidth="5"
            />
            <path
              d="M430 270Q560 96 690 96Q760 96 842 182"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="5 7"
              fill="none"
              opacity=".6"
            />
            <line
              data-motion="line"
              x1="430"
              y1="62"
              x2="430"
              y2="327"
              stroke="var(--secondary)"
              strokeDasharray="4 5"
            />
            <circle
              data-motion="point"
              cx="430"
              cy="270"
              r="9"
              fill="var(--accent)"
              stroke="var(--paper)"
              strokeWidth="3"
            />
            <Label x={435} y={311} small>
              ① 搜索
            </Label>
            <Label x={690} y={70} small anchor="middle">
              ② / ④ 峰值附近
            </Label>
            <Label x={849} y={160} small>
              ③ 越过
            </Label>
            <path
              d="M821 211Q773 167 714 155m8-5-8 5 7 6"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="2"
            />
            <Label x={708} y={255} anchor="middle">
              {print
                ? "搜索 → 越过 → 返回 → 锁定"
                : [
                    "移动镜片，观察对比度",
                    "对比度上升",
                    "继续移动，发现下降",
                    "返回峰值附近，锁定",
                  ][step]}
            </Label>
          </>
        )}
      </Diagram>
    </div>
  );
}
const source = {
  label: "机制参考：Canon · 对比度检测与自动对焦说明",
  url: "https://www.usa.canon.com/learning/training-articles/training-articles-list/canon-autofocus-series-dual-pixel-cmos-af-explained",
};
export const deck: DeckDefinition = {
  id: "autofocus",
  title: "清晰，是怎样找回来的",
  subtitle: "对比度自动对焦 · 技术机制演示",
  theme: {
    "--paper": "#fbf8f0",
    "--ink": "#283d40",
    "--muted": "#687673",
    "--accent": "#b75431",
    "--secondary": "#507a79",
    "--surface": "#eeeade",
    "--line": "#c9d0c5",
  },
  slides: [
    {
      id: "从画面出发",
      title: "同一个物体，为什么会模糊？",
      subtitle: "取景没有变，改变的是成像与感光面的位置关系。",
      layout: "visual",
      duration: 40,
      Scene: Viewfinder,
      source,
      beats: [
        { label: "观察模糊", takeaway: "先让观众看见问题，再解释相机内部发生了什么。" },
        { label: "看到清晰", takeaway: "自动对焦要找到让目标细节清楚的镜头位置。" },
      ],
      notes:
        "这是一张原创矢量山景，用模糊滤镜表示失焦，不是镜头像差的精确仿真。相同内容在同一取景框内从模糊变清晰，引出对焦所调整的物理关系。",
    },
    {
      id: "进入光路",
      title: "移动镜片，让光落在感光面上",
      subtitle: "用远物与薄透镜近似，观察一个固定感光面的成像过程。",
      layout: "visual",
      duration: 60,
      Scene: Optics,
      source,
      beats: [
        { label: "焦点偏离", takeaway: "光束在感光面之前会聚，到达感光面时已经散开。" },
        { label: "焦点对齐", takeaway: "镜片移动后，会聚点与感光面对齐，图像变清晰。" },
      ],
      notes:
        "只示意远处物体上一点的两条近轴光线。固定焦距薄透镜移动，焦点随之移动到固定感光面；光线、会聚点和图像模糊程度同步。真实镜头由多组镜片组成，不等于整支镜头平移，画面也不构成数值光学仿真。",
    },
    {
      id: "怎样找到位置",
      title: "试着移动，再根据清晰度返回",
      subtitle: "以对比度检测为例：观察局部细节，寻找对比度较高的位置。",
      layout: "visual",
      duration: 80,
      Scene: Contrast,
      source,
      beats: [
        { label: "开始扫描", takeaway: "在这个简化例子里，相机先移动镜片，再观察变化。" },
        { label: "接近峰值", takeaway: "细节的对比度上升，表示对焦正在改善。" },
        { label: "越过峰值", takeaway: "对比度开始下降，说明刚刚经过了较清晰的位置。" },
        { label: "返回并锁定", takeaway: "不同自动对焦方法使用不同信号；这页只解释对比度检测。" },
      ],
      notes:
        "这是对比度自动对焦的教学性扫描过程。曲线是示意，不是实测性能，也不承诺唯一峰值或固定搜索次数。相位检测和混合自动对焦使用其他信息，不能从这页推断所有现代相机都会先越过再返回。打印保留完整搜索路径和顺序。",
    },
  ],
};
