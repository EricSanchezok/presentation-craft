import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { targetPose, type ScenePoses } from "./motion-targets";
export type { Pose, ScenePoses } from "./motion-targets";
export function useSceneMotion(poses: ScenePoses, step: number, print = false) {
  const root = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const scope = useRef<gsap.Context | null>(null);
  const active = useRef<gsap.core.Timeline | null>(null);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useLayoutEffect(() => {
    scope.current = gsap.context(() => {}, root);
    return () => {
      active.current?.kill();
      scope.current?.revert();
      initialized.current = false;
    };
  }, []);
  useLayoutEffect(() => {
    scope.current?.add(() => {
      active.current?.kill();
      const instant = !initialized.current || reduced || print;
      if (root.current) root.current.dataset.motionSettled = String(instant);
      const timeline = gsap.timeline({
        onComplete: () => {
          if (root.current) root.current.dataset.motionSettled = "true";
        },
        defaults: { duration: 0.52, ease: "power3.inOut", overwrite: "auto" },
      });
      active.current = timeline;
      for (const [name, states] of Object.entries(poses)) {
        if (!states.length) throw new Error(`No poses for ${name}`);
        const targets = root.current?.querySelectorAll(`[data-motion="${name}"]`);
        if (!targets?.length) throw new Error(`Missing motion target: ${name}`);
        const { at, values: pose } = targetPose(states, step);
        gsap.killTweensOf(targets);
        if (instant) gsap.set(targets, pose);
        else timeline.to(targets, pose, at);
      }
      initialized.current = true;
    });
  }, [poses, step, print, reduced]);
  return root;
}
