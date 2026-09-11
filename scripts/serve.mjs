import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, relative, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
export async function serve(directory, port = 0) {
  const root = resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      let file = resolve(root, "." + pathname);
      const rel = relative(root, file);
      if (rel.startsWith("..") || isAbsolute(rel)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      const mime =
        {
          ".html": "text/html; charset=utf-8",
          ".json": "application/json",
          ".png": "image/png",
          ".pdf": "application/pdf",
          ".md": "text/plain; charset=utf-8",
        }[extname(file)] || "application/octet-stream";
      response.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { url } = await serve(fileURLToPath(new URL("../outputs/", import.meta.url)), 4175);
  console.log(url);
}
