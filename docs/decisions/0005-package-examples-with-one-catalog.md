# Package scene examples with one catalog

## Status
Accepted
Class: architecture

## Context and Problem Statement

A minimal runtime demonstrates reliable playback but does not teach how to draw topic-specific objects. Keeping richer examples outside the skill loses that visual knowledge when the skill is copied. Separate example lists in builders, tests and archives can disagree.

## Decision Drivers

- Preserve complete visual implementations in every skill installation.
- Maintain one source per example and one catalog of public examples.
- Keep topic-specific parts out of the generic runtime.
- Exercise the same source that recipients receive.

## Considered Options

- Keep examples only at repository root.
- Duplicate examples inside and outside the skill.
- Store canonical example source inside the skill, with a shared catalog.

## Decision Outcome

Canonical scenes live in the skill's assets/examples directory. The catalog drives project creation, builds, preview states, browser coverage and archive membership. Repository examples hold evaluation briefs and generated screenshots. The small runtime owns generic graphics and complete motion targets; each subject owns its cutaways, illustrations and mechanism geometry.

## Pros and Cons of the Options

Root-only examples keep the skill smaller but omit its richest implementation guidance. Duplication makes access convenient but allows revisions to drift. Packaged canonical sources make independent installation reliable at a modest size cost. New examples must satisfy the same standalone build contract and catalog-based checks.

## Links

- [Example catalog](../../skills/html-presentation-craft/assets/examples/catalog.json)
- [Runtime contract](../../skills/html-presentation-craft/references/runtime.md)
- [Verification](../verification.md)
