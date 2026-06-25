export default function Filters({
  filters,
  onChange,
  genres,
  regions,
  originalityLabels,
  categoryLabels,
  sortLabels,
  onReset,
}) {
  const set = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="filters">
      <input
        type="search"
        className="filters__search"
        placeholder="Search name, suburb or genre…"
        value={filters.search}
        onChange={(e) => set({ search: e.target.value })}
      />

      <label className="filters__field">
        <span>Opportunity</span>
        <select
          value={filters.category}
          onChange={(e) => set({ category: e.target.value })}
        >
          <option value="all">All opportunities</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

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
        <span>I play</span>
        <select
          value={filters.originality}
          onChange={(e) => set({ originality: e.target.value })}
        >
          <option value="all">Originals or covers</option>
          {Object.entries(originalityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field">
        <span>Source</span>
        <select
          value={filters.source}
          onChange={(e) => set({ source: e.target.value })}
        >
          <option value="all">All venues</option>
          <option value="curated">Curated (with pay info)</option>
          <option value="osm">Community-mapped only</option>
        </select>
      </label>

      <label className="filters__field">
        <span>Sort by</span>
        <select
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
        >
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <button className="filters__reset" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
