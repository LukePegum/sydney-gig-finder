import { useEffect, useMemo, useState } from 'react'
import {
  venues as curatedVenues,
  allGenres,
  allRegions,
  originalityLabels,
  categoryLabels,
  venueCategories,
} from './data/venues.js'
import { fetchOsmVenues } from './data/fetchOsmVenues.js'
import MapView from './components/MapView.jsx'
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
}

export default function App() {
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedId, setSelectedId] = useState(null)
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
    return allVenues.filter((v) => {
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
  }, [filters, allVenues])

  const selected = allVenues.find((v) => v.id === selectedId) || null
  const curatedCount = curatedVenues.length

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__title">
          <h1>🎸 Sydney Gig Finder</h1>
          <p>
            Live-music venues you can apply to play — requirements, booking
            contacts and indicative pay.
          </p>
        </div>
        <div className="app-header__count">
          {filtered.length} shown · {curatedCount} curated
          {osmStatus === 'done' && ` + ${osmVenues.length} community-mapped`}
          {osmStatus === 'loading' && ' · loading map data…'}
          {osmStatus === 'error' && ' · (OSM venues unavailable)'}
        </div>
      </header>

      <Filters
        filters={filters}
        onChange={setFilters}
        genres={allGenres}
        regions={allRegions}
        originalityLabels={originalityLabels}
        categoryLabels={categoryLabels}
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
          <MapView
            venues={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
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
