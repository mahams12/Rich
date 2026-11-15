// End-to-end PDF export verification: loads the live app in headless Chrome,
// prints to PDF (same code path as "Save as PDF"), then asserts the exported
// document is a real A4 resume — text present, positioned inside the page.
//
// Requires a running dev server (default http://localhost:3000) and Chrome.
// Run: PRINT_E2E=1 npm test   (or E2E_URL=http://localhost:3000)

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.E2E_URL || "http://localhost:3000";
const ENABLED = process.env.PRINT_E2E === "1";

async function pdfTextItems(path) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(path)), isEvalSupported: false }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    pages.push({ width: viewport.width, height: viewport.height, items: content.items.map((i) => ({ str: i.str, x: i.transform[4], y: i.transform[5] })) });
  }
  return pages;
}

test("print-to-PDF produces a real A4 resume from the editor view", { skip: !ENABLED, timeout: 90000 }, async () => {
  const dir = mkdtempSync(join(tmpdir(), "rb-print-"));
  const out = join(dir, "resume.pdf");
  try {
    execFileSync(CHROME, [
      "--headless=new", "--disable-gpu",
      `--print-to-pdf=${out}`, "--no-pdf-header-footer",
      "--virtual-time-budget=20000",
      `${BASE_URL}/resume-builder?view=editor`,
    ], { stdio: "pipe", timeout: 60000 });
  } catch (error) {
    const status = error.status === undefined ? "timeout" : `exit ${error.status}`;
    assert.fail(`headless Chrome print failed (${status}): ${String(error.stderr || error.message).slice(0, 300)}`);
  }

  const pages = await pdfTextItems(out);
  rmSync(dir, { recursive: true, force: true });

  assert.ok(pages.length >= 1, "exported PDF has no pages");
  const first = pages[0];
  assert.ok(Math.abs(first.width - 595.3) < 4 && Math.abs(first.height - 841.9) < 4,
    `page size should be A4 (595x842pt), got ${first.width}x${first.height}`);

  const text = pages.map((p) => p.items.map((i) => i.str).join(" ")).join("\n");
  assert.match(text, /Jordan Lee/i, "resume name missing from exported PDF");
  assert.match(text, /Software Engineering Intern|Northstar Labs/i, "experience content missing from exported PDF");

  // Nothing app chrome should leak into the document.
  assert.doesNotMatch(text, /Resume Studio|Export PDF|Templates|All resumes|Keyword/i,
    "app UI leaked into the exported PDF");

  // The sheet must start near the page origin — the previous layout hid
  // siblings with visibility:hidden so the sheet printed offset and clipped.
  const nameItem = first.items.find((i) => /Jordan Lee/i.test(i.str));
  assert.ok(nameItem, "name not found as selectable text");
  assert.ok(nameItem.x < first.width * 0.65, `resume starts too far right (x=${nameItem.x}) — layout offset bug`);
  const maxRight = Math.max(...first.items.map((i) => i.x + (i.width || 0)));
  assert.ok(maxRight <= first.width - 30, `content clipped at right edge (maxRight=${maxRight})`);
});
