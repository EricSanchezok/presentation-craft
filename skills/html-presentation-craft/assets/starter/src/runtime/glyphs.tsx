/** Small semantic glyphs. Place them inside a Diagram with a descriptive scene label. */
export function DocumentGlyph({
  x = 0,
  y = 0,
  scale = 1,
  checked = false,
}: {
  x?: number;
  y?: number;
  scale?: number;
  checked?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round">
      <path d="M5 2H45L61 18V76H5Z" fill="var(--paper)" stroke="currentColor" strokeWidth="2" />
      <path
        d="M45 2V18H61M16 31H48M16 42H48M16 53H36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {checked ? (
        <g>
          <circle cx="52" cy="66" r="14" fill="var(--accent)" />
          <path d="m45 66 5 5 9-11" fill="none" stroke="white" strokeWidth="2.5" />
        </g>
      ) : (
        <path
          d="M23 61v10a6 6 0 0 0 12 0V59a3 3 0 0 0-6 0v11"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="2"
        />
      )}
    </g>
  );
}
export function ClockGlyph({ x = 0, y = 0, size = 44 }: { x?: number; y?: number; size?: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${size / 44})`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
    >
      <circle cx="22" cy="22" r="19" />
      <path d="M22 10V23L30 28" />
    </g>
  );
}
export function CheckGlyph({ x = 0, y = 0, size = 44 }: { x?: number; y?: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 44})`}>
      <circle cx="22" cy="22" r="21" fill="var(--accent)" />
      <path
        d="m11 22 8 8 14-17"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
