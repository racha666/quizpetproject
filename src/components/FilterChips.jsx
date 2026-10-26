const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'shonen', label: 'Сёнэн' },
  { key: 'shojo', label: 'Сёдзё' },
  { key: 'isekai', label: 'Isekai' },
  { key: 'classic', label: 'Классика' },
  { key: 'movie', label: 'Аниме-фильмы' },
  { key: 'seinen', label: 'Сэйнэн' },
]

function FilterChips({ activeFilter, onChange }) {
  return (
    <div className="filters">
      <span className="filters__label">Тематика:</span>
      {FILTERS.map(f => (
        <button
          key={f.key}
          className={`chip ${activeFilter === f.key ? 'chip--active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export default FilterChips