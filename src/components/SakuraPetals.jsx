function SakuraPetals({ count = 18 }) {
  const petals = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5 // золотое сечение — равномерное распределение
    return {
      id: i,
      left: (seed % 100),
      delay: ((seed * 7) % 12),
      duration: 10 + ((seed * 3) % 8),
      size: 5 + ((seed * 2) % 9),
      drift: -100 + ((seed * 13) % 200),
    }
  })

  return (
    <div className="petals" aria-hidden="true">
      {petals.map(p => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

export default SakuraPetals