import { useRef, useState, type PointerEvent } from 'react'
import { ArrowDown, ChevronRight, GitBranch, Mail, MoveUpRight } from 'lucide-react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import fallbackPortrait from '../assets/dwaraknath-portrait.jpg'
import { career, featuredProjects, skillGroups, credentials, identity, contactLinks } from '../data/cinematic'
import { ProjectCard } from './ProjectCard'
import { ScrollProgress } from './ScrollProgress'
import './CinematicStory.css'

const ease = [0.22, 1, 0.36, 1] as const

function StoryHeader() {
  const [menu, setMenu] = useState(false)
  return (
    <header className="film-header">
      <a className="film-monogram" href="#intro" aria-label="Dwaraknath Balaji, home">DB<span>.</span></a>
      <span className="film-header-label">DWARAKNATH BALAJI <i /> AI SOFTWARE ENGINEER</span>
      <button className="film-menu-button" type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="film-nav">MENU <span>{menu ? '−' : '+'}</span></button>
      <nav id="film-nav" className={menu ? 'film-navigation is-open' : 'film-navigation'} aria-label="Portfolio scenes">
        {[['intro','Introduction'],['universe','The work'],['timeline','Timeline'],['projects','Projects'],['finale','Contact']].map(([id,label])=><a key={id} onClick={()=>setMenu(false)} href={`#${id}`}>{label}</a>)}
      </nav>
    </header>
  )
}

function Entrance() {
  const reduce = useReducedMotion()
  const sectionRef=useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({target: sectionRef, offset: ['start start','end start']})
  const portraitY = useTransform(scrollYProgress,[0,1],[0,100])
  const textY = useTransform(scrollYProgress,[0,1],[0,-65])
  const opacity = useTransform(scrollYProgress,[0,.75],[1,.25])
  return (
    <section id="intro" ref={sectionRef} className="film-scene film-entrance" aria-label="Introduction">
      <div className="film-ambient film-ambient-blue" aria-hidden="true"/>
      <div className="film-grain" aria-hidden="true"/>
      <span className="film-side-label">A PERSONAL STORY IN FIVE SCENES · 2026</span>
      <m.div className="film-entrance-type" style={reduce?undefined:{y:textY,opacity}}>
        <m.p className="film-kicker" initial={reduce?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.8}}>01 / THE OPENING — ENGINEERING INTELLIGENCE</m.p>
        <h1><m.span initial={reduce?false:{y:'115%'}} animate={{y:0}} transition={{duration:1.2,ease}}>DWARAKNATH</m.span><m.span className="film-title-second" initial={reduce?false:{y:'115%'}} animate={{y:0}} transition={{duration:1.2,delay:.15,ease}}>BALAJI<span className="film-accent">.</span></m.span></h1>
        <m.p className="film-entrance-subtitle" initial={reduce?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.55}}>AI SOFTWARE ENGINEER <span>—</span> RAG / LLMs / AGENTIC SYSTEMS</m.p>
      </m.div>
      <m.div className="film-portrait-wrap" style={reduce?undefined:{y:portraitY}}>
        <div className="film-portrait-spotlight" aria-hidden="true"/>
        <m.img className="film-portrait" src="/hero-portrait-cutout.webp" onError={e=>{e.currentTarget.onerror=null; e.currentTarget.src=fallbackPortrait}} width="1122" height="1402" alt="Dwaraknath Balaji in a black suit" fetchPriority="high" initial={reduce?false:{opacity:0,y:95,scale:.94}} animate={{opacity:1,y:0,scale:1}} transition={{duration:1.35,delay:.15,ease}}/>
      </m.div>
      <div className="film-entrance-bottom">
        <span>BUILDING SYSTEMS THAT <strong>RETRIEVE, REASON & ACT.</strong></span>
        <a href="#universe">SCROLL TO ENTER <ArrowDown size={15}/></a>
        <span className="film-index">01 / 05</span>
      </div>
    </section>
  )
}

function Universe() {
  const reduce=useReducedMotion()
  const ref=useRef<HTMLElement>(null)
  const { scrollYProgress }=useScroll({target:ref,offset:['start end','end start']})
  const orbY=useTransform(scrollYProgress,[0,1],[-85,90])
  const orbRotation=useTransform(scrollYProgress,[0,1],[-25,30])
  return (
    <section id="universe" className="film-scene film-universe" ref={ref}>
      <div className="film-universe-orbital" aria-hidden="true">
        <m.div className="film-universe-halo" style={reduce?undefined:{y:orbY,rotate:orbRotation}}>
          <div className="film-orbit film-orbit-a"/><div className="film-orbit film-orbit-b"/><div className="film-orbit film-orbit-c"/><div className="film-core"/>
        </m.div>
      </div>
      <div className="film-scene-content film-universe-content">
        <p className="film-kicker">02 / THE INTELLIGENCE UNIVERSE</p>
        <h2>WHERE DATA<br/><em>BECOMES</em><br/>DECISIONS<span className="film-accent">.</span></h2>
        <p className="film-universe-summary">{identity.summary}</p>
        <div className="film-skills-board">
          {skillGroups.map((group,i)=><div key={group.title} className="film-skill-card">
            <span className="film-card-number">SYS / {String(i+1).padStart(2,'0')}</span>
            <h3>{group.title}</h3>
            <p>{group.skills.join(' · ')}</p>
          </div>)}
        </div>
        <a className="film-text-link" href="#timeline">FOLLOW THE JOURNEY <ChevronRight size={17}/></a>
      </div>
    </section>
  )
}

const years=[2024,2025,2026]
function TimeMachine() {
  const [year,setYear]=useState(2025)
  const reduce=useReducedMotion()
  function handlePointerMove(e:PointerEvent<HTMLDivElement>) {
    if(e.pointerType!=='mouse')return
    const rect=e.currentTarget.getBoundingClientRect()
    const ratio=(e.clientX-rect.left)/rect.width
    setYear(ratio<1/3?2024:ratio<2/3?2025:2026)
  }
  return (
    <section id="timeline" className="film-scene film-time">
      <div className="film-scene-content">
        <p className="film-kicker">03 / TIME MACHINE</p>
        <div className="film-time-head"><h2>THE MAKING<br/>OF AN <em>ENGINEER.</em></h2><p>From the foundations of software to dependable AI systems. Choose a year to explore the journey.</p></div>
        <div className="film-clock-zone">
          <div className="film-clock" aria-hidden="true" onPointerMove={handlePointerMove}><div className="film-clock-face"><span>12</span><span>03</span><span>06</span><span>09</span></div><m.div className="film-clock-hand" animate={reduce?undefined:{rotate:(year-2024)*48-48}} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 105, damping: 20 }}/><span className="film-clock-pin"/></div>
          <div className="film-year-readout" aria-live="polite">{year}</div>
          <div className="film-year-buttons" aria-label="Choose a timeline year">
            {years.map(y=><button type="button" aria-pressed={year===y} className={year===y?'is-active':''} key={y} onClick={()=>setYear(y)}>{y}</button>)}
          </div>
        </div>
        <div className="film-timeline-items">
          {career.filter(item=>(item.years as readonly number[]).includes(year)).map(item=><article key={item.title} className="film-timeline-card"><span>{item.period}</span><div><h3>{item.title}</h3><p className="film-timeline-place">{item.company}</p><p>{item.description}</p></div></article>)}
        </div>
      </div>
    </section>
  )
}

function ProjectUniverse() {
  const reduce=useReducedMotion()
  const ref=useRef<HTMLElement>(null)
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']})
  const shift=useTransform(scrollYProgress,[0,1],[-60,45])
  return (
    <section id="projects" className="film-scene film-projects" ref={ref}>
      <div className="film-project-grid" aria-hidden="true"/>
      <m.div className="film-project-aura" style={reduce?undefined:{y:shift}} aria-hidden="true"/>
      <div className="film-scene-content">
        <p className="film-kicker">04 / PROJECT UNIVERSE</p>
        <h2>BUILT TO <em>MATTER.</em></h2>
        <p className="film-project-intro">Selected systems and documented work, from enterprise knowledge retrieval to machine learning applications.</p>
        <div className="film-project-cards">
          {featuredProjects.map((project,i)=><ProjectCard key={project.name} project={project} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function Finale() {
  return (
    <footer id="finale" className="film-scene film-finale">
      <div className="film-finale-aura" aria-hidden="true"/>
      <div className="film-finale-silhouette" aria-hidden="true"><img src="/hero-portrait-cutout.webp" alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/></div>
      <div className="film-scene-content film-finale-content">
        <p className="film-kicker">05 / THE FINALE</p>
        <p className="film-finale-heading">LET'S BUILD<br/>SOMETHING<br/><em>INTELLIGENT.</em></p>
        <p className="film-finale-statement">From retrieval to reasoning. From ideas to systems you can trust.</p>
        <div className="film-finale-links">
          <a href={contactLinks.email} aria-label="Send an email to Dwaraknath Balaji"><Mail size={18}/> EMAIL <MoveUpRight size={16}/></a>
          <a href={contactLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch size={18}/> GITHUB <MoveUpRight size={16}/></a>
        </div>
        <div className="film-accolades">
          <span>{credentials.degree}</span>
          <span>{credentials.aws}</span>
          <span>{credentials.publication}</span>
          <span>{credentials.hackathon}</span>
          <span>{credentials.microsoft}</span>
          <span>{credentials.google}</span>
        </div>
        <div className="film-finale-foot"><span>DWARAKNATH BALAJI — PORTFOLIO {new Date().getFullYear()}</span><a href="#intro">BACK TO THE OPENING ↑</a></div>
      </div>
    </footer>
  )
}

export function CinematicStory() {
  return (
    <div className="film-app">
      <a className="film-skip" href="#universe">Skip introduction</a>
      <ScrollProgress/>
      <StoryHeader/>
      <main>
        <Entrance/>
        <Universe/>
        <TimeMachine/>
        <ProjectUniverse/>
      </main>
      <Finale/>
    </div>
  )
}
