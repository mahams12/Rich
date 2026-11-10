"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./resume-builder.css";

const STORAGE_KEY = "novexahub-resume-studio-v1";

const TEMPLATE_OPTIONS = [
  { id: "atelier", name: "Atelier", note: "Warm editorial design with confident type", tag: "Editorial", color: "#a84f36" },
  { id: "swiss", name: "Swiss Grid", note: "Precise alignment and quiet hierarchy", tag: "Structured", color: "#d04b32" },
  { id: "folio", name: "Folio", note: "A refined side rail for a fuller profile", tag: "Profile-led", color: "#263f49" },
  { id: "signal", name: "Signal", note: "High-contrast design for digital roles", tag: "Technology", color: "#2457a6" },
  { id: "monogram", name: "Monogram", note: "Elegant typography with a classic rhythm", tag: "Timeless", color: "#675044" },
  { id: "grid", name: "Gridline", note: "Compact, information-dense and composed", tag: "Compact", color: "#3d5148" },
];

const emptyExperience = { role: "", company: "", location: "", start: "", end: "", details: "" };
const emptyEducation = { degree: "", school: "", location: "", start: "", end: "", details: "" };
const emptyProject = { name: "", role: "", link: "", details: "" };
const emptyCertificate = { name: "", issuer: "", date: "", link: "" };

function starterResume(id) {
  return {
    id: id || "starter",
    title: "My first resume",
    template: "atelier",
    accent: "#b85c3d",
    profile: {
      fullName: "Jordan Lee",
      headline: "Software Engineer",
      email: "jordan.lee@example.com",
      phone: "+1 555 010 2040",
      location: "Austin, TX",
      website: "jordanlee.dev",
      linkedin: "linkedin.com/in/jordanlee",
      summary: "Software engineer focused on building thoughtful digital products, reliable web applications and clear user experiences. Comfortable collaborating across product, design and engineering to turn complex requirements into practical solutions.",
      photo: "",
    },
    experience: [
      { role: "Software Engineering Intern", company: "Northstar Labs", location: "Austin, TX", start: "Jun 2024", end: "Aug 2024", details: "Built reusable interface components and improved page performance across customer workflows.\nCollaborated with designers and engineers to ship product enhancements.\nDocumented implementation details and supported release testing." },
    ],
    education: [
      { degree: "BSc, Computer Science", school: "Westlake University", location: "Austin, TX", start: "2021", end: "2025", details: "Relevant coursework: Data Structures, Databases, Software Engineering." },
    ],
    projects: [
      { name: "Campus Connect", role: "Full-stack developer", link: "github.com/jordanlee/campus-connect", details: "Created a student community platform with searchable events, responsive dashboards and role-based access." },
    ],
    skills: ["JavaScript", "React", "Node.js", "REST APIs", "PostgreSQL", "Git", "UI Engineering"],
    languages: ["English — Native"],
    certificates: [],
    keywords: [],
  };
}

function makeId() {
  return "resume-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

function blankImportResume(existing) {
  const base = starterResume(existing?.id || makeId());
  return {
    ...base,
    title: "Imported resume",
    template: existing?.template || "modern",
    accent: existing?.accent || "#b85c3d",
    profile: { fullName: "", headline: "", email: "", phone: "", location: "", website: "", linkedin: "", summary: "", photo: "" },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certificates: [],
    keywords: [],
  };
}

function safeResume(value) {
  if (!value || typeof value !== "object") return null;
  const base = starterResume(value.id || makeId());
  return {
    ...base,
    ...value,
    template: ({
      modern: "atelier",
      classic: "monogram",
      minimal: "swiss",
      executive: "folio",
      tech: "signal",
      compact: "grid",
    })[value.template] || (["atelier", "swiss", "folio", "signal", "monogram", "grid"].includes(value.template) ? value.template : "atelier"),
    profile: { ...base.profile, ...(value.profile || {}) },
    experience: Array.isArray(value.experience) ? value.experience : base.experience,
    education: Array.isArray(value.education) ? value.education : base.education,
    projects: Array.isArray(value.projects) ? value.projects : base.projects,
    skills: Array.isArray(value.skills) ? value.skills : base.skills,
    languages: Array.isArray(value.languages) ? value.languages : base.languages,
    certificates: Array.isArray(value.certificates) ? value.certificates : base.certificates,
    keywords: Array.isArray(value.keywords) ? value.keywords : [],
  };
}

const STOP_WORDS = new Set(("about above after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours job role team company work years experience skills required preferred candidate responsibilities requirements ability strong excellent knowledge including using across support build develop").split(" "));

function extractKeywords(text) {
  const words = String(text || "").toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) || [];
  const counts = new Map();
  words.forEach((word) => {
    const clean = word.replace(/^[.-]+|[.-]+$/g, "");
    if (!clean || STOP_WORDS.has(clean) || /^\d+$/.test(clean)) return;
    counts.set(clean, (counts.get(clean) || 0) + 1);
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 28)
    .map(([word]) => word);
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const text = String(source || "").replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell); cell = "";
      if (row.some((part) => part.trim())) rows.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell);
  if (row.some((part) => part.trim())) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map((header) => header.trim());
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}

function keyOf(object) {
  return Object.keys(object || {}).reduce((acc, key) => {
    acc[key.toLowerCase().replace(/[^a-z0-9]/g, "")] = object[key];
    return acc;
  }, {});
}

function getValue(record, candidates) {
  const normalized = keyOf(record);
  for (const candidate of candidates) {
    const value = normalized[candidate.toLowerCase().replace(/[^a-z0-9]/g, "")];
    if (value) return value;
  }
  return "";
}

const SECTION_PATTERNS = [
  ["summary", /^(professional summary|summary|profile|career profile|objective|career objective|about me|professional profile)$/i],
  ["experience", /^(professional experience|work experience|employment history|work history|experience|employment)$/i],
  ["education", /^(education|academic background|education and training|qualifications)$/i],
  ["skills", /^(technical skills|core skills|key skills|skills|competencies|expertise)$/i],
  ["projects", /^(selected projects|personal projects|academic projects|projects|portfolio)$/i],
  ["certificates", /^(certifications|certificates|licenses and certifications|licenses|courses)$/i],
  ["languages", /^(languages|language skills)$/i],
];

const DATE_RANGE_RE = /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?\s+)?(?:19|20)\d{2}\s*(?:-|–|—|to|until)\s*(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?\s+)?(?:(?:19|20)\d{2}|present|current|now))|(?:19|20)\d{2}\s*[-–—]\s*(?:present|current|now)/i;

function normalizeResumeLines(source) {
  return String(source || "")
    .replace(/\u0000/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").replace(/^[•●▪◦‣*·\-–—]\s*/, "").trim())
    .filter((line) => line && !/^(page\s+)?\d+\s*(of\s+\d+)?$/i.test(line));
}

function splitResumeSections(lines) {
  const sections = { header: [] };
  let current = "header";
  let sectionCount = 0;
  const headingLines = [];
  lines.forEach((line) => {
    const normalized = line.replace(/[:：]\s*$/, "").trim();
    const match = SECTION_PATTERNS.find(([, pattern]) => pattern.test(normalized));
    if (match) {
      current = match[0];
      if (!sections[current]) sections[current] = [];
      sectionCount += 1;
      headingLines.push(normalized);
    } else {
      if (!sections[current]) sections[current] = [];
      sections[current].push(line);
    }
  });
  return { sections, sectionCount, headingLines };
}

function parseEntryBlocks(lines, kind) {
  const clean = lines.filter(Boolean);
  if (!clean.length) return [];
  const blocks = [];
  let block = [];
  clean.forEach((line) => {
    const isDateLine = DATE_RANGE_RE.test(line) || /^(19|20)\d{2}\s*[-–—]\s*(present|current|now)$/i.test(line);
    if (isDateLine) {
      block.push(line);
      blocks.push(block);
      block = [];
      return;
    }
    if (block.length >= 4 && !/^[•●▪◦‣*·]/.test(line) && line.length < 85 && !/[.!?]$/.test(line)) {
      blocks.push(block);
      block = [];
    }
    block.push(line);
  });
  if (block.length) blocks.push(block);

  return blocks.map((items) => {
    const dateLine = items.find((line) => DATE_RANGE_RE.test(line));
    const dateText = dateLine ? dateLine.match(DATE_RANGE_RE)?.[0] || "" : "";
    const content = items.filter((line) => line !== dateLine);
    const first = content.shift() || "";
    const parts = first.split(/\s+[|·•]\s+/).filter(Boolean);
    const role = parts[0] || first;
    let organization = parts[1] || "";
    if (!organization && content.length && content[0].length < 86 && !/[.!?]$/.test(content[0]) && !/^(built|developed|created|led|managed|designed|worked|responsible|using|used|improved|increased|reduced|delivered|collaborated|implemented)\b/i.test(content[0])) {
      organization = content.shift() || "";
    }
    const details = content.join("\n").replace(/^[•●▪◦‣*·]\s*/gm, "").trim();
    if (kind === "education") {
      return {
        degree: [role, parts[2]].filter(Boolean).join(" — "),
        school: organization,
        location: "",
        start: dateText,
        end: "",
        details,
      };
    }
    if (kind === "project") {
      return { name: role, role: organization, link: "", details: [parts.slice(2).join(" · "), details].filter(Boolean).join("\n") };
    }
    return { role, company: organization, location: "", start: dateText, end: "", details };
  }).filter((item) => Object.values(item).some((value) => String(value || "").trim()));
}

function parseTextIntoResume(source, existing) {
  const raw = String(source || "").replace(/\u0000/g, " ").trim();
  const lines = normalizeResumeLines(raw);
  const { sections, headingLines } = splitResumeSections(lines);
  const header = sections.header || [];
  const emailMatch = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = raw.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?[\d\s().-]{7,}/);
  const linkedinMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Z0-9-_%]+/i);
  const websiteMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?[A-Z0-9-]+\.(?:com|net|org|io|dev|co|me|app)(?:\/[^\s]*)?/i);
  const nameCandidate = header.find((line) =>
    line.length >= 3 &&
    line.length <= 58 &&
    !/@|https?:\/\/|linkedin\.com|\d{5,}/i.test(line) &&
    !/^(resume|curriculum vitae|curriculum vit[aá]e|cv|profile|personal details)$/i.test(line) &&
    !DATE_RANGE_RE.test(line)
  ) || "";
  const headlineCandidate = header.find((line) =>
    line !== nameCandidate &&
    line.length >= 3 &&
    line.length <= 90 &&
    !/@|https?:\/\/|linkedin\.com|\d{5,}/i.test(line) &&
    !DATE_RANGE_RE.test(line)
  ) || "";

  const summaryLines = (sections.summary || []).slice(0, 9);
  const summary = summaryLines.join(" ").replace(/\s+/g, " ").trim();
  const experience = parseEntryBlocks(sections.experience || [], "experience").slice(0, 12);
  const education = parseEntryBlocks(sections.education || [], "education").slice(0, 8);
  const projects = parseEntryBlocks(sections.projects || [], "project").slice(0, 12);
  const skills = (sections.skills || [])
    .join(",")
    .split(/[,;|•·]\s*|\n/)
    .map((item) => item.replace(/^[•●▪◦‣*·\-–—]\s*/, "").trim())
    .filter((item) => item.length > 1 && item.length < 54)
    .slice(0, 40);
  const certificates = (sections.certificates || []).map((line) => line.trim()).filter(Boolean).slice(0, 12).map((line) => ({
    name: line,
    issuer: "",
    date: "",
    link: "",
  }));
  const languages = (sections.languages || []).join(",").split(/[,;|•·]\s*|\n/).map((item) => item.trim()).filter(Boolean).slice(0, 12);
  const profile = {
    ...existing.profile,
    fullName: nameCandidate || existing.profile.fullName || "",
    headline: headlineCandidate || existing.profile.headline || "",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch && phoneMatch[0].trim().length <= 28 ? phoneMatch[0].trim() : "",
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
    website: websiteMatch ? websiteMatch[0] : "",
    summary: summary || "",
  };
  const resume = {
    ...existing,
    title: "Imported resume",
    profile,
    experience: experience.length ? experience : [],
    education: education.length ? education : [],
    projects: projects.length ? projects : [],
    skills,
    languages,
    certificates,
  };
  const detected = {
    name: Boolean(profile.fullName),
    email: Boolean(profile.email),
    phone: Boolean(profile.phone),
    summary: Boolean(profile.summary),
    experience: experience.length,
    education: education.length,
    projects: projects.length,
    skills: skills.length,
    certificates: certificates.length,
    languages: languages.length,
  };
  const sectionTotal = [detected.summary, detected.experience, detected.education, detected.projects, detected.skills, detected.certificates, detected.languages].filter(Boolean).length;
  const identityFound = detected.name || detected.email || detected.phone;
  const contentFound = sectionTotal > 0;
  const warnings = [];
  if (!detected.name) warnings.push("A clear name was not detected. Add it manually before exporting.");
  if (!detected.experience) warnings.push("No work-experience section was confidently detected.");
  if (!detected.education) warnings.push("No education section was confidently detected.");
  if (!detected.skills) warnings.push("No skills section was confidently detected.");
  if (!detected.email && !detected.phone) warnings.push("No email address or phone number was detected.");
  const report = {
    characters: raw.length,
    detected,
    headingLines,
    warnings,
    valid: raw.length >= 80 && contentFound && (identityFound || sectionTotal >= 2),
    message: raw.length < 80
      ? "The file contains too little readable text to safely build a resume."
      : !contentFound
        ? "Resume sections could not be identified. Try a text-based PDF, DOCX or paste the resume text."
        : !identityFound && sectionTotal < 2
          ? "We could not identify enough resume information. Check the file and try again."
          : "",
  };
  return { resume, report };
}
function loadScript(src, id, globalName) {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window[globalName]) { resolve(window[globalName]); return; }
    const prior = document.getElementById(id);
    if (prior) {
      prior.addEventListener("load", () => resolve(window[globalName]));
      prior.addEventListener("error", () => reject(new Error("Could not load document parser.")));
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => window[globalName] ? resolve(window[globalName]) : reject(new Error("Document parser did not initialize."));
    script.onerror = () => reject(new Error("Could not load the document parser. Check your internet connection and retry."));
    document.head.appendChild(script);
  });
}

async function extractDocumentText(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  if (extension === "pdf") {
    const pdfjs = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "rb-pdfjs", "pdfjsLib");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const documentPdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= documentPdf.numPages; pageNumber += 1) {
      const page = await documentPdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str || "").join(" "));
    }
    return pages.join("\n");
  }
  if (extension === "docx") {
    const mammoth = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js", "rb-mammoth", "mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value || "";
  }
  return file.text();
}

function importLinkedInRows(files, base) {
  const result = { ...base };
  const experience = [...base.experience];
  const education = [...base.education];
  const skills = [...base.skills];
  files.forEach(({ name, rows }) => {
    const label = name.toLowerCase();
    if (label.includes("profile")) {
      const profile = rows[0] || {};
      const first = getValue(profile, ["First Name", "First name"]);
      const last = getValue(profile, ["Last Name", "Last name"]);
      result.profile = {
        ...result.profile,
        fullName: [first, last].filter(Boolean).join(" ") || result.profile.fullName,
        headline: getValue(profile, ["Headline"]) || result.profile.headline,
        summary: getValue(profile, ["Summary"]) || result.profile.summary,
        location: getValue(profile, ["Geo Location", "Location"]) || result.profile.location,
        website: getValue(profile, ["Websites", "Website"]) || result.profile.website,
      };
    } else if (label.includes("position") || label.includes("experience")) {
      rows.forEach((item) => {
        const role = getValue(item, ["Title", "Position"]);
        const company = getValue(item, ["Company Name", "Company"]);
        if (role || company) experience.push({
          role, company,
          location: getValue(item, ["Location"]),
          start: getValue(item, ["Started On", "Start Date"]),
          end: getValue(item, ["Finished On", "End Date"]) || "Present",
          details: getValue(item, ["Description"]),
        });
      });
    } else if (label.includes("education")) {
      rows.forEach((item) => {
        const degree = getValue(item, ["Degree Name", "Degree"]);
        const school = getValue(item, ["School Name", "School"]);
        if (degree || school) education.push({
          degree: [degree, getValue(item, ["Field Of Study"])].filter(Boolean).join(" — "),
          school,
          location: getValue(item, ["Activities"]),
          start: getValue(item, ["Start Date", "Started On"]),
          end: getValue(item, ["End Date", "Finished On"]),
          details: getValue(item, ["Notes"]),
        });
      });
    } else if (label.includes("skill")) {
      rows.forEach((item) => {
        const skill = getValue(item, ["Name", "Skill"]);
        if (skill && !skills.some((current) => current.toLowerCase() === skill.toLowerCase())) skills.push(skill);
      });
    }
  });
  result.experience = experience;
  result.education = education;
  result.skills = skills;
  return result;
}

function ResumeSection({ title, children }) {
  return (
    <section className="rb-resume-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ResumePreview({ resume, compact }) {
  const profile = resume.profile || {};
  const template = resume.template || "modern";
  const hasSidebar = template === "folio";
  const main = (
    <>
      <header className="rb-resume-heading">
        <div>
          <h1>{profile.fullName || "Your Name"}</h1>
          {profile.headline ? <p className="rb-resume-headline">{profile.headline}</p> : null}
          <div className="rb-resume-contact">
            {[profile.email, profile.phone, profile.location, profile.website, profile.linkedin].filter(Boolean).join("  •  ")}
          </div>
        </div>
        {profile.photo ? <img className="rb-resume-photo" src={profile.photo} alt="" /> : null}
      </header>
      {profile.summary ? <ResumeSection title="Profile"><p>{profile.summary}</p></ResumeSection> : null}
      {resume.experience?.length ? <ResumeSection title="Experience">
        {resume.experience.map((item, index) => (
          <div className="rb-resume-entry" key={"work-" + index}>
            <div className="rb-resume-entry-top"><strong>{item.role || "Role"}</strong><span>{[item.start, item.end].filter(Boolean).join(" – ")}</span></div>
            <div className="rb-resume-subline">{[item.company, item.location].filter(Boolean).join(" · ")}</div>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        ))}
      </ResumeSection> : null}
      {resume.education?.length ? <ResumeSection title="Education">
        {resume.education.map((item, index) => (
          <div className="rb-resume-entry" key={"edu-" + index}>
            <div className="rb-resume-entry-top"><strong>{item.degree || "Degree"}</strong><span>{[item.start, item.end].filter(Boolean).join(" – ")}</span></div>
            <div className="rb-resume-subline">{[item.school, item.location].filter(Boolean).join(" · ")}</div>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        ))}
      </ResumeSection> : null}
      {resume.projects?.some((item) => item.name || item.details) ? <ResumeSection title="Projects">
        {resume.projects.filter((item) => item.name || item.details).map((item, index) => (
          <div className="rb-resume-entry" key={"project-" + index}>
            <div className="rb-resume-entry-top"><strong>{item.name}</strong><span>{item.role}</span></div>
            {item.link ? <div className="rb-resume-subline">{item.link}</div> : null}
            {item.details ? <p>{item.details}</p> : null}
          </div>
        ))}
      </ResumeSection> : null}
      {resume.skills?.filter(Boolean).length ? <ResumeSection title="Skills"><p className="rb-resume-skill-list">{resume.skills.filter(Boolean).join("  ·  ")}</p></ResumeSection> : null}
      {resume.certificates?.some((item) => item.name) ? <ResumeSection title="Certifications">
        {resume.certificates.filter((item) => item.name).map((item, index) => <div className="rb-resume-entry" key={"cert-" + index}><div className="rb-resume-entry-top"><strong>{item.name}</strong><span>{item.date}</span></div><div className="rb-resume-subline">{item.issuer}</div></div>)}
      </ResumeSection> : null}
      {resume.languages?.filter(Boolean).length ? <ResumeSection title="Languages"><p>{resume.languages.filter(Boolean).join("  ·  ")}</p></ResumeSection> : null}
    </>
  );
  const side = (
    <aside className="rb-resume-sidebar">
      {profile.photo ? <img className="rb-resume-photo rb-sidebar-photo" src={profile.photo} alt="" /> : null}
      <h2>{profile.fullName || "Your Name"}</h2>
      {profile.headline ? <p className="rb-sidebar-role">{profile.headline}</p> : null}
      <div className="rb-sidebar-contact">{[profile.email, profile.phone, profile.location, profile.website, profile.linkedin].filter(Boolean).map((item, index) => <span key={index}>{item}</span>)}</div>
      {resume.skills?.length ? <div className="rb-sidebar-block"><h3>Core skills</h3><p>{resume.skills.join(" · ")}</p></div> : null}
      {resume.languages?.length ? <div className="rb-sidebar-block"><h3>Languages</h3><p>{resume.languages.join(" · ")}</p></div> : null}
    </aside>
  );
  return (
    <article className={"rb-resume-sheet rb-template-" + template + (compact ? " rb-resume-compact" : "")} style={{ "--resume-accent": resume.accent || "#b85c3d" }}>
      {hasSidebar ? <>{side}<div className="rb-resume-main">{main}</div></> : main}
    </article>
  );
}

function Icon({ children }) {
  return <span className="rb-icon" aria-hidden="true">{children}</span>;
}

function Field({ label, value, onChange, placeholder, multiline, type }) {
  return (
    <label className={"rb-field" + (multiline ? " rb-field-wide" : "")}>
      <span>{label}</span>
      {multiline
        ? <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder || label} rows={4} />
        : <input type={type || "text"} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder || label} />}
    </label>
  );
}

export default function ResumeBuilder() {
  const [resumes, setResumes] = useState([starterResume()]);
  const [activeId, setActiveId] = useState("starter");
  const [view, setView] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [showUploadLinkedIn, setShowUploadLinkedIn] = useState(false);
  const [importText, setImportText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const photoRef = useRef(null);
  const appRef = useRef(null);

  const current = resumes.find((resume) => resume.id === activeId) || resumes[0];
  const profile = current?.profile || {};
  const suggestedKeywords = useMemo(() => extractKeywords(jobDescription), [jobDescription]);
  const resumeText = useMemo(() => {
    if (!current) return "";
    return JSON.stringify({
      profile: current.profile,
      experience: current.experience,
      education: current.education,
      projects: current.projects,
      skills: current.skills,
      languages: current.languages,
      certificates: current.certificates,
    }).toLowerCase();
  }, [current]);
  const matchedKeywords = suggestedKeywords.filter((word) => resumeText.includes(word));
  const missingKeywords = suggestedKeywords.filter((word) => !resumeText.includes(word));

  useEffect(() => {
    document.body.classList.add("rb-resume-mode");
    return () => document.body.classList.remove("rb-resume-mode");
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(stored) && stored.length) {
        const clean = stored.map(safeResume).filter(Boolean);
        if (clean.length) {
          setResumes(clean);
          setActiveId(clean[0].id);
        }
      }
    } catch (_) { /* keep the starter resume if saved data is unavailable */ }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes)); }
    catch (_) { setToast("Browser storage is full. Remove a large photo or export a backup."); }
  }, [resumes, mounted]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const updateCurrent = useCallback((updater) => {
    setResumes((all) => all.map((resume) => resume.id === activeId ? updater(resume) : resume));
  }, [activeId]);

  const updateProfile = (key, value) => updateCurrent((resume) => ({ ...resume, profile: { ...resume.profile, [key]: value } }));
  const updateListItem = (section, index, key, value) => updateCurrent((resume) => ({
    ...resume,
    [section]: resume[section].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
  }));
  const addItem = (section) => {
    const empty = section === "experience" ? emptyExperience : section === "education" ? emptyEducation : section === "projects" ? emptyProject : emptyCertificate;
    updateCurrent((resume) => ({ ...resume, [section]: [...resume[section], { ...empty }] }));
  };
  const removeItem = (section, index) => updateCurrent((resume) => ({ ...resume, [section]: resume[section].filter((_, itemIndex) => itemIndex !== index) }));

  const goToApp = (nextView) => {
    setView(nextView || "dashboard");
    appRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const createResume = () => {
    const fresh = starterResume(makeId());
    fresh.title = "Untitled resume";
    fresh.profile = { ...fresh.profile, fullName: "", headline: "", email: "", phone: "", location: "", website: "", linkedin: "", summary: "", photo: "" };
    fresh.experience = [];
    fresh.education = [];
    fresh.projects = [];
    fresh.skills = [];
    fresh.languages = [];
    fresh.certificates = [];
    fresh.keywords = [];
    setResumes((all) => [fresh, ...all]);
    setActiveId(fresh.id);
    setView("editor");
    setToast("New resume created. Add your details to get started.");
    appRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const deleteResume = (id) => {
    if (resumes.length === 1) {
      setToast("Keep at least one resume in your workspace.");
      return;
    }
    const remaining = resumes.filter((resume) => resume.id !== id);
    setResumes(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
    setToast("Resume deleted from this browser.");
  };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(current, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = (current.title || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".json";
    anchor.click();
    URL.revokeObjectURL(url);
    setToast("Editable JSON backup downloaded.");
  };

  const printResume = () => {
    if (!current) return;
    const runPrint = () => {
      document.title = (profile.fullName || "Resume").replace(/[^a-z0-9 -]/gi, "").trim().replace(/\s+/g, "_") + "_Resume";
      window.print();
      window.setTimeout(() => { document.title = "NovexaHub Resume Studio"; }, 1000);
    };
    if (view !== "editor") {
      setView("editor");
      window.setTimeout(runPrint, 220);
    } else runPrint();
  };

  const handleImportFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      let imported = blankImportResume(current);
      const csvFiles = [];
      for (const file of files) {
        const extension = file.name.split(".").pop().toLowerCase();
        if (extension === "csv") {
          csvFiles.push({ name: file.name, rows: parseCsv(await file.text()) });
        } else if (extension === "json") {
          const parsed = JSON.parse(await file.text());
          imported = safeResume(parsed.resume || parsed.profile || parsed) || imported;
        } else if (["pdf", "docx", "txt"].includes(extension)) {
          const text = await extractDocumentText(file);
          if (!text.trim()) throw new Error("No selectable text was found. This may be a scanned PDF; use a text-based PDF or paste its text instead.");
          imported = parseTextIntoResume(text, imported);
        } else {
          throw new Error("Supported files: PDF, DOCX, TXT, JSON and LinkedIn CSV exports.");
        }
      }
      if (csvFiles.length) imported = importLinkedInRows(csvFiles, imported);
      imported.id = current.id;
      imported.title = imported.title === "My first resume" ? "Imported resume" : imported.title;
      setResumes((all) => all.map((resume) => resume.id === activeId ? imported : resume));
      setShowImport(false);
      setToast("Import complete. Review every section before exporting.");
    } catch (error) {
      setToast(error.message || "Could not import this file. Try another format.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const importPastedText = () => {
    if (!importText.trim()) { setToast("Paste your resume text first."); return; }
    const imported = parseTextIntoResume(importText, blankImportResume(current));
    imported.id = current.id;
    imported.title = "Imported resume";
    setResumes((all) => all.map((resume) => resume.id === activeId ? imported : resume));
    setImportText("");
    setShowImport(false);
    setToast("Resume text added. Review and refine the imported details.");
  };

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setToast("Choose an image file."); return; }
    try {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(640 / image.width, 640 / image.height, 1);
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        updateProfile("photo", canvas.toDataURL("image/jpeg", 0.82));
        URL.revokeObjectURL(objectUrl);
        setToast("Photo added to your resume.");
      };
      image.onerror = () => { URL.revokeObjectURL(objectUrl); setToast("Could not read that image."); };
      image.src = objectUrl;
    } catch (_) { setToast("Could not process that image."); }
    event.target.value = "";
  };

  const addKeyword = (word) => {
    const clean = String(word || "").trim().toLowerCase();
    if (!clean) return;
    updateCurrent((resume) => ({ ...resume, keywords: Array.from(new Set([...(resume.keywords || []), clean])) }));
    setKeywordDraft("");
  };

  const copyKeywords = async () => {
    const text = Array.from(new Set([...matchedKeywords, ...missingKeywords, ...(current.keywords || [])])).join(", ");
    try { await navigator.clipboard.writeText(text); setToast("Keywords copied."); }
    catch (_) { setToast("Select and copy the keyword list manually."); }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Overview", icon: "◫" },
    { id: "resumes", label: "My resumes", icon: "▤" },
    { id: "templates", label: "Templates", icon: "▦" },
    { id: "keywords", label: "Keyword lab", icon: "⌕" },
  ];

  return (
    <div className="rb-page">
      <header className="rb-site-header">
        <a className="rb-brand" href="/" aria-label="NovexaHub home">
          <span className="rb-brand-mark">N</span>
          <span>novexa<span>hub</span><small>RESUME STUDIO</small></span>
        </a>
        <nav className="rb-public-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#templates-overview">Templates</a>
          <a href="#resume-faq">FAQ</a>
        </nav>
        <button className="rb-button rb-button-dark rb-header-cta" onClick={() => goToApp("dashboard")}>Open studio <span>↗</span></button>
      </header>

      <section className="rb-hero">
        <div className="rb-hero-noise" />
        <div className="rb-hero-copy">
          <div className="rb-eyebrow"><span className="rb-pulse" /> FREE RESUME BUILDER · NO ACCOUNT NEEDED</div>
          <h1>Make your next move<br /><em>look as good as it feels.</em></h1>
          <p>Build a clear, confident resume with beautifully crafted templates. Edit every detail, match your language to the role and keep your files in your own browser.</p>
          <div className="rb-hero-actions">
            <button className="rb-button rb-button-accent" onClick={() => goToApp("dashboard")}>Build my resume <span>→</span></button>
            <button className="rb-button rb-button-ghost" onClick={() => goToApp("templates")}>Explore templates</button>
          </div>
          <div className="rb-trust-row"><span>✓ Free to use</span><span>✓ Live preview</span><span>✓ PDF export</span><span>✓ Local-first privacy</span></div>
        </div>
        <div className="rb-hero-art" aria-hidden="true">
          <div className="rb-orbit rb-orbit-one" /><div className="rb-orbit rb-orbit-two" />
          <div className="rb-hero-card rb-card-back"><div className="rb-mock-line rb-mock-short" /><div className="rb-mock-title" /><div className="rb-mock-line" /><div className="rb-mock-line rb-mock-mid" /><div className="rb-mock-block" /><div className="rb-mock-line" /><div className="rb-mock-line rb-mock-short" /></div>
          <div className="rb-hero-card rb-card-front"><div className="rb-mock-header"><div><b>YOUR NAME</b><span>PRODUCT DESIGNER</span></div><i /></div><div className="rb-mock-rule" /><div className="rb-mock-section">PROFILE</div><div className="rb-mock-line" /><div className="rb-mock-line rb-mock-mid" /><div className="rb-mock-section">EXPERIENCE</div><div className="rb-mock-bold-line" /><div className="rb-mock-line" /><div className="rb-mock-line rb-mock-short" /><div className="rb-mock-bold-line" /><div className="rb-mock-line" /><div className="rb-mock-section">EDUCATION</div><div className="rb-mock-line rb-mock-mid" /></div>
          <div className="rb-float-pill rb-pill-a">✦ Editable templates</div><div className="rb-float-pill rb-pill-b">100% in your browser</div>
        </div>
        <div className="rb-hero-bottom"><span>DESIGNED FOR THE NEXT CHAPTER</span><span>01 — 04</span></div>
      </section>

      <section className="rb-value-strip" id="how-it-works">
        <div><b>01</b><span><strong>Start anywhere</strong><small>Blank canvas or import an existing CV</small></span></div>
        <div><b>02</b><span><strong>Make it yours</strong><small>Every section updates in a live preview</small></span></div>
        <div><b>03</b><span><strong>Move with intent</strong><small>Compare role keywords and export a PDF</small></span></div>
      </section>

      <section className="rb-workspace-section" ref={appRef} id="resume-studio">
        <div className="rb-section-heading">
          <div><div className="rb-eyebrow rb-eyebrow-dark">YOUR CAREER WORKSPACE</div><h2>A better resume, <em>one good edit at a time.</em></h2></div>
          <div className="rb-local-note"><span>●</span> Changes save automatically on this device</div>
        </div>
        <div className="rb-app-shell">
          <aside className="rb-sidebar">
            <a href="#resume-studio" className="rb-sidebar-brand"><span className="rb-brand-mark">N</span><span>Resume Studio<small>BY NOVEXAHUB</small></span></a>
            <div className="rb-workspace-label">WORKSPACE</div>
            <nav className="rb-side-nav" aria-label="Resume workspace">
              {sidebarItems.map((item) => <button key={item.id} className={view === item.id || (view === "editor" && item.id === "resumes") ? "active" : ""} onClick={() => setView(item.id)}><span>{item.icon}</span>{item.label}</button>)}
            </nav>
            <div className="rb-sidebar-bottom">
              <div className="rb-side-tip"><span>✳</span><b>Small details matter.</b><p>Keep your strongest results near the top and use clear, specific language.</p></div>
              <div className="rb-privacy-label"><span>◉</span> Saved on this device</div>
            </div>
          </aside>

          <section className="rb-main-panel">
            <div className="rb-app-topbar">
              <div><span className="rb-top-eyebrow">NOVEXAHUB / RESUME STUDIO</span><h2>{view === "dashboard" ? "Your workspace" : view === "resumes" ? "My resumes" : view === "templates" ? "Choose your look" : view === "keywords" ? "Keyword lab" : "Resume editor"}</h2></div>
              <div className="rb-top-actions">
                <button className="rb-button rb-button-light" onClick={() => setShowImport(true)}><Icon>↑</Icon> Import</button>
                <button className="rb-button rb-button-dark" onClick={printResume}><Icon>↓</Icon> Export PDF</button>
              </div>
            </div>

            {view === "dashboard" || view === "resumes" ? (
              <div className="rb-dashboard-view">
                <div className="rb-welcome-card">
                  <div><div className="rb-eyebrow rb-eyebrow-light">YOUR NEXT OPPORTUNITY STARTS HERE</div><h3>Ready when <em>you are.</em></h3><p>Create a tailored version for every role, or refine the resume you already have.</p></div>
                  <button className="rb-button rb-button-accent" onClick={createResume}>＋ New resume</button>
                  <div className="rb-welcome-watermark">N</div>
                </div>
                <div className="rb-dashboard-meta"><div><h3>{view === "resumes" ? "All resumes" : "Recently edited"}</h3><p>{resumes.length} {resumes.length === 1 ? "resume" : "resumes"} saved in this browser</p></div><button className="rb-text-button" onClick={() => setView("templates")}>Browse templates ↗</button></div>
                <div className="rb-resume-grid">
                  {resumes.map((resume) => <article className="rb-resume-card" key={resume.id}>
                    <button className="rb-resume-card-preview" onClick={() => { setActiveId(resume.id); setView("editor"); }} aria-label={"Edit " + resume.title}>
                      <ResumePreview resume={resume} compact />
                    </button>
                    <div className="rb-resume-card-info"><div><strong>{resume.title || "Untitled resume"}</strong><small>{resume.profile?.fullName || "Add your name"} · {TEMPLATE_OPTIONS.find((item) => item.id === resume.template)?.name || "Modern"}</small></div><button className="rb-more-button" onClick={() => { setActiveId(resume.id); setView("editor"); }} aria-label="Edit resume">↗</button></div>
                    <div className="rb-card-actions"><button onClick={() => { setActiveId(resume.id); setView("editor"); }}>Edit resume</button><button onClick={() => { setActiveId(resume.id); deleteResume(resume.id); }}>Delete</button></div>
                  </article>)}
                  <button className="rb-create-card" onClick={createResume}><span>＋</span><strong>Create a new resume</strong><small>Start with a clean page</small></button>
                </div>
                <div className="rb-quick-row">
                  <button onClick={() => setShowImport(true)}><span>↥</span><div><strong>Import an existing resume</strong><small>PDF, Word, text, JSON or LinkedIn CSV</small></div><b>→</b></button>
                  <button onClick={() => setShowLinkedIn(true)}><span>in</span><div><strong>Bring in your LinkedIn details</strong><small>Use your LinkedIn data export</small></div><b>→</b></button>
                  <button onClick={() => setView("keywords")}><span>⌕</span><div><strong>Match a job description</strong><small>Find useful keywords for your next application</small></div><b>→</b></button>
                </div>
              </div>
            ) : null}

            {view === "templates" ? (
              <div className="rb-templates-view">
                <div className="rb-view-intro"><div><span className="rb-eyebrow rb-eyebrow-dark">THE RIGHT FIRST IMPRESSION</span><h3>Find a format that <em>fits your story.</em></h3><p>Each original design uses editable text sections and a consistent document structure. Choose one, then make it yours.</p></div><button className="rb-button rb-button-accent" onClick={createResume}>＋ Start from scratch</button></div>
                <div className="rb-template-grid">
                  {TEMPLATE_OPTIONS.map((template) => <button key={template.id} className={"rb-template-card" + (current.template === template.id ? " selected" : "")} onClick={() => { updateCurrent((resume) => ({ ...resume, template: template.id })); setToast(template.name + " template selected."); }}>
                    <div className={"rb-template-thumb rb-thumb-" + template.id} style={{ "--thumb-accent": template.color }}><ResumePreview resume={{ ...current, template: template.id, accent: template.color }} compact /></div>
                    <div className="rb-template-card-copy"><span className="rb-template-tag">{template.tag}</span><strong>{template.name}</strong><small>{template.note}</small><span className="rb-template-use">{current.template === template.id ? "Selected ✓" : "Use template →"}</span></div>
                  </button>)}
                </div>
              </div>
            ) : null}

            {view === "editor" ? (
              <div className="rb-editor-view">
                <div className="rb-editor-toolbar"><div><input className="rb-title-input" aria-label="Resume title" value={current.title || ""} onChange={(event) => updateCurrent((resume) => ({ ...resume, title: event.target.value }))} /><span className="rb-saved-status"><i /> Saved locally</span></div><div className="rb-editor-toolbar-actions"><button className="rb-button rb-button-light" onClick={() => setView("templates")}>Change template</button><button className="rb-button rb-button-light" onClick={() => setShowUploadLinkedIn(true)}>Share to LinkedIn ↗</button><button className="rb-button rb-button-dark" onClick={printResume}>↓ Download PDF</button></div></div>
                <div className="rb-editor-layout">
                  <div className="rb-fields-panel">
                    <div className="rb-editor-progress"><div><b>Resume content</b><span>{[profile.fullName, profile.email, profile.summary].filter(Boolean).length}/3 essentials</span></div><div className="rb-progress-track"><i style={{ width: (Math.max(1, [profile.fullName, profile.email, profile.summary].filter(Boolean).length) / 3 * 100) + "%" }} /></div></div>
                    <details className="rb-form-section" open><summary><span className="rb-form-icon">01</span><span><b>Personal details</b><small>Name, contact and profile</small></span><i>⌄</i></summary><div className="rb-form-grid">
                      <Field label="Full name" value={profile.fullName} onChange={(value) => updateProfile("fullName", value)} />
                      <Field label="Professional headline" value={profile.headline} onChange={(value) => updateProfile("headline", value)} placeholder="e.g. Product Designer" />
                      <Field label="Email" value={profile.email} onChange={(value) => updateProfile("email", value)} type="email" />
                      <Field label="Phone" value={profile.phone} onChange={(value) => updateProfile("phone", value)} />
                      <Field label="City / location" value={profile.location} onChange={(value) => updateProfile("location", value)} />
                      <Field label="Website / portfolio" value={profile.website} onChange={(value) => updateProfile("website", value)} />
                      <Field label="LinkedIn URL" value={profile.linkedin} onChange={(value) => updateProfile("linkedin", value)} />
                      <Field label="Professional summary" value={profile.summary} onChange={(value) => updateProfile("summary", value)} multiline placeholder="A focused 2–4 line introduction about your experience and strengths." />
                      <div className="rb-photo-control"><span>Profile photo</span><div>{profile.photo ? <img src={profile.photo} alt="Resume profile" /> : <span className="rb-photo-empty">＋</span>}<button onClick={() => photoRef.current?.click()}>{profile.photo ? "Change photo" : "Add photo"}</button>{profile.photo ? <button className="rb-remove-photo" onClick={() => updateProfile("photo", "")}>Remove</button> : null}</div><input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhoto} /></div>
                    </div></details>
                    <details className="rb-form-section"><summary><span className="rb-form-icon">02</span><span><b>Work experience</b><small>Roles, impact and achievements</small></span><i>⌄</i></summary><div className="rb-repeat-list">{current.experience.map((item, index) => <div className="rb-repeat-card" key={"experience-" + index}><div className="rb-repeat-card-head"><b>Position {index + 1}</b><button onClick={() => removeItem("experience", index)}>Remove</button></div><div className="rb-form-grid"><Field label="Job title" value={item.role} onChange={(value) => updateListItem("experience", index, "role", value)} /><Field label="Company" value={item.company} onChange={(value) => updateListItem("experience", index, "company", value)} /><Field label="Location" value={item.location} onChange={(value) => updateListItem("experience", index, "location", value)} /><div className="rb-date-grid"><Field label="Start date" value={item.start} onChange={(value) => updateListItem("experience", index, "start", value)} /><Field label="End date" value={item.end} onChange={(value) => updateListItem("experience", index, "end", value)} /></div><Field label="Achievements and responsibilities" value={item.details} onChange={(value) => updateListItem("experience", index, "details", value)} multiline /></div></div>)}<button className="rb-add-row" onClick={() => addItem("experience")}>＋ Add experience</button></div></details>
                    <details className="rb-form-section"><summary><span className="rb-form-icon">03</span><span><b>Education</b><small>Degrees and academic history</small></span><i>⌄</i></summary><div className="rb-repeat-list">{current.education.map((item, index) => <div className="rb-repeat-card" key={"education-" + index}><div className="rb-repeat-card-head"><b>Education {index + 1}</b><button onClick={() => removeItem("education", index)}>Remove</button></div><div className="rb-form-grid"><Field label="Degree / qualification" value={item.degree} onChange={(value) => updateListItem("education", index, "degree", value)} /><Field label="Institution" value={item.school} onChange={(value) => updateListItem("education", index, "school", value)} /><Field label="Location" value={item.location} onChange={(value) => updateListItem("education", index, "location", value)} /><div className="rb-date-grid"><Field label="Start" value={item.start} onChange={(value) => updateListItem("education", index, "start", value)} /><Field label="End" value={item.end} onChange={(value) => updateListItem("education", index, "end", value)} /></div><Field label="Additional details" value={item.details} onChange={(value) => updateListItem("education", index, "details", value)} multiline /></div></div>)}<button className="rb-add-row" onClick={() => addItem("education")}>＋ Add education</button></div></details>
                    <details className="rb-form-section"><summary><span className="rb-form-icon">04</span><span><b>Projects</b><small>Selected work and portfolio links</small></span><i>⌄</i></summary><div className="rb-repeat-list">{current.projects.map((item, index) => <div className="rb-repeat-card" key={"projects-" + index}><div className="rb-repeat-card-head"><b>Project {index + 1}</b><button onClick={() => removeItem("projects", index)}>Remove</button></div><div className="rb-form-grid"><Field label="Project name" value={item.name} onChange={(value) => updateListItem("projects", index, "name", value)} /><Field label="Your role" value={item.role} onChange={(value) => updateListItem("projects", index, "role", value)} /><Field label="Project link" value={item.link} onChange={(value) => updateListItem("projects", index, "link", value)} /><Field label="What you built / achieved" value={item.details} onChange={(value) => updateListItem("projects", index, "details", value)} multiline /></div></div>)}<button className="rb-add-row" onClick={() => addItem("projects")}>＋ Add project</button></div></details>
                    <details className="rb-form-section"><summary><span className="rb-form-icon">05</span><span><b>Skills and languages</b><small>Tools, strengths and spoken languages</small></span><i>⌄</i></summary><div className="rb-form-grid"><Field label="Skills (separate with commas)" value={current.skills.join(", ")} onChange={(value) => updateCurrent((resume) => ({ ...resume, skills: value.split(",").map((item) => item.trim()).filter(Boolean) }))} multiline placeholder="React, JavaScript, communication..." /><Field label="Languages (separate with commas)" value={current.languages.join(", ")} onChange={(value) => updateCurrent((resume) => ({ ...resume, languages: value.split(",").map((item) => item.trim()).filter(Boolean) }))} /></div></details>
                    <details className="rb-form-section"><summary><span className="rb-form-icon">06</span><span><b>Certifications</b><small>Credentials and courses</small></span><i>⌄</i></summary><div className="rb-repeat-list">{current.certificates.map((item, index) => <div className="rb-repeat-card" key={"certificate-" + index}><div className="rb-repeat-card-head"><b>Certificate {index + 1}</b><button onClick={() => removeItem("certificates", index)}>Remove</button></div><div className="rb-form-grid"><Field label="Certificate" value={item.name} onChange={(value) => updateListItem("certificates", index, "name", value)} /><Field label="Issuer" value={item.issuer} onChange={(value) => updateListItem("certificates", index, "issuer", value)} /><Field label="Date" value={item.date} onChange={(value) => updateListItem("certificates", index, "date", value)} /><Field label="Credential link" value={item.link} onChange={(value) => updateListItem("certificates", index, "link", value)} /></div></div>)}<button className="rb-add-row" onClick={() => addItem("certificates")}>＋ Add certification</button></div></details>
                    <div className="rb-editor-bottom-actions"><button className="rb-button rb-button-light" onClick={exportBackup}>Export editable backup</button><button className="rb-button rb-button-accent" onClick={printResume}>Download PDF →</button></div>
                  </div>
                  <div className="rb-live-preview"><div className="rb-preview-head"><div><span className="rb-live-dot" /> LIVE PREVIEW</div><div className="rb-color-picker"><span>Accent</span>{["#b85c3d", "#1f4f4a", "#3857a6", "#7553a3", "#263342"].map((color) => <button key={color} style={{ background: color }} className={current.accent === color ? "active" : ""} aria-label={"Use " + color} onClick={() => updateCurrent((resume) => ({ ...resume, accent: color }))} />)}</div></div><div className="rb-preview-canvas"><ResumePreview resume={current} /></div><div className="rb-preview-foot"><span>Text remains selectable in the exported document.</span><button onClick={() => setView("keywords")}>Optimize keywords ↗</button></div></div>
                </div>
              </div>
            ) : null}

            {view === "keywords" ? (
              <div className="rb-keyword-view">
                <div className="rb-view-intro"><div><span className="rb-eyebrow rb-eyebrow-dark">ROLE-ALIGNED LANGUAGE</span><h3>Make your experience <em>easier to find.</em></h3><p>Paste a job description. We will identify recurring terms and compare them with your current resume, right in your browser.</p></div><button className="rb-button rb-button-light" onClick={() => setView("editor")}>Back to editor ↗</button></div>
                <div className="rb-keyword-layout">
                  <div className="rb-job-input-card"><label htmlFor="rb-job-description">JOB DESCRIPTION</label><textarea id="rb-job-description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here. Include responsibilities, required skills and qualifications for a more useful comparison..." /><div className="rb-job-input-foot"><span>{jobDescription.trim().split(/\s+/).filter(Boolean).length} words scanned locally</span><button onClick={() => setJobDescription("")}>Clear</button></div><div className="rb-keyword-privacy">◉ Your text is analyzed on this device and is not sent to a server.</div></div>
                  <div className="rb-keyword-results"><div className="rb-results-summary"><div><b>{matchedKeywords.length}</b><span>Found in resume</span></div><div><b>{missingKeywords.length}</b><span>Worth reviewing</span></div><div><b>{suggestedKeywords.length}</b><span>Terms identified</span></div></div>
                    <div className="rb-keyword-group"><div className="rb-keyword-group-head"><h4>Already in your resume</h4><span className="rb-match-label">MATCHED</span></div><div className="rb-chip-list">{matchedKeywords.length ? matchedKeywords.map((word) => <span className="rb-keyword-chip matched" key={word}>{word} <i>✓</i></span>) : <p className="rb-empty-copy">Matched terms will appear here.</p>}</div></div>
                    <div className="rb-keyword-group"><div className="rb-keyword-group-head"><h4>Consider adding</h4><span className="rb-missing-label">REVIEW</span></div><div className="rb-chip-list">{missingKeywords.length ? missingKeywords.map((word) => <button className="rb-keyword-chip missing" key={word} onClick={() => addKeyword(word)}>＋ {word}</button>) : <p className="rb-empty-copy">Paste a job description to find useful terms.</p>}</div><p className="rb-keyword-note">Only add a term when it accurately describes your skills or experience. Keywords are not a substitute for evidence.</p></div>
                    <div className="rb-keyword-group"><div className="rb-keyword-group-head"><h4>Your saved keywords</h4><button className="rb-text-button" onClick={copyKeywords}>Copy list ↗</button></div><div className="rb-chip-list">{(current.keywords || []).map((word) => <button className="rb-keyword-chip saved" key={word} onClick={() => updateCurrent((resume) => ({ ...resume, keywords: resume.keywords.filter((item) => item !== word) }))}>{word} <i>×</i></button>)}{!(current.keywords || []).length ? <p className="rb-empty-copy">Terms you add will be saved here.</p> : null}</div><div className="rb-add-keyword"><input value={keywordDraft} onChange={(event) => setKeywordDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addKeyword(keywordDraft); }} placeholder="Add your own keyword" /><button onClick={() => addKeyword(keywordDraft)}>Add keyword</button></div></div>
                  </div>
                </div>
                <div className="rb-ats-coming"><div className="rb-ats-icon">✳</div><div><span>IN THE NEXT RELEASE</span><h4>ATS readiness analysis</h4><p>A structured review of formatting, section completeness, keyword coverage and document readability is planned for a future release. This keyword comparison is not an official ATS score.</p></div><span className="rb-coming-pill">COMING SOON</span></div>
              </div>
            ) : null}
          </section>
        </div>
      </section>

      <section className="rb-template-teaser" id="templates-overview">
        <div className="rb-teaser-copy"><div className="rb-eyebrow rb-eyebrow-dark">A FORMAT THAT FEELS LIKE YOU</div><h2>Six original layouts.<br /><em>One clear story.</em></h2><p>From first roles to experienced professionals, pick a structure that makes your strongest work easy to understand.</p><button className="rb-button rb-button-dark" onClick={() => goToApp("templates")}>See all templates ↗</button></div>
        <div className="rb-teaser-cards"><div className="rb-teaser-sheet rb-teaser-one"><b>YOUR NAME</b><i /><span /><span /><label>EXPERIENCE</label><span /><span /><span /></div><div className="rb-teaser-sheet rb-teaser-two"><b>YOUR NAME</b><label>PROFILE</label><span /><span /><label>SELECTED WORK</label><span /><span /><span /></div><div className="rb-teaser-sheet rb-teaser-three"><b>YOUR NAME</b><i /><label>EXPERIENCE</label><span /><span /><label>EDUCATION</label><span /><span /></div></div>
      </section>

      <section className="rb-faq-section" id="resume-faq"><div><div className="rb-eyebrow rb-eyebrow-dark">GOOD TO KNOW</div><h2>Questions, <em>answered.</em></h2><p>Everything you need to get started with Resume Studio.</p></div><div className="rb-faq-list">
        <details><summary>Is the resume builder really free? <i>＋</i></summary><p>Yes. You can create resumes, switch between the available layouts, edit your content and use the browser print dialog to save a PDF. No account is required.</p></details>
        <details><summary>Where is my resume data saved? <i>＋</i></summary><p>Your drafts are saved in local browser storage on this device. They are not uploaded to a NovexaHub server. Export an editable JSON backup before clearing browser data or switching devices.</p></details>
        <details><summary>Can I import a PDF, Word document or LinkedIn profile? <i>＋</i></summary><p>PDF and DOCX text can be imported in your browser. LinkedIn CSV exports can be added through the import panel. Direct LinkedIn profile access depends on LinkedIn API approval, so the data-export route is provided as the reliable alternative.</p></details>
        <details><summary>Does the keyword tool calculate an ATS score? <i>＋</i></summary><p>It compares words in a job description with the text in your resume and highlights possible gaps. It does not simulate every employer's applicant tracking system or guarantee a score, interview or job offer.</p></details>
      </div></section>

      <footer className="rb-footer"><a className="rb-brand" href="/"><span className="rb-brand-mark">N</span><span>novexa<span>hub</span><small>RESUME STUDIO</small></span></a><p>Thoughtful tools for your next chapter.</p><div><a href="/">NovexaHub</a><a href="/privacy-policy">Privacy</a><a href="/terms">Terms</a></div><small>© {new Date().getFullYear()} NovexaHub. Built to help good work get noticed.</small></footer>

      {showImport ? <div className="rb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowImport(false); }}><section className="rb-modal" role="dialog" aria-modal="true" aria-labelledby="rb-import-title"><button className="rb-modal-close" onClick={() => setShowImport(false)} aria-label="Close">×</button><span className="rb-eyebrow rb-eyebrow-dark">BRING YOUR WORK WITH YOU</span><h3 id="rb-import-title">Import a resume</h3><p>Choose a PDF, Word document, text or JSON backup. You can also select LinkedIn CSV files together.</p><label className="rb-dropzone"><span>↑</span><b>{busy ? "Reading your file…" : "Choose files to import"}</b><small>PDF · DOCX · TXT · JSON · CSV</small><input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.json,.csv" multiple onChange={handleImportFiles} disabled={busy} /></label><div className="rb-modal-divider"><span>OR PASTE RESUME TEXT</span></div><textarea className="rb-paste-area" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="Paste selectable text from your current resume..." /><button className="rb-button rb-button-accent rb-modal-submit" onClick={importPastedText}>Import pasted text →</button><small className="rb-modal-privacy">Files are processed locally in your browser. They are not uploaded to NovexaHub.</small></section></div> : null}

      {showLinkedIn ? <div className="rb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLinkedIn(false); }}><section className="rb-modal rb-linkedin-modal" role="dialog" aria-modal="true" aria-labelledby="rb-linkedin-title"><button className="rb-modal-close" onClick={() => setShowLinkedIn(false)} aria-label="Close">×</button><div className="rb-linkedin-mark">in</div><span className="rb-eyebrow rb-eyebrow-dark">LINKEDIN PROFILE IMPORT</span><h3 id="rb-linkedin-title">Bring your profile over.</h3><p>LinkedIn limits which profile fields third-party apps can read. The dependable route today is to request your data archive and import the relevant CSV files here.</p><ol className="rb-linkedin-steps"><li><b>Request your LinkedIn data</b><span>Open LinkedIn Settings and Privacy, then find Get a copy of your data.</span></li><li><b>Choose profile information</b><span>Include Profile, Positions, Education and Skills where available.</span></li><li><b>Import the CSV files</b><span>Return here and select the downloaded CSV files together.</span></li></ol><button className="rb-button rb-button-accent rb-modal-submit" onClick={() => { setShowLinkedIn(false); setShowImport(true); }}>Choose LinkedIn CSV files →</button><a className="rb-external-link" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Open LinkedIn ↗</a><small className="rb-modal-privacy">Your LinkedIn password is never requested or stored here.</small></section></div> : null}

      {showUploadLinkedIn ? <div className="rb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowUploadLinkedIn(false); }}><section className="rb-modal" role="dialog" aria-modal="true" aria-labelledby="rb-linkedin-upload-title"><button className="rb-modal-close" onClick={() => setShowUploadLinkedIn(false)} aria-label="Close">×</button><div className="rb-linkedin-mark">in</div><span className="rb-eyebrow rb-eyebrow-dark">SHARE YOUR RESUME</span><h3 id="rb-linkedin-upload-title">Ready for LinkedIn.</h3><p>LinkedIn does not provide a general-purpose API for third-party apps to upload a member resume to every profile or job application area. Export your PDF, then attach it in LinkedIn where you apply or manage your profile.</p><ol className="rb-linkedin-steps"><li><b>Save your PDF</b><span>Use Download PDF and choose Save as PDF in the browser print window.</span></li><li><b>Open LinkedIn</b><span>Go to Jobs and attach your saved resume when applying, or update the relevant profile section.</span></li><li><b>Keep a tailored version</b><span>Use a separate resume for each role so the content stays relevant.</span></li></ol><button className="rb-button rb-button-accent rb-modal-submit" onClick={() => { setShowUploadLinkedIn(false); printResume(); }}>Download PDF first →</button><a className="rb-external-link" href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer">Open LinkedIn Jobs ↗</a><small className="rb-modal-privacy">Your resume is not sent to LinkedIn by this tool. You remain in control of the upload.</small></section></div> : null}
      {toast ? <div className="rb-toast" role="status">{toast}</div> : null}
      <input type="file" accept=".json" hidden onChange={handleImportFiles} />
    </div>
  );
}
