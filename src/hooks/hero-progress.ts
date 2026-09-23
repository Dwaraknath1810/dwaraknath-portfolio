export const clamp = (value: number) => Math.max(0, Math.min(1, value))
const stage = (progress: number, start: number, end: number) => {
  const t = clamp((progress - start) / (end - start))
  return t * t * (3 - 2 * t)
}
export function heroStages(progress: number) {
  const overall = clamp(progress)
  return {
    overall,
    portrait: stage(overall, 0, 0.1),
    title: stage(overall, 0.1, 0.35),
    ai: stage(overall, 0.1, 0.24),
    engineer: stage(overall, 0.18, 0.35),
    introduction: stage(overall, 0.35, 0.55),
    cta: stage(overall, 0.5, 0.75),
    geometry: stage(overall, 0.25, 0.65),
    exit: stage(overall, 0.75, 1),
  }
}
export type HeroStages = ReturnType<typeof heroStages>
