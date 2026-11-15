import test from "node:test";
import assert from "node:assert/strict";

import {
  DATE_RANGE_RE,
  blankImportResume,
  extractDateRange,
  extractGithubProfileUrl,
  extractKeywords,
  extractSkillItems,
  importLinkedInRows,
  makeId,
  normalizeResumeLines,
  normalizeSectionHeading,
  parseCsv,
  parseTextIntoResume,
  pdfPageToLines,
  resumePrintTitle,
  safeResume,
  splitOutsideParentheses,
  splitResumeSections,
  starterResume,
  validateResumeJson,
} from "../src/lib/resume/parser.js";

const US_RESUME = `Jordan Lee
Senior Software Engineer
jordan.lee@example.com | +1 555 010 2040 | Austin, TX
linkedin.com/in/jordanlee | github.com/jordanlee | jordanlee.dev

PROFESSIONAL SUMMARY
Senior software engineer with 8 years of experience building reliable web applications, distributed systems and developer tooling.

WORK EXPERIENCE
Senior Software Engineer | Northstar Labs
Jan 2021 - Present
Led a team of five engineers building a real-time collaboration platform.
Reduced API latency by 40% through query optimization and caching.

Software Engineer | Brightside Co
Jun 2017 - Dec 2020
Built customer-facing analytics dashboards used by 2M monthly users.
Maintained CI pipelines and release automation.

EDUCATION
BSc, Computer Science | Westlake University
2013 - 2017
Graduated with honors. Relevant coursework: distributed systems, databases.

PROJECTS
Campus Connect
github.com/jordanlee/campus-connect
Built a student community platform with searchable events and role-based access.

SKILLS
JavaScript, TypeScript, React, Node.js, PostgreSQL, GraphQL, AWS, Docker

CERTIFICATIONS
AWS Certified Solutions Architect
CKA: Certified Kubernetes Administrator

LANGUAGES
English — Native, Spanish — Conversational

INTERESTS
Open source, Trail running, Mentoring`;

const PK_RESUME = `Ahmed Raza
Flutter Developer
Lahore, Pakistan
ahmed.raza@example.com +92 300 1234567

PROFILE
Flutter developer building cross-platform mobile applications with Firebase backends and clean architecture.

EXPERIENCE
Flutter Developer | TechSolutions Pvt Ltd
Mar 2022 - Present
Developed and maintained production Flutter apps with 50k+ downloads.

EDUCATION
BS Computer Science
University of Engineering and Technology, Lahore
2017 - 2021

PROJECTS
SafeApp: Flutter secure messaging app with end-to-end encryption
Campus Events — React Native app for university event discovery
github.com/ahmedraza/campus-events
Also built: Invoice Generator, Prayer Times Widget (in development), Notes Sync

SOFTWARE & SKILLS
Flutter, Dart, Firebase, REST APIs, Provider, Git

LANGUAGES
English, Urdu

HOBBIES & INTERESTS
Cricket, Open source`;

test("parseTextIntoResume extracts a complete US-style resume", () => {
  const { resume, report } = parseTextIntoResume(US_RESUME, blankImportResume(null));
  assert.equal(report.valid, true);
  assert.equal(resume.profile.fullName, "Jordan Lee");
  assert.equal(resume.profile.headline, "Senior Software Engineer");
  assert.equal(resume.profile.email, "jordan.lee@example.com");
  assert.equal(resume.profile.phone, "+1 555 010 2040");
  assert.equal(resume.profile.linkedin, "linkedin.com/in/jordanlee");
  assert.equal(resume.profile.github, "https://github.com/jordanlee");
  assert.equal(resume.profile.website, "jordanlee.dev");
  assert.match(resume.profile.summary, /8 years of experience/);
  assert.equal(resume.experience.length, 2);
  assert.equal(resume.experience[0].role, "Senior Software Engineer");
  assert.equal(resume.experience[0].company, "Northstar Labs");
  assert.equal(resume.experience[0].start, "Jan 2021");
  assert.equal(resume.experience[0].end, "Present");
  assert.match(resume.experience[0].details, /real-time collaboration platform/);
  assert.equal(resume.experience[1].company, "Brightside Co");
  assert.equal(resume.education.length, 1);
  assert.match(resume.education[0].degree, /BSc/);
  assert.match(resume.education[0].school, /Westlake University/);
  assert.equal(resume.education[0].start, "2013");
  assert.equal(resume.education[0].end, "2017");
  assert.equal(resume.projects.length, 1);
  assert.equal(resume.projects[0].name, "Campus Connect");
  assert.match(resume.projects[0].link, /github\.com\/jordanlee\/campus-connect/);
  assert.ok(resume.skills.includes("TypeScript"));
  assert.ok(resume.skills.includes("GraphQL"));
  assert.equal(resume.certificates.length, 2);
  assert.match(resume.certificates[0].name, /AWS Certified/);
  assert.ok(resume.languages.some((l) => /English/.test(l)));
  assert.ok(resume.interests.includes("Trail running"));
});

test("parseTextIntoResume handles PK-style CVs with heading variants", () => {
  const { resume, report } = parseTextIntoResume(PK_RESUME, blankImportResume(null));
  assert.equal(report.valid, true);
  assert.equal(resume.profile.fullName, "Ahmed Raza");
  assert.equal(resume.profile.headline, "Flutter Developer");
  assert.equal(resume.profile.email, "ahmed.raza@example.com");
  assert.match(resume.profile.phone, /300 1234567/);
  assert.match(resume.profile.location, /Lahore, Pakistan/);
  assert.match(resume.profile.summary, /cross-platform mobile applications/);
  assert.equal(resume.experience.length, 1);
  assert.equal(resume.experience[0].role, "Flutter Developer");
  assert.equal(resume.experience[0].company, "TechSolutions Pvt Ltd");
  assert.equal(resume.education.length, 1);
  assert.match(resume.education[0].degree, /BS Computer Science/);
  assert.match(resume.education[0].school, /University of Engineering and Technology/);
  const projectNames = resume.projects.map((p) => p.name);
  assert.ok(projectNames.some((n) => /SafeApp/.test(n)));
  assert.ok(projectNames.some((n) => /Campus Events/.test(n)));
  assert.ok(projectNames.some((n) => /Invoice Generator/.test(n)));
  assert.ok(resume.projects.some((p) => /github\.com\/ahmedraza/.test(p.link)));
  assert.ok(resume.skills.includes("Flutter"));
  assert.ok(resume.skills.includes("Dart"));
  assert.ok(resume.languages.includes("English"));
  assert.ok(resume.interests.includes("Cricket"));
});

test("parseTextIntoResume parses inline 'Heading: content' sections", () => {
  const text = `Maria Silva
maria@example.com

Experience: Product Manager, Flowbase (2020 - Present)
Education: MBA, Lisbon School of Economics
Skills: Roadmapping, SQL, A/B testing`;
  const { resume, report } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(report.valid, true);
  assert.equal(resume.profile.fullName, "Maria Silva");
  assert.equal(resume.experience.length, 1);
  assert.match(resume.experience[0].role, /Product Manager/);
  assert.ok(resume.skills.includes("SQL"));
});

test("parseTextIntoResume does not leak work dates into education", () => {
  const text = `Sam Ode
sam@example.com

EXPERIENCE
Engineer | Acme
Jan 2020 - Dec 2022
Built things.

EDUCATION
BSc Physics | State University Jan 2020 - Dec 2022
Graduated.`;
  const { resume } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(resume.education.length, 1);
  assert.equal(resume.education[0].start, "");
  assert.equal(resume.education[0].end, "");
});

test("parseTextIntoResume rejects garbage and short input", () => {
  const garbage = parseTextIntoResume("asdkfjh alskdjf zxcv", blankImportResume(null));
  assert.equal(garbage.report.valid, false);
  const empty = parseTextIntoResume("", blankImportResume(null));
  assert.equal(empty.report.valid, false);
  const nonsense = parseTextIntoResume("blah ".repeat(60), blankImportResume(null));
  assert.equal(nonsense.report.valid, false);
});

test("parseTextIntoResume keeps explicit Name: labels as the identity", () => {
  const text = `RESUME
Name: Priya Sharma
priya@example.com

EXPERIENCE
Data Analyst | Insights Ltd
2021 - Present
Analyzed data.`;
  const { resume } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(resume.profile.fullName, "Priya Sharma");
});

test("dates embedded in a role line still split correctly", () => {
  const text = `Pat Kim
pat@example.com

EXPERIENCE
Backend Developer Feb 2019 - Aug 2021
CoreStack Inc
Shipped payment services.

SKILLS
Python, Django`;
  const { resume } = parseTextIntoResume(text, blankImportResume(null));
  assert.equal(resume.experience.length, 1);
  assert.equal(resume.experience[0].start, "Feb 2019");
  assert.equal(resume.experience[0].end, "Aug 2021");
});

// ── pdfPageToLines ───────────────────────────────────────────────────────

const item = (text, x, y, width = 60, height = 11) => ({
  str: text,
  transform: [height, 0, 0, height, x, y],
  width,
});

test("pdfPageToLines reconstructs rows and keeps column gaps as separators", () => {
  const items = [
    item("Jordan Lee", 50, 700, 120),
    item("jordan@x.com", 50, 680, 100),
    item("Austin, TX", 250, 680, 80),
    item("Experience", 50, 640, 90),
  ];
  const { lines, columnDetected } = pdfPageToLines(items, [], 612);
  assert.equal(columnDetected, false);
  assert.deepEqual(lines, ["Jordan Lee", "jordan@x.com | Austin, TX", "Experience"]);
});

test("pdfPageToLines detects two-column layout and hoists identity into the header", () => {
  const items = [
    // left column (skills rail)
    item("Skills", 40, 700, 50),
    item("JavaScript", 40, 680, 70),
    item("React", 40, 660, 40),
    item("Node.js", 40, 640, 50),
    // right column (main)
    item("Jordan Lee", 340, 700, 130),
    item("Experience", 340, 680, 80),
    item("Senior Dev", 340, 660, 80),
    item("Northstar Labs", 340, 640, 100),
  ];
  const { lines, columnDetected } = pdfPageToLines(items, [], 612);
  assert.equal(columnDetected, true);
  // The name at the top of the main column must land in the header preamble,
  // not inside the rail's last section.
  assert.equal(lines[0], "Jordan Lee");
  assert.ok(lines.includes("Skills"));
  assert.ok(lines.includes("Experience"));
});

test("pdfPageToLines attaches link annotation URLs to their labels", () => {
  const items = [
    item("Campus Connect", 50, 700, 110),
  ];
  const annotations = [{
    subtype: "Link",
    url: "https://github.com/jordanlee/campus-connect",
    rect: [48, 695, 165, 712],
  }];
  const { lines } = pdfPageToLines(items, annotations, 612);
  assert.equal(lines[0], "Campus Connect https://github.com/jordanlee/campus-connect");
});

test("pdfPageToLines places orphan link annotations as standalone lines", () => {
  const items = [item("Jordan Lee", 50, 700, 120)];
  const annotations = [{
    subtype: "Link",
    url: "https://jordanlee.dev",
    rect: [400, 690, 490, 705],
  }];
  const { lines } = pdfPageToLines(items, annotations, 612);
  assert.ok(lines.some((l) => l.includes("https://jordanlee.dev")));
});

// ── CSV / LinkedIn import ─────────────────────────────────────────────────

test("parseCsv handles quoting, CRLF, embedded newlines and BOM", () => {
  const csv = '﻿Name,Title,Notes\n"Doe, Jane","Senior ""Dev""","Line one\nLine two"\r\nJohn,Eng,\r\n';
  const rows = parseCsv(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].Name, "Doe, Jane");
  assert.equal(rows[0].Title, 'Senior "Dev"');
  assert.equal(rows[0].Notes, "Line one\nLine two");
  assert.equal(rows[1].Name, "John");
});

test("importLinkedInRows merges Profile, Positions, Education, Skills, Certifications", () => {
  const files = [
    { name: "Profile.csv", rows: parseCsv('First Name,Last Name,Headline,Summary,Geo Location,Websites\nJordan,Lee,Senior Engineer,Builder of things,Austin TX,"https://jordanlee.dev,https://github.com/jordanlee"') },
    { name: "Email Addresses.csv", rows: parseCsv("Email Address,Confirmed\njordan.lee@example.com,Yes") },
    { name: "Positions.csv", rows: parseCsv("Company Name,Title,Description,Location,Started On,Finished On\nNorthstar Labs,Senior Software Engineer,Led platform work,Austin,Jan 2021,\nBrightside Co,Software Engineer,Built dashboards,Remote,Jun 2017,Dec 2020") },
    { name: "Education.csv", rows: parseCsv("School Name,Degree Name,Field Of Study,Start Date,End Date,Notes\nWestlake University,BSc,Computer Science,2013,2017,Honors") },
    { name: "Skills.csv", rows: parseCsv("Name\nJavaScript\nReact\nJavaScript\nPostgreSQL") },
    { name: "Certifications.csv", rows: parseCsv("Name,Authority,Started On,Url\nAWS SAA,Amazon,2022,https://credly.example/aws") },
  ];
  const { resume, report } = importLinkedInRows(files, blankImportResume(null));
  assert.equal(report.valid, true);
  assert.equal(resume.profile.fullName, "Jordan Lee");
  assert.equal(resume.profile.headline, "Senior Engineer");
  assert.equal(resume.profile.email, "jordan.lee@example.com");
  assert.equal(resume.profile.location, "Austin TX");
  assert.equal(resume.profile.website, "https://jordanlee.dev");
  assert.equal(resume.profile.github, "https://github.com/jordanlee");
  assert.equal(resume.experience.length, 2);
  assert.equal(resume.experience[0].company, "Northstar Labs");
  assert.equal(resume.experience[0].end, "");
  assert.equal(resume.education.length, 1);
  assert.match(resume.education[0].degree, /BSc — Computer Science/);
  assert.deepEqual(resume.skills, ["JavaScript", "React", "PostgreSQL"]);
  assert.equal(resume.certificates.length, 1);
  assert.equal(resume.certificates[0].issuer, "Amazon");
  assert.ok(report.importedParts.includes("Positions"));
});

test("importLinkedInRows rejects unrecognized CSVs and too-empty selections", () => {
  assert.throws(() => importLinkedInRows([{ name: "random.csv", rows: parseCsv("a,b\n1,2") }], blankImportResume(null)), /not a recognized LinkedIn export/);
  assert.throws(() => importLinkedInRows([{ name: "Skills.csv", rows: parseCsv("Name\nJavaScript") }], blankImportResume(null)), /too little profile information/);
});

// ── JSON backup / model helpers ───────────────────────────────────────────

test("validateResumeJson round-trips an exported backup", () => {
  const base = blankImportResume(null);
  const original = starterResume("r1");
  original.title = "My resume";
  original.accent = "#123456";
  const { resume, report } = validateResumeJson(original, base);
  assert.equal(report.valid, true);
  assert.equal(resume.id, base.id);
  assert.equal(resume.profile.fullName, "Jordan Lee");
  assert.equal(resume.accent, "#123456");
  assert.equal(resume.experience.length, 1);
});

test("validateResumeJson unwraps {resume} envelopes and rejects non-resume JSON", () => {
  const base = blankImportResume(null);
  const { resume } = validateResumeJson({ resume: starterResume("x") }, base);
  assert.equal(resume.id, base.id);
  assert.throws(() => validateResumeJson({ foo: "bar" }, base), /not a NovexaHub resume backup/);
  assert.throws(() => validateResumeJson([1, 2, 3], base), /does not contain a resume object/);
  assert.throws(() => validateResumeJson({ profile: {} }, base), /too little resume information/);
});

test("safeResume remaps legacy templates and never backfills demo content", () => {
  const legacy = safeResume({ id: "a", template: "executive", skills: "not-an-array" });
  assert.equal(legacy.template, "folio");
  assert.deepEqual(legacy.skills, []);
  assert.equal(legacy.profile.fullName, "");
  assert.equal(safeResume({ id: "b", template: "nonsense" }).template, "vertical");
  assert.equal(safeResume(null), null);
});

test("blankImportResume carries a usable default section order", () => {
  const blank = blankImportResume(null);
  assert.ok(blank.sectionOrder.length >= 8);
  assert.ok(blank.sectionOrder.includes("experience"));
});

// ── Small utility functions ───────────────────────────────────────────────

test("extractKeywords ranks recurring non-stop terms", () => {
  const keywords = extractKeywords("React React React node node aws the and for with kubernetes kubernetes");
  assert.equal(keywords[0], "react");
  assert.ok(keywords.includes("kubernetes"));
  assert.ok(!keywords.includes("the"));
});

test("extractSkillItems splits categories without breaking parenthesized groups", () => {
  const skills = extractSkillItems([
    "Languages: JavaScript, TypeScript, Python",
    "Frameworks: React (Native, Next.js), Express",
    "PostgreSQL; Redis",
  ]);
  assert.ok(skills.includes("JavaScript"));
  assert.ok(skills.includes("React (Native, Next.js)"));
  assert.ok(skills.includes("Redis"));
});

test("splitOutsideParentheses respects nested groups", () => {
  assert.deepEqual(splitOutsideParentheses("a, b (x, y), c"), ["a", "b (x, y)", "c"]);
  assert.deepEqual(splitOutsideParentheses("one;two[three;four];five"), ["one", "two[three;four]", "five"]);
});

test("extractDateRange covers month-year, numeric and present forms", () => {
  assert.deepEqual(extractDateRange("Jan 2021 - Present"), { start: "Jan 2021", end: "Present", text: "Jan 2021 - Present" });
  assert.equal(extractDateRange("03/2019 to 04/2022").start, "03/2019");
  assert.equal(extractDateRange("2017 — 2021").end, "2021");
  assert.equal(DATE_RANGE_RE.test("June 2024 – Current"), true);
  assert.equal(extractDateRange("not a date"), null);
});

test("normalizeSectionHeading strips numbering, bullets and trailing separators", () => {
  assert.equal(normalizeSectionHeading("2. Work Experience:"), "Work Experience");
  assert.equal(normalizeSectionHeading("• Skills |"), "Skills");
  assert.equal(normalizeSectionHeading("EXPERIENCE -"), "EXPERIENCE");
});

test("splitResumeSections groups lines under detected headings", () => {
  const { sections } = splitResumeSections(normalizeResumeLines("Jane Doe\nEXPERIENCE\nDev at Acme\nSKILLS\nJS, React"));
  assert.deepEqual(sections.header, ["Jane Doe"]);
  assert.deepEqual(sections.experience, ["Dev at Acme"]);
  assert.deepEqual(sections.skills, ["JS, React"]);
});

test("extractGithubProfileUrl prefers real URLs and accepts handles", () => {
  assert.equal(extractGithubProfileUrl("see github.com/octocat here"), "https://github.com/octocat");
  assert.equal(extractGithubProfileUrl("GitHub: octocat"), "https://github.com/octocat");
  assert.equal(extractGithubProfileUrl("no github"), "");
});

test("resumePrintTitle produces filename-safe titles", () => {
  assert.equal(resumePrintTitle("Jordan Lee"), "Jordan_Lee_Resume");
  assert.equal(resumePrintTitle("  María-José D. "), "Mara-Jos_D_Resume");
  assert.equal(resumePrintTitle(""), "Resume_Resume");
});

test("makeId generates unique ids", () => {
  assert.notEqual(makeId(), makeId());
});
