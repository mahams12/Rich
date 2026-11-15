// End-to-end PDF import test: real PDF bytes → pdf.js (the exact version the
// app loads from cdnjs) → pdfPageToLines → parseTextIntoResume.
// Uses pdfjs-dist's Node-capable legacy build so no browser is required.

import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

import { blankImportResume, parseTextIntoResume, pdfPageToLines } from "../src/lib/resume/parser.js";

const require = createRequire(import.meta.url);
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
pdfjs.GlobalWorkerOptions.workerSrc = null; // run on the main thread in Node

const escapePdfText = (text) => String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

/**
 * Build a minimal but valid PDF in memory.
 * pages: [{ blocks: [{text, x, y, size}], links: [{url, rect:[x1,y1,x2,y2]}] }]
 * Coordinates use PDF user space (origin bottom-left), matching pdf.js output.
 */
function buildPdf(pages) {
  // Objects 1-3 are reserved for catalog, page tree and the shared font.
  const objects = [null, null, null];
  const kids = [];
  pages.forEach((page) => {
    const ops = (page.blocks || []).map((block) => `BT /F1 ${block.size || 11} Tf 1 0 0 1 ${block.x} ${block.y} Tm (${escapePdfText(block.text)}) Tj ET`);
    const stream = ops.join("\n");
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const contentObjNum = objects.length;
    const annots = [];
    (page.links || []).forEach((link) => {
      objects.push(`<< /Type /Annot /Subtype /Link /Rect [${link.rect.join(" ")}] /Border [0 0 0] /A << /S /URI /URI (${escapePdfText(link.url)}) >> >>`);
      annots.push(`${objects.length} 0 R`);
    });
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 3 0 R >> >> ${annots.length ? `/Annots [${annots.join(" ")}]` : ""} >>`);
    kids.push(`${objects.length} 0 R`);
  });
  objects[0] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${kids.length} >>`;
  objects[2] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  const all = objects;

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  all.forEach((body, index) => {
    offsets[index] = pdf.length;
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${all.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => { pdf += String(offset).padStart(10, "0") + " 00000 n \n"; });
  pdf += `trailer\n<< /Size ${all.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

const SIMPLE_PAGE = {
  blocks: [
    { text: "Jordan Lee", x: 50, y: 720, size: 24 },
    { text: "Senior Software Engineer", x: 50, y: 700 },
    { text: "jordan.lee@example.com | +1 555 010 2040", x: 50, y: 682 },
    { text: "linkedin.com/in/jordanlee", x: 50, y: 668 },
    { text: "WORK EXPERIENCE", x: 50, y: 630, size: 13 },
    { text: "Senior Software Engineer | Northstar Labs", x: 50, y: 610 },
    { text: "Jan 2021 - Present", x: 50, y: 596 },
    { text: "Led a team of five engineers building a real-time collaboration platform.", x: 50, y: 580 },
    { text: "Software Engineer | Brightside Co", x: 50, y: 560 },
    { text: "Jun 2017 - Dec 2020", x: 50, y: 546 },
    { text: "Built customer-facing analytics dashboards.", x: 50, y: 530 },
    { text: "EDUCATION", x: 50, y: 500, size: 13 },
    { text: "BSc, Computer Science | Westlake University", x: 50, y: 480 },
    { text: "2013 - 2017", x: 50, y: 466 },
    { text: "SKILLS", x: 50, y: 436, size: 13 },
    { text: "JavaScript, TypeScript, React, Node.js, PostgreSQL", x: 50, y: 416 },
  ],
};

const TWO_COLUMN_PAGE = {
  blocks: [
    // left rail (contact + skills)
    { text: "Ahmed Raza", x: 330, y: 730, size: 22 },
    { text: "CONTACT", x: 40, y: 700, size: 12 },
    { text: "ahmed.raza@example.com", x: 40, y: 682 },
    { text: "+92 300 1234567", x: 40, y: 668 },
    { text: "Lahore, Pakistan", x: 40, y: 654 },
    { text: "SKILLS", x: 40, y: 620, size: 12 },
    { text: "Flutter", x: 40, y: 602 },
    { text: "Dart", x: 40, y: 588 },
    { text: "Firebase", x: 40, y: 574 },
    { text: "Git", x: 40, y: 560 },
    // right/main column
    { text: "Flutter Developer", x: 330, y: 710 },
    { text: "EXPERIENCE", x: 330, y: 676, size: 13 },
    { text: "Flutter Developer | TechSolutions Pvt Ltd", x: 330, y: 656 },
    { text: "Mar 2022 - Present", x: 330, y: 642 },
    { text: "Developed production Flutter apps with 50k+ downloads.", x: 330, y: 626 },
    { text: "EDUCATION", x: 330, y: 592, size: 13 },
    { text: "BS Computer Science", x: 330, y: 572 },
    { text: "University of Engineering and Technology, Lahore", x: 330, y: 558 },
    { text: "2017 - 2021", x: 330, y: 544 },
  ],
  links: [
    { url: "https://github.com/ahmedraza", rect: [38, 649, 160, 660] },
  ],
};

async function extractLines(pdfBytes) {
  const doc = await pdfjs.getDocument({ data: pdfBytes, isEvalSupported: false }).promise;
  const lines = [];
  let columns = false;
  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const annotations = await page.getAnnotations({ intent: "display" });
    const result = pdfPageToLines(content.items, annotations, viewport.width);
    columns = columns || result.columnDetected;
    lines.push(...result.lines, "");
  }
  return { text: lines.join("\n"), columns };
}

test("single-column PDF → pdfPageToLines → parseTextIntoResume", async () => {
  const { text, columns } = await extractLines(buildPdf([SIMPLE_PAGE]));
  assert.equal(columns, false);
  const { resume, report } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(report.valid, true);
  assert.equal(resume.profile.fullName, "Jordan Lee");
  assert.equal(resume.profile.headline, "Senior Software Engineer");
  assert.equal(resume.profile.email, "jordan.lee@example.com");
  assert.match(resume.profile.phone, /555 010 2040/);
  assert.match(resume.profile.linkedin, /linkedin\.com\/in\/jordanlee/);
  assert.equal(resume.experience.length, 2);
  assert.equal(resume.experience[0].company, "Northstar Labs");
  assert.equal(resume.experience[0].start, "Jan 2021");
  assert.equal(resume.experience[1].end, "Dec 2020");
  assert.equal(resume.education.length, 1);
  assert.match(resume.education[0].school, /Westlake University/);
  assert.ok(resume.skills.includes("TypeScript"));
  assert.ok(resume.skills.includes("PostgreSQL"));
});

test("two-column PDF → column detection → accurate section mapping", async () => {
  const { text, columns } = await extractLines(buildPdf([TWO_COLUMN_PAGE]));
  assert.equal(columns, true);
  const { resume, report } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(report.valid, true);
  assert.equal(resume.profile.fullName, "Ahmed Raza");
  assert.equal(resume.profile.headline, "Flutter Developer");
  assert.equal(resume.profile.email, "ahmed.raza@example.com");
  assert.match(resume.profile.phone, /300 1234567/);
  assert.match(resume.profile.location, /Lahore, Pakistan/);
  assert.equal(resume.profile.github, "https://github.com/ahmedraza");
  assert.equal(resume.experience.length, 1);
  assert.equal(resume.experience[0].company, "TechSolutions Pvt Ltd");
  assert.match(resume.experience[0].details, /50k\+ downloads/);
  assert.equal(resume.education.length, 1);
  assert.match(resume.education[0].school, /University of Engineering and Technology/);
  assert.ok(resume.skills.includes("Flutter"));
  assert.ok(resume.skills.includes("Firebase"));
  assert.ok(!resume.skills.includes("SKILLS"));
});

test("multi-page PDF concatenates pages with a blank separator", async () => {
  const page2 = { blocks: [{ text: "PROJECTS", x: 50, y: 720, size: 13 }, { text: "Campus Connect", x: 50, y: 700 }, { text: "Built a student community platform.", x: 50, y: 684 }] };
  const { text } = await extractLines(buildPdf([SIMPLE_PAGE, page2]));
  const { resume } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(resume.projects.length, 1);
  assert.equal(resume.projects[0].name, "Campus Connect");
  assert.match(resume.projects[0].details, /student community platform/);
});

test("image-only PDF produces too little text and is flagged invalid", async () => {
  const emptyPage = { blocks: [] };
  const { text } = await extractLines(buildPdf([emptyPage]));
  assert.ok(text.trim().length < 80);
  const { report } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(report.valid, false);
});

test("corrupt PDF data rejects cleanly instead of hanging", async () => {
  const junk = new TextEncoder().encode("%PDF-1.4 this is not a real pdf body at all");
  await assert.rejects(() => pdfjs.getDocument({ data: junk, isEvalSupported: false }).promise);
});
