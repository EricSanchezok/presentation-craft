import { cp, mkdir, stat, readFile, realpath } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
export async function createDeck(target, example) {
  if (example) {
    const catalog = JSON.parse(
      await readFile(new URL("../assets/examples/catalog.json", import.meta.url), "utf8"),
    );
    if (!catalog.some((entry) => entry.id === example))
      throw new Error(`Unknown example: ${example}`);
  }
  const destination = resolve(target);
  try {
    await stat(destination);
    throw new Error(`Target already exists: ${destination}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(destination, { recursive: true });
  await cp(fileURLToPath(new URL("../assets/starter/", import.meta.url)), destination, {
    recursive: true,
    filter: (path) => !["node_modules", "dist", "delivery", ".DS_Store"].includes(basename(path)),
  });
  if (example)
    await cp(
      fileURLToPath(new URL(`../assets/examples/${example}/deck.tsx`, import.meta.url)),
      resolve(destination, "src/deck.tsx"),
    );
  return destination;
}
if (
  process.argv[1] &&
  (await realpath(fileURLToPath(import.meta.url))) === (await realpath(resolve(process.argv[1])))
) {
  if (!process.argv[2])
    throw new Error("Usage: node create-deck.mjs /absolute/new-project [--example anc]");
  if (
    process.argv[3] &&
    (process.argv[3] !== "--example" || !process.argv[4] || process.argv.length !== 5)
  )
    throw new Error("Expected --example <id>");
  console.log(await createDeck(process.argv[2], process.argv[4]));
}
