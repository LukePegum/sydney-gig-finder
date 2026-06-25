import { useEffect, useMemo, useState } from 'react'
import { Music, Map as MapIcon, BarChart3 } from 'lucide-react'
import {
  venues as curatedVenues,
  allGenres,
  allRegions,
  originalityLabels,
  categoryLabels,
  sortLabels,
  venueCategories,
} from './data/venues.js'
import { fetchOsmVenues } from './data/fetchOsmVenues.js'
import MapView from './components/MapView.jsx'
import StatsView from './components/StatsView.jsx'
import Filters from './components/Filters.jsx'
import VenueList from './components/VenueList.jsx'
import VenueDetail from './components/VenueDetail.jsx'

const emptyFilters = {
  search: '',
  genre: 'all',
  region: 'all',
  originality: 'all',
  category: 'all', // 'all' | 'gig' | 'open-mic' | 'live-music'
  source: 'all', // 'all' | 'curated' | 'osm'
  sort: 'default', // 'default' | 'pay-desc' | 'pay-asc' | 'response'
}

const RESPONSE_RANK = { fast: 0, medium: 1, slow: 2 }

export default function App() {
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState('map') // 'map' | 'stats'
  const [osmVenues, setOsmVenues] = useState([])
  const [osmStatus, setOsmStatus] = useState('loading') // loading | done | error

  // Pull community-mapped venues from OpenStreetMap on first load.
  useEffect(() => {
    let cancelled = false
    fetchOsmVenues()
      .then((list) => {
        if (cancelled) return
        setOsmVenues(list)
        setOsmStatus('done')
      })
      .catch(() => {
        if (!cancelled) setOsmStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allVenues = useMemo(
    () => [...curatedVenues, ...osmVenues],
    [osmVenues]
  )

  const filtered = useMemo(() => {
    const list = allVenues.filter((v) => {
      const q = filters.search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        (v.suburb && v.suburb.toLowerCase().includes(q)) ||
        v.genres.some((g) => g.toLowerCase().includes(q))
      const matchesGenre =
        filters.genre === 'all' || v.genres.includes(filters.genre)
      const matchesRegion =
        filters.region === 'all' || v.region === filters.region
      const matchesCategory =
        filters.category === 'all' ||
        venueCategories(v).includes(filters.category)
      const matchesOriginality =
        filters.originality === 'all' ||
        v.originality === filters.originality ||
        v.originality === 'both'
      const isOsm = v.source === 'osm'
      const matchesSource =
        filters.source === 'all' ||
        (filters.source === 'osm' && isOsm) ||
        (filters.source === 'curated' && !isOsm)
      return (
        matchesSearch &&
        matchesGenre &&
        matchesRegion &&
        matchesCategory &&
        matchesOriginality &&
        matchesSource
      )
    })

    // Sorting. Venues with no data (e.g. OSM) sink to the bottom.
    const payOf = (v) => (typeof v.payTier === 'number' ? v.payTier : -1)
    const respOf = (v) =>
      v.responsiveness != null ? RESPONSE_RANK[v.responsiveness] : 99
    const sorted = [...list]
    if (filters.sort === 'pay-desc') {
      sorted.sort((a, b) => payOf(b) - payOf(a))
    } else if (filters.sort === 'pay-asc') {
      // Keep unknown-pay venues at the bottom even when ascending.
      sorted.sort((a, b) => {
        const pa = payOf(a) < 0 ? Infinity : payOf(a)
        const pb = payOf(b) < 0 ? Infinity : payOf(b)
        return pa - pb
      })
    } else if (filters.sort === 'response') {
      sorted.sort((a, b) => respOf(a) - respOf(b))
    }
    return sorted
  }, [filters, allVenues])

  const selected = allVenues.find((v) => v.id === selectedId) || null
  const curatedCount = curatedVenues.length

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__title">
          <span className="app-header__logo">
            <Music size={22} strokeWidth={2.2} />
          </span>
          <div>
            <h1>Sydney Gig Finder</h1>
            <p>
              Live-music venues you can apply to play — requirements, booking
              contacts and indicative pay.
            </p>
          </div>
        </div>
        <div className="app-header__right">
          <div className="view-toggle" role="tablist" aria-label="View">
            <button
              className={view === 'map' ? 'is-active' : ''}
              onClick={() => setView('map')}
            >
              <MapIcon size={15} /> Map
            </button>
            <button
              className={view === 'stats' ? 'is-active' : ''}
              onClick={() => setView('stats')}
            >
              <BarChart3 size={15} /> Insights
            </button>
          </div>
          <div className="app-header__count">
            {filtered.length} shown · {curatedCount} curated
            {osmStatus === 'done' && ` + ${osmVenues.length} community-mapped`}
            {osmStatus === 'loading' && ' · loading map data…'}
            {osmStatus === 'error' && ' · (OSM venues unavailable)'}
          </div>
        </div>
      </header>

      <Filters
        filters={filters}
        onChange={setFilters}
        genres={allGenres}
        regions={allRegions}
        originalityLabels={originalityLabels}
        categoryLabels={categoryLabels}
        sortLabels={sortLabels}
        onReset={() => setFilters(emptyFilters)}
      />

      <main className="app-body">
        <aside className="sidebar">
          {selected ? (
            <VenueDetail venue={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <VenueList
              venues={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </aside>

        <section className="map-pane">
          {view === 'map' ? (
            <MapView
              venues={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <StatsView venues={filtered} />
          )}
        </section>
      </main>

      <footer className="app-footer">
        Curated venues show <strong>indicative</strong> pay &amp; requirements —
        always confirm with the booker. Community-mapped (OpenStreetMap) venues
        are location-only and <strong>unverified</strong>.
      </footer>
    </div>
  )
}
