import { useState, useEffect, useRef } from "react";

// ── Colours — light, human-focused palette ──────────────────────────────────
const C = {
  bg: "#f4f6fb",
  surface: "#ffffff",
  card: "#ffffff",
  border: "rgba(104, 110, 170, 0.18)",
  text: "#1e2432",
  sub: "#5f6880",
  muted: "#7d8699",
  indigo: "#4f46e5",
  violet: "#7c3aed",
  cyan: "#0ea5e9",
  orange: "#f59e0b",
  green: "#10b981",
  pink: "#ec4899",
  navBg: "rgba(255,255,255,0.82)",
  divider: "rgba(100, 116, 139, 0.14)",
  gridLine: "rgba(79,53,243,0.08)",
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const GithubIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GmailIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

// ── Typing hook ───────────────────────────────────────────────────────────────
function useTyping(words, speed = 90, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[wi % words.length];
    const id = setTimeout(() => {
      if (!del) {
        setDisplay(cur.slice(0, display.length + 1));
        if (display.length + 1 === cur.length) setTimeout(() => setDel(true), pause);
      } else {
        setDisplay(cur.slice(0, display.length - 1));
        if (display.length - 1 === 0) { setDel(false); setWi(w => w + 1); }
      }
    }, del ? speed * 0.45 : speed);
    return () => clearTimeout(id);
  }, [display, del, wi, words, speed, pause]);
  return display;
}

// ── InView hook ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

// ── Reveal ────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, dir = "up", style = {} }) {
  const [ref, v] = useInView();
  const map = { up: "translateY(36px)", left: "translateX(-36px)", right: "translateX(36px)" };
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : (map[dir] || "none"),
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────
function Marquee({ items, color = C.indigo, bg = "#eef3ff", speed = 30 }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: bg, padding: "13px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", gap: 56, width: "max-content", animation: `marquee ${speed}s linear infinite` }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 10, color, opacity: 0.5 }}>◆</span>
            <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: "'DM Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, color }) {
  const [val, setVal] = useState(0);
  const [ref, v] = useInView(0.3);
  useEffect(() => {
    if (!v) return;
    const num = parseInt(to.replace(/\D/g, "")) || 0;
    const step = Math.ceil(num / 55);
    let cur = 0;
    const id = setInterval(() => {
      cur += step;
      if (cur >= num) { setVal(num); clearInterval(id); } else setVal(cur);
    }, 18);
    return () => clearInterval(id);
  }, [v, to]);
  if (to === "1st Class") return <span ref={ref} style={{ color }}>1st</span>;
  return <span ref={ref} style={{ color }}>{val}{to.includes("+") ? "+" : ""}</span>;
}

// ── Logo with fallback ────────────────────────────────────────────────────────
function Logo({ src, alt, style = {} }) {
  const [err, setErr] = useState(false);
  if (err) return <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, fontFamily: "'DM Mono', monospace", textAlign: "center" }}>{alt}</span>;
  return <img src={src} alt={alt} onError={() => setErr(true)} style={{ objectFit: "contain", ...style }} />;
}

// ── Pill ──────────────────────────────────────────────────────────────────────
function Pill({ label, color }) {
  return (
    <span style={{
      fontSize: 10, padding: "4px 11px", borderRadius: 99,
      background: color + "15", color, fontWeight: 700,
      fontFamily: "'DM Mono', monospace", letterSpacing: 0.8, textTransform: "uppercase",
    }}>{label}</span>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHead({ eyebrow, title, color, center = false }) {
  return (
    <Reveal>
      <div style={{ textAlign: center ? "center" : "left", marginBottom: 52 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: color + "12", borderRadius: 99, padding: "5px 16px", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{eyebrow}</span>
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)", fontWeight: 800, color: C.text, lineHeight: 1.15, margin: 0 }}>{title}</h2>
      </div>
    </Reveal>
  );
}

// ── About vector illustration ─────────────────────────────────────────────────
function AboutVectorIllustration() {
  return (
    <svg viewBox="0 0 520 420" style={{ width: "100%", height: "auto", display: "block" }} aria-label="About illustration">
      <defs>
        <linearGradient id="panelGlow" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#eef2ff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect x="40" y="36" width="440" height="350" rx="32" fill="url(#panelGlow)" />
      <circle cx="150" cy="118" r="58" fill="#fef3c7" />
      <circle cx="348" cy="118" r="52" fill="#e0e7ff" />
      <path d="M128 265c18-52 60-88 112-88s97 36 116 88" fill="#c7d2fe" opacity="0.8" />
      <rect x="160" y="188" width="200" height="118" rx="18" fill="#ffffff" stroke="#dbe4ff" strokeWidth="2" />
      <rect x="182" y="212" width="92" height="12" rx="6" fill="#c7d2fe" />
      <rect x="182" y="235" width="128" height="10" rx="5" fill="#e2e8f0" />
      <rect x="182" y="255" width="110" height="10" rx="5" fill="#e2e8f0" />
      <rect x="182" y="280" width="66" height="12" rx="6" fill="#fbbf24" opacity="0.9" />
      <circle cx="270" cy="102" r="26" fill="#f59e0b" opacity="0.9" />
      <path d="M118 98c0-26 18-48 46-48 20 0 36 12 42 31" fill="none" stroke="#4f46e5" strokeWidth="10" strokeLinecap="round" />
      <path d="M325 92c-4-20 5-36 22-44 19-9 42-3 55 15" fill="none" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" />
      <path d="M290 245l34 20 48-50" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="415" cy="152" r="8" fill="#4f46e5" />
      <circle cx="106" cy="155" r="7" fill="#f59e0b" />
      <circle cx="370" cy="264" r="6" fill="#0ea5e9" />
    </svg>
  );
}

// ── Education timeline item ───────────────────────────────────────────────────
function EduTimelineItem({ degree, school, affil, period, badge, logos, color, delay, last }) {
  const [ref, v] = useInView(0.15);
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0, transform: v ? "none" : "translateX(-30px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      display: "flex", gap: 20, paddingBottom: last ? 0 : 20,
    }}>
      {/* Dot + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%", background: color,
          border: `3px solid ${C.bg}`, boxShadow: `0 0 0 3px ${color}40, 0 0 16px ${color}30`,
          flexShrink: 0, marginTop: 14, zIndex: 1,
          transition: "box-shadow 0.3s",
        }} />
        {!last && (
          <div style={{
            width: 2, flex: 1, marginTop: 6, borderRadius: 2,
            background: `linear-gradient(${color}80, ${color}10)`,
          }} />
        )}
      </div>

      {/* Card — compact horizontal */}
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          flex: 1, background: C.card, border: `1.5px solid ${hover ? color + '40' : C.border}`,
          borderRadius: 12, padding: "14px 20px", marginBottom: last ? 0 : 4,
          boxShadow: hover ? `0 4px 24px ${color}20` : "0 2px 12px rgba(0,0,0,0.15)",
          borderLeft: `3px solid ${color}`,
          display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
          transition: "all 0.3s",
        }}
      >
        {/* Logos */}
        {logos?.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {logos.map((l, i) => (
              <div key={i} style={{ height: 32, maxWidth: 80, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 6px", display: "flex", alignItems: "center" }}>
                <Logo src={l.src} alt={l.alt} style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto" }} />
              </div>
            ))}
          </div>
        )}
        {/* Info — horizontal flow */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: "'Sora', sans-serif" }}>{degree}</span>
            {badge && <Pill label={badge} color={color} />}
          </div>
          <div style={{ fontSize: 12, color, fontWeight: 700 }}>{school} <span style={{ color: C.muted, fontWeight: 400 }}>· {affil}</span></div>
        </div>
        {/* Period — far right */}
        <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: C.muted, background: color + '12', padding: "4px 10px", borderRadius: 6, fontWeight: 600, letterSpacing: 1, flexShrink: 0 }}>{period}</span>
      </div>
    </div>
  );
}

// ── Experience item ───────────────────────────────────────────────────────────
function ExpItem({ title, company, period, desc, logo, color, delay, last }) {
  return (
    <Reveal delay={delay} dir="left">
      <div style={{ display: "flex", gap: 22, paddingBottom: last ? 0 : 40 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, boxShadow: `0 0 0 4px ${color}25`, flexShrink: 0 }} />
          {!last && <div style={{ width: 2, flex: 1, background: `linear-gradient(${color}60, transparent)`, marginTop: 8, borderRadius: 2 }} />}
        </div>
        <div style={{ flex: 1, paddingBottom: last ? 0 : 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {logo && (
                <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
                  <Logo src={logo} alt={company} style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
                </div>
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, fontFamily: "'Sora', sans-serif" }}>{title}</div>
                <div style={{ fontSize: 13, color, fontWeight: 700 }}>{company}</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: C.muted, background: "rgba(79,53,243,0.08)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>{period}</span>
          </div>
          <p style={{ color: C.sub, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ── Skill group ───────────────────────────────────────────────────────────────
function SkillGroup({ title, items, color, delay }) {
  return (
    <Reveal delay={delay}>
      <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", background: C.card }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{title}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {items.map(item => <SkillChip key={item} label={item} color={color} />)}
        </div>
      </div>
    </Reveal>
  );
}

function SkillChip({ label, color }) {
  const [h, setH] = useState(false);
  return (
    <span onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      padding: "5px 13px", fontSize: 12, fontWeight: 600, borderRadius: 8,
      background: h ? color : color + "10", color: h ? "#fff" : color,
      border: `1px solid ${color}25`, transition: "all 0.18s", cursor: "pointer",
    }}>{label}</span>
  );
}

// ── Programme card ────────────────────────────────────────────────────────────
function ProgrammeCard({ logo, name, shortName, role, desc, tags, link, color, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: C.card, border: `1.5px solid ${hover ? color + "55" : C.border}`,
        borderRadius: 16, padding: "26px", transition: "all 0.3s", height: "100%",
        display: "flex", flexDirection: "column", gap: 14,
        boxShadow: hover ? `0 16px 48px ${color}18` : "0 2px 12px rgba(79,53,243,0.05)",
        transform: hover ? "translateY(-4px)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 12, border: `1.5px solid ${C.border}`, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
            <Logo src={logo} alt={shortName} style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, color, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{shortName}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: "'Sora', sans-serif", lineHeight: 1.3 }}>{name}</div>
          </div>
        </div>
        <div style={{ height: 1, background: C.divider }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
          <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>{role}</span>
        </div>
        <p style={{ color: C.sub, fontSize: 13, lineHeight: 1.85, margin: 0, flex: 1 }}>{desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map(tag => <Pill key={tag} label={tag} color={color} />)}
        </div>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: hover ? color : C.muted, fontFamily: "'DM Mono', monospace", fontWeight: 700, textDecoration: "none", transition: "color 0.2s" }}>
            Visit Programme →
          </a>
        )}
      </div>
    </Reveal>
  );
}

// ── Blog card ─────────────────────────────────────────────────────────────────
function BlogCard({ title, year, desc, tag, color, delay, link }) {
  const [hover, setHover] = useState(false);

  const handleReadMore = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.card,
          border: `1.5px solid ${hover ? color + "55" : C.border}`,
          borderRadius: 16,
          padding: "26px",
          transition: "all 0.3s",
          height: "100%",
          cursor: "pointer",
          boxShadow: hover
            ? `0 12px 40px ${color}18`
            : "0 2px 12px rgba(79,53,243,0.05)",
          transform: hover ? "translateY(-4px)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Pill label={tag} color={color} />

          <span
            style={{
              fontSize: 11,
              color: C.muted,
              fontFamily: "'DM Mono', monospace",
              fontWeight: 600,
            }}
          >
            {year}
          </span>
        </div>

        <h3
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: C.text,
            marginBottom: 10,
            fontFamily: "'Sora', sans-serif",
            lineHeight: 1.35,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: C.sub,
            fontSize: 13,
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {desc}
        </p>

        <div
          onClick={handleReadMore}
          style={{
            marginTop: 18,
            fontSize: 12,
            color: color,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          Read More →
        </div>
      </div>
    </Reveal>
  );
}

// ── Gallery item ──────────────────────────────────────────────────────────────
function GalleryItem({ src, type, caption, color, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        border: `1.5px solid ${hover ? color + "55" : C.border}`, borderRadius: 14,
        overflow: "hidden", transition: "all 0.3s",
        boxShadow: hover ? `0 14px 40px ${color}22` : "0 2px 12px rgba(79,53,243,0.05)",
        transform: hover ? "translateY(-4px)" : "none",
      }}>
        {type === "video" ? (
          <video controls style={{ width: "100%", height: 210, objectFit: "cover", display: "block", background: "#000" }}>
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div style={{ position: "relative", overflow: "hidden", height: 210 }}>
            <img src={src} alt={caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hover ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s" }} />
            {hover && (
              <div style={{ position: "absolute", inset: 0, background: `${color}bb`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>View →</span>
              </div>
            )}
          </div>
        )}
        {caption && (
          <div style={{ padding: "11px 15px", background: C.surface, borderTop: `1px solid ${C.divider}` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.sub, fontWeight: 500 }}>{caption}</p>
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault(); setStatus("sending");
    setTimeout(() => { setStatus("sent"); setForm({ name: "", email: "", message: "" }); }, 1400);
  };
  const field = {
    width: "100%", padding: "12px 15px", background: "rgba(255,255,255,0.04)",
    border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text,
    fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s",
  };
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <input name="name" value={form.name} onChange={onChange} placeholder="Full Name" required style={field} />
      <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email Address" required style={field} />
      <textarea name="message" value={form.message} onChange={onChange} placeholder="Your Message" rows={5} required style={{ ...field, resize: "vertical" }} />
      <button type="submit" disabled={status === "sending"} style={{
        padding: "13px", background: status === "sent" ? C.green : C.indigo,
        border: "none", borderRadius: 10, color: "#fff",
        fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
        cursor: status === "sending" ? "not-allowed" : "pointer",
        opacity: status === "sending" ? 0.7 : 1, transition: "all 0.25s",
        fontFamily: "'DM Mono', monospace", boxShadow: `0 4px 18px ${C.indigo}40`,
      }}>
        {status === "sending" ? "Sending…" : status === "sent" ? "✓ Message Sent!" : "Send Message"}
      </button>
    </form>
  );
}

// ── Social icon button ────────────────────────────────────────────────────────
function SocialBtn({ href, label, icon, color }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} title={label} target="_blank" rel="noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center",
        border: `1.5px solid ${h ? color : C.border}`, borderRadius: 12,
        color: h ? color : C.muted, textDecoration: "none",
        transition: "all 0.2s", background: h ? color + "10" : C.surface,
        boxShadow: h ? `0 4px 16px ${color}30` : "none",
      }}>{icon}</a>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const LOADING_DURATION = 3000;

export default function App() {
  const typed = useTyping(["Pratham Neupane", "a Curriculum Developer", "an Educator", "a MERN Stack Developer"], 85, 1800);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOADING_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMove = (event) => {
      setCursor({ x: event.clientX, y: event.clientY, visible: true });
    };
    const handleLeave = () => setCursor((prev) => ({ ...prev, visible: false }));

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  const navItems = ["home", "about", "education", "experience", "skills", "gallery", "blogs", "contact"];

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...navItems].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goto = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  // ── Data ──────────────────────────────────────────────────────────────────
  const education = [
    { degree: "MSc. IT (Data Analytics)", school: "Islington College", affil: "London Metropolitan University", period: "2026 – 2028", badge: null, color: C.indigo, logos: [{ src: "src/assets/public/Education/islington.png", alt: "Islington" }, { src: "src/assets/public/Education/LMU.png", alt: "LMU" }] },
    { degree: "BSc. (Hons) Computing", school: "Itahari International College", affil: "London Metropolitan University", period: "2021 – 2024", color: C.violet, logos: [{ src: "src/assets/public/Education/iic.png", alt: "IIC" }, { src: "src/assets/public/Education/LMU.png", alt: "LMU" }] },
    { degree: "SLC (+2) Science", school: "GEMS Institute of Higher Education", affil: "National Examination Board", period: "2018 – 2020", color: C.cyan, logos: [{ src: "src/assets/public/Education/GIHE.png", alt: "GIHE" }] },
    { degree: "SEE", school: "GEMS School", affil: "National Examination Board", period: "2017", color: C.orange, logos: [{ src: "src/assets/public/Education/GEMS.png", alt: "GEMS" }] },
  ];

  const experience = [
    { title: "Senior Academic Direction Supervisor", company: "ING Skill Academy", period: "2025 – Present", logo: "src/assets/public/Work/ING.png", color: C.indigo, desc: "Leading curriculum development, teacher training, and academic strategy. Focused on integrating technology with pedagogy to improve learning outcomes at scale." },
    { title: "Academic Development & Delivery Officer", company: "ING Skill Academy", period: "2024 – 2025", logo: "src/assets/public/Work/ING.png", color: C.violet, desc: "Designed and delivered academic programs, coordinated content creation, and supported faculty in effective classroom delivery methodologies." },
    { title: "Full Stack Intern", company: "Hunchha Digital Agency", period: "2022 – 2023", logo: "src/assets/public/Work/hunchha.png", color: C.orange, desc: "Developed full-stack web applications using the MERN stack. Built responsive user interfaces and implemented RESTful backend APIs for diverse client projects." },
  ];

  // const programmes = [
  //   { shortName: "GPPC", name: "Global Professional Pathway Course", logo: "src/assets/public/Programmes/GPPC.png", role: "Programme Coordinator & Operations Lead", color: C.indigo, desc: "A specialised programme for high school graduates across AI & Data Science, Cybersecurity, Business & Digital Innovation, Animation, Software Development, and Finance.", tags: ["AI & Data Science", "Cybersecurity", "Business", "Operations"], link: "https://ingskill.com/global-professional-pathway-course" },
  //   { shortName: "ROBO", name: "Nepal's First Industry-Connected Robotics", logo: "src/assets/public/Programmes/Robo.png", role: "Curriculum Designer & Content Developer", color: C.cyan, desc: "Nepal's first industry-connected robotics programme for young innovators, developed with leading robotics companies in China. Designed full curriculum and content.", tags: ["Robotics", "Curriculum Design", "STEM", "Coding"], link: "https://ingrobo.com/" },
  //   { shortName: "CSFC", name: "Contemporary Skills Foundations Course", logo: "src/assets/public/Programmes/CSFC.png", role: "Operations Manager & AI Trainer", color: C.violet, desc: "A foundational computing programme. Managed end-to-end operations and delivered specialised AI training sessions covering tools, concepts, and real-world applications.", tags: ["AI Training", "Computer Science", "Operations"], link: null },
  //   { shortName: "SEP / Skill Up", name: "Skill Enrichment Programme (now Skill Up)", logo: "src/assets/public/Programmes/SEP.png", role: "Head of Student Services & Operations", color: C.orange, desc: "Bridging academics and career readiness through hands-on learning. Led Student Services Department, managing student journeys and all programme operations.", tags: ["Student Services", "Operations", "Career Readiness"], link: "https://ingskill.com/skill-up" },
  // ];

  const skills = [
    { title: "Programming Languages", color: C.indigo, items: ["C++", "Java", "JavaScript", "Python"] },
    { title: "Web Development", color: C.violet, items: ["React.js", "Node.js", "Express.js", "HTML5", "CSS3", "MongoDB"] },
    { title: "Tools & Databases", color: C.cyan, items: ["Git", "GitHub", "MySQL", "MongoDB", "GitHub Actions", "n8n"] },
    { title: "Core CS Concepts", color: C.orange, items: ["Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems"] },
    { title: "Pedagogy & Curriculum", color: C.green, items: ["5E Pedagogy", "Curriculum Design", "Content Creation", "Teacher Training", "Assessment"] },
  ];

  const gallery = [
    { src: "src/assets/public/Gallery/AI.mov", type: "video", caption: "AI Workshop — ING Skill Academy", color: C.indigo },
    { src: "src/assets/public/Gallery/SEP-Team.JPG", type: "image", caption: "SEP Team — Academic Initiative", color: C.violet },
    { src: "src/assets/public/Gallery/CS.MOV", type: "video", caption: "Computer Science Programme", color: C.cyan },
    // { src: "src/assets/public/Gallery/skillup.mp4", type: "video", caption: "Skill Up Programme", color: C.orange },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden", cursor: "none" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; background: ${C.bg}; color: ${C.text}; font-family: "Cambria", "Times New Roman", serif; }
        html { scroll-behavior: smooth; }
        body { cursor: none; }
        p, span, button, a, input, textarea { font-family: "Cambria", "Times New Roman", serif; }
        h1, h2, h3, h4, h5, h6 { font-family: "Times New Roman", Times, serif; }
        ::selection { background: ${C.indigo}55; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.indigo}; border-radius: 2px; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:none; } }
        @keyframes blinkCur { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes floatY   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(400px); } }
        @keyframes pulse    { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes gridMove { from { transform: translateY(0); } to { transform: translateY(40px); } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 30px rgba(249,115,22,0.18); } 50% { box-shadow: 0 0 60px rgba(249,115,22,0.26); } }
        @keyframes matrixRain { 0% { transform: translateY(-100%); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
        @keyframes spinLoader { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: ${C.muted}; }
        input:focus, textarea:focus { border-color: ${C.indigo} !important; }
        a, button { cursor: none !important; }
        @media (max-width: 960px)  { .hero-content-wrapper { flex-direction: column-reverse !important; text-align: center !important; } .hero-img { max-width: 340px !important; margin: 0 auto !important; } .hero-stats { justify-content: center !important; } .hero-btns { justify-content: center !important; } .hero-socials { justify-content: center !important; } }
        @media (max-width: 768px)  { .nav-links { display: none !important; } .mob-btn { display: flex !important; } .about-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px)  { .mob-btn { display: none !important; } .mob-menu { display: none !important; } }
      `}</style>

      {loading && (
        <div style={{ position: "fixed", inset: 0, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid rgba(79,70,229,0.18)", borderTopColor: C.indigo, animation: "spinLoader 0.8s linear infinite" }} />
            <div style={{ fontSize: 12, letterSpacing: 2, color: C.sub, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Loading</div>
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: cursor.x,
          top: cursor.y,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "transparent",
          border: "1.5px solid #111111",
          boxShadow: "none",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: cursor.visible ? 1 : 0,
          transition: "opacity 0.1s ease",
        }}
      />

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? C.navBg : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.35s",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", height: 66, justifyContent: "space-between" }}>
          {/* Logo */}
          <div>
            <div style={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 900, fontSize: 18, color: C.text }}>
              Pratham Neupane
            </div>
          </div>

          {/* Desktop links */}
          <div className="nav-links" style={{ display: "flex", gap: 4 }}>
            {navItems.map(id => (
              <button key={id} onClick={() => goto(id)} style={{
                background: active === id ? C.indigo + "22" : "transparent",
                border: "none", borderRadius: 8, padding: "8px 12px",
                color: active === id ? C.text : C.sub,
                fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                fontFamily: "'DM Mono', monospace", transition: "all 0.2s",
              }}>{id}</button>
            ))}
          </div>

          {/* Mobile button */}
          <button className="mob-btn" onClick={() => setMenuOpen(o => !o)} style={{
            display: "none", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, background: "transparent",
            border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 18,
          }}>{menuOpen ? "✕" : "☰"}</button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mob-menu" style={{ background: C.navBg, borderTop: `1px solid ${C.border}`, padding: "12px 40px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(id => (
              <button key={id} onClick={() => goto(id)} style={{
                background: "transparent", border: "none", textAlign: "left", padding: "10px 0",
                color: active === id ? C.orange : C.sub, fontSize: 14, fontWeight: 600,
                textTransform: "capitalize", fontFamily: "'DM Mono', monospace",
              }}>{id}</button>
            ))}
          </div>
        )}
      </nav>

      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #f8f7f3 0%, #f2f5fa 100%)" }}>

        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "120px 40px 80px", position: "relative", zIndex: 1, width: "100%" }}>
          <div className="hero-content-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 60 }}>

            {/* LEFT — Text content */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: 540 }}>
              <div style={{ animation: "fadeUp 0.7s ease 0.05s both" }}>
                <div style={{ display: "inline-block", marginBottom: 24, fontSize: 30, fontWeight: 700, color: C.orange, fontFamily: "Noto Sans Devanagari, Cambria, serif", letterSpacing: 0.5, lineHeight: 1 }}>
                  नमस्ते
                </div>
              </div>

              <div style={{ animation: "fadeUp 0.7s ease 0.18s both" }}>
                <h1 style={{ fontWeight: 900, fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.08, color: C.text, letterSpacing: -1.5, marginBottom: 4 }}>
                  I'm <span style={{ background: `linear-gradient(135deg, ${C.orange}, #fb923c)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{typed}</span>
                  <span style={{ animation: "blinkCur 0.8s infinite", color: C.orange }}>|</span>
                </h1>
              </div>

              <div style={{ animation: "fadeUp 0.7s ease 0.32s both" }}>
                <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.9, marginTop: 20, marginBottom: 34, fontWeight: 400, maxWidth: 490 }}>
                   Senior Academic Direction Supervisor at ING Skill Academy. MSc. IT (Data Analytics) student at Islington College. Bridging technology and pedagogy to build scalable learning systems.
                </p>
              </div>

              <div className="hero-btns" style={{ animation: "fadeUp 0.7s ease 0.44s both", display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <button onClick={() => goto("programmes")} style={{
                  padding: "14px 32px", background: `linear-gradient(135deg, ${C.orange}, #ea580c)`,
                  border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 800,
                  letterSpacing: 0.8, fontFamily: "'DM Mono', monospace",
                  boxShadow: `0 8px 28px rgba(249,115,22,0.4)`, transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex", alignItems: "center", gap: 8,
                }}>Portfolio <span style={{ fontSize: 16 }}>↗</span></button>
                <button onClick={() => goto("contact")} style={{
                  padding: "14px 32px", background: "transparent", border: `1.5px solid ${C.border}`,
                  borderRadius: 10, color: C.text, fontSize: 13, fontWeight: 700,
                  fontFamily: "'DM Mono', monospace", letterSpacing: 0.8,
                  transition: "border-color 0.2s, color 0.2s",
                }}>Hire me</button>
              </div>

              {/* Social icons */}
              <div className="hero-socials" style={{ animation: "fadeUp 0.7s ease 0.54s both", display: "flex", gap: 10, marginBottom: 36 }}>
                <SocialBtn href="https://github.com/Prathammxz" label="GitHub" color={"#aaa"} icon={<GithubIcon size={18} />} />
                <SocialBtn href="https://np.linkedin.com/in/pratham-neupane-8bb04b318" label="LinkedIn" color={C.indigo} icon={<LinkedinIcon size={18} />} />
                <SocialBtn href="mailto:neupanepratham5@gmail.com" label="Email" color={"#EA4335"} icon={<GmailIcon size={18} />} />
              </div>

              {/* Stats */}
              <div className="hero-stats" style={{ animation: "fadeUp 0.7s ease 0.64s both", display: "flex", gap: 0, flexWrap: "wrap" }}>
                {[["2+", "Years Exp", C.orange], ["1000+", "Students", C.cyan]].map(([n, l, col]) => (
                  <div key={l} style={{ paddingRight: 28, marginRight: 28, borderRight: `1px solid rgba(255,255,255,0.08)` }}>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>
                      <Counter to={n} color={col} />
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Large hero photo with orange circle (matching reference design) */}
            <div className="hero-img" style={{ flexShrink: 0, position: "relative" }}>
              <Reveal delay={0.28} dir="right">
                <div style={{ position: "relative", width: 420, height: 500 }}>

                  {/* Orange glowing circle behind photo */}
                  <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    width: 380, height: 380, borderRadius: "50%",
                    background: `radial-gradient(circle, ${C.orange}dd 0%, ${C.orange}88 40%, transparent 70%)`,
                    animation: "glowPulse 4s ease-in-out infinite",
                    zIndex: 0,
                  }} />

                  {/* Decorative dashed orbit rings */}
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 440, height: 440, border: `1.5px dashed rgba(249,115,22,0.2)`, borderRadius: "50%", animation: "spinSlow 25s linear infinite", pointerEvents: "none", zIndex: 0 }} />

                  {/* Floating accent dots */}
                  <div style={{ position: "absolute", top: 20, right: 10, width: 20, height: 20, borderRadius: "50%", background: C.orange, zIndex: 4, animation: "floatY 3s ease-in-out infinite", boxShadow: `0 4px 16px ${C.orange}80` }} />
                  <div style={{ position: "absolute", bottom: 60, left: 10, width: 14, height: 14, borderRadius: "50%", background: C.violet, zIndex: 4, animation: "floatY 4.5s ease-in-out infinite 1.2s", boxShadow: `0 4px 14px ${C.violet}60` }} />
                  <div style={{ position: "absolute", top: "45%", right: -10, width: 8, height: 8, borderRadius: "50%", background: C.cyan, zIndex: 4, animation: "pulse 2s infinite" }} />

                  {/* Main photo — large, no border frame, photo overflows circle */}
                  <img src="src/assets/public/me.png" alt="Pratham Neupane" style={{
                    position: "relative", zIndex: 2,
                    width: "100%", height: "100%",
                    objectFit: "contain", objectPosition: "bottom",
                    display: "block",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
                  }} />

                  {/* "Hello!" badge — top left of photo (matches reference)
                  <div style={{
                    position: "absolute", top: 30, left: -30, zIndex: 5,
                    display: "flex", flexDirection: "column", gap: 6,
                    animation: "floatY 5s ease-in-out infinite 0.5s",
                  }}>
                    <div style={{
                      background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)",
                      border: `1px solid rgba(104,110,170,0.14)`, borderRadius: 12,
                      padding: "10px 14px", maxWidth: 160,
                      boxShadow: "0 10px 24px rgba(30,36,50,0.06)",
                    }}>
                      <div style={{ fontSize: 14, color: C.orange, marginBottom: 4 }}>❝</div>
                      <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Pratham's exceptional product design ensure our website's success, highly recommended</div>
                    </div>
                  </div> */}

                  {/* Stars + Experience badge — right side (matches reference)
                  <div style={{
                    position: "absolute", top: 40, right: -20, zIndex: 5,
                    animation: "floatY 6s ease-in-out infinite 1s",
                  }}>
                    <div style={{
                      background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)",
                      border: `1px solid rgba(104,110,170,0.14)`, borderRadius: 12,
                      padding: "12px 16px", textAlign: "center",
                      boxShadow: "0 10px 24px rgba(30,36,50,0.06)",
                    }}>
                      <div style={{ color: C.orange, fontSize: 13, letterSpacing: 2, marginBottom: 4 }}>★★★★★</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.text, lineHeight: 1, fontFamily: '"Times New Roman", Times, serif' }}>3+</div>
                      <div style={{ fontSize: 10, color: C.sub, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginTop: 2 }}>Years<br />Experience</div>
                    </div>
                  </div> */}

                  {/* Floating tech badge bottom-right */}
                  <div style={{
                    position: "absolute", bottom: 30, right: -10, zIndex: 5,
                    background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)",
                    border: `1px solid rgba(104,110,170,0.14)`,
                    borderRadius: 12, padding: "8px 14px",
                    animation: "floatY 5s ease-in-out infinite 0.5s",
                    boxShadow: "0 10px 24px rgba(30,36,50,0.06)",
                  }}>
                    <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: C.sub, letterSpacing: 1, marginBottom: 2 }}>STACK</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.orange, fontFamily: "'DM Mono', monospace" }}>MERN · Python</div>
                  </div>

                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* <Marquee items={["Curriculum Developer", "Educator", "MERN Stack Developer", "Data Analytics", "5E Pedagogy", "Operations Lead", "AI Trainer", "Robotics", "EdTech Nepal"]} color={C.indigo} bg="#eef3ff" speed={30} /> */}

      {/* ── ABOUT ───────────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <Reveal delay={0.15} dir="right">
              <img
                src="src/assets/public/about.png"
                alt="Pratham Neupane"
                style={{
                  width: "100%",
                  display: "block",
                  maxWidth: 550,
                  margin: "0 auto",
                  objectFit: "contain",
                  background: "transparent",
                }}
              />
            </Reveal>
            <div>
              <SectionHead title="About Me" color={C.indigo} />
              <p style={{ color: C.sub, lineHeight: 1.9, fontSize: 15, marginBottom: 20, marginTop: -24 }}>
                I integrate technology with pedagogy to build scalable learning systems. My expertise spans curriculum development, 5E pedagogy, and full-stack web application development.
              </p>
              <p style={{ color: C.sub, lineHeight: 1.9, fontSize: 15 }}>
                Passionate about combining educational research with technology to enhance learning outcomes and create engaging experiences for students across diverse backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDUCATION — Timeline ─────────────────────────────────────────────── */}
      < section id="education" style={{ padding: "100px 0", background: C.surface }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <SectionHead title="Educational Qualifications" color={C.violet} />
          <div style={{ maxWidth: 780 }}>
            {education.map((e, i) => (
              <EduTimelineItem key={e.degree} {...e} delay={i * 0.12} last={i === education.length - 1} />
            ))}
          </div>
        </div>
      </section >

      {/* ── EXPERIENCE ──────────────────────────────────────────────────────── */}
      < section id="experience" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <SectionHead title="Professional Journey" color={C.orange} />
          <div style={{ maxWidth: 720 }}>
            {experience.map((e, i) => <ExpItem key={e.title} {...e} delay={i * 0.1} last={i === experience.length - 1} />)}
          </div>
        </div>
      </section >

      {/* ── SKILLS ──────────────────────────────────────────────────────────── */}
      < section id="skills" style={{ padding: "100px 0", background: C.surface }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <SectionHead title="Skills & Competencies" color={C.cyan} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
            {skills.map((s, i) => <SkillGroup key={s.title} {...s} delay={i * 0.08} />)}
          </div>
        </div>
      </section >

      {/* <Marquee items={["GPPC", "ROBO", "CSFC", "SEP", "Skill Up", "ING Skill Academy", "Curriculum Design", "5E Pedagogy", "AI Training", "Operations Lead"]} color={C.violet} bg="#eef3ff" speed={28} /> */}

      {/* ── PROGRAMMES ──────────────────────────────────────────────────────── */}
      {/* This is the programmes section which is currently commented out. */}
      {/* <section id="programmes" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <SectionHead title="Programmes & Initiatives" color={C.indigo} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 22 }}>
            {programmes.map((p, i) => <ProgrammeCard key={p.shortName} {...p} delay={i * 0.1} />)}
          </div>
        </div>
      </section> */}

      {/* ── GALLERY ─────────────────────────────────────────────────────────── */}
      <section id="gallery" style={{ padding: "100px 0", background: C.surface }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <SectionHead title="Moments & Milestones" color={C.orange} center />
          <p style={{ color: C.sub, fontSize: 14, textAlign: "center", marginTop: -36, marginBottom: 48 }}>Highlights from trainings, academic programmes, and professional initiatives.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 18 }}>
            {gallery.map((item, i) => <GalleryItem key={i} {...item} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ── BLOGS ───────────────────────────────────────────────────────────── */}
      <section id="blogs" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <SectionHead title="Blogs & Research" color={C.green} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 18 }}>
            <BlogCard title="Micromanagement vs Macro Management" year="2026" tag="Research" color={C.indigo} desc="Effective management is not about being involved in everything or stepping back completely. This article explores the balance between guidance, trust and autonomy, and how managers can adjust their approach based on the situation." delay={0} link="https://medium.com/@prathamneupane01/micromanagement-vs-macro-management-finding-the-right-balance-in-the-workplace-9fbec4f861b8" />
            <BlogCard title="Modern Curriculum Design" year="2025" tag="Pedagogy" color={C.orange} desc="Bridging technology with 5E pedagogy to create dynamic, engaging curricula that prepare students for the digital age and evolving workforce demands." delay={0.1} />
            <BlogCard title="The Future of EdTech in Nepal" year="2024" tag="EdTech" color={C.violet} desc="Exploring how emerging technologies can democratise educational access and improve quality across Nepal's diverse educational landscape." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "100px 0", background: C.surface }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
          <SectionHead title="Get In Touch" color={C.indigo} center />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start", maxWidth: 880, margin: "0 auto" }}>
            <Reveal>
              <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "34px" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 22 }}>Send a Message</h3>
                <ContactForm />
              </div>
            </Reveal>
            <Reveal delay={0.15} dir="right">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p style={{ color: C.sub, fontSize: 15, lineHeight: 1.9 }}>Open to academic collaborations, curriculum development, web development work, or speaking engagements.</p>
                {[
                  { label: "Email", value: "neupanepratham5@gmail.com", href: "mailto:neupanepratham5@gmail.com", color: "#EA4335" },
                  { label: "GitHub", value: "github.com/Prathammxz", href: "https://github.com/Prathammxz", color: C.text },
                  { label: "LinkedIn", value: "linkedin.com/in/pratham-neupane", href: "https://np.linkedin.com/in/pratham-neupane-8bb04b318", color: C.indigo },
                  { label: "Location", value: "Kathmandu, Nepal", href: null, color: C.cyan },
                ].map(({ label, value, href, color }) => (
                  <div key={label} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", background: "rgba(255,255,255,0.03)", border: `1.5px solid ${C.border}`, borderRadius: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                      {href
                        ? <a href={href} style={{ fontSize: 13, color: C.text, textDecoration: "none", fontWeight: 600 }}>{value}</a>
                        : <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{value}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#f5f7ff", padding: "36px 40px 28px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 900, fontSize: 17, color: C.text, marginBottom: 3 }}>
              Pratham Neupane
            </div>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: C.muted, letterSpacing: 1 }}>© 2026 · All rights reserved</div>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {[
              { label: "GitHub", href: "https://github.com/Prathammxz", icon: <GithubIcon size={16} />, color: C.muted },
              { label: "LinkedIn", href: "https://np.linkedin.com/in/pratham-neupane-8bb04b318", icon: <LinkedinIcon size={16} />, color: C.muted },
              { label: "Email", href: "mailto:neupanepratham5@gmail.com", icon: <GmailIcon size={16} />, color: C.muted },
            ].map(({ label, href, icon, color }) => (
              <a key={label} href={href} title={label} style={{ color, textDecoration: "none", transition: "color 0.2s", display: "flex" }}
                onMouseEnter={e => e.currentTarget.style.color = C.cyan}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >{icon}</a>
            ))}
          </div>
        </div>
      </footer>

    </div >
  );
}

