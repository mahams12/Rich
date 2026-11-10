# NovexaHub Resume Studio

Public route: \`/resume-builder\`

## V1 architecture

Resume Studio is a browser-first React experience inside the existing Next.js App Router application. It intentionally has no resume API, account system, database or file-storage dependency in V1.

- Resume drafts and settings are stored in \`localStorage\` under \`novexahub-resume-studio-v1\`.
- PDF export uses the browser print dialog. Choose **Save as PDF** to create a selectable-text A4 document.
- Editable JSON backup is available for moving a resume between browsers or devices.
- PDF and DOCX text extraction run in the browser using PDF.js and Mammoth, loaded on demand from cdnjs only when a user selects a matching file.
- TXT, JSON and LinkedIn CSV imports are parsed locally. LinkedIn exports can be selected as multiple CSV files (Profile, Positions, Education and Skills).
- The keyword lab extracts recurring terms from a job description and compares them with the current resume text locally. It does not call a language model, job board or paid API.
- A profile photo is resized in the browser before it is written to local storage.

The app does not upload the user's resume, photo or pasted job description to NovexaHub. Browser storage is device- and browser-specific; users should export a JSON backup before clearing browser data or switching devices.

## LinkedIn integration boundaries

V1 deliberately avoids collecting a LinkedIn password or pretending that an OAuth connection can read every profile field. LinkedIn's open OIDC permissions provide basic identity fields; additional profile APIs and programs require LinkedIn approval. The reliable import path is the member's own LinkedIn data export, where the user selects the CSV files they want to import.

Resume Studio does not claim to upload a PDF directly to a member profile through a generic LinkedIn API. It exports a PDF and opens LinkedIn Jobs so the member can attach it in the relevant application flow.

Official references:
- https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access
- https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication

## SEO implementation

The route includes:
- Page-specific title, description, canonical URL, keywords, Open Graph and Twitter metadata.
- \`SoftwareApplication\` and FAQPage JSON-LD.
- A human-readable feature explanation and FAQ content.
- Inclusion in \`src/app/sitemap.ts\`.
- Accessible labels, semantic sections, keyboard focus styles and reduced-motion support.

SEO implementation improves crawlability and topical relevance but cannot guarantee a particular search position. Performance, usefulness, competition, backlinks and ongoing content quality also affect rankings.

## Cloudflare deployment

The route uses the repository's existing Next.js + OpenNext Cloudflare Workers build. No new build dependency or environment variable is required for V1.

\`\`\`bash
npm install
npm run dev
npm run build
npm run preview
\`\`\`

The existing GitHub-to-Cloudflare production pipeline deploys commits on the configured production branch. Once deployed, the route is available at \`https://<your-domain>/resume-builder\`.

## Planned serverless evolution (not enabled in V1)

Do not enable these endpoints until the corresponding product capability and privacy controls are ready.

| Capability | Planned Worker endpoint | Notes |
|---|---|---|
| LinkedIn OAuth | \`/api/v1/integrations/linkedin/start\` and \`/callback\` | Requires an approved LinkedIn product and scopes. Keep client secrets and access tokens in Worker Secrets; use a short-lived, single-use OAuth state. |
| Cloud resume sync | \`/api/v1/resumes\` | Add sign-in and Cloudflare D1 only when users need multi-device sync. Encrypt sensitive fields where appropriate and provide deletion/export controls. |
| Advanced document parsing | \`/api/v1/resumes/parse\` | Prefer client-side parsing; use short-lived object storage only if large-document server parsing becomes necessary. |
| Keyword analysis | \`/api/v1/keywords/analyze\` | V1 is deterministic and local. A future AI-assisted endpoint must be opt-in and must not add invented experience or skills. |
| ATS readiness | \`/api/v1/ats/score\` | Show the criteria and limitations. Never present a heuristic as an employer's real ATS score or promise selection. |

Keep the resume data model independent of the view/template. Templates should render the same canonical resume object so new designs do not require separate storage schemas.
