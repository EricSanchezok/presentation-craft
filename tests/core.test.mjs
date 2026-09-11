import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, mkdir, rm, stat, symlink } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createDeck } from "../skills/html-presentation-craft/scripts/create-deck.mjs";
import {
  bundle,
  auditHTML,
} from "../skills/html-presentation-craft/assets/starter/scripts/bundle.mjs";
import {
  move,
  normalize,
  readPosition,
  validateDeck,
} from "../skills/html-presentation-craft/assets/starter/src/runtime/navigation.ts";
const deck = {
  slides: [
    { id: "a", duration: 10, beats: [{}, {}] },
    { id: "b", duration: 20, beats: [{}, {}, {}] },
  ],
};
test("every position can be traversed forward and backward without losing beats", () => {
  validateDeck(deck);
  let p = { slide: 0, step: 0 };
  const route = [p];
  for (let i = 0; i < 4; i++) {
    p = move(deck, p, 1);
    route.push(p);
  }
  assert.deepEqual(route, [
    { slide: 0, step: 0 },
    { slide: 0, step: 1 },
    { slide: 1, step: 0 },
    { slide: 1, step: 1 },
    { slide: 1, step: 2 },
  ]);
  assert.deepEqual(move(deck, p, 1), p);
  for (let i = 3; i >= 0; i--) {
    p = move(deck, p, -1);
    assert.deepEqual(p, route[i]);
  }
  assert.deepEqual(move(deck, p, -1), p);
});
test("direct links clamp invalid numbers and preserve valid middle states", () => {
  assert.deepEqual(readPosition(deck, "#slide=2&step=1"), { slide: 1, step: 1 });
  assert.deepEqual(readPosition(deck, "#slide=100&step=100"), { slide: 1, step: 2 });
  assert.deepEqual(readPosition(deck, "#slide=abc&step=-1"), { slide: 0, step: 0 });
  assert.deepEqual(normalize(deck, { slide: 1.8, step: 2.9 }), { slide: 1, step: 2 });
  assert.throws(() => validateDeck({ slides: [] }));
  assert.throws(() =>
    validateDeck({ slides: [{ id: "a", duration: 1, beats: [], printStep: 3 }] }),
  );
});
test("create-deck is self-contained and refuses to replace a user project", async () => {
  const root = await mkdtemp(join(tmpdir(), "craft-create-"));
  try {
    const target = join(root, "new");
    await createDeck(target);
    assert.equal(
      JSON.parse(await readFile(join(target, "package.json"), "utf8")).name,
      "html-presentation",
    );
    await stat(join(target, "package-lock.json"));
    await stat(join(target, "scripts/bundle.mjs"));
    await assert.rejects(stat(join(target, "node_modules")));
    await writeFile(join(target, "user.txt"), "keep");
    await assert.rejects(createDeck(target), /already exists/);
    assert.equal(await readFile(join(target, "user.txt"), "utf8"), "keep");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("offline bundle handles hashed files, CSS assets and script closing text", async () => {
  const root = await mkdtemp(join(tmpdir(), "craft-bundle-"));
  try {
    await mkdir(join(root, "dist/assets"), { recursive: true });
    await writeFile(
      join(root, "dist/index.html"),
      `<!doctype html><html><head><link href='./assets/a.css' rel='stylesheet'></head><body><script src='./assets/b.js' type='module'></script><a href='https://example.org/source'>Source</a></body></html>`,
    );
    await writeFile(
      join(root, "dist/assets/a.css"),
      'a{background:url("data:image/svg+xml,%3Csvg/%3E")}',
    );
    await writeFile(
      join(root, "dist/assets/b.js"),
      'globalThis.message="</ScRiPt>";globalThis.caption="import( an example )";',
    );
    await bundle(join(root, "dist"));
    const html = await readFile(join(root, "dist/演示.html"), "utf8");
    auditHTML(html);
    assert.ok(html.includes("<\\/ScRiPt>"));
    assert.ok(!html.includes('src="./assets/'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("offline audit refuses hidden style imports, image files and remote embeds", () => {
  assert.throws(
    () => auditHTML('<style>@import "https://example.org/font.css";</style>'),
    /@import/,
  );
  assert.throws(
    () => auditHTML("<style>.x{background:url(../lost.png)}</style>"),
    /Unembedded CSS/,
  );
  assert.throws(() => auditHTML('<img src="lost.png">'), /Unembedded/);
  assert.throws(() => auditHTML('<iframe src="https://example.org"></iframe>'));
  assert.doesNotThrow(() =>
    auditHTML('<svg><use href="#shape"/></svg><a href="https://example.org">Citation</a>'),
  );
});

test("SVG target states reset every attribute and reject incomplete rewind targets", async () => {
  const { targetPose } =
    await import("../skills/html-presentation-craft/assets/starter/src/runtime/motion-targets.ts");
  const states = [
    { attr: { d: "M0 0L2 2", opacity: 1 } },
    { attr: { d: "M0 0L5 2", opacity: 0.5 } },
  ];
  assert.deepEqual(targetPose(states, 0).values, { attr: states[0].attr });
  assert.deepEqual(targetPose(states, 3).values, { attr: states[1].attr });
  assert.throws(() => targetPose([{ attr: { d: "M0 0" } }, {}], 1), /complete/);
  assert.throws(() => targetPose([], 0));
  assert.equal(targetPose([{ x: 10, attr: { cx: 4 } }, { attr: { cx: 6 } }], 1).values.x, 0);
});

test("all catalog examples ship inside the skill and can seed standalone projects", async () => {
  const catalog = JSON.parse(
    await readFile(
      new URL("../skills/html-presentation-craft/assets/examples/catalog.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(new Set(catalog.map((p) => p.id)).size, catalog.length);
  const root = await mkdtemp(join(tmpdir(), "craft-examples-"));
  try {
    for (const example of catalog) {
      const target = join(root, example.id);
      await createDeck(target, example.id);
      const canonical = await readFile(
        new URL(
          `../skills/html-presentation-craft/assets/examples/${example.id}/deck.tsx`,
          import.meta.url,
        ),
        "utf8",
      );
      assert.equal(await readFile(join(target, "src/deck.tsx"), "utf8"), canonical);
      await stat(join(target, "src/runtime/glyphs.tsx"));
    }
    await assert.rejects(createDeck(join(root, "bad"), "../bad"), /Unknown/);
    await assert.rejects(stat(join(root, "bad")));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI entry points work through symlinked installation paths", async () => {
  const root = await mkdtemp(join(tmpdir(), "craft-cli-"));
  try {
    const create = join(root, "create.mjs");
    await symlink(
      fileURLToPath(
        new URL("../skills/html-presentation-craft/scripts/create-deck.mjs", import.meta.url),
      ),
      create,
    );
    const project = join(root, "project");
    const created = spawnSync(process.execPath, [create, project, "--example", "anc"], {
      encoding: "utf8",
    });
    assert.equal(created.status, 0, created.stderr);
    assert.match(await readFile(join(project, "src/deck.tsx"), "utf8"), /id: "anc"/);
    const entry = join(root, "bundle.mjs");
    await symlink(
      fileURLToPath(
        new URL(
          "../skills/html-presentation-craft/assets/starter/scripts/bundle.mjs",
          import.meta.url,
        ),
      ),
      entry,
    );
    const dist = join(root, "dist");
    await mkdir(dist);
    await writeFile(join(dist, "index.html"), "<!doctype html><html><body>CLI probe</body></html>");
    const built = spawnSync(process.execPath, [entry, dist], { encoding: "utf8" });
    assert.equal(built.status, 0, built.stderr);
    assert.match(await readFile(join(dist, "演示.html"), "utf8"), /CLI probe/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
