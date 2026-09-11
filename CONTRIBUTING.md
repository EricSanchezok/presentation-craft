# Contributing

Thanks for helping make presentations clearer, more expressive, and more reliable. Start with the [development guide](docs/development.md) and [architecture](docs/architecture.md). This is an HTML presentation skill and runtime; editable PPTX export and hosted deployment are outside its current scope.

## Propose a useful change

For a design improvement, show the existing visual problem, explain its effect on an audience, and provide the revised complete state. For a behavioral bug, include the slide and step, browser, reproduction sequence, expected result and observed result. Remove confidential content from reproductions. Avoid adding dependencies or icon collections without an example that benefits from them.

## Implement and verify

1. Create a branch from `main`; descriptive `codex/` branches are welcome.
2. Change the owning module. Canonical example source belongs inside the skill; the catalog drives build, preview and packaging. Keep copied skills independent of this repository.
3. Add the smallest meaningful regression evidence. Playback or bundling changes need actual built-output checks; narrative and visual changes need rendered review as well as structural checks.
4. Update the owning documentation and source attribution. Follow [documentation standards](docs/AGENTS.md); genuine architecture choices use [decisions](docs/decisions/README.md).
5. Run relevant validation from the [development guide](docs/development.md), then the shared gates before committing. Describe what was actually checked, including any environment limitation.

## Review expectations

A good change explains what the audience can understand more easily and why. Include a screenshot for changed composition and key states for changed motion. Preserve evidence boundaries: examples, hypotheses and measurements must be distinguishable. Never claim universal browser or offline compatibility based solely on a successful build.

Original contributions use the repository's MIT license. Retain dependency notices and record any third-party assets or derived mechanisms. Repository governance uses repo-seed; manage its recorded files through the resident workflow described in [AGENTS.md](AGENTS.md).
