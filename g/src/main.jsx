import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, Sparkles, Layers, BrainCircuit, PenTool, Orbit, Menu, X, MousePointer2 } from 'lucide-react';
import './styles.css';

const caseStudies = [
  {
    client: 'Success Academy',
    title: 'AI-first learning ecosystem transformation',
    tag: 'Strategy / UX / Platform Design',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
    stats: ['Canvas + Learnosity future state', 'AI-enabled content workflows', 'Network-level academic governance'],
  },
  {
    client: 'CCA',
    title: 'Teacher micro-UIs and data-informed instruction',
    tag: 'Experience Systems / Dashboards',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
    stats: ['LMS embedded insights', 'Reduced manual aggregation', 'Teacher actionability'],
  },
  {
    client: 'Kadal AI',
    title: 'Agentic workflows for content and curriculum teams',
    tag: 'AI Product / Service Design',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80',
    stats: ['Content lake context', 'Human-in-the-loop review', 'Standards mapping and audits'],
  },
];

const capabilities = [
  { icon: PenTool, label: 'Experience Strategy', text: 'From ambiguous opportunity to decision-ready product direction.' },
  { icon: Layers, label: 'Design Systems', text: 'Scalable UX patterns, governance models, and operating rhythms.' },
  { icon: BrainCircuit, label: 'AI Product Design', text: 'Agentic workflows, copilots, and human-centered AI experiences.' },
  { icon: Orbit, label: 'Transformation Design', text: 'Change journeys that move executives, teams, and users together.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const update = (event) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);
  return position;
}

function CursorGlow() {
  const { x, y } = useMousePosition();
  const springX = useSpring(x, { stiffness: 120, damping: 25 });
  const springY = useSpring(y, { stiffness: 120, damping: 25 });
  return <motion.div className="cursor-glow" style={{ x: springX, y: springY }} aria-hidden="true" />;
}

function MagneticButton({ children, variant = 'primary', href = '#contact' }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      href={href}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPos({
          x: (event.clientX - rect.left - rect.width / 2) * 0.16,
          y: (event.clientY - rect.top - rect.height / 2) * 0.16,
        });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      whileTap={{ scale: 0.96 }}
      className={`magnetic-button ${variant === 'primary' ? 'button-primary' : 'button-secondary'}`}
    >
      <span>{children}<ArrowUpRight size={16} /></span>
    </motion.a>
  );
}

function FloatingVisual() {
  return (
    <div className="floating-visual">
      <motion.div className="glow-one" animate={{ x: [0, 40, -20, 0], y: [0, 30, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="glow-two" animate={{ x: [0, -30, 20, 0], y: [0, -30, 10, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="ui-card ui-card-large" animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="window-bar"><div><span /><span /><span /></div><small>AI Workbench</small></div>
        <div className="ui-skeleton hero-line" />
        <div className="ui-grid"><div /><div /><div /></div>
      </motion.div>
      <motion.div className="ui-card ui-card-small" animate={{ y: [0, 18, 0], rotate: [0, -1.5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <p><Sparkles size={16} /> Strategy signal</p>
        <div className="line full" /><div className="line short" />
        <div className="mini-grid"><span>Design Ops</span><span>AI Flow</span></div>
      </motion.div>
    </div>
  );
}

function CaseStudyCard({ item, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <motion.article ref={ref} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }} transition={{ duration: 0.7, delay: index * 0.05 }} className="case-card">
      <div className="case-grid">
        <div className="case-image-wrap">
          <motion.img src={item.image} alt={`${item.client} visual`} style={{ y: imageY }} loading="lazy" />
          <div className="case-image-overlay" />
        </div>
        <div className="case-content">
          <div>
            <div className="case-meta"><span>{item.client}</span><span>{item.tag}</span></div>
            <h3>{item.title}</h3>
          </div>
          <div className="chip-row">{item.stats.map((stat) => <span key={stat}>{stat}</span>)}</div>
        </div>
      </div>
    </motion.article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.35], [0, -180]);
  const yOrb = useTransform(scrollYProgress, [0, 1], [0, 420]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 47) % 100}%`,
    top: `${(i * 31) % 100}%`,
    delay: i * 0.18,
    size: 2 + ((i * 7) % 4),
  })), []);

  return (
    <main className="site-shell">
      <CursorGlow />
      <motion.div style={{ scaleX: progressScale }} className="scroll-progress" />

      <header className="site-header">
        <a href="#top" className="brand">GS</a>
        <nav className="desktop-nav">
          <a href="#work">Work</a><a href="#capabilities">Capabilities</a><a href="#method">Method</a><a href="#contact">Contact</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      {menuOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mobile-menu">
          <a onClick={() => setMenuOpen(false)} href="#work">Work</a>
          <a onClick={() => setMenuOpen(false)} href="#capabilities">Capabilities</a>
          <a onClick={() => setMenuOpen(false)} href="#method">Method</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Contact</a>
        </motion.div>
      )}

      <section id="top" className="hero-section">
        <motion.div style={{ y: yOrb }} className="hero-orb" />
        {particles.map((p, i) => <motion.span key={i} className="particle" style={{ left: p.left, top: p.top, width: p.size, height: p.size }} animate={{ y: [0, -22, 0], opacity: [0.25, 0.9, 0.25] }} transition={{ delay: p.delay, duration: 4 + i * 0.08, repeat: Infinity }} />)}
        <div className="hero-grid">
          <motion.div style={{ y: yHero }} initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
            <motion.div variants={fadeUp} className="eyebrow"><Sparkles size={16} /> Product, UX, design systems and AI transformation</motion.div>
            <motion.h1 variants={fadeUp}>Designing intelligent experiences for learning at scale.</motion.h1>
            <motion.p variants={fadeUp} className="hero-copy">I help education organizations turn complexity into elegant product ecosystems, from UX strategy and design governance to AI-enabled workflows, platforms, and transformation programs.</motion.p>
            <motion.div variants={fadeUp} className="cta-row"><MagneticButton href="#work">Explore work</MagneticButton><MagneticButton href="#contact" variant="secondary">Start a conversation</MagneticButton></motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.25 }}><FloatingVisual /></motion.div>
        </div>
      </section>

      <section className="signal-section">
        {["UX strategy that executives understand", "Design systems that teams can actually use", "AI workflows that preserve human judgment"].map((item, i) => (
          <motion.div key={item} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="signal-card">
            <div>0{i + 1}</div><h3>{item}</h3>
          </motion.div>
        ))}
      </section>

      <section id="work" className="content-section">
        <div className="section-heading">
          <div><p>Selected work</p><h2>Complex systems made visible, usable, and scalable.</h2></div>
          <span>Each engagement combines product strategy, experience architecture, governance, and execution design.</span>
        </div>
        <div className="case-list">{caseStudies.map((item, i) => <CaseStudyCard key={item.client} item={item} index={i} />)}</div>
      </section>

      <section id="capabilities" className="content-section">
        <p className="section-kicker">Capabilities</p>
        <div className="capability-grid">
          {capabilities.map(({ icon: Icon, label, text }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -10 }} className="capability-card">
              <Icon /><h3>{label}</h3><p>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="method" className="method-section">
        <div className="method-panel">
          <div><p>Method</p><h2>Think deeply. Prototype fast. Govern what scales.</h2></div>
          <div className="method-list">
            {["Divergent discovery to expose the true system", "Experience architecture to connect user journeys, data, and workflows", "Prototype-led alignment for faster executive decisions", "Governance, adoption, and operating model design for scale"].map((step, i) => (
              <motion.div key={step} whileHover={{ x: 10 }}><span>0{i + 1}</span><strong>{step}</strong></motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <MousePointer2 size={28} />
        <motion.h2 initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Let’s design the next intelligent learning experience.</motion.h2>
        <MagneticButton href="mailto:your.email@example.com">Contact me</MagneticButton>
        <p>Replace with your preferred email, LinkedIn, and calendar link.</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
