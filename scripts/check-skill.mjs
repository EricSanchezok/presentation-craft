import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { extractLinks } from "./verify-doc-links.mjs";
const root = resolve("skills/html-presentation-craft");
const docs = [
  resolve(root, "SKILL.md"),
  resolve(root, "assets/examples/README.md"),
  ...(await readdir(resolve(root, "references")))
    .filter((f) => f.endsWith(".md"))
    .map((f) => resolve(root, "references", f)),
];
const errors = [];
for (const file of docs) {
  const text = await readFile(file, "utf8");
  for (const { filePart } of extractLinks(text)) {
    if (!filePart) continue;
    const target = resolve(dirname(file), filePart);
    if (relative(root, target).startsWith("..")) errors.push(`${file}: reference leaves skill`);
    try {
      await stat(target);
    } catch {
      errors.push(`${file}: missing ${filePart}`);
    }
  }
}
for (const file of [
  "agents/openai.yaml",
  "scripts/create-deck.mjs",
  "assets/starter/package-lock.json",
  "assets/starter/scripts/bundle.mjs",
])
  try {
    await stat(resolve(root, file));
  } catch {
    errors.push(`Missing packaged resource: ${file}`);
  }
if (errors.length) throw new Error(errors.join("\n"));
console.log(`Skill references OK (${docs.length} documents; all required targets inside package).`);
