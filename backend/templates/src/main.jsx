import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowUpRight, Github, Instagram, Linkedin, Menu, X,
  Sun, Moon, Sparkles, Code2
} from "lucide-react";
import "./style.css";

const API = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const STATIC_MEDIA = import.meta.env.DEV ? "" : "/static";

async function apiGet(path) {
  const response = await fetch(`${API}${path}`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

const transition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] };

function Header({ mode, setMode, night, setNight, active, setActive }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Home", "Work", "Skills", "Posts", "About", "Contact"];

  function navigate(label) {
    setActive(label);
    setMenuOpen(false);
    document.getElementById(label.toLowerCase())?.scrollIntoView({
      behavior: "smooth", block: "start"
    });
  }

  return (
    <header className="site-header">
      <div className="header-top">
        <a className="wordmark" href="#home" onClick={(e) => {
          e.preventDefault(); navigate("Home");
        }}>RAGHAVA<span>.</span></a>

        <div className="mode-switch" aria-label="Portfolio mode">
          <button className={mode === "creative" ? "mode-button selected" : "mode-button"}
            onClick={() => setMode("creative")}>Creative</button>
          <button className={mode === "developer" ? "mode-button selected" : "mode-button"}
            onClick={() => setMode("developer")}>Developer</button>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {mode === "developer" && (
          <motion.div className="theme-switch" key="developer-theme"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={transition}>
            <button className={!night ? "theme-button selected" : "theme-button"}
              onClick={() => setNight(false)}><Sun size={17}/> Day</button>
            <button className={night ? "theme-button selected" : "theme-button"}
              onClick={() => setNight(true)}><Moon size={17}/> Night</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="nav-wrap">
        <nav className={menuOpen ? "section-nav open" : "section-nav"}>
          {links.map((link) => (
            <button key={link} onClick={() => navigate(link)}
              className={active === link ? "nav-button active" : "nav-button"}>
              {link}
            </button>
          ))}
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>
  );
}

function HeroArtwork({ mode, night }) {
  if (mode === "developer") {
    return (
      <div className={`hero-visual developer-visual ${night ? "night" : "day"}`}>
        <video
          className="hero-video"
          key={night ? "night-video" : "day-video"}
          src={`${STATIC_MEDIA}${night ? "/videos/night.mp4" : "/videos/day.mp4"}`}
          autoPlay muted loop playsInline preload="auto"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="video-shade"/>
        <div className="visual-code-mark"><Code2 size={22}/><span>DEVELOPER MODE</span></div>
        <div className="hero-visual-copy">
          <h2>Building ideas into<br/>digital experiences.</h2>
          <p>I'm Raghava.</p>
        </div>
        <span className="visual-corner">PYTHON · AI · DEVELOPMENT</span>
      </div>
    );
  }

  return (
    <div className="hero-visual creative-visual">
      <div className="creative-glow"/>
      <div className="creative-orbit orbit-one"/>
      <div className="creative-orbit orbit-two"/>
      <div className="creative-orbit orbit-three"/>
      <div className="creative-spark spark-one">✦</div>
      <div className="creative-spark spark-two">✧</div>
      <div className="hero-visual-copy">
        <h2>Ideas shaped into<br/>visual stories.</h2>
        <p>Animator. Designer.</p>
      </div>
      <span className="visual-corner">CREATIVE PORTFOLIO / 2026</span>
    </div>
  );
}

function Hero({ mode, night, site }) {
  const isCreative = mode === "creative";
  return (
    <section className="hero-section" id="home">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div className="hero-card" key={mode}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={transition}>
          <div className="hero-kicker">
            {isCreative ? "CREATIVE PORTFOLIO / 2026" : "C:\\PORTFOLIO\\DEVELOPER"}
          </div>
          <HeroArtwork mode={mode} night={night}/>
          <p className="hero-description">
            {isCreative
              ? "A creative space for motion, art and digital experiences."
              : "Developer · AI Explorer · Problem Solver"}
          </p>
          <div className="hero-tags">
            {(isCreative ? ["2D Animation", "Visual Design", "Motion"] :
              ["Python", "Backend", "AI Applications"]).map(tag =>
              <span key={tag}>{tag}</span>)}
          </div>
          <button className="scroll-cue" onClick={() =>
            document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Scroll to work"><ArrowDown size={22}/></button>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article className="project-card" layout
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }} transition={{ ...transition, delay: index * 0.04 }}
      onClick={() => onOpen(project)}>
      <div className="project-media">
        {project.media_kind === "video" && project.media_url
          ? <video src={project.media_url} muted loop playsInline controls autoPlay preload="metadata"
              onClick={event => event.stopPropagation()}/>
          : project.media_url ? <img src={project.media_url} alt={project.title} loading="lazy"/> :
          <div className="media-placeholder"><Sparkles/></div>}
      </div>
      <div className="project-info">
        <div><span className="eyebrow">{project.category || "PROJECT"}</span><h3>{project.title}</h3></div>
        <span className="project-year">{project.year || ""}<ArrowUpRight size={17}/></span>
      </div>
    </motion.article>
  );
}

function App() {
  const [mode, setMode] = useState("creative");
  const [night, setNight] = useState(false);
  const [active, setActive] = useState("Home");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [about, setAbout] = useState(null);
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLoadError("");
    Promise.all([
      apiGet(`/projects/?mode=${mode}`),
      apiGet(`/skills/?mode=${mode}`),
      apiGet(`/posts/?mode=${mode}`),
      apiGet(`/about/?mode=${mode}`),
      apiGet("/site/")
    ]).then(([p, s, po, a, st]) => {
      if (!alive) return;
      setProjects(Array.isArray(p) ? p : []);
      setSkills(Array.isArray(s) ? s : []);
      setPosts(Array.isArray(po) ? po : []);
      setAbout(a); setSite(st); setLoading(false);
    }).catch(error => {
      if (!alive) return;
      setProjects([]); setSkills([]); setPosts([]); setAbout(null);
      setLoadError("Portfolio content is not available right now. Please check the backend connection.");
      setLoading(false);
      console.error("Portfolio API:", error);
    });
    return () => { alive = false; };
  }, [mode]);

  useEffect(() => {
    const sections = ["home", "work", "skills", "posts", "about", "contact"];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting)
          setActive(entry.target.id[0].toUpperCase() + entry.target.id.slice(1));
      });
    }, { threshold: 0.2, rootMargin: "-10% 0px -55% 0px" });
    sections.forEach(id => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const categories = useMemo(() =>
    [...new Set(projects.map(p => p.category).filter(Boolean))], [projects]);
  const visibleProjects = projects.filter(p => filter === "All" || p.category === filter);

  return (
    <div className={`portfolio-page ${mode} ${mode === "developer" ? (night ? "dev-night" : "dev-day") : ""}`}>
      <div className="portfolio-shell">
        <Header mode={mode} setMode={next => {
          setMode(next); setFilter("All"); if (next === "creative") setNight(false);
        }} night={night} setNight={setNight} active={active} setActive={setActive}/>
        <main>
          <Hero mode={mode} night={night} site={site}/>

          <section className="content-section" id="work">
            <div className="section-title">
              <span className="eyebrow">01 / {mode === "creative" ? "SELECTED WORK" : "DEVELOPER PROJECTS"}</span>
              <h2>{mode === "creative" ? <>Selected<br/><span>creative work.</span></> : <>Projects built<br/><span>with code.</span></>}</h2>
            </div>
            {categories.length > 0 && <div className="category-row">
              {["All", ...categories].map(category =>
                <button key={category} className={filter === category ? "category-chip active" : "category-chip"}
                  onClick={() => setFilter(category)}>{category}</button>)}
            </div>}
            {loading && <p className="empty-state">Loading projects…</p>}
            {!loading && !visibleProjects.length && <p className="empty-state">Projects will appear here soon.</p>}
            <motion.div layout className="project-grid">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project, index) =>
                  <ProjectCard key={project.id} project={project} index={index} onOpen={setSelectedProject}/>)}
              </AnimatePresence>
            </motion.div>
          </section>

          <section className="content-section skills-section" id="skills">
            <div className="section-title">
              <span className="eyebrow">02 / {mode === "creative" ? "CREATIVE TOOLKIT" : "TECH STACK"}</span>
              <h2>Skills in<br/><span>{mode === "creative" ? "motion." : "practice."}</span></h2>
            </div>
            <div className="skills-grid">
              <div className="skill-art-panel">
                <div className="skill-art-2d"><i/><b/><em/><span>✦</span></div>
                <p>{mode === "creative" ? "IDEAS INTO EXPRESSION" : "TOOLS INTO SOLUTIONS"}</p>
              </div>
              <div className="skill-list">
                {skills.map((skill, i) =>
                  <motion.div className="skill-item" key={skill.id || skill.name}
                    initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ ...transition, delay: i * 0.035 }}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{skill.name}</strong>
                    {skill.proficiency != null && <small>{skill.proficiency}%</small>}
                    {skill.proficiency != null && <div className="skill-meter"><i style={{width: `${skill.proficiency}%`}}/></div>}
                    {skill.detail && <p>{skill.detail}</p>}
                  </motion.div>)}
                {!loading && !skills.length && <p className="empty-state">Skills will appear here soon.</p>}
              </div>
            </div>
          </section>

          <section className="content-section" id="posts">
            <div className="section-title">
              <span className="eyebrow">03 / JOURNAL</span>
              <h2>Posts &<br/><span>updates.</span></h2>
            </div>
            <div className="posts-grid">
              {posts.map((post, i) =>
                <motion.article className="post-card" key={post.id}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ ...transition, delay: i * 0.04 }}>
                  {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} loading="lazy"/>}
                  <div className="eyebrow">{post.category || "UPDATE"} {post.published_on ? `· ${post.published_on}` : ""}</div>
                  <h3>{post.title}</h3><p>{post.body}</p>
                </motion.article>)}
              {!loading && !posts.length && <p className="empty-state">Posts and updates will appear here soon.</p>}
            </div>
          </section>

          <section className="content-section about-section" id="about">
            <span className="eyebrow">04 / ABOUT</span>
            <div className="about-content">
              <h2>{about?.heading || "A little about me."}</h2>
              <div><p>{about?.introduction || "I'm Raghava."}</p><p>{about?.description || "I enjoy turning ideas into thoughtful digital experiences."}</p></div>
            </div>
          </section>

          <section className="contact-section" id="contact">
            <span className="eyebrow">05 / CONTACT</span>
            <h2>Have an idea?<br/><span>Let's build it.</span></h2>
            {site?.contact_email && <a className="contact-link" href={`mailto:${site.contact_email}`}>Get in touch <ArrowUpRight size={18}/></a>}
            <div className="footer-line">
              <span>{site?.location || "INDIA"}</span>
              <span>© {new Date().getFullYear()} {site?.site_title || "Raghava"}</span>
              <div className="social-links">
                {site?.instagram_url && <a href={site.instagram_url} aria-label="Instagram"><Instagram/></a>}
                {site?.linkedin_url && <a href={site.linkedin_url} aria-label="LinkedIn"><Linkedin/></a>}
                {site?.github_url && <a href={site.github_url} aria-label="GitHub"><Github/></a>}
              </div>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {selectedProject && <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={() => setSelectedProject(null)}>
          <motion.div className="project-modal" initial={{y:18,opacity:0}} animate={{y:0,opacity:1}} exit={{y:12,opacity:0}}
            onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}><X/></button>
            {selectedProject.media_url && <div className="project-modal-media">
              {selectedProject.media_kind === "video"
                ? <video src={selectedProject.media_url} controls autoPlay muted loop playsInline/>
                : <img src={selectedProject.media_url} alt={selectedProject.title}/>}
            </div>}
            <span className="eyebrow">{selectedProject.category}</span>
            <h2>{selectedProject.title}</h2><p>{selectedProject.description}</p>
            {selectedProject.project_url && <a href={selectedProject.project_url} target="_blank" rel="noreferrer">View project <ArrowUpRight size={16}/></a>}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
      {loadError && <div className="api-toast" role="status">{loadError}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
