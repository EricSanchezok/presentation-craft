# Architecture

This reference maps the authoring skill, shipped runtime, and repository verification boundaries.

## Authoring skill

[html-presentation-craft](../skills/html-presentation-craft/SKILL.md) owns the audience-to-delivery workflow. Its references hold narrative, visual, composition, motion, runtime and delivery guidance. Its assets contain an independently installable starter and canonical topic scenes; its create-deck script copies that starter and an optional catalog example without dependency caches or generated output.

## Runtime

The starter's [types](../skills/html-presentation-craft/assets/starter/src/runtime/types.ts) define DeckDefinition, SlideDefinition, Beat and SceneProps. One definition feeds the player and notes export. Navigation owns bounded positions and deep links. The player owns controls, dialogs, timer and static slides. Scene components own explanatory content; motion owns transitions to complete poses inside one scene. Theme variables express visual choices without changing playback semantics.

Vite builds imported assets into a single application. The bundle script inlines built CSS and JavaScript, rejects unsupported resource dependencies and writes the receiver-facing HTML. Structural auditing does not establish arbitrary runtime network behavior; browser tests inspect the shipped output.

## Examples and verification

[Examples](../examples/README.md) contain four task briefs and generated previews; canonical source lives in the skill. One catalog drives creation, builds, previews, browser checks and packaging. The build script creates independent starter copies and produces outputs plus matching notes. Root tests cover navigation, safe creation and bundling; browser tests cover rendered playback and print. The [testing policy](testing.md) owns evidence selection.

## Governance

repo-seed manages repository governance. It is not copied into new presentations. The [architecture decision](decisions/0004-separate-craft-and-runtime.md) owns alternatives and tradeoffs. [Provenance](provenance.md) identifies the original diagrams, technical references and runtime libraries.
