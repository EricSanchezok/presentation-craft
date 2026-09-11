import { readFile, writeFile, cp, realpath } from "node:fs/promises";
import { resolve, dirname, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, serialize } from "parse5";
import { parse as parseJS } from "acorn";
import postcss from "postcss";
import valueParser from "postcss-value-parser";

const local = (value) => value.startsWith("data:") || value.startsWith("#") || !value;
function attribute(node, name) {
  return node.attrs?.find((a) => a.name === name)?.value;
}
function children(node) {
  return node.childNodes || [];
}
function walk(node, action) {
  action(node);
  for (const child of children(node)) walk(child, action);
}
function verifyCSS(css) {
  const tree = postcss.parse(css);
  tree.walkAtRules("import", () => {
    throw new Error("Offline CSS must not contain @import.");
  });
  tree.walkDecls((decl) =>
    valueParser(decl.value).walk((node) => {
      if (node.type !== "function" || node.value.toLowerCase() !== "url") return;
      const value = valueParser
        .stringify(node.nodes)
        .trim()
        .replace(/^(['"])(.*)\1$/, "$2");
      if (!local(value)) throw new Error(`Unembedded CSS resource: ${value.slice(0, 100)}`);
    }),
  );
}
export function auditHTML(html) {
  const tree = parse(html);
  walk(tree, (node) => {
    if (node.tagName === "style")
      verifyCSS(
        children(node)
          .map((n) => n.value || "")
          .join(""),
      );
    const style = attribute(node, "style");
    if (style) verifyCSS(`a{${style}}`);
    for (const name of ["src", "poster", "srcset"]) {
      const value = attribute(node, name);
      if (value && !local(value))
        throw new Error(`Unembedded ${node.tagName} ${name}: ${value.slice(0, 100)}`);
      // Multiple candidates need explicit imports and a single chosen local asset for this starter.
      if (name === "srcset" && value)
        throw new Error(
          "Use one imported image source in offline slides; srcset is not supported.",
        );
    }
    if (["link", "image", "use"].includes(node.tagName)) {
      const value = attribute(node, "href");
      if (value && !local(value)) throw new Error(`Unembedded ${node.tagName} href: ${value}`);
    }
    if (node.tagName === "iframe" || node.tagName === "object")
      throw new Error("Embedded remote documents require a separate delivery agreement.");
  });
}
export async function bundle(directory) {
  const root = resolve(directory);
  const tree = parse(await readFile(resolve(root, "index.html"), "utf8"));
  const resources = [];
  const asset = async (value) => {
    if (/^[a-z]+:|^\/\//i.test(value)) throw new Error(`External build resource: ${value}`);
    const location = resolve(root, decodeURIComponent(value.replace(/^\//, "")));
    const rel = relative(root, location);
    if (rel.startsWith("..") || isAbsolute(rel))
      throw new Error("Build resource leaves output directory.");
    resources.push(rel);
    return readFile(location, "utf8");
  };
  const nodes = [];
  walk(tree, (node) => nodes.push(node));
  for (const node of nodes) {
    if (node.tagName === "script" && attribute(node, "src")) {
      const code = await asset(attribute(node, "src"));
      // A split module would need a file URL and would break double-click delivery.
      const pending = [parseJS(code, { ecmaVersion: "latest", sourceType: "module" })];
      while (pending.length) {
        const item = pending.pop();
        if (!item || typeof item !== "object") continue;
        if (
          item.type === "ImportDeclaration" ||
          item.type === "ImportExpression" ||
          ((item.type === "ExportNamedDeclaration" || item.type === "ExportAllDeclaration") &&
            item.source)
        )
          throw new Error("The build still contains split modules.");
        for (const value of Object.values(item)) {
          if (Array.isArray(value)) pending.push(...value);
          else if (value && typeof value === "object") pending.push(value);
        }
      }
      node.attrs = [{ name: "type", value: "module" }];
      node.childNodes = [
        {
          nodeName: "#text",
          value: code.replace(/<\/script/gi, (text) => "<\\/" + text.slice(2)),
          parentNode: node,
        },
      ];
    }
    if (node.tagName === "link" && attribute(node, "rel") === "stylesheet") {
      const css = await asset(attribute(node, "href"));
      verifyCSS(css);
      node.nodeName = node.tagName = "style";
      node.attrs = [];
      node.childNodes = [{ nodeName: "#text", value: css, parentNode: node }];
    }
  }
  const html = serialize(tree);
  auditHTML(html);
  await writeFile(resolve(root, "演示.html"), html);
  const project = dirname(root);
  try {
    await cp(resolve(project, "delivery"), root, { recursive: true });
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  try {
    await cp(resolve(project, "ASSETS.md"), resolve(root, "素材来源.md"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  const report = {
    bytes: Buffer.byteLength(html),
    embeddedBuildFiles: resources,
    checks: ["HTML resource attributes", "CSS URLs and imports", "split-module guard"],
    runtimeNetworkTest:
      "Run the browser check; static inspection cannot prove arbitrary JavaScript is offline.",
  };
  try {
    await cp(resolve(project, "licenses"), resolve(root, "licenses"), { recursive: true });
    await cp(resolve(project, "THIRD_PARTY.md"), resolve(root, "THIRD_PARTY.md"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  await writeFile(resolve(root, "asset-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(`Built 演示.html (${(report.bytes / 1024 / 1024).toFixed(2)} MB)`);
  return report;
}
if (
  process.argv[1] &&
  (await realpath(fileURLToPath(import.meta.url))) === (await realpath(resolve(process.argv[1])))
)
  await bundle(process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), "../dist"));
