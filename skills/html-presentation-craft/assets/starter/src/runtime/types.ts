import type { ComponentType, CSSProperties } from "react";
export type Beat = { label: string; takeaway?: string };
export type SceneProps = { step: number; print: boolean };
export type SlideDefinition = {
  id: string;
  title: string;
  subtitle?: string;
  notes: string;
  duration: number;
  beats: Beat[];
  Scene: ComponentType<SceneProps>;
  printStep?: number;
  layout?: "standard" | "visual";
  source?: { label: string; url?: string };
};
export type DeckDefinition = {
  id: string;
  title: string;
  subtitle: string;
  slides: SlideDefinition[];
  theme?: CSSProperties & Record<`--${string}`, string>;
};
