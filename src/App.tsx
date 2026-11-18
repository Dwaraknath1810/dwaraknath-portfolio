import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Interlude } from './sections/Interlude'
import './styles/cinematic.css'
import { Expertise } from './sections/Expertise'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Capabilities } from './sections/Capabilities'
import { Philosophy } from './sections/Philosophy'
import { Contact } from './sections/Contact'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <About />
          <Expertise />
          <Interlude />
          <Projects />
          <Experience />
          <Capabilities />
          <Philosophy />
          <Contact />
        </main>
        <Footer />
      </LazyMotion>
    </MotionConfig>
  )
}
