import type { ResumeData } from "./index";

function bullets(text: string) {
  return text.split("\n").map(l => l.trim()).filter(Boolean);
}
function skills(text: string) {
  return text.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
}

export function ResumePreview({ data }: { data: ResumeData }) {
  const { template } = data;
  if (template === "classic") return <ClassicTemplate data={data} />;
  if (template === "minimal") return <MinimalTemplate data={data} />;
  if (template === "executive") return <ExecutiveTemplate data={data} />;
  if (template === "compact") return <CompactTemplate data={data} />;
  if (template === "academic") return <AcademicTemplate data={data} />;
  return <ModernTemplate data={data} />;
}

/* ─── MODERN ─────────────────────────────────────────────────────────── */
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, experiences, projects, education } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#1a1a1a", background: "#fff", padding: "32px 36px", minHeight: "297mm", lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #6d28d9", paddingBottom: "12px", marginBottom: "14px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, color: "#6d28d9", letterSpacing: "-0.5px" }}>{p.name || "Your Name"}</div>
        {p.headline && <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{p.headline}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "6px", fontSize: "9px", color: "#444" }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.github && <span>💻 {p.github}</span>}
        </div>
      </div>

      {p.summary && <Section title="Summary"><p style={{ margin: 0, color: "#333" }}>{p.summary}</p></Section>}

      {p.skills && (
        <Section title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {skills(p.skills).map((s, i) => (
              <span key={i} style={{ background: "#ede9fe", color: "#5b21b6", padding: "2px 8px", borderRadius: "4px", fontSize: "9px" }}>{s}</span>
            ))}
          </div>
        </Section>
      )}

      {experiences.some(e => e.title || e.company) && (
        <Section title="Experience">
          {experiences.filter(e => e.title || e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, fontSize: "10px" }}>{exp.title}</span>
                <span style={{ color: "#666", fontSize: "9px" }}>{exp.duration}</span>
              </div>
              <div style={{ color: "#6d28d9", fontSize: "9px", marginBottom: "3px" }}>{exp.company}</div>
              {bullets(exp.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "10px", color: "#333", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </Section>
      )}

      {projects.some(p => p.title) && (
        <Section title="Projects">
          {projects.filter(p => p.title).map((proj, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, fontSize: "10px" }}>{proj.title}</span>
                {proj.technologies && <span style={{ color: "#6d28d9", fontSize: "9px" }}>{proj.technologies}</span>}
              </div>
              {bullets(proj.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "10px", color: "#333", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </Section>
      )}

      {education.some(e => e.school) && (
        <Section title="Education">
          {education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, fontSize: "10px" }}>{edu.school}</span>
                <span style={{ color: "#666", fontSize: "9px" }}>{edu.year}</span>
              </div>
              <div style={{ color: "#555", fontSize: "9px" }}>{edu.degree}{edu.score ? ` | ${edu.score}` : ""}</div>
            </div>
          ))}
        </Section>
      )}

      {p.achievements && (
        <Section title="Achievements">
          {bullets(p.achievements).map((b, i) => (
            <div key={i} style={{ paddingLeft: "10px", color: "#333", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
          ))}
        </Section>
      )}

      {p.certifications && (
        <Section title="Certifications">
          {bullets(p.certifications).map((b, i) => (
            <div key={i} style={{ paddingLeft: "10px", color: "#333", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
          ))}
        </Section>
      )}
    </div>
  );
}

/* ─── CLASSIC ─────────────────────────────────────────────────────────── */
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, experiences, projects, education } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "Georgia, serif", fontSize: "10px", color: "#1a1a1a", background: "#fff", padding: "32px 36px", minHeight: "297mm", lineHeight: 1.6 }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "14px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>{p.name || "Your Name"}</div>
        {p.headline && <div style={{ fontSize: "10px", color: "#555", marginTop: "2px", fontStyle: "italic" }}>{p.headline}</div>}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "14px", marginTop: "6px", fontSize: "9px", color: "#444" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      {p.summary && <ClassicSection title="Objective"><p style={{ margin: 0, fontStyle: "italic", color: "#333" }}>{p.summary}</p></ClassicSection>}

      {p.skills && (
        <ClassicSection title="Technical Skills">
          <p style={{ margin: 0, color: "#333" }}>{skills(p.skills).join(" • ")}</p>
        </ClassicSection>
      )}

      {experiences.some(e => e.title || e.company) && (
        <ClassicSection title="Work Experience">
          {experiences.filter(e => e.title || e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{exp.title}</span>
                <span style={{ fontSize: "9px", color: "#555" }}>{exp.duration}</span>
              </div>
              <div style={{ fontStyle: "italic", color: "#555", fontSize: "9px", marginBottom: "3px" }}>{exp.company}</div>
              {bullets(exp.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "12px", color: "#333", marginBottom: "1px" }}>– {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </ClassicSection>
      )}

      {projects.some(p => p.title) && (
        <ClassicSection title="Projects">
          {projects.filter(p => p.title).map((proj, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: 700 }}>{proj.title}</span>
              {proj.technologies && <span style={{ fontStyle: "italic", color: "#555", fontSize: "9px" }}> ({proj.technologies})</span>}
              {bullets(proj.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "12px", color: "#333", marginBottom: "1px" }}>– {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </ClassicSection>
      )}

      {education.some(e => e.school) && (
        <ClassicSection title="Education">
          {education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{edu.school}</span>
                <span style={{ fontSize: "9px", color: "#555" }}>{edu.year}</span>
              </div>
              <div style={{ fontStyle: "italic", color: "#555", fontSize: "9px" }}>{edu.degree}{edu.score ? ` | ${edu.score}` : ""}</div>
            </div>
          ))}
        </ClassicSection>
      )}

      {p.achievements && <ClassicSection title="Achievements">{bullets(p.achievements).map((b, i) => <div key={i} style={{ paddingLeft: "12px", color: "#333", marginBottom: "1px" }}>– {b.replace(/^[•\-]\s*/, "")}</div>)}</ClassicSection>}
      {p.certifications && <ClassicSection title="Certifications">{bullets(p.certifications).map((b, i) => <div key={i} style={{ paddingLeft: "12px", color: "#333", marginBottom: "1px" }}>– {b.replace(/^[•\-]\s*/, "")}</div>)}</ClassicSection>}
    </div>
  );
}

/* ─── MINIMAL ─────────────────────────────────────────────────────────── */
function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, experiences, projects, education } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "10px", color: "#222", background: "#fff", padding: "32px 36px", minHeight: "297mm", lineHeight: 1.5 }}>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "24px", fontWeight: 300, letterSpacing: "-1px", color: "#111" }}>{p.name || "Your Name"}</div>
        {p.headline && <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>{p.headline}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px", fontSize: "9px", color: "#666" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      {p.summary && <MinSection title="About">{p.summary}</MinSection>}

      {p.skills && (
        <MinSection title="Skills">
          <div style={{ color: "#444" }}>{skills(p.skills).join("  ·  ")}</div>
        </MinSection>
      )}

      {experiences.some(e => e.title || e.company) && (
        <MinSection title="Experience">
          {experiences.filter(e => e.title || e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>{exp.title} <span style={{ fontWeight: 400, color: "#666" }}>@ {exp.company}</span></span>
                <span style={{ color: "#999", fontSize: "9px" }}>{exp.duration}</span>
              </div>
              {bullets(exp.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "8px", color: "#444", marginBottom: "1px", borderLeft: "2px solid #e5e7eb", marginLeft: "2px" }}>  {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </MinSection>
      )}

      {projects.some(p => p.title) && (
        <MinSection title="Projects">
          {projects.filter(p => p.title).map((proj, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: 600 }}>{proj.title}</span>
              {proj.technologies && <span style={{ color: "#888", fontSize: "9px" }}> — {proj.technologies}</span>}
              {bullets(proj.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "8px", color: "#444", marginBottom: "1px", borderLeft: "2px solid #e5e7eb", marginLeft: "2px" }}>  {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </MinSection>
      )}

      {education.some(e => e.school) && (
        <MinSection title="Education">
          {education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <span style={{ fontWeight: 600 }}>{edu.school}</span>
              <span style={{ color: "#666", fontSize: "9px" }}> · {edu.degree}{edu.score ? ` · ${edu.score}` : ""}{edu.year ? ` · ${edu.year}` : ""}</span>
            </div>
          ))}
        </MinSection>
      )}

      {p.achievements && <MinSection title="Achievements">{bullets(p.achievements).map((b, i) => <div key={i} style={{ paddingLeft: "8px", color: "#444", marginBottom: "1px" }}>· {b.replace(/^[•\-]\s*/, "")}</div>)}</MinSection>}
      {p.certifications && <MinSection title="Certifications">{bullets(p.certifications).map((b, i) => <div key={i} style={{ paddingLeft: "8px", color: "#444", marginBottom: "1px" }}>· {b.replace(/^[•\-]\s*/, "")}</div>)}</MinSection>}
    </div>
  );
}

/* ─── EXECUTIVE ───────────────────────────────────────────────────────── */
function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, experiences, projects, education } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#1a1a1a", background: "#fff", minHeight: "297mm", lineHeight: 1.5 }}>
      {/* Dark header */}
      <div style={{ background: "#1e293b", color: "#fff", padding: "24px 36px 20px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px" }}>{p.name || "Your Name"}</div>
        {p.headline && <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{p.headline}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "8px", fontSize: "9px", color: "#cbd5e1" }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.github && <span>💻 {p.github}</span>}
        </div>
      </div>

      <div style={{ padding: "20px 36px" }}>
        {p.summary && <ExecSection title="Executive Summary"><p style={{ margin: 0, color: "#334155" }}>{p.summary}</p></ExecSection>}

        {p.skills && (
          <ExecSection title="Core Competencies">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {skills(p.skills).map((s, i) => (
                <span key={i} style={{ background: "#f1f5f9", color: "#334155", padding: "2px 8px", borderRadius: "3px", fontSize: "9px", border: "1px solid #e2e8f0" }}>{s}</span>
              ))}
            </div>
          </ExecSection>
        )}

        {experiences.some(e => e.title || e.company) && (
          <ExecSection title="Professional Experience">
            {experiences.filter(e => e.title || e.company).map((exp, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "3px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, color: "#1e293b" }}>{exp.title}</span>
                  <span style={{ color: "#64748b", fontSize: "9px" }}>{exp.duration}</span>
                </div>
                <div style={{ color: "#475569", fontSize: "9px", marginBottom: "4px", fontStyle: "italic" }}>{exp.company}</div>
                {bullets(exp.description).map((b, j) => (
                  <div key={j} style={{ paddingLeft: "12px", color: "#334155", marginBottom: "2px" }}>▸ {b.replace(/^[•\-]\s*/, "")}</div>
                ))}
              </div>
            ))}
          </ExecSection>
        )}

        {projects.some(p => p.title) && (
          <ExecSection title="Key Projects">
            {projects.filter(p => p.title).map((proj, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ fontWeight: 700, color: "#1e293b" }}>{proj.title}{proj.technologies && <span style={{ fontWeight: 400, color: "#64748b", fontSize: "9px" }}> | {proj.technologies}</span>}</div>
                {bullets(proj.description).map((b, j) => (
                  <div key={j} style={{ paddingLeft: "12px", color: "#334155", marginBottom: "2px" }}>▸ {b.replace(/^[•\-]\s*/, "")}</div>
                ))}
              </div>
            ))}
          </ExecSection>
        )}

        {education.some(e => e.school) && (
          <ExecSection title="Education">
            {education.filter(e => e.school).map((edu, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: "#1e293b" }}>{edu.school}</span>
                  <span style={{ color: "#64748b", fontSize: "9px" }}>{edu.year}</span>
                </div>
                <div style={{ color: "#475569", fontSize: "9px" }}>{edu.degree}{edu.score ? ` | ${edu.score}` : ""}</div>
              </div>
            ))}
          </ExecSection>
        )}

        {p.achievements && <ExecSection title="Achievements">{bullets(p.achievements).map((b, i) => <div key={i} style={{ paddingLeft: "12px", color: "#334155", marginBottom: "2px" }}>▸ {b.replace(/^[•\-]\s*/, "")}</div>)}</ExecSection>}
        {p.certifications && <ExecSection title="Certifications">{bullets(p.certifications).map((b, i) => <div key={i} style={{ paddingLeft: "12px", color: "#334155", marginBottom: "2px" }}>▸ {b.replace(/^[•\-]\s*/, "")}</div>)}</ExecSection>}
      </div>
    </div>
  );
}

/* ─── COMPACT ─────────────────────────────────────────────────────────── */
function CompactTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, experiences, projects, education } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "Arial, sans-serif", fontSize: "9.5px", color: "#1a1a1a", background: "#fff", padding: "24px 30px", minHeight: "297mm", lineHeight: 1.4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0f172a", paddingBottom: "8px", marginBottom: "10px" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{p.name || "Your Name"}</div>
          {p.headline && <div style={{ fontSize: "9px", color: "#64748b" }}>{p.headline}</div>}
        </div>
        <div style={{ textAlign: "right", fontSize: "8.5px", color: "#475569", lineHeight: 1.7 }}>
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
          {p.github && <div>{p.github}</div>}
        </div>
      </div>

      {p.summary && <CompSection title="Summary"><p style={{ margin: 0, color: "#334155" }}>{p.summary}</p></CompSection>}

      {p.skills && (
        <CompSection title="Skills">
          <p style={{ margin: 0, color: "#334155" }}>{skills(p.skills).join(" | ")}</p>
        </CompSection>
      )}

      {experiences.some(e => e.title || e.company) && (
        <CompSection title="Experience">
          {experiences.filter(e => e.title || e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>{exp.title}, <span style={{ fontWeight: 400, color: "#475569" }}>{exp.company}</span></span>
                <span style={{ color: "#64748b", fontSize: "8.5px" }}>{exp.duration}</span>
              </div>
              {bullets(exp.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "8px", color: "#334155", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </CompSection>
      )}

      {projects.some(p => p.title) && (
        <CompSection title="Projects">
          {projects.filter(p => p.title).map((proj, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <span style={{ fontWeight: 600 }}>{proj.title}</span>
              {proj.technologies && <span style={{ color: "#64748b", fontSize: "8.5px" }}> [{proj.technologies}]</span>}
              {bullets(proj.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "8px", color: "#334155", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </CompSection>
      )}

      {education.some(e => e.school) && (
        <CompSection title="Education">
          {education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ marginBottom: "5px" }}>
              <span style={{ fontWeight: 600 }}>{edu.school}</span>
              <span style={{ color: "#475569", fontSize: "8.5px" }}> · {edu.degree}{edu.score ? ` · ${edu.score}` : ""}{edu.year ? ` · ${edu.year}` : ""}</span>
            </div>
          ))}
        </CompSection>
      )}

      {p.achievements && <CompSection title="Achievements">{bullets(p.achievements).map((b, i) => <div key={i} style={{ paddingLeft: "8px", color: "#334155", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>)}</CompSection>}
      {p.certifications && <CompSection title="Certifications">{bullets(p.certifications).map((b, i) => <div key={i} style={{ paddingLeft: "8px", color: "#334155", marginBottom: "1px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>)}</CompSection>}
    </div>
  );
}

/* ─── Section helpers ─────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#6d28d9", textTransform: "uppercase", letterSpacing: "0.8px", borderBottom: "1px solid #ede9fe", paddingBottom: "2px", marginBottom: "6px" }}>{title}</div>
      {children}
    </div>
  );
}
function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #333", paddingBottom: "2px", marginBottom: "6px" }}>{title}</div>
      {children}
    </div>
  );
}
function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "#9ca3af", marginBottom: "5px" }}>{title}</div>
      {children}
    </div>
  );
}
function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.8px", background: "#f8fafc", padding: "3px 6px", marginBottom: "6px", borderLeft: "3px solid #1e293b" }}>{title}</div>
      {children}
    </div>
  );
}
function CompSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#0f172a", marginBottom: "4px" }}>{title}</div>
      {children}
    </div>
  );
}

/* ─── ACADEMIC (Suraj-style) ──────────────────────────────────────────── */
function AcademicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, experiences, projects, education } = data;
  const contacts = [p.phone, p.email, p.linkedin, p.github, p.location].filter(Boolean);

  return (
    <div id="resume-preview" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "10px", color: "#111", background: "#fff", padding: "28px 40px", minHeight: "297mm", lineHeight: 1.55 }}>

      {/* Centered name header */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "1px" }}>{p.name || "Your Name"}</div>
        {p.headline && <div style={{ fontSize: "10px", color: "#444", marginTop: "2px", fontStyle: "italic" }}>{p.headline}</div>}
        <div style={{ fontSize: "9px", color: "#333", marginTop: "5px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
          {contacts.map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>

      {/* Education first (academic style) */}
      {education.some(e => e.school) && (
        <AcadSection title="Education">
          {education.filter(e => e.school).map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "10px" }}>{edu.school}</div>
                <div style={{ fontStyle: "italic", fontSize: "9.5px", color: "#333" }}>{edu.degree}{edu.score ? `, CGPA: ${edu.score}` : ""}</div>
              </div>
              <div style={{ textAlign: "right", fontSize: "9px", color: "#333", whiteSpace: "nowrap" }}>
                <div>{p.location || ""}</div>
                <div>{edu.year}</div>
              </div>
            </div>
          ))}
        </AcadSection>
      )}

      {/* Experience */}
      {experiences.some(e => e.title || e.company) && (
        <AcadSection title="Experience">
          {experiences.filter(e => e.title || e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "10px" }}>{exp.title}</span>
                <span style={{ fontSize: "9px", color: "#333" }}>{exp.duration}</span>
              </div>
              <div style={{ fontStyle: "italic", fontSize: "9.5px", color: "#333", marginBottom: "3px" }}>{exp.company}</div>
              {bullets(exp.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "12px", fontSize: "9.5px", marginBottom: "2px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </AcadSection>
      )}

      {/* Projects */}
      {projects.some(pr => pr.title) && (
        <AcadSection title="Projects">
          {projects.filter(pr => pr.title).map((proj, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span>
                  <span style={{ fontWeight: 700, fontSize: "10px", textDecoration: "underline" }}>{proj.title}</span>
                  {proj.technologies && <span style={{ fontStyle: "italic", fontSize: "9px", color: "#333" }}> | {proj.technologies}</span>}
                </span>
              </div>
              {bullets(proj.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: "12px", fontSize: "9.5px", marginBottom: "2px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
              ))}
            </div>
          ))}
        </AcadSection>
      )}

      {/* Achievements */}
      {p.achievements && (
        <AcadSection title="Achievements">
          {bullets(p.achievements).map((b, i) => (
            <div key={i} style={{ paddingLeft: "12px", fontSize: "9.5px", marginBottom: "2px" }}>• {b.replace(/^[•\-]\s*/, "")}</div>
          ))}
        </AcadSection>
      )}

      {/* Technical Skills */}
      {p.skills && (
        <AcadSection title="Technical Skills">
          <div style={{ fontSize: "9.5px", color: "#111" }}>
            <span style={{ fontWeight: 700 }}>Languages: </span>
            {skills(p.skills).join(", ")}
          </div>
          {p.certifications && (
            <div style={{ fontSize: "9.5px", color: "#111", marginTop: "3px" }}>
              <span style={{ fontWeight: 700 }}>Certifications: </span>
              {bullets(p.certifications).map(b => b.replace(/^[•\-]\s*/, "")).join(", ")}
            </div>
          )}
        </AcadSection>
      )}
    </div>
  );
}

function AcadSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{
        fontSize: "11px",
        fontWeight: 700,
        fontVariant: "small-caps",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #111",
        paddingBottom: "1px",
        marginBottom: "6px",
        marginTop: "10px",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
