// src/components/Skeleton.jsx
function Skeleton({
  width = '100%',
  height = '1em',
  radius = '4px',
  className = '',
  style = {},
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  )
}

export default Skeleton