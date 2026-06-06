import { useState, useEffect, useRef } from "react";

// ── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  dark: {
    bg:        "#0c0d10",
    surface:   "#13141a",
    card:      "#181921",
    cardHover: "#1e2030",
    border:    "rgba(180,160,100,0.18)",
    borderHov: "rgba(180,160,100,0.45)",
    text:      "#e8e6df",
    sub:       "#a09e96",
    muted:     "#5a5850",
    gold:      "#c9a84c",
    goldLight: "#e2c97e",
    goldGlow:  "rgba(201,168,76,0.22)",
    navBg:     "rgba(12,13,16,0.92)",
    divider:   "rgba(180,160,100,0.12)",
  },
  light: {
    bg:        "#f7f5f0",
    surface:   "#ffffff",
    card:      "#ffffff",
    cardHover: "#faf8f3",
    border:    "rgba(140,110,40,0.18)",
    borderHov: "rgba(140,110,40,0.45)",
    text:      "#1a1814",
    sub:       "#4a4640",
    muted:     "#9a9288",
    gold:      "#8c6e28",
    goldLight: "#b08030",
    goldGlow:  "rgba(140,110,40,0.18)",
    navBg:     "rgba(247,245,240,0.94)",
    divider:   "rgba(140,110,40,0.1)",
  },
};

// ── Typing effect ─────────────────────────────────────────────────────────────
function useTyping(words, speed = 100, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[wi % words.length];
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(cur.slice(0, display.length + 1));
        if (display.length + 1 === cur.length) setTimeout(() => setDel(true), pause);
      } else {
        setDisplay(cur.slice(0, display.length - 1));
        if (display.length - 1 === 0) { setDel(false); setWi(w => w + 1); }
      }
    }, del ? speed * 0.5 : speed);
    return () => clearTimeout(t);
  }, [display, del, wi, words, speed, pause]);
  return display;
}

// ── InView hook ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Animated reveal wrapper ───────────────────────────────────────────────────
function Reveal({ children, delay = 0, dir = "up", style = {} }) {
  const [ref, inView] = useInView();
  const offsets = { up: "translateY(32px)", left: "translateX(-32px)", right: "translateX(32px)", none: "none" };
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : offsets[dir],
      transition: `opacity 0.75s cubic-bezier(.4,0,.2,1) ${delay}s, transform 0.75s cubic-bezier(.4,0,.2,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
      <div style={{ width: 32, height: 1, background: t.gold }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, color: t.gold, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{label}</span>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider({ t }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
      <div style={{ height: 1, background: t.divider }} />
    </div>
  );
}

// ── Logo image with fallback ──────────────────────────────────────────────────
function Logo({ src, alt, style = {} }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 11, fontWeight: 700, color: "#888", fontFamily: "'DM Mono', monospace", textAlign: "center", padding: 4 }}>
      {alt}
    </div>
  );
  return <img src={src} alt={alt} onError={() => setErr(true)} style={{ objectFit: "contain", ...style }} />;
}

// ── Education card ────────────────────────────────────────────────────────────
function EduCard({ degree, school, affil, period, badge, logos, t, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: hover ? t.cardHover : t.card,
        border: `1px solid ${hover ? t.borderHov : t.border}`,
        borderLeft: `3px solid ${t.gold}`,
        borderRadius: 4, padding: "28px 32px", transition: "all 0.3s",
        display: "flex", flexDirection: "column", gap: 16, height: "100%",
      }}>
        {/* Logos row */}
        {logos && logos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {logos.map((logo, i) => (
              <div key={i} style={{
                height: 44, maxWidth: 120,
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 3, padding: "6px 10px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Logo src={logo.src} alt={logo.alt} style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto" }} />
              </div>
            ))}
          </div>
        )}
        {/* Content */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: t.gold, letterSpacing: 1 }}>{period}</span>
            {badge && <span style={{ fontSize: 11, color: t.gold, border: `1px solid ${t.gold}44`, padding: "2px 10px", borderRadius: 2, fontWeight: 600, letterSpacing: 0.5 }}>{badge}</span>}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>{degree}</div>
          <div style={{ fontSize: 13, color: t.gold, fontWeight: 600, marginBottom: 2 }}>{school}</div>
          <div style={{ fontSize: 12, color: t.muted }}>{affil}</div>
        </div>
      </div>
    </Reveal>
  );
}

// ── Experience item ───────────────────────────────────────────────────────────
function ExpItem({ title, company, period, desc, logo, t, delay, last }) {
  return (
    <Reveal delay={delay} dir="left">
      <div style={{ display: "flex", gap: 28, paddingBottom: last ? 0 : 36 }}>
        {/* Timeline dot + line */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.gold, border: `2px solid ${t.gold}`, flexShrink: 0, marginTop: 5 }} />
          {!last && <div style={{ width: 1, flex: 1, background: t.divider, marginTop: 8 }} />}
        </div>
        {/* Content */}
        <div style={{ flex: 1, paddingBottom: last ? 0 : 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
            {/* Left: logo + title + company */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {logo && (
                <div style={{
                  width: 48, height: 48, flexShrink: 0, borderRadius: 4,
                  border: `1px solid ${t.border}`, background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 6, overflow: "hidden",
                }}>
                  <Logo src={logo} alt={company} style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
                </div>
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.text, fontFamily: "'Playfair Display', serif" }}>{title}</div>
                <div style={{ fontSize: 13, color: t.gold, fontWeight: 600 }}>{company}</div>
              </div>
            </div>
            {/* Right: period */}
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: t.muted, letterSpacing: 0.5, marginTop: 4 }}>{period}</span>
          </div>
          <p style={{ color: t.sub, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ── Skill group ───────────────────────────────────────────────────────────────
function SkillGroup({ title, items, t, delay }) {
  return (
    <Reveal delay={delay}>
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 4, padding: "24px 28px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, color: t.gold, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>{title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {items.map(item => <SkillChip key={item} label={item} t={t} />)}
        </div>
      </div>
    </Reveal>
  );
}

function SkillChip({ label, t }) {
  const [hover, setHover] = useState(false);
  return (
    <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      padding: "5px 13px", fontSize: 12, fontWeight: 500,
      background: hover ? `${t.gold}18` : "transparent",
      border: `1px solid ${hover ? t.gold : t.border}`,
      color: hover ? t.gold : t.sub,
      borderRadius: 2, transition: "all 0.2s", cursor: "default",
    }}>{label}</span>
  );
}

// ── Programme card ────────────────────────────────────────────────────────────
function ProgrammeCard({ logo, name, shortName, role, desc, tags, link, t, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: hover ? t.cardHover : t.card,
        border: `1px solid ${hover ? t.borderHov : t.border}`,
        borderRadius: 4, padding: "28px 30px",
        transition: "all 0.3s", height: "100%",
        display: "flex", flexDirection: "column", gap: 18,
        boxShadow: hover ? `0 8px 32px rgba(0,0,0,0.2)` : "none",
      }}>

        {/* Logo + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 4, flexShrink: 0,
            border: `1px solid ${t.border}`, background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", padding: 8,
          }}>
            <Logo src={logo} alt={shortName} style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, color: t.gold, textTransform: "uppercase", marginBottom: 5 }}>{shortName}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Playfair Display', serif", lineHeight: 1.35 }}>{name}</div>
          </div>
        </div>

        {/* Divider line */}
        <div style={{ height: 1, background: t.divider }} />

        {/* Role */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.gold, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: t.gold, fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>{role}</span>
        </div>

        {/* Description */}
        <p style={{ color: t.sub, fontSize: 13, lineHeight: 1.85, margin: 0, flex: 1 }}>{desc}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: "3px 10px",
              border: `1px solid ${t.border}`, borderRadius: 2,
              color: t.muted, fontFamily: "'DM Mono', monospace", letterSpacing: 0.5,
            }}>{tag}</span>
          ))}
        </div>

        {/* Link */}
        {link && (
          <a href={link} target="_blank" rel="noreferrer" style={{
            fontSize: 11, color: hover ? t.gold : t.muted,
            fontFamily: "'DM Mono', monospace", letterSpacing: 1,
            textDecoration: "none", transition: "color 0.2s",
          }}>Visit Programme →</a>
        )}
      </div>
    </Reveal>
  );
}

// ── Blog card ─────────────────────────────────────────────────────────────────
function BlogCard({ title, year, desc, tag, t, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: hover ? t.cardHover : t.card,
        border: `1px solid ${hover ? t.borderHov : t.border}`,
        borderRadius: 4, padding: "28px 30px", transition: "all 0.3s",
        height: "100%", cursor: "pointer",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, color: t.gold, textTransform: "uppercase", border: `1px solid ${t.gold}44`, padding: "3px 10px", borderRadius: 2, fontFamily: "'DM Mono', monospace" }}>{tag}</span>
          <span style={{ fontSize: 11, color: t.muted, fontFamily: "'DM Mono', monospace" }}>{year}</span>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 10, fontFamily: "'Playfair Display', serif", lineHeight: 1.4 }}>{title}</h3>
        <p style={{ color: t.sub, fontSize: 13, lineHeight: 1.8, margin: 0 }}>{desc}</p>
        <div style={{ marginTop: 20, fontSize: 12, color: t.gold, fontWeight: 600, letterSpacing: 0.5 }}>Read More →</div>
      </div>
    </Reveal>
  );
}

// ── Gallery item ──────────────────────────────────────────────────────────────
function GalleryItem({ src, type, caption, t, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        border: `1px solid ${hover ? t.borderHov : t.border}`,
        borderRadius: 4, overflow: "hidden", transition: "all 0.3s",
        boxShadow: hover ? `0 12px 40px rgba(0,0,0,0.35)` : "0 2px 12px rgba(0,0,0,0.15)",
      }}>
        {type === "video" ? (
          <video controls style={{ width: "100%", height: 220, objectFit: "cover", display: "block", background: "#000" }}>
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
            <img src={src} alt={caption} style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hover ? "scale(1.04)" : "scale(1)", transition: "transform 0.5s",
            }} />
            {hover && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>🔍 View</span>
              </div>
            )}
          </div>
        )}
        {caption && (
          <div style={{ padding: "12px 16px", background: t.card, borderTop: `1px solid ${t.border}` }}>
            <p style={{ margin: 0, fontSize: 12, color: t.sub, fontStyle: "italic" }}>{caption}</p>
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm({ t }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setForm({ name: "", email: "", message: "" }); }, 1400);
  };
  const field = {
    width: "100%", padding: "11px 14px", background: t.surface,
    border: `1px solid ${t.border}`, borderRadius: 3, color: t.text,
    fontSize: 14, outline: "none", fontFamily: "inherit",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <input name="name" value={form.name} onChange={onChange} placeholder="Full Name" required style={field} />
      <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email Address" required style={field} />
      <textarea name="message" value={form.message} onChange={onChange} placeholder="Your Message" rows={5} required style={{ ...field, resize: "vertical" }} />
      <button type="submit" disabled={status === "sending"} style={{
        padding: "12px", background: status === "sent" ? "transparent" : t.gold,
        border: status === "sent" ? `1px solid ${t.gold}` : "none",
        borderRadius: 3, color: status === "sent" ? t.gold : t.bg,
        fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
        cursor: status === "sending" ? "not-allowed" : "pointer",
        opacity: status === "sending" ? 0.6 : 1, transition: "all 0.25s",
        fontFamily: "'DM Mono', monospace",
      }}>
        {status === "sending" ? "Sending…" : status === "sent" ? "✓ Message Sent" : "Send Message"}
      </button>
    </form>
  );
}

// ── Social icon button ────────────────────────────────────────────────────────
function SocialBtn({ href, icon, label, t }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={href} title={label} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${hover ? t.gold : t.border}`, borderRadius: 2,
        color: hover ? t.gold : t.sub, textDecoration: "none", fontSize: 13,
        fontFamily: "'DM Mono', monospace", fontWeight: 600,
        transition: "all 0.2s", background: hover ? `${t.gold}10` : "transparent",
      }}>{icon}</a>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState("dark");
  const t = T[theme];
  const typed = useTyping(["Pratham Neupane", "Curriculum Developer", "Educator", "MERN Stack Developer"], 85, 1800);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["home", "about", "education", "experience", "skills", "programmes", "gallery", "blogs", "contact"];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...navItems].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  // ── Education data with logos ─────────────────────────────────────────────
  const education = [
    {
      degree: "MSc. IT (Data Analytics)",
      school: "Islington College",
      affil: "London Metropolitan University",
      period: "2026 – 2028",
      badge: null,
      logos: [
        { src: "/Education/islington.png", alt: "Islington College" },
      ],
    },
    {
      degree: "BSc. (Hons) Computing",
      school: "Itahari International College",
      affil: "London Metropolitan University",
      period: "2021 – 2024",
      badge: "1st Class Honours",
      logos: [
        { src: "/Education/iic.png", alt: "Itahari International College" },
      ],
    },
    {
      degree: "SLC (+2) Science",
      school: "GEMS Institute of Higher Education",
      affil: "National Examination Board",
      period: "2018 – 2020",
      badge: "A+ · 3.65 GPA",
      logos: [
        { src: "/Education/GIHE.png", alt: "GEMS Institute of Higher Education" },
      ],
    },
    {
      degree: "SEE",
      school: "GEMS School",
      affil: "National Examination Board",
      period: "2017",
      badge: "A+ · 3.80 GPA",
      logos: [
        { src: "/Education/GEMS.png", alt: "GEMS School" },
      ],
    },
  ];

  // ── Programmes data with logos ────────────────────────────────────────────
  const programmes = [
    {
      shortName: "GPPC",
      name: "Global Professional Pathway Course",
      logo: "/Programmes/GPPC.png",
      role: "Programme Coordinator & Operations Lead",
      desc: "A specialised programme for high school graduates, equipping them with skills across AI & Data Science, Cybersecurity, Business & Digital Innovation, Animation & Film Making, Software Development, and Accounting & Finance. I oversaw end-to-end programme delivery, student management, and operational strategy.",
      tags: ["AI & Data Science", "Cybersecurity", "Business", "Animation", "Operations"],
      link: "https://ingskill.com/global-professional-pathway-course",
    },
    {
      shortName: "ROBO",
      name: "Nepal's First Industry-Connected Robotics Programme",
      logo: "/Programmes/Robo.png",
      role: "Curriculum Designer & Content Developer",
      desc: "Nepal's first industry-connected robotics programme for young innovators, developed with leading robotics companies in China. I designed the full curriculum and learning content — covering building-block robotics kits, block-based coding, and guided learning books.",
      tags: ["Robotics", "Curriculum Design", "Coding", "STEM", "Content Development"],
      link: "https://ingrobo.com/",
    },
    {
      shortName: "CSFC",
      name: "Contemporary Skills Foundations Course",
      logo: "/Programmes/CSFC.png",
      role: "Operations Manager & AI Trainer",
      desc: "A foundational computing programme introducing students to core computer science concepts. I managed programme operations end-to-end and delivered specialised AI training sessions, equipping students with practical knowledge in artificial intelligence tools and real-world applications.",
      tags: ["AI Training", "Computer Science", "Operations", "Student Training"],
      link: null,
    },
    {
      shortName: "SEP / Skill Up",
      name: "Skill Enrichment Programme (now Skill Up)",
      logo: "/Programmes/SEP.png",
      role: "Head of Student Services & Operations",
      desc: "A programme bridging the gap between academics and career readiness through hands-on learning, expert guidance, and industry exposure. Now rebranded as Skill Up. I led the Student Services Department, managing student journeys and all programme operations.",
      tags: ["Student Services", "Operations", "Career Readiness", "Programme Management"],
      link: "https://ingskill.com/skill-up",
    },
  ];

  const galleryItems = [
    { src: "Gallery/AI.mov",       type: "video", caption: "AI Workshop — ING Skill Academy" },
    { src: "Gallery/SEP-Team.JPG", type: "image", caption: "SEP Team — Academic Initiative" },
    { src: "Gallery/CS.MOV",       type: "video", caption: "Computer Science Programme" },
    { src: "Gallery/skillup.mp4",  type: "video", caption: "Skill Up Programme" },
  ];

  const skills = [
    { title: "Programming Languages", items: ["C++", "Java", "JavaScript", "Python"] },
    { title: "Web Development",       items: ["React.js", "Node.js", "Express.js", "HTML5", "CSS3", "MongoDB"] },
    { title: "Tools & Databases",     items: ["Git", "GitHub", "MySQL", "MongoDB", "GitHub Actions", "Linux"] },
    { title: "Core CS Concepts",      items: ["Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems"] },
    { title: "Pedagogy & Curriculum", items: ["5E Pedagogy", "Curriculum Design", "Content Creation", "Teacher Training", "Learning Assessment"] },
  ];

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${t.gold}33; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${t.bg}; }
        ::-webkit-scrollbar-thumb { background: ${t.gold}55; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
        @keyframes blinkCur { 0%,100% { opacity:1; } 50% { opacity:0; } }
        input::placeholder, textarea::placeholder { color: ${t.muted}; }
        input:focus, textarea:focus { border-color: ${t.gold} !important; }
        @media (max-width: 900px) { .hero-image { display: none !important; } }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mob-btn   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mob-btn  { display: none !important; }
          .mob-menu { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? t.navBg : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${t.divider}` : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", height: 66, justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: t.text, letterSpacing: 0.5 }}>Pratham Neupane</span>
            <span style={{ fontSize: 10, color: t.gold, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>Portfolio</span>
          </div>

          <div className="nav-links" style={{ display: "flex", gap: 4 }}>
            {navItems.map(id => (
              <button key={id} onClick={() => goto(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "5px 12px", borderRadius: 2,
                fontSize: 11, fontWeight: active === id ? 600 : 400,
                color: active === id ? t.gold : t.sub,
                fontFamily: "'DM Mono', monospace", letterSpacing: 0.8,
                textTransform: "capitalize", transition: "color 0.2s",
                borderBottom: active === id ? `1px solid ${t.gold}` : "1px solid transparent",
              }}>{id}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setTheme(th => th === "dark" ? "light" : "dark")} style={{
              background: "transparent", border: `1px solid ${t.border}`, borderRadius: 2,
              padding: "6px 14px", cursor: "pointer", color: t.sub,
              fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1,
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
            }}>
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            <button className="mob-btn" onClick={() => setMenuOpen(o => !o)} style={{
              background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer", display: "none",
            }}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        </div>

        {menuOpen && (
          <div className="mob-menu" style={{
            background: t.navBg, backdropFilter: "blur(20px)",
            borderTop: `1px solid ${t.divider}`, padding: "16px 40px 24px",
          }}>
            {navItems.map(id => (
              <button key={id} onClick={() => goto(id)} style={{
                display: "block", background: "none", border: "none", color: t.sub,
                padding: "9px 0", fontSize: 13, fontFamily: "'DM Mono', monospace",
                letterSpacing: 1, textTransform: "capitalize", cursor: "pointer",
                borderBottom: `1px solid ${t.divider}`, width: "100%", textAlign: "left",
              }}>{id}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(${t.divider} 1px, transparent 1px), linear-gradient(90deg, ${t.divider} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }} />
        <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, background: `linear-gradient(180deg, transparent, ${t.gold}, transparent)`, zIndex: 0 }} />

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "120px 40px 80px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 60, width: "100%" }}>

            {/* LEFT */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: 580 }}>
              <div style={{ animation: "fadeUp 0.8s ease 0.1s both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                  <div style={{ width: 28, height: 1, background: t.gold }} />
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 4, color: t.gold, textTransform: "uppercase" }}>Academic & Technology Professional</span>
                </div>
              </div>
              <div style={{ animation: "fadeUp 0.8s ease 0.25s both" }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(2.4rem, 5vw, 4.8rem)", lineHeight: 1.05, color: t.text, marginBottom: 8, letterSpacing: -1 }}>
                  {typed}<span style={{ animation: "blinkCur 0.8s infinite", color: t.gold }}>|</span>
                </h1>
              </div>
              <div style={{ animation: "fadeUp 0.8s ease 0.4s both" }}>
                <p style={{ fontSize: 15, color: t.sub, lineHeight: 1.9, marginTop: 24, marginBottom: 36, fontWeight: 300 }}>
                  Academic Senior Supervisor at ING Skill Academy. MSc. IT (Data Analytics) candidate at Islington College. Bridging technology and pedagogy to build scalable learning systems.
                </p>
              </div>
              <div style={{ animation: "fadeUp 0.8s ease 0.55s both", display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => goto("contact")} style={{
                  padding: "12px 28px", background: t.gold, border: "none", borderRadius: 2,
                  color: t.bg, fontSize: 12, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Mono', monospace",
                }}>Get In Touch</button>
                <a href="Assets/CV.pdf" download style={{
                  padding: "12px 28px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: 2,
                  color: t.sub, fontSize: 12, fontWeight: 600, letterSpacing: 2,
                  textTransform: "uppercase", fontFamily: "'DM Mono', monospace", textDecoration: "none",
                }}>Download CV</a>
              </div>
              <div style={{ animation: "fadeUp 0.8s ease 0.65s both", display: "flex", gap: 10, marginTop: 20 }}>
                <SocialBtn href="https://github.com/Prathammxz"                        icon="GH" label="GitHub"   t={t} />
                <SocialBtn href="https://np.linkedin.com/in/pratham-neupane-8bb04b318" icon="in" label="LinkedIn" t={t} />
                <SocialBtn href="mailto:neupanepratham5@gmail.com"                     icon="@"  label="Email"    t={t} />
              </div>
              <div style={{ animation: "fadeUp 0.8s ease 0.75s both", display: "flex", gap: 20, marginTop: 40, flexWrap: "wrap" }}>
                {[["3+", "Years Experience"], ["1000+", "Students Mentored"], ["1st Class", "BSc Honours"]].map(([n, l]) => (
                  <div key={l} style={{ paddingRight: 20, borderRight: `1px solid ${t.divider}` }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: t.gold }}>{n}</div>
                    <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Photo */}
            <div className="hero-image" style={{ flexShrink: 0 }}>
              <Reveal delay={0.35} dir="right">
                <div style={{ width: 300, height: 380, borderRadius: 4, border: `1px solid ${t.borderHov}`, overflow: "hidden", position: "relative", boxShadow: `0 24px 60px rgba(0,0,0,0.4)` }}>
                  <img src="/me.png" alt="Pratham Neupane" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 20px 16px", background: "linear-gradient(transparent, rgba(0,0,0,0.72))" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontWeight: 700, fontSize: 15 }}>Pratham Neupane</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", color: t.gold, fontSize: 10, letterSpacing: 2, marginTop: 4 }}>ACADEMIC · DEVELOPER</div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      <Divider t={t} />

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <Reveal>
                <SectionLabel label="About Me" t={t} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: t.text, marginBottom: 24, lineHeight: 1.2 }}>
                  Transforming Education Through Technology
                </h2>
                <p style={{ color: t.sub, lineHeight: 1.9, fontSize: 15, marginBottom: 16, fontWeight: 300 }}>
                  I integrate technology with pedagogy to build scalable learning systems. My expertise spans curriculum development, 5E pedagogy, and full-stack web application development.
                </p>
                <p style={{ color: t.sub, lineHeight: 1.9, fontSize: 15, fontWeight: 300 }}>
                  Passionate about combining educational research with technology to enhance learning outcomes and create engaging experiences for students across diverse backgrounds and learning needs.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.15} dir="right">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: "🎓", title: "Educator",       desc: "Curriculum design & 5E Pedagogy" },
                  { icon: "💻", title: "Developer",      desc: "MERN Stack & Full Stack Web" },
                  { icon: "📊", title: "Data Analytics", desc: "MSc. IT specialisation" },
                  { icon: "🏆", title: "1st Class",      desc: "BSc Honours graduate" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 4, padding: "20px 18px" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, color: t.muted }}>{desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider t={t} />

      {/* ── EDUCATION ─────────────────────────────────────────────────────── */}
      <section id="education" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <SectionLabel label="Academic Background" t={t} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: t.text, marginBottom: 48 }}>Educational Qualifications</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {education.map((e, i) => (
              <EduCard key={e.degree} {...e} t={t} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <Divider t={t} />

      {/* ── EXPERIENCE ────────────────────────────────────────────────────── */}
      <section id="experience" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <SectionLabel label="Work Experience" t={t} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: t.text, marginBottom: 48 }}>Professional Journey</h2>
          </Reveal>
          <div style={{ maxWidth: 700 }}>
            <ExpItem title="Academic Senior Supervisor"              company="ING Skill Academy"      period="2025 – Present" logo="/Work/ING.png"     desc="Leading curriculum development, teacher training, and academic strategy. Focused on integrating technology with pedagogy to improve learning outcomes at scale."                                                             t={t} delay={0}   />
            <ExpItem title="Academic Development & Delivery Officer" company="ING Skill Academy"      period="2024 – 2025"    logo="/Work/ING.png"     desc="Designed and delivered academic programs, coordinated content creation, and supported faculty in effective classroom delivery methodologies."                                                                         t={t} delay={0.1} />
            <ExpItem title="Full Stack Intern"                       company="Hunchha Digital Agency" period="2022 – 2023"    logo="/Work/hunchha.png" desc="Developed full-stack web applications using the MERN stack. Built responsive user interfaces and implemented RESTful backend APIs for diverse client projects." t={t} delay={0.2} last />
          </div>
        </div>
      </section>

      <Divider t={t} />

      {/* ── SKILLS ────────────────────────────────────────────────────────── */}
      <section id="skills" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <SectionLabel label="Technical Expertise" t={t} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: t.text, marginBottom: 48 }}>Skills & Competencies</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {skills.map((s, i) => <SkillGroup key={s.title} title={s.title} items={s.items} t={t} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      <Divider t={t} />

      {/* ── ACADEMIC PROGRAMMES ───────────────────────────────────────────── */}
      <section id="programmes" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <SectionLabel label="Academic Work" t={t} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: t.text, marginBottom: 12 }}>Programmes & Initiatives</h2>
            <p style={{ color: t.sub, fontSize: 15, marginBottom: 52, fontWeight: 300, maxWidth: 600 }}>
              Key academic programmes I have contributed to as coordinator, curriculum designer, trainer, and operations lead at ING Skill Academy.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {programmes.map((p, i) => (
              <ProgrammeCard key={p.shortName} {...p} t={t} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <Divider t={t} />

      {/* ── GALLERY ───────────────────────────────────────────────────────── */}
      <section id="gallery" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <SectionLabel label="Gallery" t={t} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: t.text, marginBottom: 12 }}>Moments & Milestones</h2>
            <p style={{ color: t.sub, fontSize: 14, marginBottom: 48, fontWeight: 300 }}>
              Highlights from trainings, academic programmes, and professional initiatives.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {galleryItems.map((item, i) => (
              <GalleryItem key={i} src={item.src} type={item.type} caption={item.caption} t={t} delay={i * 0.08} />
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ marginTop: 32, border: `1px dashed ${t.border}`, borderRadius: 4, padding: "24px", textAlign: "center" }}>
              <p style={{ color: t.muted, fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
                To add more items, append entries to the <code style={{ color: t.gold }}>galleryItems</code> array in App.jsx
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider t={t} />

      {/* ── BLOGS ─────────────────────────────────────────────────────────── */}
      <section id="blogs" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <SectionLabel label="Publications" t={t} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: t.text, marginBottom: 48 }}>Blogs & Research</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <BlogCard title="Data Analytics in Education"   year="2026" tag="Research" desc="Leveraging data-driven insights to improve learning outcomes, personalise student journeys, and measure curriculum effectiveness across diverse learner cohorts." t={t} delay={0}   />
            <BlogCard title="Modern Curriculum Design"      year="2025" tag="Pedagogy" desc="Bridging technology with 5E pedagogy to create dynamic, engaging curricula that prepare students for the digital age and evolving workforce demands."           t={t} delay={0.1} />
            <BlogCard title="The Future of EdTech in Nepal" year="2024" tag="EdTech"   desc="Exploring how emerging technologies can democratise educational access and improve quality across Nepal's diverse educational landscape."                        t={t} delay={0.2} />
          </div>
        </div>
      </section>

      <Divider t={t} />

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <SectionLabel label="Contact" t={t} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: t.text, marginBottom: 48 }}>Get In Touch</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <Reveal>
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 4, padding: "36px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 24 }}>Send a Message</h3>
                <ContactForm t={t} />
              </div>
            </Reveal>
            <Reveal delay={0.15} dir="right">
              <div>
                <p style={{ color: t.sub, fontSize: 15, lineHeight: 1.9, marginBottom: 36, fontWeight: 300 }}>
                  I am open to discussing academic collaborations, curriculum development projects, web development work, or speaking engagements. Feel free to reach out.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { label: "Email",    value: "neupanepratham5@gmail.com",          href: "mailto:neupanepratham5@gmail.com" },
                    { label: "GitHub",   value: "github.com/Prathammxz",              href: "https://github.com/Prathammxz" },
                    { label: "LinkedIn", value: "linkedin.com/in/pratham-neupane",     href: "https://np.linkedin.com/in/pratham-neupane-8bb04b318" },
                    { label: "Location", value: "Kathmandu, Nepal",                   href: null },
                  ].map(({ label, value, href }) => (
                    <div key={label} style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 20, borderBottom: `1px solid ${t.divider}` }}>
                      <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, color: t.gold, textTransform: "uppercase", minWidth: 72, paddingTop: 2 }}>{label}</span>
                      {href
                        ? <a href={href} style={{ fontSize: 14, color: t.sub, textDecoration: "none", transition: "color 0.2s" }}
                             onMouseEnter={e => e.target.style.color = t.gold}
                             onMouseLeave={e => e.target.style.color = t.sub}>{value}</a>
                        : <span style={{ fontSize: 14, color: t.sub }}>{value}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${t.divider}`, padding: "28px 40px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", color: t.muted, fontSize: 13 }}>© 2026 Pratham Neupane. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "GitHub",   href: "https://github.com/Prathammxz" },
              { label: "LinkedIn", href: "https://np.linkedin.com/in/pratham-neupane-8bb04b318" },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, color: t.muted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = t.gold}
                onMouseLeave={e => e.target.style.color = t.muted}
              >{label}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}