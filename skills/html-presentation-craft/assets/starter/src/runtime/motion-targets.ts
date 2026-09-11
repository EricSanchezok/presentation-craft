/** Each attribute target declares the same keys at every beat, including its reset state. */
export type Pose = {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  autoAlpha?: number;
  at?: number;
  attr?: Record<string, string | number>;
};
export type ScenePoses = Record<string, readonly Pose[]>;
export function targetPose(states: readonly Pose[], step: number) {
  if (!states.length) throw new Error("A motion target needs at least one pose");
  const keys = [...new Set(states.flatMap((pose) => Object.keys(pose.attr ?? {})))];
  for (const pose of states) {
    if (keys.some((key) => pose.attr?.[key] === undefined))
      throw new Error("SVG attribute targets must be complete in every pose");
  }
  const { at = 0, attr, ...values } = states[Math.min(step, states.length - 1)];
  // Filter primitives and paths with attribute-only states need no CSS transforms.
  const css =
    !attr ||
    states.some(({ attr: _attr, at: _at, ...cssValues }) => Object.keys(cssValues).length > 0)
      ? { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, ...values }
      : {};
  return { at, values: { ...css, ...(attr ? { attr } : {}) } };
}
