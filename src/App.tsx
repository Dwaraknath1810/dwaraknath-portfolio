import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import { CinematicStory } from './cinematic/CinematicStory'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <CinematicStory />
      </LazyMotion>
    </MotionConfig>
  )
}
