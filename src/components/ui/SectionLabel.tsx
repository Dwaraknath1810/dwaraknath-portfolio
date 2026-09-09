export function SectionLabel({
  number,
  children,
}: {
  number: string
  children: string
}) {
  return (
    <div className="section-label eyebrow">
      <span>{number} /</span>
      {children}
    </div>
  )
}
