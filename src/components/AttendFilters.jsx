export default function AttendFilters({
  filters,
  onChange,
  genres,
  regions,
  onReset,
}) {
  const set = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="filters">
      <input
        type="search"
        className="filters__search"
        placeholder="Search artist or venue…"
        value={filters.search}
        onChange={(e) => set({ search: e.target.value })}
      />

      <label className="filters__field">
        <span>Region</span>
        <select
          value={filters.region}
          onChange={(e) => set({ region: e.target.value })}
        >
          <option value="all">All of Sydney</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field">
        <span>Genre</span>
        <select
          value={filters.genre}
          onChange={(e) => set({ genre: e.target.value })}
        >
          <option value="all">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field">
        <span>Sort by</span>
        <select
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
        >
          <option value="date">Date: soonest</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
        </select>
      </label>

      <label className="filters__check">
        <input
          type="checkbox"
          checked={filters.freeOnly}
          onChange={(e) => set({ freeOnly: e.target.checked })}
        />
        <span>Free only</span>
      </label>

      <button className="filters__reset" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
