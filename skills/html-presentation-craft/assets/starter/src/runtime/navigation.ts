import type { DeckDefinition } from "./types";
export type Position = { slide: number; step: number };
export function validateDeck(deck: DeckDefinition) {
  if (!deck.slides.length) throw new Error("An HTML presentation needs at least one slide.");
  const ids = new Set<string>();
  for (const s of deck.slides) {
    if (!s.id || ids.has(s.id)) throw new Error(`Duplicate or empty slide id: ${s.id}`);
    ids.add(s.id);
    if (!s.beats.length || !Number.isFinite(s.duration) || s.duration <= 0)
      throw new Error(`Invalid beats or duration: ${s.id}`);
    if (
      s.printStep !== undefined &&
      (!Number.isInteger(s.printStep) || s.printStep < 0 || s.printStep >= s.beats.length)
    )
      throw new Error(`Invalid printStep: ${s.id}`);
  }
}
export function normalize(deck: DeckDefinition, value: Position): Position {
  const integer = (v: number) => (Number.isFinite(v) ? Math.floor(v) : 0);
  const slide = Math.max(0, Math.min(deck.slides.length - 1, integer(value.slide)));
  const step = Math.max(0, Math.min(deck.slides[slide].beats.length - 1, integer(value.step)));
  return { slide, step };
}
export function readPosition(deck: DeckDefinition, hash: string): Position {
  const query = new URLSearchParams(hash.replace(/^#/, ""));
  return normalize(deck, {
    slide: Number(query.get("slide") || 1) - 1,
    step: Number(query.get("step") || 0),
  });
}
export function positionHash(p: Position) {
  return `#slide=${p.slide + 1}&step=${p.step}`;
}
export function move(deck: DeckDefinition, p: Position, direction: -1 | 1): Position {
  p = normalize(deck, p);
  if (direction === 1) {
    if (p.step < deck.slides[p.slide].beats.length - 1) return { ...p, step: p.step + 1 };
    return p.slide < deck.slides.length - 1 ? { slide: p.slide + 1, step: 0 } : p;
  }
  if (p.step > 0) return { ...p, step: p.step - 1 };
  return p.slide > 0 ? { slide: p.slide - 1, step: deck.slides[p.slide - 1].beats.length - 1 } : p;
}
