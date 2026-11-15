// Resume Studio — pure parsing, model and import helpers.
// This module has no DOM or React dependencies so it can be unit-tested in Node
// and reused by the browser importer (PDF.js, Mammoth, CSV, JSON).

export const DEFAULT_RESUME_DESIGN = {
  font: "sans",
  textSize: "normal",
  spacing: "comfortable",
  photoShape: "circle",
  showPhoto: true,
  photoPosition: "sidebar",
  sectionStyle: "line",
  sidebarWidth: "34",
};

export const DEFAULT_SECTION_ORDER = [
  "profile",
  "experience",
  "education",
  "projects",
  "skills",
  "certificates",
  "languages",
  "interests",
  "achievements",
];

const TEMPLATE_IDS = [
  "professional", "chrono", "elegant", "circular", "modern", "luxe",
  "classic", "casual", "horizontal", "vertical", "atelier", "swiss",
  "folio", "signal", "monogram", "gridline",
];

const LEGACY_TEMPLATE_MAP = {
  minimal: "swiss",
  executive: "folio",
  tech: "signal",
  compact: "gridline",
  grid: "gridline",
};

export function makeId() {
  return "resume-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

export function starterResume(id) {
  return {
    id: id || "starter",
    title: "My first resume",
    template: "vertical",
    accent: "#920b36",
    design: { ...DEFAULT_RESUME_DESIGN },
    sectionOrder: ["education", "experience", "projects", "profile", "skills", "certificates", "interests", "languages", "achievements"],
    profile: {
      fullName: "Jordan Lee",
      headline: "Software Engineer",
      email: "jordan.lee@example.com",
      phone: "+1 555 010 2040",
      location: "Austin, TX",
      website: "jordanlee.dev",
      linkedin: "linkedin.com/in/jordanlee",
      github: "github.com/jordanlee",
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
    achievements: [],
    certificates: [],
    keywords: [],
  };
}

export function blankImportResume(existing) {
  const base = starterResume(existing?.id || makeId());
  return {
    ...base,
    title: "Imported resume",
    template: existing?.template || "vertical",
    accent: existing?.accent || "#920b36",
    design: { ...DEFAULT_RESUME_DESIGN, ...(existing?.design || {}) },
    sectionOrder: Array.isArray(existing?.sectionOrder) && existing.sectionOrder.length
      ? [...existing.sectionOrder]
      : [...DEFAULT_SECTION_ORDER],
    profile: { fullName: "", headline: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", summary: "", photo: "" },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certificates: [],
    interests: [],
    achievements: [],
    keywords: [],
  };
}

const EMPTY_PROFILE = { fullName: "", headline: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", summary: "", photo: "" };

export function safeResume(value) {
  if (!value || typeof value !== "object") return null;
  const base = starterResume(value.id || makeId());
  return {
    ...base,
    ...value,
    template: LEGACY_TEMPLATE_MAP[value.template] || (TEMPLATE_IDS.includes(value.template) ? value.template : "vertical"),
    // Missing fields must stay blank — never backfill demo/starter content
    // into a restored or imported resume.
    profile: { ...EMPTY_PROFILE, ...(value.profile || {}) },
    design: { ...DEFAULT_RESUME_DESIGN, ...(value.design || {}) },
    sectionOrder: Array.isArray(value.sectionOrder) ? value.sectionOrder : base.sectionOrder,
    experience: Array.isArray(value.experience) ? value.experience : [],
    education: Array.isArray(value.education) ? value.education : [],
    projects: Array.isArray(value.projects) ? value.projects : [],
    skills: Array.isArray(value.skills) ? value.skills : [],
    languages: Array.isArray(value.languages) ? value.languages : [],
    certificates: Array.isArray(value.certificates) ? value.certificates : [],
    interests: Array.isArray(value.interests) ? value.interests : [],
    achievements: Array.isArray(value.achievements) ? value.achievements : [],
    keywords: Array.isArray(value.keywords) ? value.keywords : [],
  };
}

const STOP_WORDS = new Set(("about above after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours job role team company work years experience skills required preferred candidate responsibilities requirements ability strong excellent knowledge including using across support build develop").split(" "));

export function extractKeywords(text) {
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

export function parseCsv(source) {
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
  ["skills", /^(software\s*(?:&|and)\s*skills|technical skills|core skills|key skills|skills|competencies|core competencies|expertise|technical expertise|skill set|areas of expertise|technical skills and tools)$/i],
  ["projects", /^(selected projects|personal projects|academic projects|projects|portfolio|key projects|extracurricular activities|extracurricular|selected work|project experience)$/i],
  ["achievements", /^(achievements|key achievements|selected achievements|accomplishments|honors and achievements|awards and achievements|awards & achievements|awards)$/i],
  ["certificates", /^(certifications|certificates|licenses and certifications|licenses|courses|professional development)$/i],
  ["languages", /^(languages|language skills)$/i],
  ["interests", /^(hobbies|interests|hobbies (?:and|&) interests|activities|personal interests)$/i],
  ["contact", /^(contact|contact details|contact information|personal details|personal information)$/i],
];

const MONTH_RE = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_POINT_RE = "(?:" + MONTH_RE + "\\s+(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])[/.](?:19|20)?\\d{2}|(?:19|20)\\d{2}|present|current|now)";
export const DATE_RANGE_RE = new RegExp("(" + DATE_POINT_RE + ")\\s*(?:-|–|—|to|until|through)\\s*(" + DATE_POINT_RE + ")", "i");

const ROLE_WORD_RE = /\b(engineer|developer|programmer|designer|manager|analyst|consultant|intern|specialist|coordinator|director|lead|architect|officer|teacher|accountant|technician|administrator|founder|owner|associate|executive|researcher|scientist|product|sales|marketing|support|nurse|doctor|lawyer|editor|operator|supervisor|strategist|representative|assistant|producer|writer|recruiter|trainer|auditor|planner|advisor|adviser)\b/i;
const ACTION_START_RE = /^(built|developed|created|designed|led|managed|worked|responsible|using|used|improved|increased|reduced|delivered|collaborated|implemented|supported|coordinated|maintained|launched|achieved|conducted|provided|performed|assisted|analyzed|analysed|contributed|automated|deployed|integrated|optimized|optimised|organized|organised|executed|streamlined|oversaw|spearheaded|successfully|results-driven|detail-oriented)\b/i;
const DEGREE_RE = /\b(b\.?\s?sc|bachelor|master|m\.?\s?sc|mba|ph\.?\s?d|doctorate|diploma|associate|matric|intermediate|fsc|a-level|o-level|bs\b|ms\b|bba\b|m\.?phil|certification)\b/i;
const INSTITUTION_RE = /\b(university|college|school|institute|academy|polytechnic)\b/i;

export function normalizeResumeLines(source) {
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

export function normalizeSectionHeading(line) {
  return String(line || "")
    .replace(/^\s*(?:\d+(?:\.\d+)*[.)]?\s*)/, "")
    .replace(/^[#•▪◦*-]+\s*/, "")
    .replace(/[:：|–—-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitResumeSections(lines) {
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

export function extractDateRange(line) {
  const match = String(line || "").match(DATE_RANGE_RE);
  if (!match) return null;
  return { start: match[1].trim(), end: match[2].trim(), text: match[0] };
}

export function extractLabeledValue(source, labels) {
  for (const label of labels) {
    const expression = new RegExp("(?:^|\\n)\\s*" + label + "\\s*[:：–—-]\\s*([^\\n]+)", "i");
    const match = String(source || "").match(expression);
    if (match?.[1]) return match[1].trim().replace(/[|•·]+$/, "").trim();
  }
  return "";
}

export function splitOutsideParentheses(value, separators = /[,;|•·•]+/) {
  const source = String(value || "");
  const output = [];
  let current = "";
  let depth = 0;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "(" || char === "[" || char === "{") depth += 1;
    else if (char === ")" || char === "]" || char === "}") depth = Math.max(0, depth - 1);
    if (depth === 0 && separators.test(char)) {
      if (current.trim()) output.push(current.trim());
      current = "";
    } else current += char;
  }
  if (current.trim()) output.push(current.trim());
  return output;
}

export function extractSkillItems(lines) {
  const categoryPrefix = /^(?:programming languages?|languages?|frameworks?|libraries|tools?|platforms?|databases?|cloud|technologies|technical skills|soft skills|core competencies|methodologies|other skills?)\s*[:：-]\s*/i;
  const items = [];
  (lines || []).forEach((line) => {
    const value = String(line || "").replace(categoryPrefix, "").trim();
    splitOutsideParentheses(value).forEach((item) => {
      const clean = item.replace(/^[•●▪◦‣*·\-–—]+\s*/, "").trim();
      if ((clean.length > 1 || /^(c|r)$/i.test(clean)) && clean.length < 72 && !/^skills?$/i.test(clean)) items.push(clean);
    });
  });
  return Array.from(new Map(items.map((item) => [item.toLowerCase(), item])).values()).slice(0, 60);
}

function parseSimpleList(lines, splitInline = false, limit = 30) {
  const output = [];
  (lines || []).forEach((rawLine) => {
    const line = String(rawLine || "").replace(/^[•●▪◦‣*·\-–—]+\s*/, "").trim();
    if (!line) return;
    const parts = splitInline ? splitOutsideParentheses(line, /[,;|•·]+/) : [line];
    parts.forEach((part) => {
      const clean = part.trim().replace(/^[•●▪◦‣*·\-–—]+\s*/, "");
      if (clean && !output.some((item) => item.toLowerCase() === clean.toLowerCase())) output.push(clean);
    });
  });
  return output.slice(0, limit);
}

function isLikelyEntryTitle(line, kind) {
  const value = String(line || "").replace(/^[•●▪◦‣*·]\s*/, "").trim();
  if (value.length < 3 || value.length > 115 || ACTION_START_RE.test(value)) return false;
  if (/[.!?]$/.test(value) || /@|https?:\/\//i.test(value)) return false;
  if (extractDateRange(value)) return false;
  if (kind === "education") return DEGREE_RE.test(value) || (INSTITUTION_RE.test(value) && value.length < 95);
  if (kind === "project") {
    const words = value.split(/\s+/).filter(Boolean).length;
    if (words > 9 || /[,;:]$/.test(value)) return false;
    if (/^(?:built|developed|created|designed|implemented|used|using|mobile app live|flutter\/firebase app|saas that|live real estate website|ai-tools marketplace with)\b/i.test(value)) return false;
    if (/\b(?:that publishes|live on google play|with ai mood|with admin|end-to-end|meta review pending|contributed; in development|github|google play|app store|tmdb apis?|spotify apis?|youtube apis?)\b/i.test(value)) return false;
    return value.length <= 100 && !/^https?:\/\//i.test(value);
  }
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
    else if (current.length && newTitle && currentHasTitle() && currentText().length >= 2) flush();

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

function parseProjectEntries(lines) {
  const clean = (lines || []).map((line) => String(line || "").trim()).filter(Boolean);
  const projects = [];
  let current = null;
  let alsoBuilt = false;
  let alsoBuiltBuffer = "";
  let skipLighthouseMetrics = false;

  const flush = () => {
    if (current && (current.name || current.details.length)) {
      const name = String(current.name || "").trim();
      const details = current.details.join("\n").trim();
      if (name && !/^lighthouse averages?\b/i.test(name)) {
        projects.push({ name, role: current.role || "", link: current.link || "", details });
      }
    }
    current = null;
  };

  const flushAlsoBuilt = () => {
    if (!alsoBuiltBuffer.trim()) return;
    splitOutsideParentheses(alsoBuiltBuffer, /[,;]+/).forEach((entry) => {
      const value = entry.trim().replace(/[.]$/, "");
      if (!value) return;
      const status = value.match(/^(.*?)(\s*\((?:contributed|in development|under development)[^)]*\))$/i);
      const name = (status ? status[1] : value).trim();
      if (!name || /^lighthouse averages?\b/i.test(name)) return;
      projects.push({
        name,
        role: "",
        link: "",
        details: status ? status[2].replace(/^\s*\(/, "").replace(/\)$/, "") : "",
      });
    });
    alsoBuiltBuffer = "";
    alsoBuilt = false;
  };

  const appendDetailsAndLinks = (line) => {
    if (!current || !line) return;
    const urls = line.match(/https?:\/\/[^\s|]+|(?:www\.)?github\.com\/[^\s|]+|(?:www\.)?gitlab\.com\/[^\s|]+/ig) || [];
    if (urls.length) {
      current.link = [current.link, ...urls].filter(Boolean).join(" | ");
      const withoutUrls = line
        .replace(/https?:\/\/[^\s|]+|(?:www\.)?github\.com\/[^\s|]+|(?:www\.)?gitlab\.com\/[^\s|]+/ig, "")
        .replace(/\s*\|\s*/g, " ")
        .trim();
      if (withoutUrls) current.details.push(withoutUrls);
    } else {
      current.details.push(line);
    }
  };

  const isProjectName = (value) => {
    const name = String(value || "").trim();
    const words = name.split(/\s+/).filter(Boolean).length;
    if (name.length < 2 || name.length > 90 || words > 9) return false;
    if (/^(?:lighthouse|performance|accessibility|best practices|seo|also built)\b/i.test(name)) return false;
    if (/^(?:built|developed|created|designed|implemented|used|using|collaborated|delivered|designed and developed)\b/i.test(name)) return false;
    if (/@|https?:\/\/|[.!?]$/.test(name)) return false;
    return true;
  };

  clean.forEach((rawLine) => {
    const line = rawLine.replace(/^[•●▪◦‣*·]\s*/, "").trim();
    if (!line) return;

    const alsoBuiltHeading = line.match(/^also\s+built\s*:?[ \t]*(.*)$/i);
    if (alsoBuiltHeading) {
      flush();
      flushAlsoBuilt();
      skipLighthouseMetrics = false;
      alsoBuilt = true;
      alsoBuiltBuffer = alsoBuiltHeading[1].trim();
      return;
    }

    // Lighthouse/SEO score summaries are metrics, not portfolio projects.
    // PDF extraction can detach a score row from its heading.
    if (/^lighthouse\s+averages?\b/i.test(line)) {
      flush();
      skipLighthouseMetrics = true;
      return;
    }
    if (/^(?:performance|accessibility|best\s+practices|practices|seo)\s*\d{1,3}\b/i.test(line)) {
      flush();
      return;
    }
    if (skipLighthouseMetrics) return;

    // "Also built" is a terminal comma-separated list. Collect every wrapped
    // line until the end of this already-isolated Projects section.
    if (alsoBuilt) {
      alsoBuiltBuffer = [alsoBuiltBuffer, line].filter(Boolean).join(" ");
      return;
    }

    // Many CVs place the project name and its description on one bullet:
    // "SafeApp: Flutter secure messaging app ...". Treat the short prefix as
    // the project name and retain the complete text after the colon.
    const inline = line.match(/^([^:：]{2,90})\s*[:：]\s*(.+)$/);
    if (inline && isProjectName(inline[1])) {
      flush();
      current = { name: inline[1].trim(), role: "", link: "", details: [] };
      appendDetailsAndLinks(inline[2].trim());
      return;
    }

    const stackParts = line.split(/\s*—\s*/);
    const possibleTitle = stackParts[0].trim();
    if (isLikelyEntryTitle(possibleTitle, "project")) {
      flush();
      current = {
        name: possibleTitle,
        role: stackParts.length > 1 ? stackParts.slice(1).join(" — ").trim() : "",
        link: "",
        details: [],
      };
      return;
    }

    if (current) appendDetailsAndLinks(line);
  });

  flush();
  flushAlsoBuilt();

  // De-duplicate accidental repeated headings while preserving source order.
  const seen = new Set();
  return projects.filter((project) => {
    const key = project.name.toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 30);
}

export function extractGithubProfileUrl(source) {
  const text = String(source || "");
  const labeled = extractLabeledValue(text, [
    "github profile url",
    "github profile",
    "github url",
    "github account",
    "github",
  ]);
  const urlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Z0-9-]{1,39})(?:\/[A-Z0-9_.-]+)?/i);
  if (urlMatch?.[1]) return "https://github.com/" + urlMatch[1];

  if (labeled) {
    const valueMatch = labeled.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Z0-9-]{1,39})/i);
    if (valueMatch?.[1]) return "https://github.com/" + valueMatch[1];
    const handle = labeled.trim().replace(/^@/, "").match(/^([A-Z0-9-]{1,39})$/i);
    if (handle?.[1]) return "https://github.com/" + handle[1];
  }
  return "";
}

export function parseTextIntoResume(source, existing) {
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
  const github = extractGithubProfileUrl(raw);
  const websiteSource = raw
    .replace(emailMatch?.[0] || "", " ")
    .replace(linkedinMatch?.[0] || "", " ")
    .replace(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Z0-9-]{1,39}(?:\/[A-Z0-9_.-]+)?/gi, " ");
  const websiteMatch = websiteSource.match(/(?:https?:\/\/)?(?:www\.)?(?:[A-Z0-9-]+\.)+[A-Z]{2,}(?:\/[^\s|]*)?/i);
  const nameCandidate = (explicitName?.[1] || "").trim() || header.find((line) =>
    line.length >= 3 &&
    line.length <= 58 &&
    !/@|https?:\/\/|linkedin\.com|github\.com|\d{5,}/i.test(line) &&
    !/\b(?:Pakistan|India|United States|United Kingdom|Canada|Australia|UAE|Dubai|Lahore|Karachi|Islamabad|Delhi|Mumbai)\b/i.test(line) &&
    !/^(resume|curriculum vitae|curriculum vit[aá]e|cv|profile|personal details|contact|contact details|contact information|personal information)$/i.test(line) &&
    !DATE_RANGE_RE.test(line)
  ) || "";
  const headlineCandidate = explicitHeadline || header.find((line) =>
    line !== nameCandidate &&
    line.length >= 3 &&
    line.length <= 90 &&
    ROLE_WORD_RE.test(line) &&
    !/@|https?:\/\/|linkedin\.com|github\.com|\d{5,}/i.test(line) &&
    !/\b(?:Pakistan|India|United States|United Kingdom|Canada|Australia|UAE|Dubai|Lahore|Karachi|Islamabad|Delhi|Mumbai|block|street|road|phase|sector|paragon city)\b/i.test(line) &&
    !/^(location|city|address|phone|mobile|email)\s*[:：]/i.test(line) &&
    !DATE_RANGE_RE.test(line)
  ) || "";

  const summaryLines = (sections.summary || []).slice(0, 9);
  const summary = summaryLines.join(" ").replace(/\s+/g, " ").trim();
  const experience = parseEntryBlocks(sections.experience || [], "experience").slice(0, 12);
  // Two-column PDFs sometimes align a work date beside an education row.
  // If the exact same date range is present in Experience, do not duplicate
  // it onto an Education record unless it is independently listed there.
  const experienceDateKeys = new Set((sections.experience || [])
    .map((line) => extractDateRange(line))
    .filter(Boolean)
    .map((date) => date.start.toLowerCase() + "|" + date.end.toLowerCase()));
  const educationLines = (sections.education || []).map((line) => {
    const date = extractDateRange(line);
    if (!date || !experienceDateKeys.has(date.start.toLowerCase() + "|" + date.end.toLowerCase())) return line;
    return line.replace(DATE_RANGE_RE, " ").replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim();
  }).filter(Boolean);
  const education = parseEntryBlocks(educationLines, "education").slice(0, 8);
  const projects = parseProjectEntries(sections.projects || []);
  const skills = extractSkillItems(sections.skills || []);
  const certificates = (sections.certificates || []).map((line) => line.trim()).filter(Boolean).slice(0, 12).map((line) => ({
    name: line,
    issuer: "",
    date: "",
    link: "",
  }));
  const languages = (sections.languages || []).join(",").split(/[,;|•·]\s*|\n/).map((item) => item.trim()).filter(Boolean).slice(0, 12);
  const interests = parseSimpleList(sections.interests || [], true, 30);
  const achievements = parseSimpleList(sections.achievements || [], false, 30);
  const profile = {
    ...existing.profile,
    fullName: nameCandidate || existing.profile.fullName || "",
    headline: headlineCandidate || existing.profile.headline || "",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch.trim() : "",
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
    github,
    website: extractLabeledValue(raw, ["portfolio", "website", "personal website"]) || (websiteMatch ? websiteMatch[0] : ""),
    location: explicitLocation || (() => {
      const index = header.findIndex((line) => /\b(?:Lahore|Karachi|Islamabad|Rawalpindi|Peshawar|Quetta|Multan|Faisalabad)\b.*\bPakistan\b/i.test(line));
      if (index < 0) return existing.profile.location || "";
      const previous = header[index - 1] || "";
      const addressPrefix = /\b(?:block|street|road|phase|sector|paragon|town|house|apartment|colony)\b/i.test(previous) ? previous : "";
      return [addressPrefix, header[index]].filter(Boolean).join(" ");
    })(),
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
    achievements,
  };
  const detected = {
    name: Boolean(profile.fullName),
    github: Boolean(profile.github),
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
    achievements: achievements.length,
  };
  const sectionTotal = [detected.summary, detected.experience, detected.education, detected.projects, detected.skills, detected.certificates, detected.languages, detected.interests, detected.achievements].filter(Boolean).length;
  const identityFound = detected.name || detected.email || detected.phone || detected.github;
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

export function importLinkedInRows(files, base) {
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
      const linkedInWebsites = getValue(profile, ["Websites", "Website"]);
      const importedGithub = extractGithubProfileUrl(linkedInWebsites);
      const portfolioWebsite = String(linkedInWebsites || "").split(/[\s,;]+/).find((value) => value && !/github\.com/i.test(value)) || "";
      result.profile = {
        ...result.profile,
        fullName: [first, last].filter(Boolean).join(" ") || result.profile.fullName,
        headline: getValue(profile, ["Headline"]) || result.profile.headline,
        summary: getValue(profile, ["Summary"]) || result.profile.summary,
        location: getValue(profile, ["Geo Location", "Location"]) || result.profile.location,
        website: portfolioWebsite || result.profile.website,
        github: importedGithub || result.profile.github,
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
        github: Boolean(result.profile.github),
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

export function validateResumeJson(payload, base) {
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
    github: Boolean(resume.profile.github),
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

/**
 * Reconstruct ordered text lines from a PDF.js textContent item list.
 * `items` are raw PDF.js TextItem objects ({str, transform, width, ...}).
 * `annotations` are raw PDF.js link annotations (optional — used to keep
 * hyperlink destinations next to their visible labels).
 * Returns { lines, columnDetected } where lines are ready for
 * normalizeResumeLines / splitResumeSections.
 */
export function pdfPageToLines(contentItems, annotations, viewportWidth) {
  const positioned = (contentItems || [])
    .filter((item) => typeof item.str === "string" && item.str.trim())
    .map((item) => ({
      text: item.str.trim(),
      x: Number(item.transform?.[4] || 0),
      y: Number(item.transform?.[5] || 0),
      width: Number(item.width || 0),
      height: Math.abs(Number(item.transform?.[3] || item.transform?.[0] || 10)),
    }));

  // PDF.js text extraction does not include hyperlink destinations. Read
  // link annotations and attach each URL to the visible linked label so
  // project, GitHub, portfolio and app-store links survive PDF import.
  (annotations || [])
    .filter((annotation) => annotation.subtype === "Link" && (annotation.url || annotation.unsafeUrl))
    .forEach((annotation) => {
      const url = String(annotation.url || annotation.unsafeUrl || "").trim();
      const rect = annotation.rect || [];
      if ((!url.startsWith("http://") && !url.startsWith("https://")) || rect.length !== 4) return;
      const left = Math.min(rect[0], rect[2]);
      const right = Math.max(rect[0], rect[2]);
      const bottom = Math.min(rect[1], rect[3]);
      const top = Math.max(rect[1], rect[3]);
      const match = positioned
        .filter((item) => item.x <= right + 3 && item.x + item.width >= left - 3 && item.y >= bottom - 4 && item.y <= top + 4)
        .sort((a, b) => Math.abs(a.y - (bottom + top) / 2) - Math.abs(b.y - (bottom + top) / 2))[0];
      if (match) {
        if (!match.text.includes(url)) match.text += " " + url;
      } else {
        positioned.push({ text: url, x: left, y: bottom, width: Math.max(1, right - left), height: Math.max(1, top - bottom) });
      }
    });

  positioned.sort((a, b) => (b.y - a.y) || (a.x - b.x));
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
      split > viewportWidth * 0.27 &&
      split < viewportWidth * 0.76 &&
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
    const leftColumn = [];
    const rightColumn = [];
    rows.forEach((row) => {
      const left = row.items.filter((item) => item.x < columnSplit);
      const right = row.items.filter((item) => item.x >= columnSplit);
      if (left.length) leftColumn.push({ y: row.y, text: makeLine(left) });
      if (right.length) rightColumn.push({ y: row.y, text: makeLine(right) });
    });

    // Read the column whose content starts higher first — in rail layouts the
    // main column's name/title usually sits above the rail's first line.
    let primary = leftColumn;
    let secondary = rightColumn;
    if (rightColumn.length && leftColumn.length) {
      const yDelta = rightColumn[0].y - leftColumn[0].y;
      if (yDelta > 1 || (Math.abs(yDelta) <= 1 && rightColumn.length > leftColumn.length)) {
        primary = rightColumn;
        secondary = leftColumn;
      }
    }

    // Hoist each column's pre-heading preamble (name, headline, contact rows)
    // into the document header. Without this, a name placed at the top of the
    // main column lands inside the rail's last section and is never detected.
    const preamble = [];
    const preambleSeen = new Set();
    const hoistPreamble = (column) => {
      const texts = column.map((entry) => entry.text);
      const { sections } = splitResumeSections(texts);
      const head = (sections.header || []).slice(0, 4);
      head.forEach((line) => {
        const key = line.toLowerCase();
        if (!preambleSeen.has(key)) {
          preambleSeen.add(key);
          preamble.push(line);
        }
      });
      return texts.slice(sections.header?.length || 0);
    };
    const primaryLines = hoistPreamble(primary);
    const secondaryLines = hoistPreamble(secondary);

    pageLines = [...preamble, ...primaryLines, "", ...secondaryLines].filter((line, index, all) => line || (index > 0 && index < all.length - 1));
  } else {
    pageLines = rows.map((row) => makeLine(row.items)).filter(Boolean);
  }
  return { lines: pageLines, columnDetected: columnSplit !== null };
}

/** Filename-safe document title used when printing/exporting the resume. */
export function resumePrintTitle(fullName) {
  return String(fullName || "Resume").replace(/[^a-z0-9 -]/gi, "").trim().replace(/\s+/g, "_") + "_Resume";
}
