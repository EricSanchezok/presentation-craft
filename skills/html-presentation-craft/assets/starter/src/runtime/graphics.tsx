import { useId, type ReactNode } from "react";
export function Diagram({
  label,
  children,
  viewBox = "0 0 1120 370",
}: {
  label: string;
  viewBox?: string;
  children: (marker: string) => ReactNode;
}) {
  const id = `arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox={viewBox} role="img" aria-label={label}>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M1 1L8 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.6" />
        </marker>
      </defs>
      {children(`url(#${id})`)}
    </svg>
  );
}
export function Connection({
  d,
  marker,
  dashed = false,
  accent = false,
}: {
  d: string;
  marker?: string;
  dashed?: boolean;
  accent?: boolean;
}) {
  return (
    <path
      d={d}
      markerEnd={marker}
      fill="none"
      stroke={accent ? "var(--accent)" : "var(--muted)"}
      strokeWidth="2.5"
      strokeDasharray={dashed ? "7 6" : undefined}
    />
  );
}
export function Label({
  x,
  y,
  children,
  small = false,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: ReactNode;
  small?: boolean;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={small ? "diagram-caption" : "diagram-label"}>
      {children}
    </text>
  );
}
export function Panel({
  x,
  y,
  width,
  height,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={width}
        height={height}
        rx="10"
        fill="var(--surface)"
        stroke="var(--line)"
        strokeWidth="1.5"
      />
      {children}
    </g>
  );
}
export function Axis({
  x = 100,
  y = 310,
  width = 900,
  height = 250,
  xLabel,
  yLabel,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  xLabel: string;
  yLabel: string;
}) {
  return (
    <g>
      <path
        d={`M${x} ${y - height}V${y}H${x + width}`}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.5"
      />
      <Label x={x + width} y={y + 38} small anchor="end">
        {xLabel}
      </Label>
      <Label x={x} y={y - height - 20} small>
        {yLabel}
      </Label>
    </g>
  );
}
