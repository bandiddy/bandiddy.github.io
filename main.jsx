import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#080c08",
  bg2: "#0d120d",
  bg3: "#121a12",
  border: "#1e2e1e",
  borderBright: "#2e442e",
  text: "#d4e8d4",
  muted: "#6a8a6a",
  dim: "#3a4e3a",
  green: "#7fff6f",
  greenDim: "#4aaf3a",
  amber: "#f0c060",
  amberDim: "#a07830",
  wine: "#8b1a4a",
  wineBright: "#c0305a",
  wineLight: "#e8608a",
  cream: "#f0e8d8",
  creamDim: "#c8b898",
  gold: "#d4a830",
  fairway: "#1a3a1a",
  fairwayBright: "#2a5a2a",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080c08; color: #d4e8d4; font-family: 'Rajdhani', sans-serif; min-height: 100vh; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #080c08; }
  ::-webkit-scrollbar-thumb { background: #2e442e; border-radius: 3px; }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.8} 94%{opacity:1} 96%{opacity:0.9} 97%{opacity:1} }
  @keyframes typewriter { from{width:0} to{width:100%} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 8px #7fff6f30} 50%{box-shadow:0 0 20px #7fff6f60,0 0 40px #7fff6f20} }
  @keyframes candleFlicker { 0%,100%{opacity:0.9;transform:scaleY(1)} 25%{opacity:1;transform:scaleY(1.05)} 50%{opacity:0.85;transform:scaleY(0.95)} 75%{opacity:1;transform:scaleY(1.02)} }
  @keyframes swirl { 0%{transform:rotate(0deg) scale(1)} 100%{transform:rotate(360deg) scale(1)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes waveText { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes greenPulse { 0%,100%{text-shadow:0 0 6px #7fff6f80} 50%{text-shadow:0 0 16px #7fff6f,0 0 30px #7fff6f40} }
`;

// ── TERMINAL TYPEWRITER ──
function TypewriterText({ lines, speed = 40 }) {
  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;
    if (currentChar < lines[currentLine].text.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          if (!next[currentLine]) next[currentLine] = { ...lines[currentLine], text: "" };
          next[currentLine] = { ...lines[currentLine], text: lines[currentLine].text.slice(0, currentChar + 1) };
          return next;
        });
        setCurrentChar(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setCurrentLine(l => l + 1); setCurrentChar(0); }, 300);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar, lines, speed]);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {displayed.map((line, i) => (
        <div key={i} style={{ marginBottom: 6, lineHeight: 1.7 }}>
          <span style={{ color: COLORS.dim }}>{line.prefix || ""}</span>
          <span style={{ color: line.color || COLORS.green }}>{line.text}</span>
        </div>
      ))}
      {currentLine < lines.length && (
        <span style={{ display: "inline-block", width: 10, height: 18, background: COLORS.green, animation: "blink 1s infinite", verticalAlign: "middle" }} />
      )}
    </div>
  );
}

// ── TERMINAL WINDOW ──
function Terminal({ title = "alvin@portfolio:~$", children, style = {} }) {
  return (
    <div style={{
      background: "#050a05",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 4px 40px rgba(0,0,0,0.6), 0 0 0 1px #1e2e1e",
      animation: "glowPulse 4s ease-in-out infinite",
      ...style
    }}>
      {/* Terminal titlebar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px",
        background: "#0a0f0a",
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
        <span style={{ marginLeft: 12, fontSize: 12, color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{title}</span>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

// ── CODE LINE ──
function CodeLine({ indent = 0, keyword, value, comment, dim, children }) {
  const indentStr = "  ".repeat(indent);
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2, display: "flex", gap: 8, flexWrap: "wrap" }}>
      <span style={{ color: COLORS.dim, userSelect: "none" }}>{indentStr}</span>
      {keyword && <span style={{ color: "#c792ea" }}>{keyword}</span>}
      {value && <span style={{ color: COLORS.green }}>{value}</span>}
      {comment && <span style={{ color: COLORS.dim, fontStyle: "italic" }}> {comment}</span>}
      {dim && <span style={{ color: COLORS.muted }}>{dim}</span>}
      {children}
    </div>
  );
}

// ── CANDLE SVG ──
function Candle({ height = 60 }) {
  return (
    <svg width="24" height={height + 30} viewBox={`0 0 24 ${height + 30}`} style={{ display: "inline-block" }}>
      {/* Flame */}
      <ellipse cx="12" cy="10" rx="5" ry="8" fill="#f0c060" opacity="0.9" style={{ animation: "candleFlicker 1.8s ease-in-out infinite" }} />
      <ellipse cx="12" cy="12" rx="3" ry="5" fill="#fff4d0" opacity="0.8" style={{ animation: "candleFlicker 1.4s ease-in-out infinite reverse" }} />
      <ellipse cx="12" cy="8" rx="2" ry="3" fill="#ffffff" opacity="0.6" style={{ animation: "candleFlicker 1.2s ease-in-out infinite" }} />
      {/* Wick */}
      <line x1="12" y1="17" x2="12" y2="22" stroke="#555" strokeWidth="1.5" />
      {/* Body */}
      <rect x="6" y="22" width="12" height={height} rx="2" fill={COLORS.wine} />
      <rect x="6" y="22" width="12" height="8" rx="2" fill={COLORS.wineBright} opacity="0.5" />
      {/* Drips */}
      <path d="M 8 30 Q 7 35 8 38" stroke={COLORS.wineLight} strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M 16 28 Q 17 33 16 36" stroke={COLORS.wineLight} strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  );
}

// ── WINE GLASS SVG ──
function WineGlass({ filled = true }) {
  return (
    <svg width="40" height="70" viewBox="0 0 40 70">
      <path d="M 8 5 Q 8 30 20 35 Q 32 30 32 5 Z" fill={filled ? COLORS.wine : "none"} stroke={COLORS.wineBright} strokeWidth="1.5" opacity={filled ? 0.8 : 0.4} />
      <line x1="20" y1="35" x2="20" y2="58" stroke={COLORS.creamDim} strokeWidth="1.5" opacity="0.6" />
      <path d="M 10 58 Q 20 62 30 58" fill="none" stroke={COLORS.creamDim} strokeWidth="1.5" opacity="0.6" />
      {filled && <ellipse cx="20" cy="18" rx="8" ry="3" fill={COLORS.wineBright} opacity="0.4" />}
    </svg>
  );
}

// ── GOLF HOLE SVG ──
function GolfScene() {
  return (
    <svg width="100%" viewBox="0 0 500 200" style={{ display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1a0a" />
          <stop offset="100%" stopColor="#1a3a1a" />
        </linearGradient>
        <radialGradient id="holePulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.green} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.green} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="200" fill="url(#sky)" />
      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={20 + i * 23} cy={15 + (i % 5) * 12} r={1 + (i % 3) * 0.5}
          fill={COLORS.green} opacity={0.3 + (i % 4) * 0.15}>
          <animate attributeName="opacity" values={`${0.3 + (i % 4) * 0.15};0.8;${0.3 + (i % 4) * 0.15}`}
            dur={`${1.5 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Rolling hills */}
      <path d="M 0 140 Q 80 100 160 130 Q 240 155 320 120 Q 400 90 500 130 L 500 200 L 0 200 Z" fill={COLORS.fairway} />
      <path d="M 0 155 Q 100 130 200 145 Q 300 160 400 140 Q 450 133 500 145 L 500 200 L 0 200 Z" fill={COLORS.fairwayBright} />
      {/* Green */}
      <ellipse cx="250" cy="168" rx="90" ry="22" fill="#1e4a1e" />
      <ellipse cx="250" cy="165" rx="60" ry="14" fill="#254a25" />
      {/* Hole glow */}
      <ellipse cx="250" cy="165" rx="20" ry="6" fill="url(#holePulse)" />
      <ellipse cx="250" cy="167" rx="6" ry="2.5" fill="#050c05" />
      {/* Flag */}
      <line x1="250" y1="167" x2="250" y2="100" stroke="#888" strokeWidth="2" />
      <polygon points="250,100 278,112 250,124" fill={COLORS.green} opacity="0.9" />
      {/* Ball arc */}
      <path d="M 60 160 Q 140 60 240 148" fill="none" stroke={COLORS.green}
        strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4" />
      {/* Ball */}
      <circle cx="240" cy="148" r="7" fill="#f0f0ee" stroke="#ccc" strokeWidth="1">
        <animateMotion path="M 0 0 Q -60 -60 0 0" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Club silhouette */}
      <line x1="50" y1="168" x2="82" y2="130" stroke={COLORS.amber} strokeWidth="3"
        strokeLinecap="round" opacity="0.7" />
      <rect x="44" y="166" width="14" height="6" rx="2" fill={COLORS.amber} opacity="0.7"
        transform="rotate(-22,51,169)" />
      {/* Scorecard -->*/}
      <rect x="340" y="125" width="100" height="65" rx="4" fill="#0d1a0d" stroke={COLORS.border} strokeWidth="1" />
      <text x="390" y="142" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9" fill={COLORS.dim} letterSpacing="0.1em">TOPGOLF</text>
      <rect x="348" y="148" width="84" height="1" fill={COLORS.border} />
      {[["Bay 1","92 pts"],["Bay 2","118 pts"],["Bay 3","★ 134"]].map(([bay, score], i) => (
        <g key={i}>
          <text x="352" y={162 + i * 13} fontFamily="'JetBrains Mono',monospace" fontSize="8" fill={COLORS.muted}>{bay}</text>
          <text x="434" y={162 + i * 13} fontFamily="'JetBrains Mono',monospace" fontSize="8"
            fill={i === 2 ? COLORS.amber : COLORS.green} textAnchor="end">{score}</text>
        </g>
      ))}
    </svg>
  );
}

// ── NAV ──
function Nav({ active, setActive }) {
  const tabs = ["home","resume","industry","contact"];
  const labels = { home: "~/ home", resume: "tech.resume", industry: "industry.exp", contact: "contact.me" };
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px",
      height: 60,
      background: "rgba(5,10,5,0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        color: COLORS.green,
        letterSpacing: "0.08em",
        animation: "greenPulse 3s ease-in-out infinite",
      }}>
        ajg<span style={{ color: COLORS.muted }}>@portfolio</span><span style={{ color: COLORS.dim }}>:~$</span>
        <span style={{ display: "inline-block", width: 9, height: 16, background: COLORS.green, marginLeft: 4, verticalAlign: "middle", animation: "blink 1.2s infinite" }} />
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActive(tab)} style={{
            background: active === tab ? COLORS.bg3 : "transparent",
            border: active === tab ? `1px solid ${COLORS.borderBright}` : "1px solid transparent",
            borderRadius: 4,
            padding: "6px 16px",
            color: active === tab ? COLORS.green : COLORS.muted,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.06em",
            cursor: "pointer",
            transition: "all 0.2s",
          }}>{labels[tab]}</button>
        ))}
      </div>
    </nav>
  );
}

// ══ HOME PAGE ══
function HomePage() {
  const [booted, setBooted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBooted(true), 200); return () => clearTimeout(t); }, []);

  const bootLines = [
    { prefix: "$ ", text: "whoami", color: COLORS.green },
    { prefix: "", text: "alvin-joseph-garcia", color: COLORS.amber },
    { prefix: "$ ", text: "cat ./profile.json", color: COLORS.green },
    { prefix: "", text: `{`, color: COLORS.muted },
    { prefix: "  ", text: `"role": "Front End Developer · Technical Liaison"`, color: COLORS.text },
    { prefix: "  ", text: `"company": "InvestCloud, Inc — Los Angeles, CA"`, color: COLORS.text },
    { prefix: "  ", text: `"stack": ["React", "Node.js", "JavaScript", "MySQL"]`, color: COLORS.text },
    { prefix: "  ", text: `"also_known_for": ["Sommelier 🍷", "Anaheim Ducks 🏒"]`, color: COLORS.amber },
    { prefix: "  ", text: `"status": "actively seeking new opportunities 🟢"`, color: COLORS.green },
    { prefix: "  ", text: `"goal": "client-facing tech role · great service · great product"`, color: COLORS.amber },
    { prefix: "", text: `}`, color: COLORS.muted },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80, maxWidth: 1100, margin: "0 auto", padding: "100px 48px 80px" }}>
      {/* Hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: 60, alignItems: "start", marginBottom: 80 }}>
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: COLORS.greenDim,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}>// Walnut, CA · Available</div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(52px, 7vw, 88px)",
            lineHeight: 1.0,
            fontWeight: 300,
            color: COLORS.text,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}>
            Alvin<br />
            <em style={{ color: COLORS.muted, fontStyle: "italic" }}>Joseph</em><br />
            Garcia
          </h1>

          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 17,
            color: COLORS.muted,
            maxWidth: 440,
            marginTop: 28,
            lineHeight: 1.8,
            letterSpacing: "0.03em",
          }}>
            Developer who codes like a chef plates —{" "}
            <span style={{ color: COLORS.green }}>precision, presentation, no excuses.</span>{" "}
            Now looking to bring that technical foundation into a client-facing role — where great service and a great product go hand in hand.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
            {[
              { label: "./resume", href: "#resume", primary: true },
              { label: "github.com/bandiddy", href: "https://github.com/bandiddy", primary: false },
              { label: "linkedin", href: "https://linkedin.com/in/alvingarcia", primary: false },
            ].map(btn => (
              <a key={btn.label} href={btn.href} onClick={btn.href.startsWith("#") ? (e) => { e.preventDefault(); } : undefined}
                style={{
                  display: "inline-flex", alignItems: "center",
                  padding: btn.primary ? "10px 24px" : "9px 20px",
                  borderRadius: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  background: btn.primary ? COLORS.green : "transparent",
                  color: btn.primary ? "#050a05" : COLORS.muted,
                  border: btn.primary ? "none" : `1px solid ${COLORS.border}`,
                  fontWeight: btn.primary ? 700 : 400,
                  transition: "all 0.2s",
                }}>
                {btn.label}
              </a>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div style={{ animation: "fadeUp 0.8s ease 0.2s both" }}>
          {booted && (
            <Terminal title="alvin@portfolio: ~/about ~">
              <TypewriterText lines={bootLines} speed={35} />
            </Terminal>
          )}
        </div>
      </div>

      {/* Tech stack bar */}
      <div style={{
        borderTop: `1px solid ${COLORS.border}`,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "28px 0",
        marginBottom: 80,
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          display: "flex", gap: 32, alignItems: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: COLORS.dim,
          letterSpacing: "0.1em",
          flexWrap: "wrap",
        }}>
          {["React.js","Node.js","JavaScript","HTML5","CSS3","MySQL","MongoDB","Firebase","Git","SQL","Power BI","Tableau","Bluebeam","jQuery","Bootstrap","AJAX"].map((tech, i) => (
            <span key={tech} style={{
              color: i % 3 === 0 ? COLORS.green : i % 3 === 1 ? COLORS.amber : COLORS.muted,
              opacity: i < 8 ? 0.9 : 0.45,
              whiteSpace: "nowrap",
            }}>
              {i % 4 === 0 ? <span style={{ color: COLORS.dim }}>{"<"}</span> : null}
              {tech}
              {i % 4 === 0 ? <span style={{ color: COLORS.dim }}>{"/>"}</span> : null}
            </span>
          ))}
        </div>
      </div>

      {/* Skills 2-col code blocks */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: COLORS.dim,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 24,
      }}>// core_capabilities.js</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 80 }}>
        {[
          {
            name: "frontend_dev",
            props: { role: '"UI Engineer"', stack: '["React","Node","JS","CSS"]', env: '"Fintech Production"' },
            color: COLORS.green,
          },
          {
            name: "data_reporting",
            props: { tools: '["SQL","PowerBI","Tableau","Excel"]', scope: '"Financial QA"', precision: '"obsessive"' },
            color: COLORS.amber,
          },
          {
            name: "tech_liaison",
            props: { translates: '"eng → humans"', docs: '["specs","notes","memos"]', compliance: '["SOX","ITGC"]' },
            color: "#a0c8f0",
          },
          {
            name: "infra_knowledge",
            props: { databases: '["MySQL","MongoDB","Firebase"]', devops: '["Git","Heroku"]', bonus: '"Bluebeam Revu"' },
            color: "#c8a0f0",
          },
        ].map(skill => (
          <div key={skill.name} style={{
            background: "#050a05",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: "20px 24px",
            borderLeft: `3px solid ${skill.color}`,
          }}>
            <div style={{ color: "#c792ea", marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: COLORS.muted }}>const </span>
              <span style={{ color: skill.color }}>{skill.name}</span>
              <span style={{ color: COLORS.muted }}> = {"{"}</span>
            </div>
            {Object.entries(skill.props).map(([k, v]) => (
              <div key={k} style={{ marginLeft: 16, marginBottom: 4, fontSize: 12, color: COLORS.text }}>
                <span style={{ color: COLORS.muted }}>{k}</span>
                <span style={{ color: COLORS.dim }}>: </span>
                <span style={{ color: COLORS.green }}>{v}</span>
                <span style={{ color: COLORS.dim }}>,</span>
              </div>
            ))}
            <div style={{ color: COLORS.muted, fontSize: 13 }}>{"}"}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim, letterSpacing: "0.15em", marginBottom: 16 }}>/* about */</div>
          <p style={{ color: COLORS.muted, marginBottom: 16, lineHeight: 1.85, fontSize: 16 }}>
            I'm a <span style={{ color: COLORS.text }}>front-end developer and technical liaison</span> with five years at InvestCloud building production software, translating between engineering teams and the people who depend on their work.
          </p>
          <p style={{ color: COLORS.muted, marginBottom: 16, lineHeight: 1.85, fontSize: 16 }}>
            Now I'm ready to bring that technical foundation into a <span style={{ color: COLORS.text }}>client-facing role</span> — combining what I know about technology with what hospitality taught me about service, presence, and delivering something people actually feel.
          </p>
          <p style={{ color: COLORS.muted, lineHeight: 1.85, fontSize: 16 }}>
            Beyond the screen: <span style={{ color: COLORS.text }}>fine dining and the NHL</span> — proof that technical skill and human connection aren't a trade-off.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            ["Status", "Actively seeking new opportunities 🟢"],
            ["Goal", "Client-facing tech role · great service · great product"],
            ["Background", "Front End Developer · Tech Liaison, InvestCloud (2020–2025)"],
            ["Education", "BA Cultural Anthropology + Asian American Studies, UCSB"],
            ["Also known for", "CMS + WSET Level 2 Sommelier · Anaheim Ducks 🏒"],
          ].map(([label, val]) => (
            <div key={label} style={{ borderLeft: `2px solid ${COLORS.border}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: COLORS.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 15, color: COLORS.text }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══ RESUME PAGE ══
function ResumePage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 48px 80px" }}>
      {/* Header terminal */}
      <Terminal title="alvin@portfolio: ~/resume ~" style={{ marginBottom: 56 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
          <div style={{ color: COLORS.dim, marginBottom: 8 }}>$ cat resume.md</div>
          <div style={{ color: COLORS.amber, fontSize: 20, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, marginBottom: 4 }}>Alvin Joseph Garcia</div>
          <div style={{ color: COLORS.muted, fontSize: 12, letterSpacing: "0.1em" }}>FRONT-END DEVELOPER · TECHNICAL LIAISON · DOCUMENTATION SPECIALIST</div>
          <div style={{ color: COLORS.dim, marginTop: 8, fontSize: 12 }}>
            <span style={{ marginRight: 24 }}>📍 Walnut, CA 91789</span>
            <span style={{ marginRight: 24 }}>📞 (626) 827-0249</span>
            <span>✉ alvinjoseph.garcia@gmail.com</span>
          </div>
        </div>
      </Terminal>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 56, alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ position: "sticky", top: 80 }}>
          <Terminal title="$ skills --list" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
              {[
                ["HTML5/CSS", COLORS.green],
                ["JavaScript", COLORS.green],
                ["React.js", COLORS.green],
                ["Node.js", COLORS.amber],
                ["MySQL", COLORS.amber],
                ["MongoDB", COLORS.amber],
                ["Firebase", COLORS.muted],
                ["Git/Heroku", COLORS.muted],
                ["SQL", COLORS.muted],
                ["Power BI", COLORS.muted],
                ["Tableau", COLORS.muted],
                ["Bluebeam", COLORS.dim],
              ].map(([skill, color]) => (
                <div key={skill} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: COLORS.muted }}>
                  <span style={{ color }}>&gt; {skill}</span>
                  <span style={{ color: COLORS.dim }}>✓</span>
                </div>
              ))}
            </div>
          </Terminal>

          {/* Competencies */}
          <div style={{ background: "#050a05", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "16px 20px" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: COLORS.dim, letterSpacing: "0.15em", marginBottom: 14 }}>// COMPETENCIES</div>
            {["Data Validation","Report Config","Doc QA","SOX/ITGC","Audit Support","Tech Liaison","Cross-functional Coord"].map(c => (
              <div key={c} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.muted, marginBottom: 8, paddingLeft: 12, borderLeft: `1px solid ${COLORS.border}` }}>
                <span style={{ color: COLORS.green }}>→</span> {c}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div>
          {/* Experience */}
          <section style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim, letterSpacing: "0.15em", marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${COLORS.border}` }}>
              // EXPERIENCE
            </div>

            {/* InvestCloud */}
            <div style={{ marginBottom: 48, padding: "28px", background: "#050a05", border: `1px solid ${COLORS.border}`, borderRadius: 8, borderLeft: `3px solid ${COLORS.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, letterSpacing: "0.03em", fontFamily: "'Rajdhani',sans-serif" }}>Front End Developer · Technical Liaison</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: COLORS.muted, marginTop: 4 }}>InvestCloud, Inc — Los Angeles, CA</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim, whiteSpace: "nowrap", paddingTop: 4 }}>Jan 2020 – Jun 2025</div>
              </div>
              {/* Mini terminal inside */}
              <div style={{ background: "#030803", borderRadius: 4, padding: "12px 16px", marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim, marginBottom: 8 }}>$ git log --oneline --author="alvin"</div>
                {[
                  ["a1f3c2d", "feat: built production React interfaces serving live fintech users"],
                  ["b2e4d1a", "docs: owned full documentation layer — specs, release notes, QA"],
                  ["c3f5e2b", "chore: translated complex eng concepts for non-developer stakeholders"],
                  ["d4a6f3c", "fix: caught versioning + reference errors others consistently missed"],
                ].map(([hash, msg]) => (
                  <div key={hash} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, marginBottom: 4, display: "flex", gap: 12 }}>
                    <span style={{ color: COLORS.amber, flexShrink: 0 }}>{hash}</span>
                    <span style={{ color: COLORS.muted }}>{msg}</span>
                  </div>
                ))}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Built and maintained client-facing front-end interfaces in a live fintech environment — production-grade React, JavaScript, and Node.js that real users depended on daily.",
                  "Owned the documentation layer end-to-end: release notes, tech specs, QA — catching the kind of errors only a developer knows to look for.",
                  "Served as the human translation layer between engineering and everyone else — breaking down complex technical concepts without losing either audience.",
                  "Applied a developer's instinct to documentation precision — a misplaced reference in a spec causes the same downstream chaos as a missing semicolon in code.",
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: 14, color: COLORS.muted, paddingLeft: 20, position: "relative", lineHeight: 1.7 }}>
                    <span style={{ position: "absolute", left: 0, color: COLORS.green, fontFamily: "'JetBrains Mono',monospace" }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lendisty */}
            <div style={{ padding: "28px", background: "#050a05", border: `1px solid ${COLORS.border}`, borderRadius: 8, borderLeft: `3px solid ${COLORS.amber}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, letterSpacing: "0.03em", fontFamily: "'Rajdhani',sans-serif" }}>Front-End Web Design · Marketing Intern</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Lendisty, LLC — Brea, CA</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim, whiteSpace: "nowrap", paddingTop: 4 }}>Mar 2017 – Aug 2017</div>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Jumped into a scrappy startup — touching digital assets, engineering correspondence, and everything in between.",
                  "Built and QA'd large digital delivery packages from scratch — polished and client-ready every time.",
                  "Kept multiple team leads organized and on schedule — the behind-the-scenes work that makes everything look effortless.",
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: 14, color: COLORS.muted, paddingLeft: 20, position: "relative", lineHeight: 1.7 }}>
                    <span style={{ position: "absolute", left: 0, color: COLORS.amber, fontFamily: "'JetBrains Mono',monospace" }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Education */}
          <section>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim, letterSpacing: "0.15em", marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${COLORS.border}` }}>
              // EDUCATION
            </div>
            {[
              ["MERN Full-Stack Development", "University of California, Irvine", "Feb 2019"],
              ["Computer Information Systems", "Fullerton College", "May 2018"],
              ["BA Asian American Studies · BA Cultural Anthropology", "University of California, Santa Barbara", "Jun 2009"],
            ].map(([degree, school, date]) => (
              <div key={degree} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.text, fontFamily: "'Rajdhani',sans-serif" }}>{degree}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: COLORS.muted, marginTop: 3 }}>{school}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim, whiteSpace: "nowrap" }}>{date}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

// ══ INDUSTRY PAGE ══
function IndustryPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, #080c08 0%, #0f080a 40%, #110608 100%)`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 48px 80px" }}>

        {/* Header — wine bar atmosphere */}
        <div style={{ textAlign: "center", marginBottom: 80, position: "relative" }}>
          {/* Candles */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginBottom: 32 }}>
            <Candle height={50} />
            <Candle height={70} />
            <Candle height={45} />
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: COLORS.amberDim, marginBottom: 16 }}>
            — Beyond the Screen —
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 300, color: COLORS.cream, marginBottom: 20, letterSpacing: "-0.01em" }}>
            Industry <em style={{ color: COLORS.wineLight }}>Experience</em>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: COLORS.creamDim, maxWidth: 600, margin: "0 auto", lineHeight: 1.8, fontStyle: "italic" }}>
            "Years spent in fine dining and hospitality sharpened skills no bootcamp teaches — reading a room, staying composed under pressure, and delivering at a standard that guests can feel."
          </p>
        </div>

        {/* Credential cards */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 72, flexWrap: "wrap" }}>
          {[
            { label: "CMS", sub: "Court of Master Sommeliers", detail: "Level 1 — Introductory" },
            { label: "WSET", sub: "Wine & Spirit Education Trust", detail: "Level 2 Award in Wines" },
            { label: "FOH", sub: "Front of House Experience", detail: "Fine dining · Sommelier · Host" },
            { label: "⛳", sub: "Topgolf Opening Crew", detail: "Montebello, CA · Mar 2024" },
          ].map(c => (
            <div key={c.label} style={{
              background: `linear-gradient(135deg, #1a0810, #0f050a)`,
              border: `1px solid ${COLORS.wine}40`,
              borderRadius: 8,
              padding: "20px 24px",
              textAlign: "center",
              minWidth: 160,
              boxShadow: `0 4px 24px ${COLORS.wine}20`,
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: COLORS.gold, marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: COLORS.wineLight, letterSpacing: "0.08em", marginBottom: 4, fontFamily: "'Rajdhani',sans-serif" }}>{c.sub}</div>
              <div style={{ fontSize: 11, color: COLORS.amberDim, fontFamily: "'JetBrains Mono',monospace" }}>{c.detail}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          {[
            {
              date: "Mar 2024 – Present",
              company: "Topgolf",
              location: "Montebello, CA",
              title: "Bay Host",
              color: COLORS.green,
              bullets: [
                "Joined the opening crew — helping write the playbook for service culture at a brand-new venue before the first tee shot was ever taken.",
                "Brought fine dining sensibilities into an entertainment venue: reading the bay, anticipating needs, delivering food and beverage with the timing of a seasoned service professional — just with more fist pumps.",
                "Guide first-time players through the Topgolf technology with genuine enthusiasm — when guests understand the game, they stay longer and come back.",
                "Channeled a real love of golf into the work — learning the game properly, using every perk available, and making that passion tangible in every guest interaction.",
              ],
            },
            {
              date: "Dec 2021 – Present",
              company: "Club Level Wine Cellar — Honda Center",
              location: "Anaheim, CA · Sommelier for the Anaheim Ducks",
              title: "Sommelier",
              color: COLORS.wineLight,
              bullets: [
                "Serve as the in-house Sommelier for Club Level at the Honda Center — home of the Anaheim Ducks — curating and executing the wine program for one of the premier sports and entertainment venues in Southern California.",
                "Became the resident wine authority for a high-volume, high-profile environment where the crowd can go from 0 to sold-out in a period break — and the wine service never skips a beat.",
                "Built genuine connections with guests across all walks of life — suite holders, season ticket members, and first-timers — bringing the same fine dining warmth to a live sports setting.",
                "Navigated multiple POS systems and high-volume cash and card transactions nightly without breaking a sweat or a smile.",
              ],
            },
            {
              date: "May 2011 – Dec 2019",
              company: "Carthay Circle Restaurant",
              location: "Disneyland Resort",
              title: "Sommelier · Server · Host · Busser",
              color: COLORS.gold,
              bullets: [
                "Spent nearly a decade in one of Southern California's most demanding fine dining rooms — and somehow kept getting better every year.",
                "Guided guests through menus with genuine enthusiasm — turning a dinner decision into a story and a one-time visitor into a return reservation.",
                "Partnered daily with the chef and management to craft seasonal pairings and beverage programs that actually made sense together.",
                "Handled guest concerns with grace under scrutiny of one of the world's most recognizable brands — never compromising the four-star standard.",
                "Worked every position in the room — host, busser, server, sommelier — which means I understand the full operation, not just my corner of it.",
              ],
            },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 48,
              padding: "40px 0",
              borderTop: `1px solid ${COLORS.wine}30`,
            }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.amberDim, marginBottom: 8 }}>{item.date}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: COLORS.creamDim, marginBottom: 4 }}>{item.company}</div>
                {item.location && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: COLORS.dim }}>{item.location}</div>}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: item.color, marginBottom: 20 }}>{item.title}</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {item.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: 15, color: COLORS.creamDim, paddingLeft: 24, position: "relative", lineHeight: 1.75, opacity: 0.85 }}>
                      <span style={{ position: "absolute", left: 0, color: item.color, fontFamily: "'Cormorant Garamond',serif", fontSize: 20, lineHeight: 1 }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div style={{
          borderTop: `1px solid ${COLORS.wine}30`,
          paddingTop: 48,
          marginTop: 16,
          textAlign: "center",
        }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 28 }}>
            <WineGlass filled={true} />
            <WineGlass filled={false} />
            <WineGlass filled={true} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", color: COLORS.creamDim, maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            "Precision and presence aren't opposites. Whether tracking a software release or reading a hitting bay, the standard is the same: know the product deeply, read the room, and deliver without excuses."
          </p>
        </div>
      </div>
    </div>
  );
}

// ══ CONTACT PAGE ══
function ContactPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 48px 80px" }}>
      <Terminal title="alvin@portfolio: ~/contact ~" style={{ marginBottom: 56, maxWidth: 600 }}>
        <TypewriterText
          speed={30}
          lines={[
            { prefix: "$ ", text: "send --message --to=alvin", color: COLORS.green },
            { prefix: "", text: "Opening communication channels...", color: COLORS.muted },
            { prefix: "", text: "✓ email ready", color: COLORS.green },
            { prefix: "", text: "✓ linkedin connected", color: COLORS.green },
            { prefix: "", text: "✓ github accessible", color: COLORS.green },
            { prefix: "", text: "✓ phone available", color: COLORS.green },
            { prefix: "", text: "Ready. Looking forward to connecting.", color: COLORS.amber },
          ]}
        />
      </Terminal>

      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, color: COLORS.text, marginBottom: 16, letterSpacing: "-0.01em" }}>
        Let's <em style={{ color: COLORS.wineLight }}>Connect</em>
      </div>
      <p style={{ fontSize: 16, color: COLORS.muted, maxWidth: 480, marginBottom: 56, lineHeight: 1.8 }}>
        Open to conversations about technical project coordination, front-end development, and hybrid tech/ops roles.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 600, marginBottom: 80 }}>
        {[
          { icon: "✉", label: "Email", value: "alvinjoseph.garcia@gmail.com", href: "mailto:alvinjoseph.garcia@gmail.com", color: COLORS.green },
          { icon: "☎", label: "Phone", value: "(626) 827-0249", href: "tel:6268270249", color: COLORS.amber },
          { icon: "in", label: "LinkedIn", value: "/in/alvingarcia", href: "https://linkedin.com/in/alvingarcia", color: COLORS.accent2 },
          { icon: "⌥", label: "GitHub", value: "github.com/bandiddy", href: "https://github.com/bandiddy", color: COLORS.muted },
        ].map(c => (
          <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "20px 24px",
              background: "#050a05",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              textDecoration: "none",
              color: COLORS.muted,
              fontSize: 14,
              transition: "all 0.2s",
              borderLeft: `3px solid ${c.color}40`,
            }}>
            <span style={{ fontSize: 20, color: c.color }}>{c.icon}</span>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: COLORS.dim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{c.label}</div>
              <div style={{ color: COLORS.text, fontSize: 13 }}>{c.value}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ══ APP ══
export default function App() {
  const [active, setActive] = useState("home");

  const pages = { home: <HomePage />, resume: <ResumePage />, industry: <IndustryPage />, contact: <ContactPage /> };

  return (
    <>
      <style>{STYLES}</style>
      <Nav active={active} setActive={setActive} />
      <main style={{ transition: "opacity 0.2s" }}>
        {pages[active]}
      </main>
      <footer style={{
        borderTop: `1px solid ${COLORS.border}`,
        padding: "24px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim }}>© 2026 Alvin Joseph Garcia</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.dim }}>Walnut, CA 91789</span>
      </footer>
    </>
  );
}
