import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const files = walk(".");
const re = /https:\/\/images\.unsplash\.com\/[^"'\\\s]+/g;
const urls = new Set();
const byFile = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  let match;
  while ((match = re.exec(text))) {
    urls.add(match[0]);
    if (!byFile.has(match[0])) byFile.set(match[0], []);
    byFile.get(match[0]).push(file);
  }
}

const broken = [];
for (const url of [...urls].sort()) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    console.log(`${res.status} ${url}`);
    if (!res.ok) broken.push({ url, status: res.status, files: byFile.get(url) });
  } catch (error) {
    console.log(`ERR ${url} ${error.message}`);
    broken.push({ url, status: "ERR", files: byFile.get(url) });
  }
}

console.log("\nBROKEN_COUNT", broken.length);
for (const item of broken) {
  console.log("BROKEN", item.status, item.url);
  for (const file of item.files ?? []) console.log("  ", file);
}
