import type { ResumeData } from "./index";

function bullets(text: string) {
  return text.split("\n").map(l => l.trim()).filter(Boolean);
}
function skillList(text: string) {
  return text.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
}

/* Renders resume HTML into a hidden iframe and uses browser print to PDF */
export async function downloadResumePDF(data: ResumeData): Promise<void> {
  const html = buildResumeHTML(data);

  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) { reject(new Error("iframe unavailable")); return; }

    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          resolve();
        }, 1000);
      } catch (e) {
        document.body.removeChild(iframe);
        reject(e);
      }
    }, 600);
  });
}

function buildResumeHTML(data: ResumeData): string {
  const { personalInfo: p, experiences, projects, education, template } = data;

  const styles = getStyles(template);
  const body = getBody(data);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>${p.name || "Resume"}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: A4; margin: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  ${styles}
</style>
</head>
<body>${body}</body>
</html>`;
}

function getStyles(template: string): string {
  const base = `
    body { font-family: Arial, sans-serif; font-size: 10px; color: #1a1a1a; background: #fff; line-height: 1.5; }
    .page { padding: 28px 34px; min-height: 297mm; }
    .name { font-size: 22px; font-weight: 700; }
    .headline { font-size: 10px; color: #555; margin-top: 2px; }
    .contact { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px; font-size: 9px; color: #444; }
    .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 2px; margin-bottom: 6px; margin-top: 12px; }
    .entry { margin-bottom: 10px; }
    .entry-header { display: flex; justify-content: space-between; }
    .entry-title { font-weight: 600; }
    .entry-sub { font-size: 9px; color: #555; margin-bottom: 3px; }
    .entry-date { font-size: 9px; color: #666; }
    .bullet { padding-left: 10px; color: #333; margin-bottom: 1px; }
    .skill-tag { display: inline-block; padding: 2px 7px; border-radius: 3px; font-size: 9px; margin: 2px; }
  `;

  if (template === "classic") return base + `
    body { font-family: Georgia, serif; }
    .name { font-size: 20px; text-align: center; text-transform: uppercase; letter-spacing: 2px; }
    .headline { text-align: center; font-style: italic; }
    .contact { justify-content: center; }
    .header { border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 12px; }
    .section-title { border-bottom: 1px solid #333; }
    .entry-sub { font-style: italic; }
  `;

  if (template === "minimal") return base + `
    body { font-family: 'Helvetica Neue', Arial, sans-serif; }
    .name { font-size: 24px; font-weight: 300; letter-spacing: -1px; }
    .section-title { font-size: 9px; color: #9ca3af; letter-spacing: 1.5px; border-bottom: none; }
    .bullet { border-left: 2px solid #e5e7eb; padding-left: 8px; margin-left: 2px; }
  `;

  if (template === "executive") return base + `
    .page { padding: 0; }
    .header { background: #1e293b; color: #fff; padding: 22px 34px 18px; }
    .header .name { color: #fff; }
    .header .headline { color: #94a3b8; }
    .header .contact { color: #cbd5e1; }
    .content { padding: 18px 34px; }
    .section-title { background: #f8fafc; padding: 3px 6px; border-left: 3px solid #1e293b; color: #1e293b; }
    .bullet { padding-left: 12px; }
    .bullet::before { content: "▸ "; }
    .skill-tag { background: #f1f5f9; border: 1px solid #e2e8f0; color: #334155; }
  `;

  if (template === "compact") return base + `
    body { font-size: 9.5px; }
    .page { padding: 22px 28px; }
    .name { font-size: 18px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 10px; }
    .header-right { text-align: right; font-size: 8.5px; color: #475569; line-height: 1.7; }
    .section-title { font-size: 9px; color: #0f172a; }
  `;

  // modern (default)
  return base + `
    .header { border-bottom: 2px solid #6d28d9; padding-bottom: 10px; margin-bottom: 12px; }
    .name { color: #6d28d9; }
    .section-title { color: #6d28d9; border-bottom: 1px solid #ede9fe; }
    .skill-tag { background: #ede9fe; color: #5b21b6; }
  `;
}

function getBody(data: ResumeData): string {
  const { personalInfo: p, experiences, projects, education, template } = data;
  const isExec = template === "executive";
  const isCompact = template === "compact";
  const isClassic = template === "classic";

  const contactItems = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
  const contactHTML = `<div class="contact">${contactItems.map(c => `<span>${c}</span>`).join("")}</div>`;

  const headerHTML = isExec
    ? `<div class="header"><div class="name">${p.name || "Your Name"}</div>${p.headline ? `<div class="headline">${p.headline}</div>` : ""}${contactHTML}</div>`
    : isCompact
    ? `<div class="header"><div><div class="name">${p.name || "Your Name"}</div>${p.headline ? `<div class="headline">${p.headline}</div>` : ""}</div><div class="header-right">${contactItems.map(c => `<div>${c}</div>`).join("")}</div></div>`
    : `<div class="header"><div class="name">${p.name || "Your Name"}</div>${p.headline ? `<div class="headline">${p.headline}</div>` : ""}${contactHTML}</div>`;

  const wrapContent = (html: string) => isExec ? `<div class="content">${html}</div>` : html;

  const sectionTitle = (t: string) => `<div class="section-title">${t}</div>`;

  let content = "";

  if (p.summary) content += `${sectionTitle(isClassic ? "Objective" : isExec ? "Executive Summary" : "Summary")}<p style="color:#333;margin-bottom:4px">${p.summary}</p>`;

  if (p.skills) {
    const sl = skillList(p.skills);
    const isMin = template === "minimal";
    const isComp = template === "compact";
    content += sectionTitle(isExec ? "Core Competencies" : "Skills");
    if (isMin || isComp) {
      content += `<p style="color:#334155">${sl.join(isComp ? " | " : "  ·  ")}</p>`;
    } else {
      content += `<div>${sl.map(s => `<span class="skill-tag">${s}</span>`).join("")}</div>`;
    }
  }

  const validExp = experiences.filter(e => e.title || e.company);
  if (validExp.length) {
    content += sectionTitle(isExec ? "Professional Experience" : isClassic ? "Work Experience" : "Experience");
    validExp.forEach(exp => {
      const buls = bullets(exp.description).map(b => `<div class="bullet">${template === "classic" ? "– " : "• "}${b.replace(/^[•\-]\s*/, "")}</div>`).join("");
      content += `<div class="entry"><div class="entry-header"><span class="entry-title">${exp.title}</span><span class="entry-date">${exp.duration}</span></div><div class="entry-sub">${exp.company}</div>${buls}</div>`;
    });
  }

  const validProj = projects.filter(pr => pr.title);
  if (validProj.length) {
    content += sectionTitle(isExec ? "Key Projects" : "Projects");
    validProj.forEach(proj => {
      const buls = bullets(proj.description).map(b => `<div class="bullet">${template === "classic" ? "– " : "• "}${b.replace(/^[•\-]\s*/, "")}</div>`).join("");
      content += `<div class="entry"><div class="entry-header"><span class="entry-title">${proj.title}</span><span class="entry-date" style="color:#6d28d9">${proj.technologies}</span></div>${buls}</div>`;
    });
  }

  const validEdu = education.filter(e => e.school);
  if (validEdu.length) {
    content += sectionTitle("Education");
    validEdu.forEach(edu => {
      content += `<div class="entry"><div class="entry-header"><span class="entry-title">${edu.school}</span><span class="entry-date">${edu.year}</span></div><div class="entry-sub">${edu.degree}${edu.score ? ` | ${edu.score}` : ""}</div></div>`;
    });
  }

  if (p.achievements) {
    content += sectionTitle("Achievements");
    content += bullets(p.achievements).map(b => `<div class="bullet">• ${b.replace(/^[•\-]\s*/, "")}</div>`).join("");
  }

  if (p.certifications) {
    content += sectionTitle("Certifications");
    content += bullets(p.certifications).map(b => `<div class="bullet">• ${b.replace(/^[•\-]\s*/, "")}</div>`).join("");
  }

  return `<div class="page">${headerHTML}${wrapContent(content)}</div>`;
}
