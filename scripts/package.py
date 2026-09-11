"""Package the installable skill and receiver examples, then verify every ZIP member."""
from pathlib import Path
import hashlib
import json
import shutil
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "outputs"
EXCLUDED = {"node_modules", "dist", "delivery", ".DS_Store", "__pycache__"}

def skill_files():
    source = ROOT / "skills" / "html-presentation-craft"
    for file in sorted(source.rglob("*")):
        if file.is_file() and not any(part in EXCLUDED for part in file.relative_to(source).parts):
            yield file, "html-presentation-craft/" + file.relative_to(source).as_posix()

def archive(name, members):
    destination = OUTPUT / name
    expected = {}
    with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED) as z:
        for file, path in members:
            data = file.read_bytes()
            expected[path] = hashlib.sha256(data).hexdigest()
            z.writestr(path, data)
        z.writestr("SHA256.json", json.dumps(expected, indent=2, ensure_ascii=False))
    with tempfile.TemporaryDirectory(prefix="presentation-package-") as temporary:
        with zipfile.ZipFile(destination) as z:
            assert z.testzip() is None
            z.extractall(temporary)
        for path, checksum in expected.items():
            assert hashlib.sha256((Path(temporary) / path).read_bytes()).hexdigest() == checksum
    return {"file": name, "members": len(expected) + 1, "bytes": destination.stat().st_size, "extractedChecksums": "passed"}

if __name__ == "__main__":
    OUTPUT.mkdir(exist_ok=True)
    reports = [archive("html-presentation-craft.zip", list(skill_files()))]
    examples = []
    catalog = json.loads((ROOT / "skills/html-presentation-craft/assets/examples/catalog.json").read_text())
    for item in catalog:
        genre = item["id"]
        source = OUTPUT / "examples" / genre
        for file in sorted(source.rglob("*")):
            if file.is_file() and "source" not in file.relative_to(source).parts:
                examples.append((file, genre + "/" + file.relative_to(source).as_posix()))
    guide = OUTPUT / "示例包说明.md"
    guide.write_text("# HTML 演示示例\n\n每个主题目录的最终入口都是 `演示.html`，双击用浏览器打开。使用方向键逐步播放，N 查看讲稿，O 总览。浏览器或系统若限制本地 HTML，可使用静态 HTTP 服务。\n\n" + "\n".join(f"- {item['id']}/演示.html：{item['title']}" for item in catalog) + "\n\n每个目录附有讲稿、来源与许可说明。完整可编辑源码位于另一个 html-presentation-craft.zip 的 assets/examples；创建命令见包内 SKILL.md。\n")
    examples.append((guide, "开始阅读.md"))
    reports.append(archive("presentation-craft-examples.zip", examples))
    (OUTPUT / "package-report.json").write_text(json.dumps(reports, indent=2))
    downloads = ROOT / "downloads"
    downloads.mkdir(exist_ok=True)
    checksums = {}
    for report in reports:
        file = OUTPUT / report["file"]
        shutil.copyfile(file, downloads / file.name)
        checksums[file.name] = hashlib.sha256(file.read_bytes()).hexdigest()
    (downloads / "SHA256.json").write_text(json.dumps(checksums, indent=2) + "\n")
    print(json.dumps(reports, indent=2))
