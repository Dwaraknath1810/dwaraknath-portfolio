import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowDown, ChevronRight, GitBranch, Mail, Moon, MoveUpRight, Sun } from 'lucide-react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import fallbackPortrait from '../assets/dwaraknath-portrait.jpg'
import { career, featuredProjects, skillGroups, credentials, identity, contactLinks } from '../data/cinematic'
import { ProjectCard } from './ProjectCard'
import { ScrollProgress } from './ScrollProgress'
import { SceneNavigation } from './SceneNavigation'
import { SceneDivider } from './SceneDivider'
import { EngineeringWorkbench } from './EngineeringWorkbench'
import { RecruiterOverview } from './RecruiterOverview'
import './CinematicStory.css'

const ease = [0.22, 1, 0.36, 1] as const

type Theme = 'dark' | 'light'

function StoryHeader({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [menu, setMenu] = useState(false)
  return (
    <header className="film-header">
      <a className="film-monogram" href="#intro" aria-label="Dwaraknath Balaji, home">DB<span>.</span></a>
      <span className="film-header-label">DWARAKNATH BALAJI <i /> AI SOFTWARE ENGINEER</span>
      <button className="film-theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'light'}>{theme === 'dark' ? <Sun size={17} aria-hidden="true"/> : <Moon size={17} aria-hidden="true"/>}<span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span></button>
      <button className="film-menu-button" type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="film-nav">MENU <span>{menu ? '−' : '+'}</span></button>
      <nav id="film-nav" className={menu ? 'film-navigation is-open' : 'film-navigation'} aria-label="Portfolio scenes">
        {[['intro','Introduction'],['snapshot','Quick Brief'],['universe','The work'],['timeline','Timeline'],['workbench','Tools & Work'],['projects','Projects'],['finale','Contact']].map(([id,label])=><a key={id} onClick={()=>setMenu(false)} href={`#${id}`}>{label}</a>)}
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
      <div className="film-entrance-light film-entrance-light-a" aria-hidden="true"/>
      <div className="film-entrance-light film-entrance-light-b" aria-hidden="true"/>
      <span className="film-side-label">A PERSONAL STORY IN FIVE SCENES · {new Date().getFullYear()}</span>
      <m.div className="film-entrance-type" style={reduce?undefined:{y:textY,opacity}}>
        <m.p className="film-kicker" initial={reduce?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.8}}>01 / THE OPENING — ENGINEERING INTELLIGENCE</m.p>
        <h1><m.span initial={reduce?false:{y:'115%'}} animate={{y:0}} transition={{duration:1.2,ease}}>DWARAKNATH</m.span><m.span className="film-title-second" initial={reduce?false:{y:'115%'}} animate={{y:0}} transition={{duration:1.2,delay:.15,ease}}>BALAJI<span className="film-accent">.</span></m.span></h1>
        <m.p className="film-entrance-subtitle" initial={reduce?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.55}}>AI SOFTWARE ENGINEER <span>—</span> RAG / LLMs / AGENTIC SYSTEMS</m.p>
        <div className="film-hero-actions">
        <a className="film-resume-link film-resume-link--hero" href="/Dwaraknath_Balaji_AI_Engineer_Resume.pdf" download="Dwaraknath_Balaji_AI_Engineer_Resume.pdf">DOWNLOAD RESUME <span aria-hidden="true">↓</span></a>
        <a className="film-brief-anchor" href="#snapshot">SKIP TO THE QUICK BRIEF <ChevronRight size={15} aria-hidden="true"/></a>
        </div>
      </m.div>
      <m.div className="film-portrait-wrap" style={reduce?undefined:{y:portraitY}}>
        <div className="film-portrait-spotlight" aria-hidden="true"/>
        <div className="film-portrait-rings" aria-hidden="true"/>
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
          {skillGroups.map((group,i)=><m.div key={group.title} className="film-skill-card" initial={reduce?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:reduce?0:.65,delay:reduce?0:i*.1,ease}}>
            <span className="film-card-number">SYS / {String(i+1).padStart(2,'0')}</span>
            <h3>{group.title}</h3>
            <p>{group.skills.join(' · ')}</p>
          </m.div>)}
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
          {career.filter(item=>(item.years as readonly number[]).includes(year)).map(item=><m.article key={item.title} className="film-timeline-card" initial={reduce?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.38}}><span>{item.period}</span><div><h3>{item.title}</h3><p className="film-timeline-place">{item.company}</p><p>{item.description}</p></div></m.article>)}
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
  const [filter,setFilter]=useState<'all' | 'professional' | 'personal'>('all')
  const visibleProjects=featuredProjects.map((project,index)=>({project,index})).filter(({index})=>filter==='all' || (filter==='professional' ? index<2 : index>=2))
  return (
    <section id="projects" className="film-scene film-projects" ref={ref}>
      <div className="film-project-grid" aria-hidden="true"/>
      <m.div className="film-project-aura" style={reduce?undefined:{y:shift}} aria-hidden="true"/>
      <div className="film-scene-content">
        <p className="film-kicker">04 / PROJECT UNIVERSE</p>
        <h2>BUILT TO <em>MATTER.</em></h2>
        <p className="film-project-intro">Selected systems and documented work, from enterprise knowledge retrieval to machine learning applications.</p>
        <div className="film-project-filters" role="group" aria-label="Filter projects">
          {([["all","All projects"],["professional","Professional work"],["personal","ML projects"]] as const).map(([value,label])=><button key={value} type="button" className={filter===value?"is-active":""} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}<span aria-hidden="true">↗</span></button>)}
        </div>
        <div className="film-project-cards" aria-live="polite">
          {visibleProjects.map(({project,index})=><ProjectCard key={project.name} project={project} index={index} />)}
        </div>
      </div>
    </section>
  )
}

function Finale() {
  const reduce = useReducedMotion()
  return (
    <footer id="finale" className="film-scene film-finale">
      <div className="film-finale-aura" aria-hidden="true"/>
      <div className="film-finale-horizon" aria-hidden="true"/>
      <div className="film-finale-silhouette" aria-hidden="true"><img src="/hero-portrait-cutout.webp" alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/></div>
      <div className="film-scene-content film-finale-content">
        <p className="film-kicker">05 / THE FINALE</p>
        <m.p className="film-finale-heading" initial={reduce?false:{opacity:0,y:55}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:reduce?0:.95,ease}}>LET'S BUILD<br/>SOMETHING<br/><em>INTELLIGENT.</em></m.p>
        <p className="film-finale-statement">From retrieval to reasoning. From ideas to systems you can trust.</p>
        <div className="film-finale-links">
          <a href={contactLinks.email} aria-label="Send an email to Dwaraknath Balaji"><Mail size={18}/> EMAIL <MoveUpRight size={16}/></a>
          <a href={contactLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch size={18}/> GITHUB <MoveUpRight size={16}/></a>
          <a href="/Dwaraknath_Balaji_AI_Engineer_Resume.pdf" download="Dwaraknath_Balaji_AI_Engineer_Resume.pdf">RESUME PDF <ArrowDown size={18}/></a>
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
  const [theme, setTheme] = useState<Theme>(() => {
    try { return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark' }
    catch { return 'dark' }
  })
  useEffect(() => {
    try { window.localStorage.setItem('portfolio-theme', theme) } catch { /* private browsing */ }
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f3ef' : '#06070a')
  }, [theme])
  return (
    <div className="film-app" data-theme={theme}>
      <a className="film-skip" href="#universe">Skip introduction</a>
      <ScrollProgress/>
      <StoryHeader theme={theme} onToggleTheme={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}/>
      <SceneNavigation/>
      <main>
        <Entrance/>
        <RecruiterOverview/>
        <SceneDivider step={0}/>
        <Universe/>
        <SceneDivider step={1}/>
        <TimeMachine/>
        <EngineeringWorkbench/>
        <SceneDivider step={2}/>
        <ProjectUniverse/>
      </main>
      <SceneDivider step={3}/>
      <Finale/>
    </div>
  )
}
