# Separate presentation craft from the HTML runtime

## Status
Accepted
Class: architecture

## Context and Problem Statement

The user wants to reuse the quality of a successful HTML talk across unrelated subjects. Copying one branded deck preserves implementation but also carries its topic, layout and accidental complexity. A prose-only skill leaves fragile state and delivery mechanics to be rebuilt each time.

## Decision Drivers

- Preserve audience-led design choices without enforcing one aesthetic.
- Make copied skills and generated decks independently usable.
- Keep motion, notes and offline output consistent with one content definition.
- Validate multiple genres using the real delivered HTML.

## Considered Options

- A fixed template copied from the complete branded presentation project.
- A methodology-only skill with no maintained runtime.
- A concise skill with conditional references, a small stage runtime and varied examples.

## Decision Outcome

The repository uses the third option. The installable directory contains all its required resources. React, Vite, TypeScript and GSAP provide a local stage; CSS and SVG provide subject-specific composition. The deck definition is canonical for playback and notes. Complete target poses allow direct entry and interrupted navigation. The receiver opens a single bundled HTML file.

## Pros and Cons of the Options

A fixed template offers immediate visual consistency but overfits one event and carries hosting dependencies. Prose alone is flexible but repeatedly recreates fragile mechanics. The selected approach preserves creative freedom and reusable behavior, at the cost of maintaining the starter and its tests. System font fallbacks keep the starter small but require supplied fonts for exact cross-platform typography.

## Links

- [Visual decision cases](../../skills/html-presentation-craft/references/visual-decisions.md)
- [Source provenance](../provenance.md)
- [Runtime interface](../../skills/html-presentation-craft/references/runtime.md)
