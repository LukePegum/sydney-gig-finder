import { useEffect, useMemo, useState } from 'react'
import { Music, Map as MapIcon, BarChart3, Guitar, Ticket } from 'lucide-react'
import {
  venues as curatedVenues,
  allGenres,
  allRegions,
  originalityLabels,
  categoryLabels,
  sortLabels,
  venueCategories,
} from './data/venues.js'
import { getAttendItems, attendKindLabels } from './data/gigs.js'
import { fetchOsmVenues } from './data/fetchOsmVenues.js'
import MapView from './components/MapView.jsx'
import StatsView from './components/StatsView.jsx'
import Filters from './components/Filters.jsx'
import VenueList from './components/VenueList.jsx'
import VenueDetail from './components/VenueDetail.jsx'
import AttendFilters from './components/AttendFilters.jsx'
import GigList from './components/GigList.jsx'
import GigDetail from './components/GigDetail.jsx'

const emptyFilters = {
  search: '',
  genre: 'all',
  region: 'all',
  originality: 'all',
  category: 'all', // 'all' | 'gig' | 'open-mic' | 'live-music'
  source: 'all', // 'all' | 'curated' | 'osm'
  sort: 'default', // 'default' | 'pay-desc' | 'pay-asc' | 'response'
}

const emptyGigFilters = {
  search: '',
  region: 'all',
  genre: 'all',
  kind: 'all', // 'all' | 'gig' | 'open-mic' | 'venue'
  sort: 'date', // 'date' | 'price-asc' | 'price-desc'
  freeOnly: false,
}

const KIND_RANK = { gig: 0, 'open-mic': 1, venue: 2 }

const RESPONSE_RANK = { fast: 0, medium: 1, slow: 2 }

export default function App() {
  const [mode, setMode] = useState('perform') // 'perform' | 'attend'
  const [filters, setFilters] = useState(emptyFilters)
  const [gigFilters, setGigFilters] = useState(emptyGigFilters)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedGigId, setSelectedGigId] = useState(null)
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

  // ───────── Perform mode: venue filtering + sorting ─────────
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

    const payOf = (v) => (typeof v.payTier === 'number' ? v.payTier : -1)
    const respOf = (v) =>
      v.responsiveness != null ? RESPONSE_RANK[v.responsiveness] : 99
    const sorted = [...list]
    if (filters.sort === 'pay-desc') {
      sorted.sort((a, b) => payOf(b) - payOf(a))
    } else if (filters.sort === 'pay-asc') {
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

  // ───────── Attend mode: gigs, open-mic nights & venues to explore ─────────
  const attendItems = useMemo(() => getAttendItems(curatedVenues), [])

  const attendGenres = useMemo(
    () =>
      Array.from(
        new Set(
          attendItems
            .map((i) => i.genre)
            .filter((g) => g && g !== 'Open mic' && g !== 'Live music')
        )
      ).sort(),
    [attendItems]
  )

  const filteredGigs = useMemo(() => {
    const q = gigFilters.search.trim().toLowerCase()
    const list = attendItems.filter((i) => {
      const matchesSearch =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.venueName.toLowerCase().includes(q) ||
        i.suburb.toLowerCase().includes(q)
      const matchesRegion =
        gigFilters.region === 'all' || i.region === gigFilters.region
      const matchesGenre =
        gigFilters.genre === 'all' || i.genre === gigFilters.genre
      const matchesKind =
        gigFilters.kind === 'all' || i.kind === gigFilters.kind
      const matchesFree = !gigFilters.freeOnly || i.price === 0
      return (
        matchesSearch &&
        matchesRegion &&
        matchesGenre &&
        matchesKind &&
        matchesFree
      )
    })

    const timeOf = (i) => (i.start ? i.start.getTime() : Infinity)
    const sorted = [...list]
    if (gigFilters.sort === 'price-asc') {
      const p = (i) => (i.price == null ? Infinity : i.price)
      sorted.sort((a, b) => p(a) - p(b) || timeOf(a) - timeOf(b))
    } else if (gigFilters.sort === 'price-desc') {
      const p = (i) => (i.price == null ? -Infinity : i.price)
      sorted.sort((a, b) => p(b) - p(a) || timeOf(a) - timeOf(b))
    } else {
      // Date: dated gigs first (soonest), then open-mic, then venues.
      sorted.sort(
        (a, b) =>
          timeOf(a) - timeOf(b) || KIND_RANK[a.kind] - KIND_RANK[b.kind]
      )
    }
    return sorted
  }, [gigFilters, attendItems])

  // One map marker per venue that has upcoming gigs.
  const gigVenues = useMemo(() => {
    const m = new Map()
    for (const g of filteredGigs) {
      if (!m.has(g.venueId)) {
        m.set(g.venueId, {
          id: g.venueId,
          name: g.venueName,
          suburb: g.suburb,
          lat: g.lat,
          lng: g.lng,
          genres: [],
          count: 0,
        })
      }
      m.get(g.venueId).count++
    }
    return [...m.values()].map((v) => ({
      ...v,
      type: `${v.count} upcoming gig${v.count > 1 ? 's' : ''}`,
    }))
  }, [filteredGigs])

  const selectedGig = filteredGigs.find((g) => g.id === selectedGigId) || null

  const handleGigVenueSelect = (venueId) => {
    const g = filteredGigs.find((x) => x.venueId === venueId)
    if (g) setSelectedGigId(g.id)
  }

  const isAttend = mode === 'attend'

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
              {isAttend
                ? 'Live gigs, free open-mic nights and venues to explore around Sydney — dates, times and ticket prices.'
                : 'Live-music venues you can apply to play — requirements, booking contacts and indicative pay.'}
            </p>
          </div>
        </div>

        <div className="app-header__right">
          <div className="mode-toggle" role="tablist" aria-label="Mode">
            <button
              className={!isAttend ? 'is-active' : ''}
              onClick={() => setMode('perform')}
            >
              <Guitar size={15} /> Perform
            </button>
            <button
              className={isAttend ? 'is-active' : ''}
              onClick={() => setMode('attend')}
            >
              <Ticket size={15} /> Attend
            </button>
          </div>

          {!isAttend && (
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
          )}

          <div className="app-header__count">
            {isAttend ? (
              `${filteredGigs.length} gig${
                filteredGigs.length === 1 ? '' : 's'
              } & venues to explore`
            ) : (
              <>
                {filtered.length} shown · {curatedVenues.length} curated
                {osmStatus === 'done' &&
                  ` + ${osmVenues.length} community-mapped`}
                {osmStatus === 'loading' && ' · loading map data…'}
                {osmStatus === 'error' && ' · (OSM venues unavailable)'}
              </>
            )}
          </div>
        </div>
      </header>

      {isAttend ? (
        <AttendFilters
          filters={gigFilters}
          onChange={setGigFilters}
          genres={attendGenres}
          regions={allRegions}
          kindLabels={attendKindLabels}
          onReset={() => setGigFilters(emptyGigFilters)}
        />
      ) : (
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
      )}

      <main className="app-body">
        <aside className="sidebar">
          {isAttend ? (
            selectedGig ? (
              <GigDetail gig={selectedGig} onBack={() => setSelectedGigId(null)} />
            ) : (
              <GigList
                gigs={filteredGigs}
                selectedId={selectedGigId}
                onSelect={setSelectedGigId}
              />
            )
          ) : selected ? (
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
          {isAttend ? (
            <MapView
              venues={gigVenues}
              selectedId={selectedGig?.venueId || null}
              onSelect={handleGigVenueSelect}
            />
          ) : view === 'map' ? (
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
        {isAttend ? (
          <>
            Gig listings shown here are <strong>sample data</strong> for
            demonstration — not real events. Always confirm dates, times and
            ticket prices on the venue's own what's-on page.
          </>
        ) : (
          <>
            Curated venues show <strong>indicative</strong> pay &amp;
            requirements — always confirm with the booker. Community-mapped
            (OpenStreetMap) venues are location-only and{' '}
            <strong>unverified</strong>.
          </>
        )}
      </footer>
    </div>
  )
}
