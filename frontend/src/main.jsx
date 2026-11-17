import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Instagram, Linkedin, Github, Menu, X, Sparkles } from 'lucide-react';
import './style.css';

const API = '/api';

async function apiGet(path) {
  const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

function Spiral() {
  const group = useRef();
  const rings = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ y: (i - 3.5) * 0.34, scale: 0.48 + i * 0.105, rotation: i * 0.43 })), []);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.12;
    }
  });
  return <group ref={group}>
    {rings.map((r, i) => <mesh key={i} position={[0, r.y, 0]} rotation={[Math.PI / 2.7, r.rotation, i * 0.13]} scale={r.scale}>
      <torusGeometry args={[1, 0.055, 24, 120]} />
      <MeshTransmissionMaterial backside samples={4} thickness={0.55} roughness={0.12} transmission={0.98} ior={1.25} chromaticAberration={0.12} color={i % 2 ? '#b8a4ff' : '#83e9ff'} />
    </mesh>)}
    <mesh><icosahedronGeometry args={[0.28, 2]} /><meshPhysicalMaterial color="#c8b7ff" roughness={0.12} metalness={0.15} transmission={0.7} thickness={1} /></mesh>
    <pointLight position={[2, 2, 3]} intensity={18} color="#9b72ff" />
    <pointLight position={[-2, -1, -2]} intensity={12} color="#4bdcff" />
  </group>;
}

function SkillScene() {
  return <Canvas camera={{ position: [0, 0, 5.2], fov: 42 }} dpr={[1, 1.6]}>
    <ambientLight intensity={0.7} /><Environment preset="city" />
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.35}><Spiral /></Float>
    <Stars radius={9} depth={3} count={220} factor={2} fade speed={0.3} />
  </Canvas>;
}

function Header({ active, setActive, mode, setMode, night, setNight }) {
  const [open, setOpen] = useState(false);
  const links = ['Home', 'Work', 'Posts', 'Skills', 'About', 'Contact'];
  const go = (name) => {
    setActive(name); setOpen(false);
    document.getElementById(name.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return <header className="header">
    <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); go('Home'); }}><span className="brand-mark">R.</span><span>RAGHAVA<span className="brand-dot">®</span></span></a>
    <nav className={open ? 'nav nav-open' : 'nav'}>{links.map(x => <button className={active === x ? 'nav-link active' : 'nav-link'} key={x} onClick={() => go(x)}>{x}</button>)}</nav>
    <div className="mode-switch" role="group" aria-label="Portfolio mode">
      <button className={mode === 'creative' ? 'mode-option mode-active' : 'mode-option'} onClick={() => setMode('creative')}><span className="mode-pixel">✦</span><span>CREATIVE</span></button>
      <button className={mode === 'developer' ? 'mode-option mode-active' : 'mode-option'} onClick={() => setMode('developer')}><span className="mode-pixel">&lt;/&gt;</span><span>DEV MODE</span></button>
    </div>
    {mode === 'developer' && <div className="developer-theme" role="group" aria-label="Developer day and night theme">
      <button className={!night ? 'theme-option active' : 'theme-option'} onClick={() => setNight(false)} aria-label="Day mode">☀</button>
      <button className={night ? 'theme-option active' : 'theme-option'} onClick={() => setNight(true)} aria-label="Night mode">☾</button>
    </div>}
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
  </header>;
}

function Media({ project }) {
  if (project.media_kind === 'video' && project.media_url) return <video src={project.media_url} autoPlay muted loop playsInline controls />;
  if (project.media_url) return <img src={project.media_url} alt={project.title} loading="lazy" />;
  return null;
}

function App() {
  const [active, setActive] = useState('Home');
  const [mode, setMode] = useState('creative');
  const [night, setNight] = useState(true);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [about, setAbout] = useState(null);
  const [site, setSite] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setLoadError('');
    Promise.all([
      apiGet(`/projects/?mode=${mode}`),
      apiGet(`/skills/?mode=${mode}`),
      apiGet(`/posts/?mode=${mode}`),
      apiGet(`/about/?mode=${mode}`),
      apiGet('/site/')
    ]).then(([p, s, po, a, st]) => {
      if (cancelled) return;
      setProjects(p); setSkills(s); setPosts(po); setAbout(a); setSite(st); setLoading(false);
      setSelectedSkill(0); setSelectedProject(null); setActivePost(null); setFilter('All');
    }).catch((error) => {
      if (cancelled) return;
      setLoadError('Portfolio content is not available right now. Please check the backend connection.');
      setProjects([]); setSkills([]); setPosts([]); setAbout(null); setLoading(false);
      console.error(error);
    });
    return () => { cancelled = true; };
  }, [mode]);

  useEffect(() => {
    const ids = ['home', 'work', 'posts', 'skills', 'about', 'contact'];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id[0].toUpperCase() + entry.target.id.slice(1)); });
    }, { threshold: 0.25, rootMargin: '-10% 0px -55% 0px' });
    ids.forEach(id => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  const categories = [...new Set(projects.map(project => project.category).filter(Boolean))];
  const shownProjects = projects.filter(project => filter === 'All' || project.category === filter);
  const heroVideo = night ? site?.night_video_url : site?.day_video_url;
  const contactEmail = site?.contact_email;

  return <div className={`site-shell ${mode === 'developer' ? 'developer-mode' : 'creative-mode'} ${mode === 'developer' && night ? 'dev-night' : 'dev-day'}`}>
    <motion.div className="scroll-progress" style={{ width: progress }} />
    <Header active={active} setActive={setActive} mode={mode} setMode={next => { setMode(next); if (next === 'creative') setNight(false); }} night={night} setNight={setNight} />
    <main>
      <section className="hero section-wrap" id="home">
        {mode === 'developer' && heroVideo && <video className="developer-hero-video" key={heroVideo} src={heroVideo} autoPlay muted loop playsInline />}
        <div className="hero-grid">
          <div className="hero-copy">
            <motion.div className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}><span className="status-dot" />{mode === 'creative' ? 'CREATIVE PORTFOLIO' : 'C:\\PORTFOLIO\\DEVELOPER'}</motion.div>
            <motion.h1 key={mode} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>{mode === 'creative' ? <>Ideas into<br /><span className="gradient-text">visual stories.</span></> : <>Code into<br /><span className="gradient-text">real experiences.</span>}</motion.h1>
            <motion.p key={`intro-${mode}`} className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}>{mode === 'creative' ? "I'm Raghava — an animator and designer shaping ideas into expressive visuals, memorable moments and digital experiences." : "I'm Raghava — a software developer exploring Python, backend systems, AI applications and interactive web experiences."}</motion.p>
            <div className="hero-meta"><span>{site?.location || 'INDIA'}</span><span className="meta-line" /><span>{mode === 'creative' ? 'DESIGN · ANIMATION · IDEAS' : 'PYTHON · AI · DEVELOPMENT'}</span></div>
          </div>
          {mode === 'creative' ? <motion.div className="hero-art" initial={{ opacity: 0, scale: .84 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: .35 }}>
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-glow" />
            <div className="art-label label-top">CREATIVITY / 001</div><div className="art-label label-bottom">ALWAYS IN MOTION ↗</div>
            <div className="hero-object"><div className="object-core" /><div className="object-ring ring-a" /><div className="object-ring ring-b" /><div className="object-ring ring-c" /></div>
            <div className="floating-chip chip-one"><Sparkles size={14} /> Curiosity first</div><div className="floating-chip chip-two">01 — 06 / 26</div>
          </motion.div> : <div className="hero-art developer-hero-art"><div className="developer-terminal"><div className="terminal-head"><i /><i /><i /><span>portfolio.exe</span></div><div className="terminal-body"><p>&gt; initializing portfolio...</p><p>&gt; loading projects</p><p>&gt; loading skills</p><p className="terminal-ready">&gt; ready<span className="cursor">_</span></p></div></div></div>}
        </div>
      </section>

      <section className="work-section section-wrap" id="work">
        <div className="section-heading"><div><div className="eyebrow">01 / {mode === 'creative' ? 'SELECTED WORK' : 'C:\\PORTFOLIO\\WORK'}</div><h2>{mode === 'creative' ? <>A few things I've<br /><span className="muted-heading">brought to life.</span></> : <>Things I've<br /><span className="muted-heading">built with code.</span></>}</h2></div></div>
        {categories.length > 1 && <div className="filter-row">{['All', ...categories].map(category => <button key={category} onClick={() => setFilter(category)} className={filter === category ? 'filter active-filter' : 'filter'}>{category}</button>)}</div>}
        {loading && <div className="empty-content">Loading projects…</div>}
        {!loading && !shownProjects.length && <div className="empty-content" />}
        <motion.div layout className="project-grid">
          <AnimatePresence mode="popLayout">{shownProjects.map((project, index) => <motion.article layout key={project.id} className="project-card" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .4, delay: index * .06 }} onClick={() => setSelectedProject(project)}>
            <div className="project-image"><Media project={project} /><div className="image-overlay"><span>VIEW PROJECT <ArrowUpRight size={18} /></span></div></div>
            <div className="project-info"><div><span className="project-tag">{project.category}</span><h3>{project.title}</h3></div><span className="project-year">{project.year}</span></div>
          </motion.article>)}</AnimatePresence>
        </motion.div>
      </section>

      <section className="posts-section section-wrap" id="posts">
        <div className="section-heading"><div><div className="eyebrow">02 / {mode === 'creative' ? 'THE JOURNAL' : 'C:\\PORTFOLIO\\POSTS'}</div><h2>Posts &<br /><span className="muted-heading">updates.</span></h2></div></div>
        {loading && <div className="empty-content">Loading posts…</div>}
        {!loading && !posts.length && <div className="empty-content" />}
        <motion.div layout className="posts-grid"><AnimatePresence mode="popLayout">{posts.map((post, index) => <motion.article layout key={post.id} className="post-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .3, delay: index * .04 }} onClick={() => setActivePost(post)}>
          {post.cover_image_url && <div className="post-image"><img src={post.cover_image_url} alt={post.title} loading="lazy" /></div>}
          <div className="post-content"><div className="post-meta"><span>{post.category}</span>{post.published_on && <span>{post.published_on}</span>}</div><h3>{post.title}</h3><p>{post.body}</p><span className="post-read">READ POST <ArrowUpRight size={13} /></span></div>
        </motion.article>)}</AnimatePresence></motion.div>
      </section>

      <section className="skills-section section-wrap" id="skills">
        <div className="section-heading"><div><div className="eyebrow">03 / {mode === 'creative' ? 'CREATIVE TOOLKIT' : 'C:\\PORTFOLIO\\SKILLS'}</div><h2>Skills in<br /><span className="muted-heading">motion.</span></h2></div></div>
        <div className="skills-layout">
          <div className="skill-visual"><div className="visual-glow" />{mode === 'creative' && <SkillScene />}<div className="visual-caption">{mode === 'creative' ? 'INTERACTIVE SKILL UNIVERSE' : 'TECHNICAL TOOLKIT'} <span>✳</span></div></div>
          <div className="skill-panel"><div className="panel-top"><span>{mode === 'creative' ? 'CREATIVE DNA' : 'DEVELOPER STACK'}</span><span>{String(skills.length).padStart(2, '0')} ITEMS</span></div>
            {skills.length > 0 && <><div className="skill-list">{skills.map((skill, index) => <button key={skill.id} onClick={() => setSelectedSkill(index)} className={selectedSkill === index ? 'skill-row selected' : 'skill-row'}>
              <span className="skill-index">{String(index + 1).padStart(2, '0')}</span><span className="skill-name">{skill.name}</span>{skill.proficiency != null && <><span className="skill-level">{skill.proficiency}%</span><span className="skill-track"><i style={{ width: `${skill.proficiency}%` }} /></span></>}
            </button>)}</div>
            <AnimatePresence mode="wait"><motion.div key={`${mode}-${selectedSkill}-${skills[selectedSkill]?.id}`} className="skill-detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><span>SELECTED</span><h3>{skills[selectedSkill]?.name}</h3><p>{skills[selectedSkill]?.detail}</p></motion.div></AnimatePresence></>}
          </div>
        </div>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="eyebrow">04 / ABOUT</div>
        {about && <div className="about-grid"><h2>{about.heading}</h2><div className="about-copy"><p className="about-lead">{about.introduction}</p><p>{about.description}</p>{about.profile_image_url && <img className="about-profile-image" src={about.profile_image_url} alt="About Raghava" />}</div></div>}
      </section>

      <section className="contact-section section-wrap" id="contact"><div className="contact-orb" /><div className="eyebrow">05 / CONTACT</div><h2>Let's make<br /><span className="gradient-text">something real.</span></h2>{contactEmail && <a className="button button-primary contact-button" href={`mailto:${contactEmail}`}>Get in touch <ArrowUpRight size={17} /></a>}<div className="contact-bottom"><span>{site?.location || ''}</span><span>© {new Date().getFullYear()} {site?.site_title || 'Raghava'}</span></div></section>
    </main>
    <footer className="footer"><a className="brand" href="#home" onClick={e => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}><span className="brand-mark">R.</span><span>RAGHAVA</span></a><span>© {new Date().getFullYear()}</span><div className="socials">{site?.instagram_url && <a href={site.instagram_url} aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram /></a>}{site?.linkedin_url && <a href={site.linkedin_url} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a>}{site?.github_url && <a href={site.github_url} aria-label="GitHub" target="_blank" rel="noreferrer"><Github /></a>}</div></footer>

    <AnimatePresence>{selectedProject && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)}><motion.div className="project-modal" initial={{ opacity: 0, y: 25, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedProject(null)}><X /></button><div className="modal-media"><Media project={selectedProject} /></div><div className="modal-content"><span className="project-tag">{selectedProject.category} {selectedProject.year && `· ${selectedProject.year}`}</span><h2>{selectedProject.title}</h2><p>{selectedProject.description}</p>{selectedProject.project_url && <a href={selectedProject.project_url} target="_blank" rel="noreferrer">View project <ArrowUpRight size={15} /></a>}</div></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{activePost && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActivePost(null)}><motion.div className="project-modal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActivePost(null)}><X /></button>{activePost.cover_image_url && <img src={activePost.cover_image_url} alt={activePost.title} />}<div className="modal-content"><span className="project-tag">{activePost.category}</span><h2>{activePost.title}</h2><p>{activePost.body}</p></div></motion.div></motion.div>}</AnimatePresence>
    {loadError && <div className="api-error" role="status">{loadError}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
