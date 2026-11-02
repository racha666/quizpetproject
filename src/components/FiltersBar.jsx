function FiltersBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}) {
  const hasActiveFilters = activeFilter !== 'all' || searchQuery.trim() !== ''

  return (
    <div className="filters-bar">
      <div className="filters-bar__group">
        <label className="filters-bar__label" htmlFor="filter-difficulty">
          Сложность
        </label>
        <select
          id="filter-difficulty"
          className="filters-bar__select"
          value={activeFilter}
          onChange={e => {
            const v = e.target.value
            onFilterChange(v === 'all' ? 'all' : Number(v))
          }}
        >
            <option value="all">Все</option>
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
            <option value="4">★★★★</option>
            <option value="5">★★★★★</option>
        </select>
      </div>

      <div className="filters-bar__group filters-bar__group--search">
        <span className="filters-bar__search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="filters-bar__input"
          placeholder="Поиск по названию, тегам, организатору..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="filters-bar__clear"
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Очистить поиск"
          >
            ×
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <button
          className="filters-bar__reset"
          type="button"
          onClick={() => {
            onFilterChange('all')
            onSearchChange('')
          }}
        >
          Сбросить
        </button>
      )}

      <span className="filters-bar__count">
        {resultCount} из {totalCount}
      </span>
    </div>
  )
}

export default FiltersBar