import { useEffect, useRef, useState, useCallback } from "react";

// ── Hook: in-view ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Hook: cursor position ─────────────────────────────────────────────────────
function useCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return pos;
}

// ── Hook: scroll progress ─────────────────────────────────────────────────────
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setProgress((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

// ── Reveal wrapper ─────────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  dir = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const { ref, visible } = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.92)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[dir],
        transition: `opacity 0.75s cubic-bezier(.4,0,.2,1) ${delay}s, transform 0.75s cubic-bezier(.4,0,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const NAV = ["Work", "About", "Skills", "Contact"];

const SKILLS = [
  {
    cat: "Backend",
    icon: "⚙️",
    items: [
      "FastAPI",
      "REST APIs",
      "JWT / OAuth2",
      "Docker",
      "MCP",
      "Supabase",
    ],
    accent: "#f472b6",
  },
  {
    cat: "AI / LLM",
    icon: "🧠",
    items: [
      "LangChain",
      "LangGraph",
      "LangSmith",
      "RAG",
      "Vector DBs",
      "NLP",
      "FAISS",
      "Qdrant",
    ],
    accent: "#a78bfa",
  },
  {
    cat: "Data",
    icon: "📊",
    items: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Scikit-learn",
      "LSTM",
      "TensorFlow",
      "EDA",
    ],
    accent: "#fb923c",
  },
  {
    cat: "Languages",
    icon: "💬",
    items: ["Python", "SQL", "C", "C++"],
    accent: "#34d399",
  },
  {
    cat: "Automation",
    icon: "⚡",
    items: [
      "n8n",
      "AI Workflow Automation",
      "API Integrations",
      "Webhook Pipelines",
    ],
    accent: "#f59e0b",
  },
  {
    cat: "Tools",
    icon: "🛠️",
    items: [
      "Git / GitHub",
      "Vercel",
      "OpenAI API",
      "Streamlit",
      "React",
      "Jupyter",
      "Docker",
    ],
    accent: "#60a5fa",
  },
  {
    cat: "Databases",
    icon: "🗄️",
    items: ["MongoDB", "PostgreSQL", "SQLite", "Supabase"],
    accent: "#f87171",
  },
];

const PROJECTS = [
  {
    id: "n8n",
    num: "01",
    title: "GitHub → LinkedIn Automation",
    subtitle: "n8n AI Workflow Pipeline",
    tag: "n8n · Automation · Latest",
    color: "#f59e0b",
    bg: "from-amber-950 to-orange-900",
    emoji: "⚡",
    metric: "Zero-touch LinkedIn posts",
    desc: "Fully automated n8n workflow that watches GitHub activity (pushes, PRs, releases) and auto-generates polished LinkedIn posts using AI — turning code commits into developer brand content with zero manual effort.",
    stack: ["n8n", "GitHub API", "LinkedIn API", "AI/LLM", "Webhooks"],
    github: "https://github.com/DwitiThaker/github-to-linkedin-n8n",
    size: "large",
    isNew: true,
  },
  {
    id: "rag",
    num: "02",
    title: "Hybrid RAG System",
    subtitle: "Retrieval-Augmented Generation Pipeline",
    tag: "AI / LLM",
    color: "#a78bfa",
    bg: "from-violet-950 to-purple-900",
    emoji: "🧠",
    metric: "+32% precision",
    desc: "Production-ready hybrid RAG pipeline using BM25 + dense embeddings across 24K+ documents. Reduced query latency by ~30–40% with chunk-based indexing, score normalisation, and hybrid rank fusion.",
    stack: ["LangChain", "Qdrant", "MongoDB", "Python", "BM25"],
    github: "https://github.com/DwitiThaker/RAG_for_DB",
    size: "large",
  },
  {
    id: "cal",
    num: "03",
    title: "Google Calendar MCP",
    subtitle: "Async Scheduling Backend",
    tag: "MCP · FastAPI",
    color: "#f472b6",
    bg: "from-pink-950 to-rose-900",
    emoji: "📅",
    metric: "7 conflicts auto-resolved/wk",
    desc: "Async MCP-based scheduling backend integrating Google Calendar + Supabase. Reduces avg booking time by 10 min/session with fault-tolerant conflict resolution.",
    stack: ["FastAPI", "FastMCP", "Supabase", "Google Calendar API"],
    github: "https://github.com/DwitiThaker/calendar-mcp",
    size: "small",
  },
  {
    id: "reflexion",
    num: "04",
    title: "Reflexion AI Agent",
    subtitle: "Self-Improving Agentic Workflow",
    tag: "LangGraph",
    color: "#818cf8",
    bg: "from-indigo-950 to-violet-900",
    emoji: "🔄",
    metric: "−7s vs baseline",
    desc: "Self-improving AI agent using Reflexion architecture (LangChain + LangGraph) with iterative self-evaluation loops. Feedback-driven reasoning suitable for Copilot-style agents.",
    stack: ["LangChain", "LangGraph", "Python"],
    github: "https://github.com/DwitiThaker/reflexionAgent",
    size: "small",
  },
  {
    id: "github",
    num: "05",
    title: "GitHub MCP Server",
    subtitle: "AI ↔ GitHub Integration",
    tag: "MCP · Early Adopter",
    color: "#34d399",
    bg: "from-emerald-950 to-teal-900",
    emoji: "🔧",
    metric: "Full GitHub API coverage",
    desc: "One of the early MCP implementations enabling AI assistants to search code, create issues, manage PRs, and analyse repositories via Anthropic's new standard.",
    stack: ["Python", "MCP", "GitHub API", "Async"],
    github: "https://github.com/DwitiThaker/github-mcp",
    demo: "https://ask-your-repo.streamlit.app/",
    size: "small",
  },
  {
    id: "hospital",
    num: "06",
    title: "Hospital Management System",
    subtitle: "Role-Based Backend API",
    tag: "FastAPI · MongoDB",
    color: "#f87171",
    bg: "from-rose-950 to-red-900",
    emoji: "🏥",
    metric: "Full RBAC",
    desc: "Comprehensive role-based backend for doctors, nurses, prescriptions, and inventory with secure auth, validation workflows, and CRUD operations.",
    stack: ["FastAPI", "MongoDB", "JWT", "RBAC"],
    github: "https://github.com/DwitiThaker/Hospital-Management",
    size: "small",
  },
  {
    id: "anon",
    num: "07",
    title: "Anonymous Feedback System",
    subtitle: "Production FastAPI Service",
    tag: "Production",
    color: "#fb923c",
    bg: "from-orange-950 to-amber-900",
    emoji: "📝",
    metric: "+25% submission rate",
    desc: "Secure anonymous feedback APIs using FastAPI + MongoDB with schema validation and idempotent request handling. Deployed via Vercel + GitHub Actions.",
    stack: ["FastAPI", "MongoDB", "OAuth2", "Vercel"],
    github: "https://github.com/DwitiThaker/AnnonymousForm",
    demo: "https://feedback-form-zeta-gray.vercel.app/",
    size: "small",
  },
  {
    id: "stock",
    num: "08",
    title: "Stock Price Prediction",
    subtitle: "Hybrid LSTM Forecasting Model",
    tag: "ML · Deep Learning",
    color: "#60a5fa",
    bg: "from-blue-950 to-sky-900",
    emoji: "📈",
    metric: "LSTM + Regression fusion",
    desc: "Hybrid forecasting model combining LSTM neural networks, Linear Regression, and Rolling Mean for accurate stock price predictions and trend analysis.",
    stack: ["LSTM", "TensorFlow", "Scikit-learn", "Python"],
    github:
      "https://github.com/DwitiThaker/ds_portfolio/tree/main/Stock_price_prediction",
    size: "small",
  },
  {
    id: "toxic",
    num: "09",
    title: "Toxic Comment Classifier",
    subtitle: "Multi-model NLP Pipeline",
    tag: "NLP",
    color: "#f472b6",
    bg: "from-pink-950 to-fuchsia-900",
    emoji: "💬",
    metric: "NB + SVM + LR ensemble",
    desc: "Multi-label toxic comment detection using Naive Bayes, SVM, and Logistic Regression with comprehensive text preprocessing and feature engineering.",
    stack: ["NLP", "Scikit-learn", "Python", "TF-IDF"],
    github:
      "https://github.com/DwitiThaker/Collaborative-ml-workspace/tree/main/toxic-comment-classifier",
    size: "small",
  },
  {
    id: "yt",
    num: "10",
    title: "YouTube AI Assistant",
    subtitle: "Video Intelligence Tool",
    tag: "AI Agents",
    color: "#a78bfa",
    bg: "from-violet-950 to-fuchsia-900",
    emoji: "🎥",
    metric: "Smart Q&A on any video",
    desc: "AI-powered tool that analyses YouTube videos, extracts key insights, and answers questions using advanced NLP and retrieval techniques.",
    stack: ["LangChain", "NLP", "Streamlit", "Python"],
    github: "https://github.com/DwitiThaker/YoutubeAssistant",
    size: "small",
  },
  {
    id: "roadmap",
    num: "11",
    title: "Roadmap Generator",
    subtitle: "RAG-Powered Career Navigator",
    tag: "RAG",
    color: "#34d399",
    bg: "from-emerald-950 to-green-900",
    emoji: "🗺️",
    metric: "FAISS + personalised paths",
    desc: "AI career navigator using FAISS embeddings and RAG to provide personalised learning paths and guidance based on individual goals.",
    stack: ["RAG", "FAISS", "LangChain", "Python"],
    github: "https://github.com/DwitiThaker/roadmap-generator-app",
    size: "small",
  },
];

// ── Cursor blob ───────────────────────────────────────────────────────────────
function CursorBlob() {
  const pos = useCursor();
  return (
    <div
      className="pointer-events-none fixed z-0 rounded-full"
      style={{
        width: 420,
        height: 420,
        left: pos.x - 210,
        top: pos.y - 210,
        background:
          "radial-gradient(circle, rgba(244,114,182,0.08) 0%, rgba(167,139,250,0.05) 40%, transparent 70%)",
        transition: "left 0.18s ease, top 0.18s ease",
      }}
    />
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-white/10 py-4 my-16">
      <div className="inline-flex animate-marquee gap-12">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-sm font-semibold tracking-widest uppercase text-white/40"
          >
            {item} <span className="text-pink-400 mx-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ p, index }: { p: (typeof PROJECTS)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isLarge = p.size === "large";

  return (
    <Reveal
      delay={index * 0.07}
      dir="up"
      className={
        isLarge ? "col-span-2 md:col-span-2" : "col-span-2 md:col-span-1"
      }
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${p.bg} p-6 md:p-8 h-full min-h-[260px] group cursor-default transition-all duration-500`}
        style={{
          boxShadow: hovered
            ? `0 0 60px ${p.color}30, 0 20px 60px rgba(0,0,0,0.5)`
            : "0 4px 24px rgba(0,0,0,0.4)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* glow orb */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl transition-opacity duration-500"
          style={{ background: p.color + "20", opacity: hovered ? 1 : 0.4 }}
        />

        {/* number */}
        <div
          className="absolute top-5 right-6 font-mono text-xs tracking-widest"
          style={{ color: p.color + "60" }}
        >
          {p.num}
        </div>

        {/* NEW badge */}
        {p.isNew && (
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase z-10"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              color: "white",
              boxShadow: "0 0 18px rgba(245,158,11,0.6)",
              animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          >
            <span style={{ fontSize: "8px" }}>●</span> Latest
          </div>
        )}

        {/* tag pill */}
        <div
          className={`mb-4 inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${p.isNew ? "mt-8" : ""}`}
          style={{
            color: p.color,
            borderColor: p.color + "40",
            background: p.color + "15",
          }}
        >
          {p.tag}
        </div>

        <div className="flex items-start gap-4 mb-3">
          <div className="text-3xl">{p.emoji}</div>
          <div>
            <h3
              className="text-white font-bold text-xl md:text-2xl leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {p.title}
            </h3>
            <p className="text-white/40 text-sm mt-0.5">{p.subtitle}</p>
          </div>
        </div>

        {/* metric chip */}
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10">
          <span style={{ color: p.color }}>▲</span>
          <span className="text-white/80">{p.metric}</span>
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-xl">
          {p.desc}
        </p>

        {/* stack */}
        <div className="flex flex-wrap gap-2 mb-5">
          {p.stack.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 rounded-md bg-white/8 text-white/60 border border-white/10"
            >
              {s}
            </span>
          ))}
        </div>

        {/* links */}
        <div className="flex gap-3">
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 border"
            style={{
              color: p.color,
              borderColor: p.color + "40",
              background: hovered ? p.color + "20" : p.color + "10",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-white/10 text-white/70 border border-white/10 hover:bg-white/15 transition-all duration-300"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const progress = useScrollProgress();
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Work");
  const [copied, setCopied] = useState(false);

  // Active section detection
  useEffect(() => {
    const ids = ["work", "about", "skills", "contact"];
    const labels = ["Work", "About", "Skills", "Contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf(e.target.id);
            if (idx !== -1) setActiveSection(labels[idx]);
          }
        });
      },
      { threshold: 0.4 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("dwiti.thaker04@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const marqueeItems = [
    "FastAPI",
    "LangChain",
    "RAG",
    "LangGraph",
    "MCP",
    "Python",
    "MongoDB",
    "Vector DBs",
    "AI Agents",
    "n8n",
    "FastMCP",
    "Qdrant",
    "Supabase",
    "Automation",
    "Webhooks",
    "GitHub API",
    "LinkedIn API",
    "AI Workflows",
  ];

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        background: "#0a0a0f",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* cursor blob */}
      <CursorBlob />

      {/* scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-50 transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa)",
        }}
      />

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <nav className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          {/* logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-bold tracking-tight text-white/90 text-lg hover:text-white transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            dt<span style={{ color: "#f472b6" }}>.</span>
          </button>

          {/* desktop nav */}
          <div className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            {NAV.map((n) => (
              <button
                key={n}
                onClick={() => scrollTo(n)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  color:
                    activeSection === n ? "#0a0a0f" : "rgba(255,255,255,0.6)",
                  background: activeSection === n ? "#f472b6" : "transparent",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {/* resume btn */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/Resume_DwitiThaker.pdf"
              download="Resume_DwitiThaker.pdf"
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border border-white/20 hover:border-pink-400/60 hover:bg-pink-400/10 text-white/80 hover:text-pink-300"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Resume ↓
            </a>
          </div>

          {/* mobile burger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span
              className={`block w-5 h-0.5 bg-white/80 transition-all duration-300 ${navOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-white/80 transition-all duration-300 ${navOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-white/80 transition-all duration-300 ${navOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </nav>

        {/* mobile menu */}
        {navOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n}
                onClick={() => scrollTo(n)}
                className="text-left px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all font-medium"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 max-w-7xl mx-auto relative">
        {/* decorative grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        {/* floating badge */}
        <Reveal delay={0} dir="up">
          <div className="mb-8 inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-pink-400/30 bg-pink-400/8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-sm text-pink-300 font-medium tracking-wide">
              Open to opportunities · Class of 2026
            </span>
          </div>
        </Reveal>

        {/* headline */}
        <Reveal delay={0.1} dir="up">
          <h1
            className="text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.95] tracking-tight mb-6"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="block text-white/90">Dwiti</span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Thaker
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.2} dir="up">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <div className="max-w-md">
              <p className="text-white/50 text-lg leading-relaxed">
                Backend & AI Engineer building{" "}
                <em style={{ color: "#f472b6", fontStyle: "normal" }}>
                  intelligent systems
                </em>{" "}
                — RAG pipelines, agentic workflows & scalable APIs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:ml-auto">
              {[
                { label: "B.Tech IT", detail: "CGPA 9.34" },
                { label: "Intern", detail: "Third Rock Techno" },
                { label: "10+", detail: "Projects" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="px-4 py-3 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm text-center"
                >
                  <div
                    className="text-white font-bold text-sm"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {b.label}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">{b.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3} dir="up">
          <div className="mt-12 flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("work")}
              className="px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #f472b6, #a78bfa)",
                color: "white",
                boxShadow: "0 8px 32px rgba(244,114,182,0.35)",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              View my work ↓
            </button>
            <button
              onClick={copyEmail}
              className="px-8 py-4 rounded-2xl font-semibold text-sm border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all duration-300 hover:bg-white/5 backdrop-blur-sm"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {copied ? "✓ Copied!" : "dwiti.thaker04@gmail.com"}
            </button>
          </div>
        </Reveal>

        {/* scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs tracking-widest uppercase">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* ── WORK / PROJECTS ──────────────────────────────────────────────── */}
      <section id="work" className="px-6 py-20 max-w-7xl mx-auto">
        <Reveal dir="left">
          <div className="flex items-baseline gap-4 mb-3">
            <span className="text-xs font-mono text-pink-400 tracking-widest">
              02
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Selected Work
            </h2>
          </div>
          <p className="text-white/40 text-base ml-10 mb-12 max-w-lg">
            AI-powered backends, agentic systems, and production APIs — built to
            solve real problems.
          </p>
        </Reveal>

        {/* bento grid */}
        <div className="grid grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* left: text */}
          <div>
            <Reveal dir="left">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-xs font-mono text-pink-400 tracking-widest">
                  03
                </span>
                <h2
                  className="text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  About
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1} dir="left">
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                I'm a final-year B.Tech IT student at Indus University (CGPA
                9.34) and a Python Backend & AI Intern at{" "}
                <span className="text-white/90 font-medium">
                  Third Rock Techno
                </span>
                .
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                I build production-grade REST APIs with FastAPI, design RAG
                pipelines that actually scale, and experiment with agentic
                frameworks like LangGraph and MCP — early when it matters.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                When I'm not pushing code, I'm reading research papers, tweaking
                AI prompts, or writing guides that help other developers skip
                the painful parts.
              </p>
            </Reveal>

            <Reveal delay={0.2} dir="left">
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "🎓 B.Tech IT",
                  "📍 Ahmedabad",
                  "🚀 Early MCP Adopter",
                  "✨ CGPA 9.34",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-xl text-sm border border-white/10 text-white/60 bg-white/4"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* right: experience card + cert */}
          <div className="flex flex-col gap-4">
            <Reveal delay={0.1} dir="right">
              <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-pink-950/60 to-violet-950/60 p-7 backdrop-blur-sm">
                {/* company header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-pink-400 font-semibold tracking-widest uppercase mb-1">
                      Experience
                    </div>
                    <h3
                      className="text-white font-bold text-xl"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Python Backend & AI Intern
                    </h3>
                    <p className="text-white/50 text-sm mt-0.5">
                      Third Rock Techno
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-pink-400/15 border border-pink-400/30 text-pink-300 text-xs font-semibold">
                    Aug 2024 – Present
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      metric: "+20%",
                      text: "API reliability through validation, logging & monitoring middleware",
                    },
                    {
                      metric: "−40%",
                      text: "Email verification failures resolved in production",
                    },
                    {
                      metric: "99.9%",
                      text: "System uptime maintained across production services",
                    },
                    {
                      metric: "Multi-project",
                      text: "FastAPI + MongoDB + LangChain across client deliverables",
                    },
                  ].map((item) => (
                    <div
                      key={item.metric}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/6"
                    >
                      <span className="text-pink-400 font-bold text-sm shrink-0 mt-0.5 min-w-[64px]">
                        {item.metric}
                      </span>
                      <span className="text-white/55 text-sm leading-snug">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* cert */}
            <Reveal delay={0.2} dir="right">
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/6 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-xl shrink-0">
                  🏆
                </div>
                <div>
                  <div className="text-white/90 font-semibold text-sm">
                    AI Programming with Python
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">
                    Udacity Certification
                  </div>
                </div>
                <div className="ml-auto px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  Certified
                </div>
              </div>
            </Reveal>

            {/* currently exploring */}
            <Reveal delay={0.3} dir="right">
              <div className="rounded-2xl border border-violet-400/20 bg-violet-400/6 p-5">
                <div className="text-xs text-violet-400 font-semibold tracking-widest uppercase mb-3">
                  Currently Exploring
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "LangGraph Workflows",
                    "Vector DB Optimisation",
                    "n8n Automation",
                    "MCP Ecosystem",
                  ].map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-lg bg-violet-400/10 border border-violet-400/20 text-violet-300 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────────────────── */}
      <section id="skills" className="px-6 py-20 max-w-7xl mx-auto">
        <Reveal dir="left">
          <div className="flex items-baseline gap-4 mb-3">
            <span className="text-xs font-mono text-pink-400 tracking-widest">
              04
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Skills
            </h2>
          </div>
          <p className="text-white/40 ml-10 mb-12">
            The stack I reach for every day.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map((s, i) => (
            <Reveal key={s.cat} delay={i * 0.07} dir="up">
              <div
                className="rounded-2xl border border-white/8 bg-white/3 p-6 h-full hover:bg-white/5 transition-all duration-300 group"
                style={{ "--accent": s.accent } as React.CSSProperties}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{
                      background: s.accent + "20",
                      border: `1px solid ${s.accent}30`,
                    }}
                  >
                    {s.icon}
                  </div>
                  <h3
                    className="text-white font-bold text-base"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      color: s.accent,
                    }}
                  >
                    {s.cat}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/8 text-white/60 bg-white/4 hover:text-white/90 transition-colors duration-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="px-6 py-20 max-w-7xl mx-auto">
        <Reveal dir="up">
          <div
            className="rounded-3xl border border-white/8 overflow-hidden relative"
            style={{
              background:
                "linear-gradient(135deg, #1a0a1a 0%, #0f0a1f 50%, #0a0f1a 100%)",
            }}
          >
            {/* bg decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, #f472b6, transparent 70%)",
                }}
              />
              <div
                className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
                style={{
                  background:
                    "radial-gradient(circle, #a78bfa, transparent 70%)",
                }}
              />
            </div>

            <div className="relative p-12 md:p-20 text-center">
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/40 text-xs tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Available for opportunities
              </div>

              <h2
                className="text-5xl md:text-7xl font-bold mb-6 text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Let's build
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  something real.
                </span>
              </h2>

              <p className="text-white/40 text-lg max-w-md mx-auto mb-10">
                I'm always open to discussing AI projects, backend challenges,
                or just geeking out over LangGraph.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={copyEmail}
                  className="px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #f472b6, #a78bfa)",
                    color: "white",
                    boxShadow: "0 8px 32px rgba(244,114,182,0.35)",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {copied ? "Copied! ✓" : "Copy Email"}
                </button>

                <a
                  href="https://github.com/DwitiThaker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl font-semibold text-sm border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all duration-300 hover:bg-white/5 flex items-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>

                <a
                  href="https://www.linkedin.com/in/dwiti-thaker-a36358236/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl font-semibold text-sm border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all duration-300 hover:bg-white/5 flex items-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>

              {/* phone / location row */}
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/30 text-sm">
                <span>📞 +91 94287 02433</span>
                <span>📍 Ahmedabad, India</span>
                <a
                  href="mailto:dwiti.thaker04@gmail.com"
                  className="hover:text-white/60 transition-colors"
                >
                  ✉️ dwiti.thaker04@gmail.com
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 py-10 max-w-7xl mx-auto border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white/25 text-sm">© 2026 Dwiti Thaker</span>
        <span className="text-white/20 text-xs font-mono">
          Built with React · Vite · Tailwind
        </span>
        <div className="flex gap-4">
          {[
            { href: "https://github.com/DwitiThaker", label: "GH" },
            {
              href: "https://www.linkedin.com/in/dwiti-thaker-a36358236/",
              label: "LI",
            },
            { href: "mailto:dwiti.thaker04@gmail.com", label: "EM" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white/60 text-xs font-mono transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
