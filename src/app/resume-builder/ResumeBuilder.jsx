"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./resume-builder.css";

const STORAGE_KEY = "novexahub-resume-studio-v1";

const TEMPLATE_OPTIONS = [
  { id: "professional", name: "Professional", note: "Polished charcoal header with a portrait panel", tag: "Corporate", color: "#303846" },
  { id: "chrono", name: "Chrono", note: "A clean chronological career timeline", tag: "Timeline", color: "#315eaa" },
  { id: "elegant", name: "Elegant", note: "Soft teal banner with a dark skills rail", tag: "Elegant", color: "#85b9b4" },
  { id: "circular", name: "Circular", note: "Rounded blue profile header and airy content", tag: "Creative", color: "#315f96" },
  { id: "modern", name: "Modern", note: "Warm rust sidebar with strong section labels", tag: "Popular", color: "#98402f" },
  { id: "luxe", name: "Luxe", note: "Editorial whitespace and understated taupe", tag: "Premium", color: "#b9a39a" },
  { id: "classic", name: "Classic", note: "Straightforward black-and-white structure", tag: "ATS-friendly", color: "#454545" },
  { id: "casual", name: "Casual", note: "Fresh green profile column and soft details", tag: "Friendly", color: "#71a98b" },
  { id: "horizontal", name: "Horizontal", note: "Blue top banner with balanced two-column feel", tag: "Clean", color: "#2e6fa5" },
  { id: "vertical", name: "Vertical Timeline", note: "Burgundy sidebar and a connected career timeline", tag: "Reference style", color: "#920b36" },
  { id: "atelier", name: "Atelier", note: "Warm editorial design with confident type", tag: "Editorial", color: "#a84f36" },
  { id: "swiss", name: "Swiss Grid", note: "Precise alignment and quiet hierarchy", tag: "Structured", color: "#d04b32" },
  { id: "folio", name: "Folio", note: "A refined side rail for a fuller profile", tag: "Profile-led", color: "#263f49" },
  { id: "signal", name: "Signal", note: "High-contrast design for digital roles", tag: "Technology", color: "#2457a6" },
  { id: "monogram", name: "Monogram", note: "Elegant typography with a classic rhythm", tag: "Timeless", color: "#675044" },
  { id: "gridline", name: "Gridline", note: "Compact, information-dense and composed", tag: "Compact", color: "#3d5148" },
];

const SECTION_ORDER_OPTIONS = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certificates", label: "Certifications" },
  { id: "languages", label: "Languages" },
  { id: "interests", label: "Interests" },
];

const DEFAULT_RESUME_DESIGN = {
  font: "sans",
  textSize: "normal",
  spacing: "comfortable",
  photoShape: "circle",
  showPhoto: true,
  photoPosition: "sidebar",
  sectionStyle: "line",
  sidebarWidth: "34",
};

const emptyExperience = { role: "", company: "", location: "", start: "", end: "", details: "" };
const emptyEducation = { degree: "", school: "", location: "", start: "", end: "", details: "" };
const emptyProject = { name: "", role: "", link: "", details: "" };
const emptyCertificate = { name: "", issuer: "", date: "", link: "" };

function starterResume(id) {
  return {
    id: id || "starter",
    title: "My first resume",
    template: "vertical",
    accent: "#920b36",
    design: { ...DEFAULT_RESUME_DESIGN },
    sectionOrder: ["profile", "experience", "education", "projects", "skills", "certificates", "languages", "interests"],
    interests: [],
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
    interests: ["Continuous learning", "Volunteering"],
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
    template: existing?.template || "vertical",
    accent: existing?.accent || "#920b36",
    design: { ...DEFAULT_RESUME_DESIGN, ...(existing?.design || {}) },
    sectionOrder: [...(existing?.sectionOrder || DEFAULT_RESUME_DESIGN.sectionOrder || [])],
    profile: { fullName: "", headline: "", email: "", phone: "", location: "", website: "", linkedin: "", summary: "", photo: "" },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certificates: [],
    interests: [],
    keywords: [],
  };
}

const TEMPLATE_PREVIEW = starterResume("template-preview");

function safeResume(value) {
  if (!value || typeof value !== "object") return null;
  const base = starterResume(value.id || makeId());
  return {
    ...base,
    ...value,
    template: ({
      minimal: "swiss",
      executive: "folio",
      tech: "signal",
      compact: "gridline",
      grid: "gridline",
    })[value.template] || (["professional", "chrono", "elegant", "circular", "modern", "luxe", "classic", "casual", "horizontal", "vertical", "atelier", "swiss", "folio", "signal", "monogram", "gridline"].includes(value.template) ? value.template : "vertical"),
    profile: { ...base.profile, ...(value.profile || {}) },
    design: { ...DEFAULT_RESUME_DESIGN, ...(value.design || {}) },
    sectionOrder: Array.isArray(value.sectionOrder) ? value.sectionOrder : base.sectionOrder,
    experience: Array.isArray(value.experience) ? value.experience : base.experience,
    education: Array.isArray(value.education) ? value.education : base.education,
    projects: Array.isArray(value.projects) ? value.projects : base.projects,
    skills: Array.isArray(value.skills) ? value.skills : base.skills,
    languages: Array.isArray(value.languages) ? value.languages : base.languages,
    certificates: Array.isArray(value.certificates) ? value.certificates : base.certificates,
    interests: Array.isArray(value.interests) ? value.interests : [],
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
  ["summary", /^(professional summary|career summary|summary|profile|career profile|objective|career objective|about me|professional profile)$/i],
  ["experience", /^(professional experience|work experience|employment history|work history|experience|employment|career history|work experience and internships)$/i],
  ["education", /^(education|academic background|education and training|qualifications|academic qualifications)$/i],
  ["skills", /^(technical skills|core skills|key skills|skills|competencies|core competencies|expertise|technical expertise|skill set|areas of expertise)$/i],
  ["projects", /^(selected projects|personal projects|academic projects|projects|portfolio|key projects)$/i],
  ["certificates", /^(certifications|certificates|licenses and certifications|licenses|courses|professional development)$/i],
  ["languages", /^(languages|language skills)$/i],
  ["interests", /^(hobbies|interests|hobbies and interests|activities|personal interests)$/i],
  ["contact", /^(contact|contact details|contact information|personal details|personal information)$/i],
];

const MONTH_RE = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_POINT_RE = "(?:" + MONTH_RE + "\\s+(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])[/.](?:19|20)?\\d{2}|(?:19|20)\\d{2}|present|current|now)";
const DATE_RANGE_RE = new RegExp("(" + DATE_POINT_RE + ")\\s*(?:-|–|—|to|until|through)\\s*(" + DATE_POINT_RE + ")", "i");

const ROLE_WORD_RE = /\b(engineer|developer|programmer|designer|manager|analyst|consultant|intern|specialist|coordinator|director|lead|architect|officer|teacher|accountant|technician|administrator|founder|owner|associate|executive|researcher|scientist|product|sales|marketing|support|nurse|doctor|lawyer|editor|operator|supervisor|strategist|representative|assistant|producer|writer|recruiter|trainer|auditor|planner|advisor|adviser)\b/i;
const ACTION_START_RE = /^(built|developed|created|designed|led|managed|worked|responsible|using|used|improved|increased|reduced|delivered|collaborated|implemented|supported|coordinated|maintained|launched|achieved|conducted|provided|performed|assisted|analyzed|analysed|contributed|automated|deployed|integrated|optimized|optimised|organized|organised|executed|streamlined|oversaw|spearheaded|successfully|results-driven|detail-oriented)\b/i;
const DEGREE_RE = /\b(b\.?\s?sc|bachelor|master|m\.?\s?sc|mba|ph\.?\s?d|doctorate|diploma|associate|matric|intermediate|fsc|a-level|o-level|bs\b|ms\b|bba\b|m\.?phil|certification)\b/i;
const INSTITUTION_RE = /\b(university|college|school|institute|academy|polytechnic)\b/i;

function normalizeResumeLines(source) {
  return String(source || "")
    .replace(/\u0000/g, " ")
    .replace(/\u00ad/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\uFB01/g, "fi")
    .replace(/\uFB02/g, "fl")
    .replace(/\t+/g, " | ")
    .replace(/\f/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").replace(/^[•●▪◦‣*·\-–—]\s*/, "").trim())
    .filter((line) => line && !/^(page\s+)?\d+\s*(of\s+\d+)?$/i.test(line));
}

function normalizeSectionHeading(line) {
  return String(line || "")
    .replace(/^\s*(?:\d+(?:\.\d+)*[.)]?\s*)/, "")
    .replace(/^[#•▪◦*-]+\s*/, "")
    .replace(/[:：|–—-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitResumeSections(lines) {
  const sections = { header: [] };
  let current = "header";
  const headingLines = [];
  lines.forEach((line) => {
    const normalized = normalizeSectionHeading(line);
    let match = SECTION_PATTERNS.find(([, pattern]) => pattern.test(normalized));
    let inlineContent = "";

    if (!match) {
      const delimiter = String(line).match(/^(.{2,54}?)(?:\s*[:：]\s*|\s+[|]\s+|\s+[–—-]\s+)(.+)$/);
      if (delimiter) {
        const possibleHeading = normalizeSectionHeading(delimiter[1]);
        match = SECTION_PATTERNS.find(([, pattern]) => pattern.test(possibleHeading));
        if (match) inlineContent = delimiter[2].trim();
      }
    }

    if (match) {
      current = match[0];
      if (!sections[current]) sections[current] = [];
      headingLines.push(normalized);
      if (inlineContent) sections[current].push(inlineContent);
    } else {
      if (!sections[current]) sections[current] = [];
      sections[current].push(line);
    }
  });
  return { sections, headingLines };
}
function extractDateRange(line) {
  const match = String(line || "").match(DATE_RANGE_RE);
  if (!match) return null;
  return { start: match[1].trim(), end: match[2].trim(), text: match[0] };
}

function extractLabeledValue(source, labels) {
  for (const label of labels) {
    const expression = new RegExp("(?:^|\\n)\\s*" + label + "\\s*[:：–—-]\\s*([^\\n]+)", "i");
    const match = String(source || "").match(expression);
    if (match?.[1]) return match[1].trim().replace(/[|•·]+$/, "").trim();
  }
  return "";
}

function extractSkillItems(lines) {
  const categoryPrefix = /^(?:programming languages?|languages?|frameworks?|libraries|tools?|platforms?|databases?|cloud|technologies|technical skills|soft skills|core competencies|methodologies|other skills?)\s*[:：-]\s*/i;
  const items = [];
  (lines || []).forEach((line) => {
    const value = String(line || "").replace(categoryPrefix, "").trim();
    value.split(/[,;|•·\u2022]+/).forEach((item) => {
      const clean = item.replace(/^[•●▪◦‣*·\-–—]+\s*/, "").trim();
      if ((clean.length > 1 || /^(c|r)$/i.test(clean)) && clean.length < 54 && !/^skills?$/i.test(clean)) items.push(clean);
    });
  });
  return Array.from(new Map(items.map((item) => [item.toLowerCase(), item])).values()).slice(0, 50);
}

function isLikelyEntryTitle(line, kind) {
  const value = String(line || "").replace(/^[•●▪◦‣*·]\s*/, "").trim();
  if (value.length < 3 || value.length > 115 || ACTION_START_RE.test(value)) return false;
  if (/[.!?]$/.test(value) || /@|https?:\/\//i.test(value)) return false;
  if (extractDateRange(value)) return false;
  if (kind === "education") return DEGREE_RE.test(value) || (INSTITUTION_RE.test(value) && value.length < 95);
  if (kind === "project") return value.length <= 88 && !/^(technologies|tools|responsibilities|highlights|description|built|developed|created|designed|implemented|used|using)\s*:/i.test(value) && (/\s+\|\s+/.test(value) || /\b(project|platform|application|app|website|system|dashboard|portal|tool|solution|prototype)\b/i.test(value) || !/[,:;]$/.test(value));
  return ROLE_WORD_RE.test(value) || /\s+at\s+/i.test(value) || /\s+\|\s+/.test(value);
}

function splitRoleAndOrganization(value) {
  const text = String(value || "").trim().replace(/[|·•]+$/g, "").trim();
  const explicitParts = text.split(/\s+[|·•]\s+|\s+[–—-]\s+/).map((part) => part.trim()).filter(Boolean);
  if (explicitParts.length >= 2) return { title: explicitParts[0], organization: explicitParts[1], extras: explicitParts.slice(2) };
  const spacedParts = text.split(/\s{2,}/).map((part) => part.trim()).filter(Boolean);
  if (spacedParts.length >= 2) return { title: spacedParts[0], organization: spacedParts[1], extras: spacedParts.slice(2) };
  const atMatch = text.match(/^(.+?)\s+at\s+(.+)$/i);
  if (atMatch) return { title: atMatch[1].trim(), organization: atMatch[2].trim(), extras: [] };
  const commaParts = text.split(/,\s*/).map((part) => part.trim()).filter(Boolean);
  if (commaParts.length >= 2 && ROLE_WORD_RE.test(commaParts[0])) {
    return { title: commaParts[0], organization: commaParts.slice(1).join(", "), extras: [] };
  }
  return { title: text, organization: "", extras: [] };
}

function parseEntryBlocks(lines, kind) {
  const clean = (lines || []).map((line) => String(line || "").trim()).filter(Boolean);
  if (!clean.length) return [];
  const groups = [];
  let current = [];
  const hasDate = () => current.some((item) => item && typeof item === "object" && item.type === "date");
  const currentText = () => current.filter((item) => typeof item === "string");
  const currentHasTitle = () => currentText().some((line) => isLikelyEntryTitle(line, kind));
  const flush = () => {
    if (current.length) groups.push(current);
    current = [];
  };

  clean.forEach((line) => {
    const date = extractDateRange(line);
    const withoutDate = date ? line.replace(DATE_RANGE_RE, " ").replace(/[·•]+/g, " ").replace(/\s+/g, " ").replace(/[|\s]+$/g, "").trim() : line;
    const newTitle = isLikelyEntryTitle(withoutDate, kind);
    if (current.length && date && hasDate()) flush();
    else if (current.length && newTitle && currentHasTitle() && (hasDate() || currentText().length >= (kind === "project" ? 4 : 2))) flush();

    if (date) {
      current.push({ type: "date", start: date.start, end: date.end });
      if (withoutDate) current.push(withoutDate);
    } else {
      current.push(line);
    }
  });
  flush();

  return groups.map((group) => {
    const date = group.find((item) => item && typeof item === "object" && item.type === "date");
    const content = group.filter((item) => typeof item === "string")
      .map((line) => line.replace(/^[•●▪◦‣*·]\s*/, "").trim())
      .filter(Boolean);
    const headerCandidates = content.filter((line) =>
      line.length <= 115 &&
      !ACTION_START_RE.test(line) &&
      !/[.!?]$/.test(line) &&
      !/^https?:\/\//i.test(line)
    );
    let titleLine = headerCandidates.find((line) => isLikelyEntryTitle(line, kind)) || headerCandidates[0] || content[0] || "";
    const split = splitRoleAndOrganization(titleLine);
    let organization = split.organization;
    const remaining = content.filter((line) => line !== titleLine && !split.extras.includes(line));
    const organizationIndex = remaining.findIndex((line) =>
      line.length <= 95 &&
      !ACTION_START_RE.test(line) &&
      !/[.!?]$/.test(line) &&
      !/^(remote|hybrid|on[- ]site|full[- ]time|part[- ]time)$/i.test(line) &&
      !/^https?:\/\//i.test(line)
    );
    if (!organization && organizationIndex >= 0 && kind !== "project") {
      const candidate = remaining[organizationIndex];
      if (kind === "education" || !isLikelyEntryTitle(candidate, kind)) {
        organization = candidate;
        remaining.splice(organizationIndex, 1);
      }
    }
    const details = remaining.join("\n").replace(/^[•●▪◦‣*·]\s*/gm, "").trim();

    if (kind === "education") {
      const degreeLine = content.find((line) => DEGREE_RE.test(line)) || titleLine;
      const schoolLine = content.find((line) => INSTITUTION_RE.test(line) && line !== degreeLine) || organization;
      return {
        degree: degreeLine,
        school: schoolLine || "",
        location: "",
        start: date?.start || "",
        end: date?.end || "",
        details: content.filter((line) => line !== degreeLine && line !== schoolLine).join("\n").trim(),
      };
    }
    if (kind === "project") {
      return {
        name: titleLine,
        role: organization,
        link: content.find((line) => /https?:\/\/|github\.com|gitlab\.com/i.test(line)) || "",
        details,
      };
    }
    return {
      role: split.title || titleLine,
      company: organization,
      location: "",
      start: date?.start || "",
      end: date?.end || "",
      details,
    };
  }).filter((item) => {
    if (kind === "education") return Boolean(item.degree || item.school);
    if (kind === "project") return Boolean(item.name || item.details);
    return Boolean(item.role || item.company || item.details);
  });
}

function parseTextIntoResume(source, existing) {
  const raw = String(source || "").replace(/\u0000/g, " ").trim();
  const lines = normalizeResumeLines(raw);
  const { sections, headingLines } = splitResumeSections(lines);
  const header = [...(sections.header || []), ...(sections.contact || [])];
  const explicitName = raw.match(/(?:^|\n)\s*(?:full\s+name|name)\s*[:：-]\s*([^\n]+)/i);
  const explicitHeadline = extractLabeledValue(raw, ["professional headline", "headline", "job title", "designation", "title"]);
  const explicitLocation = extractLabeledValue(raw, ["location", "city", "current location", "address"]);
  const emailMatch = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneCandidates = raw.match(/(?:\+\d{1,3}[ .-]?)?(?:\(?\d{2,4}\)?[ .-]?)?\d[\d .()-]{5,13}\d/g) || [];
  const phoneMatch = phoneCandidates.find((candidate) => {
    const digits = candidate.replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15 && !DATE_RANGE_RE.test(candidate);
  });
  const linkedinMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Z0-9-_%]+/i);
  const websiteSource = raw.replace(emailMatch?.[0] || "", " ").replace(linkedinMatch?.[0] || "", " ");
  const websiteMatch = websiteSource.match(/(?:https?:\/\/)?(?:www\.)?[A-Z0-9-]+\.(?:com|net|org|io|dev|co|me|app)(?:\/[^\s]*)?/i);
  const nameCandidate = (explicitName?.[1] || "").trim() || header.find((line) =>
    line.length >= 3 &&
    line.length <= 58 &&
    !/@|https?:\/\/|linkedin\.com|\d{5,}/i.test(line) &&
    !/\b(?:Pakistan|India|United States|United Kingdom|Canada|Australia|UAE|Dubai|Lahore|Karachi|Islamabad|Delhi|Mumbai)\b/i.test(line) &&
    !/^(resume|curriculum vitae|curriculum vit[aá]e|cv|profile|personal details|contact|contact details|contact information|personal information)$/i.test(line) &&
    !DATE_RANGE_RE.test(line)
  ) || "";
  const headlineCandidate = explicitHeadline || header.find((line) =>
    line !== nameCandidate &&
    line.length >= 3 &&
    line.length <= 90 &&
    !/@|https?:\/\/|linkedin\.com|\d{5,}/i.test(line) &&
    !/\b(?:Pakistan|India|United States|United Kingdom|Canada|Australia|UAE|Dubai|Lahore|Karachi|Islamabad|Delhi|Mumbai)\b/i.test(line) &&
    !/^(location|city|address|phone|mobile|email)\s*[:：]/i.test(line) &&
    !DATE_RANGE_RE.test(line)
  ) || "";

  const summaryLines = (sections.summary || []).slice(0, 9);
  const summary = summaryLines.join(" ").replace(/\s+/g, " ").trim();
  const experience = parseEntryBlocks(sections.experience || [], "experience").slice(0, 12);
  const education = parseEntryBlocks(sections.education || [], "education").slice(0, 8);
  const projects = parseEntryBlocks(sections.projects || [], "project").slice(0, 12);
  const skills = extractSkillItems(sections.skills || []);
  const certificates = (sections.certificates || []).map((line) => line.trim()).filter(Boolean).slice(0, 12).map((line) => ({
    name: line,
    issuer: "",
    date: "",
    link: "",
  }));
  const languages = (sections.languages || []).join(",").split(/[,;|•·]\s*|\n/).map((item) => item.trim()).filter(Boolean).slice(0, 12);
  const interests = (sections.interests || []).join(",").split(/[,;|•·]\s*|\n/).map((item) => item.trim()).filter(Boolean).slice(0, 20);
  const profile = {
    ...existing.profile,
    fullName: nameCandidate || existing.profile.fullName || "",
    headline: headlineCandidate || existing.profile.headline || "",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch.trim() : "",
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
    website: extractLabeledValue(raw, ["portfolio", "website", "personal website"]) || (websiteMatch ? websiteMatch[0] : ""),
    location: explicitLocation || existing.profile.location || "",
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
    interests,
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
    interests: interests.length,
  };
  const sectionTotal = [detected.summary, detected.experience, detected.education, detected.projects, detected.skills, detected.certificates, detected.languages, detected.interests].filter(Boolean).length;
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
    rawPreview: raw.slice(0, 6000),
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
  if (file.size > 20 * 1024 * 1024) {
    throw new Error("This file is larger than 20 MB. Export a smaller or text-only version and try again.");
  }
  if (extension === "pdf") {
    const pdfjs = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "rb-pdfjs", "pdfjsLib");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const documentPdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    if (documentPdf.numPages > 35) {
      throw new Error("This PDF has more than 35 pages. Split it into smaller files before importing.");
    }
    const pages = [];
    const extractionWarnings = [];
    for (let pageNumber = 1; pageNumber <= documentPdf.numPages; pageNumber += 1) {
      const page = await documentPdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const positioned = content.items
        .filter((item) => typeof item.str === "string" && item.str.trim())
        .map((item) => ({
          text: item.str.trim(),
          x: Number(item.transform?.[4] || 0),
          y: Number(item.transform?.[5] || 0),
          width: Number(item.width || 0),
          height: Math.abs(Number(item.transform?.[3] || item.transform?.[0] || 10)),
        }))
        .sort((a, b) => (b.y - a.y) || (a.x - b.x));
      const rows = [];
      positioned.forEach((item) => {
        let row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= Math.max(2.2, Math.min(item.height, 14) * 0.22));
        if (!row) {
          row = { y: item.y, items: [] };
          rows.push(row);
        }
        row.items.push(item);
      });
      rows.sort((a, b) => b.y - a.y);

      const rowStarts = rows.flatMap((row) => {
        const sorted = [...row.items].sort((a, b) => a.x - b.x);
        const starts = [];
        let previousRight = null;
        sorted.forEach((item) => {
          if (previousRight === null || item.x - previousRight > 58) starts.push(item.x);
          previousRight = item.x + item.width;
        });
        return starts;
      }).filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
      let columnSplit = null;
      let largestGap = 0;
      for (let index = 1; index < rowStarts.length; index += 1) {
        const gap = rowStarts[index] - rowStarts[index - 1];
        const split = (rowStarts[index] + rowStarts[index - 1]) / 2;
        const leftCount = rowStarts.filter((x) => x < split).length;
        const rightCount = rowStarts.filter((x) => x >= split).length;
        if (
          gap > largestGap &&
          gap > 62 &&
          split > viewport.width * 0.27 &&
          split < viewport.width * 0.76 &&
          leftCount >= 3 &&
          rightCount >= 3
        ) {
          largestGap = gap;
          columnSplit = split;
        }
      }

      const makeLine = (items) => {
        const sorted = items.sort((a, b) => a.x - b.x);
        let line = "";
        let previousRight = null;
        sorted.forEach((item) => {
          if (previousRight !== null && item.x - previousRight > 20) line += " | ";
          else if (line && !/\s$/.test(line)) line += " ";
          line += item.text;
          previousRight = item.x + item.width;
        });
        return line.trim();
      };

      let pageLines;
      if (columnSplit !== null) {
        const leftLines = [];
        const rightLines = [];
        rows.forEach((row) => {
          const left = row.items.filter((item) => item.x < columnSplit);
          const right = row.items.filter((item) => item.x >= columnSplit);
          if (left.length) leftLines.push(makeLine(left));
          if (right.length) rightLines.push(makeLine(right));
        });
        pageLines = [...leftLines, "", ...rightLines].filter((line, index, all) => line || (index > 0 && index < all.length - 1));
        extractionWarnings.push("This PDF appears to use columns. Columns were read separately; check the order of experience and education entries.");
      } else {
        pageLines = rows.map((row) => makeLine(row.items)).filter(Boolean);
      }
      pages.push(pageLines.join("\n"));
    }
    const text = pages.join("\n\n");
    if (text.trim().length < 80) {
      return { text, warnings: [...extractionWarnings, "Very little selectable text was found. This PDF may be scanned, image-only or protected."] };
    }
    return { text, warnings: extractionWarnings };
  }
  if (extension === "docx") {
    const mammoth = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js", "rb-mammoth", "mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    const warnings = (result.messages || []).map((message) => message.message).filter(Boolean);
    return { text: result.value || "", warnings };
  }
  if (extension === "txt") return { text: await file.text(), warnings: [] };
  throw new Error("Unsupported document type. Choose a text-based PDF, DOCX or TXT file.");
}
function importLinkedInRows(files, base) {
  if (!files.length) throw new Error("Choose at least one LinkedIn CSV export file.");
  const result = { ...base, profile: { ...base.profile } };
  const experience = [];
  const education = [];
  const skills = [];
  const certificates = [];
  const importedParts = [];
  files.forEach(({ name, rows }) => {
    const label = name.toLowerCase();
    if (!rows.length) throw new Error(name + " is empty or could not be read as CSV.");
    const headers = Object.keys(rows[0] || {});
    const has = (keys) => keys.some((key) => headers.some((header) => header.toLowerCase().replace(/[^a-z0-9]/g, "") === key.toLowerCase().replace(/[^a-z0-9]/g, "")));
    if (label.includes("profile")) {
      if (!has(["First Name", "Last Name", "Headline", "Summary"])) throw new Error(name + " does not look like a LinkedIn Profile export.");
      const profile = rows.find((row) => getValue(row, ["First Name", "Last Name", "Headline", "Summary"])) || rows[0];
      const first = getValue(profile, ["First Name"]);
      const last = getValue(profile, ["Last Name"]);
      result.profile = {
        ...result.profile,
        fullName: [first, last].filter(Boolean).join(" ") || result.profile.fullName,
        headline: getValue(profile, ["Headline"]) || result.profile.headline,
        summary: getValue(profile, ["Summary"]) || result.profile.summary,
        location: getValue(profile, ["Geo Location", "Location"]) || result.profile.location,
        website: getValue(profile, ["Websites", "Website"]) || result.profile.website,
      };
      importedParts.push("Profile");
    } else if (label.includes("email")) {
      if (!has(["Email Address", "Email"])) throw new Error(name + " does not contain a recognized LinkedIn email column.");
      const emailRow = rows.find((row) => getValue(row, ["Email Address", "Email"]));
      result.profile.email = getValue(emailRow, ["Email Address", "Email"]) || result.profile.email;
      importedParts.push("Email address");
    } else if (label.includes("phone")) {
      if (!has(["Number", "Phone Number", "Phone"])) throw new Error(name + " does not contain a recognized LinkedIn phone column.");
      const phoneRow = rows.find((row) => getValue(row, ["Number", "Phone Number", "Phone"]));
      result.profile.phone = getValue(phoneRow, ["Number", "Phone Number", "Phone"]) || result.profile.phone;
      importedParts.push("Phone number");
    } else if (label.includes("position") || label.includes("experience")) {
      if (!has(["Title", "Company Name"])) throw new Error(name + " is missing LinkedIn position columns.");
      rows.forEach((item) => {
        const role = getValue(item, ["Title", "Position"]);
        const company = getValue(item, ["Company Name", "Company"]);
        if (role || company) experience.push({
          role, company,
          location: getValue(item, ["Location"]),
          start: getValue(item, ["Started On", "Start Date"]),
          end: getValue(item, ["Finished On", "End Date"]) || "",
          details: getValue(item, ["Description"]),
        });
      });
      importedParts.push("Positions");
    } else if (label.includes("education")) {
      if (!has(["School Name", "Degree Name", "Field Of Study"])) throw new Error(name + " is missing LinkedIn education columns.");
      rows.forEach((item) => {
        const degree = getValue(item, ["Degree Name", "Degree"]);
        const school = getValue(item, ["School Name", "School"]);
        if (degree || school) education.push({
          degree: [degree, getValue(item, ["Field Of Study"])].filter(Boolean).join(" — "),
          school,
          location: "",
          start: getValue(item, ["Start Date", "Started On"]),
          end: getValue(item, ["End Date", "Finished On"]),
          details: getValue(item, ["Notes", "Activities"]),
        });
      });
      importedParts.push("Education");
    } else if (label.includes("skill")) {
      if (!has(["Name", "Skill"])) throw new Error(name + " is missing LinkedIn skill columns.");
      rows.forEach((item) => {
        const skill = getValue(item, ["Name", "Skill"]);
        if (skill && !skills.some((current) => current.toLowerCase() === skill.toLowerCase())) skills.push(skill);
      });
      importedParts.push("Skills");
    } else if (label.includes("certification")) {
      if (!has(["Name", "Authority", "Company"])) throw new Error(name + " does not look like a LinkedIn certification export.");
      rows.forEach((item) => {
        const certificate = getValue(item, ["Name"]);
        if (certificate) certificates.push({
          name: certificate,
          issuer: getValue(item, ["Authority", "Company"]),
          date: getValue(item, ["Started On", "Issue Date"]),
          link: getValue(item, ["Url", "URL"]),
        });
      });
      importedParts.push("Certifications");
    } else {
      throw new Error(name + " is not a recognized LinkedIn export. Select Profile, Positions, Education, Skills, Email Addresses or Certifications CSV files.");
    }
  });
  result.experience = experience;
  result.education = education;
  result.skills = skills;
  result.certificates = certificates;
  const meaningful = [
    result.profile.fullName, result.profile.headline, result.profile.summary,
    experience.length, education.length, skills.length, certificates.length,
  ].filter(Boolean).length;
  if (meaningful < 2) throw new Error("LinkedIn CSV files were read, but too little profile information was found. Include Profile and at least one other export such as Positions, Education or Skills.");
  return {
    resume: result,
    report: {
      source: "LinkedIn CSV export",
      importedParts,
      detected: {
        name: Boolean(result.profile.fullName),
        email: Boolean(result.profile.email),
        phone: Boolean(result.profile.phone),
        summary: Boolean(result.profile.summary),
        experience: experience.length,
        education: education.length,
        projects: 0,
        skills: skills.length,
        certificates: certificates.length,
        languages: 0,
      },
      warnings: [
        "LinkedIn data exports do not include every profile field. Review contact details, dates and descriptions before using this resume.",
        ...(experience.length ? [] : ["No positions were detected in the selected files."]),
        ...(education.length ? [] : ["No education entries were detected in the selected files."]),
      ],
      valid: true,
      characters: 0,
    },
  };
}

function validateResumeJson(payload, base) {
  const candidate = payload?.resume || payload?.data?.resume || payload;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("This JSON file does not contain a resume object.");
  }
  const hasResumeFields = ["profile", "experience", "education", "projects", "skills", "languages", "certificates", "interests"].some((key) => Object.prototype.hasOwnProperty.call(candidate, key));
  if (!hasResumeFields) throw new Error("This JSON file is not a NovexaHub resume backup.");
  const resume = safeResume({
    ...candidate,
    id: base.id,
    profile: candidate.profile || base.profile,
    experience: Array.isArray(candidate.experience) ? candidate.experience : [],
    education: Array.isArray(candidate.education) ? candidate.education : [],
    projects: Array.isArray(candidate.projects) ? candidate.projects : [],
    skills: Array.isArray(candidate.skills) ? candidate.skills : [],
    languages: Array.isArray(candidate.languages) ? candidate.languages : [],
    certificates: Array.isArray(candidate.certificates) ? candidate.certificates : [],
    interests: Array.isArray(candidate.interests) ? candidate.interests : [],
  });
  const detected = {
    name: Boolean(resume.profile.fullName),
    email: Boolean(resume.profile.email),
    phone: Boolean(resume.profile.phone),
    summary: Boolean(resume.profile.summary),
    experience: resume.experience.length,
    education: resume.education.length,
    projects: resume.projects.length,
    skills: resume.skills.length,
    certificates: resume.certificates.length,
    languages: resume.languages.length,
  };
  const meaningful = Object.values(detected).filter(Boolean).length;
  if (meaningful < 2) throw new Error("The resume backup is valid JSON but contains too little resume information.");
  return {
    resume: { ...base, ...resume, id: base.id },
    report: {
      source: "NovexaHub JSON backup",
      importedParts: ["Resume data"],
      detected,
      warnings: ["Review all sections and links after restoring this backup."],
      valid: true,
      characters: 0,
    },
  };
}
function ResumeSection({ title, children, className = "", sectionId }) {
  return (
    <section className={"rb-resume-section " + className} data-section={sectionId || ""}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ResumePreview({ resume, compact }) {
  const profile = resume.profile || {};
  const design = { ...DEFAULT_RESUME_DESIGN, ...(resume.design || {}) };
  const template = resume.template || "vertical";
  const sidebarTemplates = ["folio", "elegant", "circular", "modern", "casual", "vertical"].includes(template);
  const sidebarIdentity = template !== "vertical";
  const showPhoto = design.showPhoto && Boolean(profile.photo);
  const photoPosition = design.photoPosition || (sidebarTemplates ? "sidebar" : "header");
  const photoClass = "rb-resume-photo rb-photo-" + (design.photoShape || "circle");
  const avatarText = String(profile.fullName || "Your Name").split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const contactItems = [profile.email, profile.phone, profile.location, profile.website, profile.linkedin].filter(Boolean);
  const headerContactItems = template === "professional" ? [profile.email, profile.phone].filter(Boolean) : contactItems;
  const professionalAsideItems = [profile.location, profile.website, profile.linkedin].filter(Boolean);

  const sectionNodes = {
    profile: profile.summary ? (
      <ResumeSection key="profile" sectionId="profile" title="Profile" className="rb-profile-section">
        <p>{profile.summary}</p>
      </ResumeSection>
    ) : null,
    experience: resume.experience?.length ? (
      <ResumeSection key="experience" sectionId="experience" title={template === "vertical" ? "Professional Experience" : "Experience"} className="rb-experience-section">
        {resume.experience.map((item, index) => (
          <div className="rb-resume-entry" key={"work-" + index}>
            <div className="rb-resume-entry-top">
              <strong>{item.role || "Role"}</strong>
              <span>{[item.start, item.end].filter(Boolean).join(" – ")}</span>
            </div>
            <div className="rb-resume-subline">{[item.company, item.location].filter(Boolean).join(" · ")}</div>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        ))}
      </ResumeSection>
    ) : null,
    education: resume.education?.length ? (
      <ResumeSection key="education" sectionId="education" title="Education" className="rb-education-section">
        {resume.education.map((item, index) => (
          <div className="rb-resume-entry" key={"edu-" + index}>
            <div className="rb-resume-entry-top">
              <strong>{item.degree || "Degree"}</strong>
              <span>{[item.start, item.end].filter(Boolean).join(" – ")}</span>
            </div>
            <div className="rb-resume-subline">{[item.school, item.location].filter(Boolean).join(" · ")}</div>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        ))}
      </ResumeSection>
    ) : null,
    projects: resume.projects?.some((item) => item.name || item.details) ? (
      <ResumeSection key="projects" sectionId="projects" title="Projects" className="rb-projects-section">
        {resume.projects.filter((item) => item.name || item.details).map((item, index) => (
          <div className="rb-resume-entry" key={"project-" + index}>
            <div className="rb-resume-entry-top"><strong>{item.name}</strong><span>{item.role}</span></div>
            {item.link ? <div className="rb-resume-subline">{item.link}</div> : null}
            {item.details ? <p>{item.details}</p> : null}
          </div>
        ))}
      </ResumeSection>
    ) : null,
    skills: resume.skills?.filter(Boolean).length ? (
      <ResumeSection key="skills" sectionId="skills" title="Skills" className="rb-skills-section">
        <div className="rb-resume-skill-list">
          {resume.skills.filter(Boolean).map((skill, index) => <span key={skill + "-" + index}>{skill}</span>)}
        </div>
      </ResumeSection>
    ) : null,
    certificates: resume.certificates?.some((item) => item.name) ? (
      <ResumeSection key="certificates" sectionId="certificates" title="Certifications" className="rb-certificates-section">
        {resume.certificates.filter((item) => item.name).map((item, index) => (
          <div className="rb-resume-entry" key={"cert-" + index}>
            <div className="rb-resume-entry-top"><strong>{item.name}</strong><span>{item.date}</span></div>
            <div className="rb-resume-subline">{item.issuer}</div>
          </div>
        ))}
      </ResumeSection>
    ) : null,
    languages: resume.languages?.filter(Boolean).length ? (
      <ResumeSection key="languages" sectionId="languages" title="Languages" className="rb-languages-section">
        <p>{resume.languages.filter(Boolean).join("  ·  ")}</p>
      </ResumeSection>
    ) : null,
    interests: resume.interests?.filter(Boolean).length ? (
      <ResumeSection key="interests" sectionId="interests" title="Hobbies & Interests" className="rb-interests-section">
        <p>{resume.interests.filter(Boolean).join("  ·  ")}</p>
      </ResumeSection>
    ) : null,
  };

  const defaultOrder = ["profile", "experience", "education", "projects", "skills", "certificates", "languages", "interests"];
  const requestedOrder = Array.isArray(resume.sectionOrder) && resume.sectionOrder.length
    ? resume.sectionOrder
    : (template === "vertical" ? ["education", "experience", "projects", "profile", "skills", "certificates", "interests", "languages"] : defaultOrder);
  const orderedSections = [...new Set([...requestedOrder, ...defaultOrder])]
    .filter((sectionId) => sectionNodes[sectionId])
    .map((sectionId) => sectionNodes[sectionId]);

  const header = (
    <header className={"rb-resume-heading" + (template === "professional" ? " rb-professional-header" : "")}>
      {showPhoto && (!sidebarTemplates || photoPosition === "header") ? <img className={photoClass} src={profile.photo} alt="" /> : compact && template === "professional" ? <div className={"rb-resume-photo-placeholder " + (design.photoShape || "circle")}>{avatarText}</div> : null}
      <div className="rb-resume-heading-copy">
        <h1>{profile.fullName || "Your Name"}</h1>
        {profile.headline ? <p className="rb-resume-headline">{profile.headline}</p> : null}
        {!sidebarTemplates ? <div className="rb-resume-contact">{headerContactItems.join("  •  ")}</div> : null}
      </div>
      {template === "professional" && showPhoto && photoPosition !== "header"
        ? <img className={photoClass} src={profile.photo} alt="" />
        : null}
    </header>
  );

  const sidebar = (
    <aside className={"rb-resume-sidebar" + (template === "vertical" ? " rb-vertical-sidebar" : "")}>
      {showPhoto && sidebarTemplates && photoPosition === "sidebar" ? <img className={photoClass + " rb-sidebar-photo"} src={profile.photo} alt="" /> : compact && sidebarTemplates && photoPosition === "sidebar" ? <div className={"rb-resume-photo-placeholder rb-sidebar-photo " + (design.photoShape || "circle")}>{avatarText}</div> : null}
      {sidebarIdentity ? <>
        <h2>{profile.fullName || "Your Name"}</h2>
        {profile.headline ? <p className="rb-sidebar-role">{profile.headline}</p> : null}
      </> : null}
      {contactItems.length ? (
        <div className="rb-sidebar-contact">
          {contactItems.map((item, index) => <span key={index}>{item}</span>)}
        </div>
      ) : null}
      {resume.languages?.filter(Boolean).length ? (
        <div className="rb-sidebar-block rb-sidebar-languages"><h3>Languages</h3><ul>{resume.languages.filter(Boolean).map((language, index) => <li key={index}>{language}</li>)}</ul></div>
      ) : null}
      {resume.skills?.filter(Boolean).length ? (
        <div className="rb-sidebar-block rb-sidebar-skills"><h3>{template === "vertical" ? "Software & Skills" : "Core Skills"}</h3><ul>{resume.skills.filter(Boolean).map((skill, index) => <li key={index}>{skill}</li>)}</ul></div>
      ) : null}
      {resume.interests?.filter(Boolean).length && template !== "vertical" ? (
        <div className="rb-sidebar-block"><h3>Interests</h3><p>{resume.interests.join(" · ")}</p></div>
      ) : null}
    </aside>
  );

  const style = {
    "--resume-accent": resume.accent || "#920b36",
    "--resume-font-family": design.font === "serif" ? 'Georgia, "Times New Roman", serif' : design.font === "humanist" ? '"Trebuchet MS", Arial, sans-serif' : 'Arial, Helvetica, sans-serif',
    "--resume-font-scale": design.textSize === "small" ? "0.92" : design.textSize === "large" ? "1.08" : "1",
    "--resume-section-gap": design.spacing === "compact" ? "13px" : design.spacing === "spacious" ? "27px" : "20px",
    "--resume-sidebar-width": (Number(design.sidebarWidth) || 34) + "%",
  };
  const professionalMainSections = ["profile", "experience", "education", "projects", "certificates"].map((id) => sectionNodes[id]).filter(Boolean);
  const professionalAsideSections = ["skills", "languages", "interests"].map((id) => sectionNodes[id]).filter(Boolean);

  return (
    <article
      className={"rb-resume-sheet rb-template-" + template + " rb-font-" + design.font + " rb-density-" + design.spacing + (compact ? " rb-resume-compact" : "") + (design.sectionStyle === "block" ? " rb-sections-block" : design.sectionStyle === "minimal" ? " rb-sections-minimal" : "")}
      style={style}
    >
      {sidebarTemplates ? <>
        {sidebar}
        <div className="rb-resume-main">
          {template === "vertical" ? header : sidebarIdentity && showPhoto && photoPosition === "header" ? <div className="rb-sidebar-photo-header"><img className={photoClass} src={profile.photo} alt="" /></div> : null}
          {orderedSections}
        </div>
      </> : template === "professional" ? <>
        {header}
        <div className="rb-professional-body">
          <div className="rb-professional-main">{professionalMainSections}</div>
          <aside className="rb-professional-aside">
            <section><h3>Personal details</h3>{professionalAsideItems.map((item, index) => <span key={index}>{item}</span>)}</section>
            {professionalAsideSections}
          </aside>
        </div>
      </> : <>
        {header}
        <div className="rb-resume-main">{orderedSections}</div>
      </>}
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
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [importText, setImportText] = useState("");
  const [importDraft, setImportDraft] = useState(null);
  const [importReport, setImportReport] = useState(null);
  const [importSource, setImportSource] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const photoRef = useRef(null);
  const appRef = useRef(null);

  const current = resumes.find((resume) => resume.id === activeId) || resumes[0];
  const profile = current?.profile || {};
  const currentDesign = { ...DEFAULT_RESUME_DESIGN, ...(current?.design || {}) };
  const currentSectionOrder = [...(current?.sectionOrder || ["profile", "experience", "education", "projects", "skills", "certificates", "languages", "interests"])];
  const suggestedKeywords = useMemo(() => extractKeywords(jobDescription), [jobDescription]);
  const resumeText = useMemo(() => {
    if (!current) return "";
    return JSON.stringify({
      profile: current.profile,
      interests: current.interests,
      experience: current.experience,
      education: current.education,
      projects: current.projects,
      skills: current.skills,
      languages: current.languages,
      certificates: current.certificates,
      interests: current.interests,
    }).toLowerCase();
  }, [current]);
  const matchedKeywords = suggestedKeywords.filter((word) => resumeText.includes(word));
  const missingKeywords = suggestedKeywords.filter((word) => !resumeText.includes(word));

  useEffect(() => {
    document.body.classList.add("rb-resume-mode");
    return () => {
      document.body.classList.remove("rb-resume-mode");
      document.body.classList.remove("rb-full-resume-editor");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("rb-full-resume-editor", view === "editor" || view === "templates");
    return () => document.body.classList.remove("rb-full-resume-editor");
  }, [view]);

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
  const updateDesign = (key, value) => updateCurrent((resume) => ({ ...resume, design: { ...DEFAULT_RESUME_DESIGN, ...(resume.design || {}), [key]: value } }));
  const moveSection = (sectionId, direction) => updateCurrent((resume) => {
    const order = [...(resume.sectionOrder || ["profile", "experience", "education", "projects", "skills", "certificates", "languages", "interests"])];
    const index = order.indexOf(sectionId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= order.length) return resume;
    [order[index], order[target]] = [order[target], order[index]];
    return { ...resume, sectionOrder: order };
  });

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
    fresh.design = { ...DEFAULT_RESUME_DESIGN };
    fresh.sectionOrder = ["profile", "experience", "education", "projects", "skills", "certificates", "languages", "interests"];
    fresh.interests = [];
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

  const openImport = () => {
    setImportDraft(null);
    setImportReport(null);
    setImportSource("");
    setImportText("");
    setShowImport(true);
  };

  const stageImport = (resume, report, source) => {
    if (!report?.valid) {
      throw new Error(report?.message || "The selected file did not contain enough recognizable resume information.");
    }
    setImportDraft({ ...resume, id: current.id });
    setImportReport(report);
    setImportSource(source);
    setToast("Import parsed. Review the detected fields before applying.");
  };

  const applyImportDraft = () => {
    if (!importDraft || !importReport?.valid) return;
    const ready = safeResume({ ...importDraft, id: current.id });
    ready.title = ready.profile.fullName ? ready.profile.fullName + " — Resume" : "Imported resume";
    setResumes((all) => all.map((resume) => resume.id === activeId ? ready : resume));
    setImportDraft(null);
    setImportReport(null);
    setImportSource("");
    setImportText("");
    setShowImport(false);
    setView("editor");
    setToast("Imported resume applied. Review the highlighted details before exporting.");
  };

  const handleImportFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const csvFiles = files.filter((file) => file.name.toLowerCase().endsWith(".csv"));
      const documentFiles = files.filter((file) => !file.name.toLowerCase().endsWith(".csv"));
      if (csvFiles.length && documentFiles.length) {
        throw new Error("Import either one resume document or a group of LinkedIn CSV files at a time. Do not mix both in one selection.");
      }
      let imported;
      let report;
      let source = files.map((file) => file.name).join(", ");
      if (csvFiles.length) {
        const parsedCsv = [];
        for (const file of csvFiles) {
          if (file.size > 10 * 1024 * 1024) throw new Error(file.name + " is larger than 10 MB.");
          const rows = parseCsv(await file.text());
          if (!rows.length) throw new Error(file.name + " has no readable CSV rows.");
          parsedCsv.push({ name: file.name, rows });
        }
        const result = importLinkedInRows(parsedCsv, blankImportResume(current));
        imported = result.resume;
        report = result.report;
      } else {
        if (documentFiles.length !== 1) {
          throw new Error("Choose one resume file at a time. LinkedIn CSV exports can be selected together.");
        }
        const file = documentFiles[0];
        const extension = file.name.split(".").pop().toLowerCase();
        if (extension === "json") {
          if (file.size > 10 * 1024 * 1024) throw new Error("JSON backup is larger than 10 MB. Remove large embedded images and export it again.");
          const parsed = JSON.parse(await file.text());
          const result = validateResumeJson(parsed, blankImportResume(current));
          imported = result.resume;
          report = result.report;
        } else if (["pdf", "docx", "txt"].includes(extension)) {
          const extracted = await extractDocumentText(file);
          if (!extracted.text.trim()) {
            throw new Error("No selectable text was found. This PDF may be scanned or image-only. Use a text-based PDF, DOCX or paste the text instead.");
          }
          const result = parseTextIntoResume(extracted.text, blankImportResume(current));
          if (!result.report.valid) throw new Error(result.report.message || "Resume details could not be extracted reliably.");
          imported = result.resume;
          report = {
            ...result.report,
            source: extension.toUpperCase() + " document",
            importedParts: ["Contact details", "Detected resume sections"],
            warnings: [...result.report.warnings, ...(extracted.warnings || []).slice(0, 4)],
          };
        } else {
          throw new Error("Unsupported file type. Use a text-based PDF, DOCX, TXT, NovexaHub JSON backup, or LinkedIn CSV export.");
        }
      }
      imported.id = current.id;
      stageImport(imported, report, source);
    } catch (error) {
      setToast(error.message || "Import failed. Check the file and try again.");
      setImportDraft(null);
      setImportReport(null);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const importPastedText = () => {
    if (!importText.trim()) { setToast("Paste your resume text first."); return; }
    try {
      const result = parseTextIntoResume(importText, blankImportResume(current));
      if (!result.report.valid) throw new Error(result.report.message || "Could not identify enough resume details in the pasted text.");
      stageImport(result.resume, {
        ...result.report,
        source: "Pasted resume text",
        importedParts: ["Contact details", "Detected resume sections"],
      }, "Pasted text");
    } catch (error) {
      setToast(error.message || "Could not read the pasted resume text.");
    }
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
    <div className={"rb-page" + (view === "editor" || view === "templates" ? " rb-full-editor" : "")}>
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
            <button className="rb-button rb-button-accent" onClick={createResume}>Build my resume <span>→</span></button>
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
                <button className="rb-button rb-button-light" onClick={openImport}><Icon>↑</Icon> Import</button>
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
                <div className="rb-view-intro"><div><span className="rb-eyebrow rb-eyebrow-dark">THE RIGHT FIRST IMPRESSION</span><h3>Find a format that <em>fits your story.</em></h3><p>Each original design uses editable text sections and a consistent document structure. Choose one, then make it yours.</p></div><div className="rb-view-actions"><button className="rb-button rb-button-light" onClick={() => setView("editor")}>← Back to editor</button><button className="rb-button rb-button-accent" onClick={createResume}>＋ Start from scratch</button></div></div>
                <div className="rb-template-gallery-grid">
                  {TEMPLATE_OPTIONS.map((template) => <button key={template.id} className={"rb-template-card" + (current.template === template.id ? " selected" : "")} onClick={() => { const sideTemplate = ["elegant", "circular", "modern", "casual", "vertical", "folio"].includes(template.id); updateCurrent((resume) => ({ ...resume, template: template.id, accent: template.color, design: { ...DEFAULT_RESUME_DESIGN, ...(resume.design || {}), photoPosition: sideTemplate ? "sidebar" : "header" }, sectionOrder: template.id === "vertical" ? ["education", "experience", "projects", "profile", "skills", "certificates", "interests", "languages"] : resume.sectionOrder })); setToast(template.name + " template selected. Customize the design while editing."); setShowDesignPanel(true); setView("editor"); }}>
                    <div className={"rb-template-thumb rb-thumb-" + template.id} style={{ "--thumb-accent": template.color }}><ResumePreview resume={{ ...TEMPLATE_PREVIEW, template: template.id, accent: template.color }} compact /></div>
                    <div className="rb-template-card-copy"><span className="rb-template-tag">{template.tag}</span><strong>{template.name}</strong><small>{template.note}</small><span className="rb-template-use">{current.template === template.id ? "Selected ✓" : "Use template →"}</span></div>
                  </button>)}
                </div>
              </div>
            ) : null}

            {view === "editor" ? (
              <div className="rb-editor-view">
                <div className="rb-editor-toolbar"><div className="rb-editor-titlebar"><button className="rb-back-workspace" onClick={() => setView("dashboard")}>← <span>All resumes</span></button><div className="rb-editor-titlegroup"><input className="rb-title-input" aria-label="Resume title" value={current.title || ""} onChange={(event) => updateCurrent((resume) => ({ ...resume, title: event.target.value }))} /><span className="rb-saved-status"><i /> Saved on this device</span></div></div><div className="rb-editor-toolbar-actions"><button className="rb-button rb-button-light" onClick={openImport}>↑ Import</button><button className="rb-button rb-button-light" onClick={() => setView("templates")}>Templates</button><button className={"rb-button " + (showDesignPanel ? "rb-button-accent" : "rb-button-light")} onClick={() => setShowDesignPanel((open) => !open)}>✦ Customize</button><button className="rb-button rb-button-light" onClick={() => setView("keywords")}>Keywords</button><button className="rb-button rb-button-dark" onClick={printResume}>↓ Export PDF</button></div></div>
                {showDesignPanel ? (
                  <section className="rb-design-panel">
                    <div className="rb-design-panel-head">
                      <div><span className="rb-eyebrow rb-eyebrow-dark">LIVE DESIGN CONTROLS</span><h3>Make this template yours.</h3><p>Every change updates the preview instantly and is saved with this resume.</p></div>
                      <button className="rb-design-close" onClick={() => setShowDesignPanel(false)} aria-label="Close design controls">×</button>
                    </div>
                    <div className="rb-design-controls">
                      <div className="rb-design-control rb-design-colors">
                        <label>Color palette</label>
                        <div className="rb-design-swatches">
                          {["#920b36", "#303846", "#315eaa", "#85b9b4", "#98402f", "#b9a39a", "#454545", "#71a98b", "#2e6fa5", "#a84f36", "#263f49", "#675044"].map((color) => (
                            <button key={color} type="button" style={{ background: color }} className={current.accent === color ? "active" : ""} onClick={() => updateCurrent((resume) => ({ ...resume, accent: color }))} aria-label={"Use " + color} />
                          ))}
                          <label className="rb-custom-color" title="Choose a custom color"><input type="color" value={current.accent || "#920b36"} onChange={(event) => updateCurrent((resume) => ({ ...resume, accent: event.target.value }))} /><span>＋</span></label>
                        </div>
                      </div>
                      <label className="rb-design-control"><span>Typography</span><select value={currentDesign.font} onChange={(event) => updateDesign("font", event.target.value)}><option value="sans">Modern sans</option><option value="humanist">Friendly sans</option><option value="serif">Editorial serif</option></select></label>
                      <label className="rb-design-control"><span>Text size</span><select value={currentDesign.textSize} onChange={(event) => updateDesign("textSize", event.target.value)}><option value="small">Compact</option><option value="normal">Regular</option><option value="large">Large</option></select></label>
                      <label className="rb-design-control"><span>Section spacing</span><select value={currentDesign.spacing} onChange={(event) => updateDesign("spacing", event.target.value)}><option value="compact">Compact</option><option value="comfortable">Comfortable</option><option value="spacious">Spacious</option></select></label>
                      <label className="rb-design-control"><span>Photo shape</span><select value={currentDesign.photoShape} onChange={(event) => updateDesign("photoShape", event.target.value)}><option value="circle">Circle</option><option value="rounded">Rounded</option><option value="square">Square</option></select></label>
                      <label className="rb-design-control"><span>Photo placement</span><select value={currentDesign.photoPosition} onChange={(event) => updateDesign("photoPosition", event.target.value)}><option value="header">Header</option><option value="sidebar" disabled={!["elegant", "circular", "modern", "casual", "vertical", "folio"].includes(current.template)}>Sidebar</option></select></label>
                      <label className="rb-design-control"><span>Sidebar width</span><select value={currentDesign.sidebarWidth} onChange={(event) => updateDesign("sidebarWidth", event.target.value)}><option value="28">Narrow · 28%</option><option value="32">Balanced · 32%</option><option value="34">Standard · 34%</option><option value="38">Wide · 38%</option></select></label>
                      <label className="rb-design-control"><span>Section heading style</span><select value={currentDesign.sectionStyle} onChange={(event) => updateDesign("sectionStyle", event.target.value)}><option value="line">Underline</option><option value="block">Color blocks</option><option value="minimal">Minimal</option></select></label>
                      <label className="rb-design-toggle"><input type="checkbox" checked={currentDesign.showPhoto} onChange={(event) => updateDesign("showPhoto", event.target.checked)} /><span>Show profile photo</span></label>
                    </div>
                    <div className="rb-design-order">
                      <div><b>Section order</b><small>Move sections up or down in the resume preview.</small></div>
                      <div className="rb-design-order-list">
                        {currentSectionOrder.map((sectionId, index) => {
                          const section = SECTION_ORDER_OPTIONS.find((item) => item.id === sectionId);
                          return section ? <div className="rb-design-order-item" key={sectionId}><span>{String(index + 1).padStart(2, "0")}</span><b>{section.label}</b><div><button type="button" disabled={index === 0} onClick={() => moveSection(sectionId, -1)} aria-label={"Move " + section.label + " up"}>↑</button><button type="button" disabled={index === currentSectionOrder.length - 1} onClick={() => moveSection(sectionId, 1)} aria-label={"Move " + section.label + " down"}>↓</button></div></div> : null;
                        })}
                      </div>
                    </div>
                  </section>
                ) : null}
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
                    <details className="rb-form-section"><summary><span className="rb-form-icon">07</span><span><b>Hobbies and interests</b><small>Optional personal interests</small></span><i>⌄</i></summary><div className="rb-form-grid"><Field label="Interests (separate with commas)" value={(current.interests || []).join(", ")} onChange={(value) => updateCurrent((resume) => ({ ...resume, interests: value.split(",").map((item) => item.trim()).filter(Boolean) }))} multiline placeholder="Volunteering, reading, sports..." /></div></details>
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

      {showImport ? <div className="rb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setShowImport(false); setImportDraft(null); setImportReport(null); } }}><section className="rb-modal rb-import-modal" role="dialog" aria-modal="true" aria-labelledby="rb-import-title"><button className="rb-modal-close" onClick={() => { setShowImport(false); setImportDraft(null); setImportReport(null); }} aria-label="Close">×</button><span className="rb-eyebrow rb-eyebrow-dark">CONTROLLED DOCUMENT IMPORT</span><h3 id="rb-import-title">{importDraft ? "Review before applying" : "Import a resume"}</h3>{importDraft && importReport ? <>
        <p className="rb-import-source">Source: <strong>{importSource}</strong></p>
        <div className="rb-import-review">
          <div className="rb-import-review-head"><div><span className="rb-import-ready-dot" /> PARSE COMPLETE</div><small>{importReport.characters ? importReport.characters.toLocaleString() + " readable characters" : "Structured data detected"}</small></div>
          <div className="rb-import-detected"><div><b>{importReport.detected.name ? "✓" : "—"}</b><span>Name</span></div><div><b>{importReport.detected.email ? "✓" : "—"}</b><span>Email</span></div><div><b>{importReport.detected.phone ? "✓" : "—"}</b><span>Phone</span></div><div><b>{importReport.detected.experience || 0}</b><span>Experience</span></div><div><b>{importReport.detected.education || 0}</b><span>Education</span></div><div><b>{importReport.detected.skills || 0}</b><span>Skills</span></div><div><b>{importReport.detected.projects || 0}</b><span>Projects</span></div><div><b>{importReport.detected.interests || 0}</b><span>Interests</span></div></div>
          <div className="rb-import-preview"><strong>{importDraft.profile.fullName || "Name not detected"}</strong><span>{importDraft.profile.headline || "Professional headline not detected"}</span><p>{importDraft.profile.summary || "No summary was detected. You can add one after import."}</p><div className="rb-import-contact-preview">{[importDraft.profile.email, importDraft.profile.phone, importDraft.profile.location, importDraft.profile.website, importDraft.profile.linkedin].filter(Boolean).map((value, index) => <span key={index}>{value}</span>)}</div></div>
          {importDraft.experience?.length ? <div className="rb-import-records"><b>Experience extracted</b>{importDraft.experience.slice(0, 5).map((item, index) => <div key={index}><strong>{item.role || "Role not detected"}</strong><span>{[item.company, item.start, item.end].filter(Boolean).join(" · ")}</span>{item.details ? <p>{item.details.slice(0, 190)}{item.details.length > 190 ? "…" : ""}</p> : null}</div>)}</div> : null}
          {importDraft.education?.length ? <div className="rb-import-records"><b>Education extracted</b>{importDraft.education.slice(0, 5).map((item, index) => <div key={index}><strong>{item.degree || "Qualification not detected"}</strong><span>{[item.school, item.start, item.end].filter(Boolean).join(" · ")}</span></div>)}</div> : null}
          {importDraft.skills?.length ? <div className="rb-import-records"><b>Skills extracted</b><div className="rb-import-skill-list">{importDraft.skills.slice(0, 28).map((skill, index) => <span key={index}>{skill}</span>)}</div></div> : null}
          {importReport.importedParts?.length ? <div className="rb-import-parts"><b>Sections read</b><span>{importReport.importedParts.join(" · ")}</span></div> : null}
          {importReport.warnings?.length ? <div className="rb-import-warnings"><b>Review these items</b><ul>{importReport.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div> : null}
          {importReport.rawPreview ? <details className="rb-import-raw"><summary>Inspect extracted text</summary><pre>{importReport.rawPreview}</pre></details> : null}
          <p className="rb-import-privacy-note">Nothing has replaced your current resume yet. Confirm below to apply these extracted details, then review every section in the editor.</p>
          <div className="rb-import-review-actions"><button className="rb-button rb-button-light" onClick={() => { setImportDraft(null); setImportReport(null); setImportSource(""); }}>Discard import</button><button className="rb-button rb-button-accent" onClick={applyImportDraft}>Use this imported resume →</button></div>
        </div>
      </> : <>
        <p>Import one existing resume document, or select multiple LinkedIn CSV exports together. We will show the fields detected before changing your current resume.</p>
        <label className="rb-dropzone"><span>↑</span><b>{busy ? "Reading and validating your file…" : "Choose resume files"}</b><small>PDF · DOCX · TXT · JSON · LinkedIn CSV</small><small className="rb-dropzone-hint">PDF/DOCX/TXT/JSON: one file per import · LinkedIn: select Profile, Positions, Education and Skills CSVs together</small><input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.json,.csv" multiple onChange={handleImportFiles} disabled={busy} /></label>
        <div className="rb-import-rules"><b>Import checks</b><span>Readable text required · scanned PDFs rejected · unsupported files rejected · empty sections flagged · original resume kept until you confirm</span></div>
        <div className="rb-modal-divider"><span>OR PASTE RESUME TEXT</span></div><textarea className="rb-paste-area" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="Paste the selectable text from your resume. Keep section headings such as Experience, Education and Skills for better results..." /><button className="rb-button rb-button-accent rb-modal-submit" onClick={importPastedText}>Parse pasted resume →</button>
        <small className="rb-modal-privacy">Files are processed locally in your browser. They are not uploaded to NovexaHub. Imported data is staged for review before it replaces anything.</small>
      </>}</section></div> : null}

      {showLinkedIn ? <div className="rb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLinkedIn(false); }}><section className="rb-modal rb-linkedin-modal" role="dialog" aria-modal="true" aria-labelledby="rb-linkedin-title"><button className="rb-modal-close" onClick={() => setShowLinkedIn(false)} aria-label="Close">×</button><div className="rb-linkedin-mark">in</div><span className="rb-eyebrow rb-eyebrow-dark">LINKEDIN PROFILE IMPORT</span><h3 id="rb-linkedin-title">Bring your profile over.</h3><p>LinkedIn limits which profile fields third-party apps can read. The dependable route today is to request your data archive and import the relevant CSV files here.</p><ol className="rb-linkedin-steps"><li><b>Request your LinkedIn data</b><span>Open LinkedIn Settings and Privacy, then find Get a copy of your data.</span></li><li><b>Choose profile information</b><span>Include Profile, Positions, Education and Skills; include Email Addresses or Phone Numbers if available.</span></li><li><b>Import the CSV files</b><span>Return here and select the downloaded CSV files together.</span></li></ol><button className="rb-button rb-button-accent rb-modal-submit" onClick={() => { setShowLinkedIn(false); openImport(); }}>Choose LinkedIn CSV files →</button><a className="rb-external-link" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Open LinkedIn ↗</a><small className="rb-modal-privacy">Your LinkedIn password is never requested or stored here.</small></section></div> : null}

      {showUploadLinkedIn ? <div className="rb-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowUploadLinkedIn(false); }}><section className="rb-modal" role="dialog" aria-modal="true" aria-labelledby="rb-linkedin-upload-title"><button className="rb-modal-close" onClick={() => setShowUploadLinkedIn(false)} aria-label="Close">×</button><div className="rb-linkedin-mark">in</div><span className="rb-eyebrow rb-eyebrow-dark">SHARE YOUR RESUME</span><h3 id="rb-linkedin-upload-title">Ready for LinkedIn.</h3><p>LinkedIn does not provide a general-purpose API for third-party apps to upload a member resume to every profile or job application area. Export your PDF, then attach it in LinkedIn where you apply or manage your profile.</p><ol className="rb-linkedin-steps"><li><b>Save your PDF</b><span>Use Download PDF and choose Save as PDF in the browser print window.</span></li><li><b>Open LinkedIn</b><span>Go to Jobs and attach your saved resume when applying, or update the relevant profile section.</span></li><li><b>Keep a tailored version</b><span>Use a separate resume for each role so the content stays relevant.</span></li></ol><button className="rb-button rb-button-accent rb-modal-submit" onClick={() => { setShowUploadLinkedIn(false); printResume(); }}>Download PDF first →</button><a className="rb-external-link" href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer">Open LinkedIn Jobs ↗</a><small className="rb-modal-privacy">Your resume is not sent to LinkedIn by this tool. You remain in control of the upload.</small></section></div> : null}
      {toast ? <div className="rb-toast" role="status">{toast}</div> : null}
      <input type="file" accept=".json" hidden onChange={handleImportFiles} />
    </div>
  );
}
