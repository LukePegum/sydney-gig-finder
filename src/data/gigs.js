// ─────────────────────────────────────────────────────────────────────────
// SAMPLE GIG LISTINGS — DEMO DATA ONLY.
//
// These are fictional shows (invented artists, dates, times and prices) used to
// demonstrate the "Attend" mode. They are NOT real events. There is no free,
// keyless source of live gig listings, so this stands in for one — the shape
// below (venueId + date/time/price/artist) is what a real feed would populate.
//
// Dates are set in July 2026 so they read as "upcoming"; refresh these or wire
// a real ticketing API before using this for anything real.
// ─────────────────────────────────────────────────────────────────────────

export const gigs = [
  { id: 'g1', venueId: 'lazybones', artist: 'Coralline', genre: 'Funk', date: '2026-07-02', time: '20:30', price: 15 },
  { id: 'g2', venueId: 'lansdowne', artist: 'Gutter Roses', genre: 'Punk', date: '2026-07-03', time: '20:00', price: 20 },
  { id: 'g3', venueId: 'oaf', artist: 'Neon Verandah', genre: 'Indie', date: '2026-07-04', time: '20:00', price: 38 },
  { id: 'g4', venueId: 'beach-road-bondi', artist: 'The Foreshore', genre: 'Indie', date: '2026-07-04', time: '20:00', price: 0 },
  { id: 'g5', venueId: 'vanguard', artist: 'The Inner West Standards', genre: 'Jazz', date: '2026-07-05', time: '19:30', price: 35 },
  { id: 'g6', venueId: 'camelot', artist: 'The Sandstone Choir', genre: 'World', date: '2026-07-06', time: '19:30', price: 30 },
  { id: 'g7', venueId: 'townie', artist: 'Harbour Static', genre: 'Soul', date: '2026-07-07', time: '20:00', price: 0 },
  { id: 'g8', venueId: 'leadbelly', artist: 'The Loose Threads', genre: 'Folk', date: '2026-07-08', time: '20:00', price: 20 },
  { id: 'g9', venueId: 'marys-underground', artist: 'Midnight Tram', genre: 'Jazz', date: '2026-07-09', time: '20:00', price: 33 },
  { id: 'g10', venueId: 'frankies', artist: 'The Night Ferries', genre: 'Rock', date: '2026-07-10', time: '21:00', price: 0 },
  { id: 'g11', venueId: 'factory', artist: 'Little Fires', genre: 'Indie', date: '2026-07-11', time: '20:00', price: 45 },
  { id: 'g12', venueId: 'coogee-bay', artist: 'Velvet Arcade', genre: 'Rock', date: '2026-07-11', time: '21:00', price: 15 },
  { id: 'g13', venueId: 'lazybones', artist: 'Wax & Wane', genre: 'Latin', date: '2026-07-12', time: '21:00', price: 18 },
  { id: 'g14', venueId: 'the-newport', artist: 'Saltwater Kites', genre: 'Acoustic', date: '2026-07-13', time: '15:00', price: 0 },
  { id: 'g15', venueId: 'golden-barley', artist: 'Static Harbour', genre: 'Acoustic', date: '2026-07-16', time: '19:00', price: 0 },
  { id: 'g16', venueId: 'lansdowne', artist: 'Highbeam', genre: 'Rock', date: '2026-07-17', time: '20:30', price: 22 },
  { id: 'g17', venueId: 'bridge-rozelle', artist: 'Tallowood', genre: 'Blues', date: '2026-07-18', time: '20:30', price: 25 },
  { id: 'g18', venueId: 'vanguard', artist: 'Otis & the Overtime', genre: 'Soul', date: '2026-07-19', time: '19:30', price: 40 },
  { id: 'g19', venueId: 'penrith-rsl', artist: 'Parkes Radio', genre: 'Country', date: '2026-07-19', time: '20:00', price: 30 },
  { id: 'g20', venueId: 'the-concourse', artist: 'Paper Lantern Parade', genre: 'World', date: '2026-07-20', time: '19:00', price: 55 },
  { id: 'g21', venueId: 'riverside-parramatta', artist: "The Ferryman's Daughter", genre: 'Cabaret', date: '2026-07-23', time: '19:30', price: 48 },
  { id: 'g22', venueId: 'manly-boatshed', artist: 'Marlow & the Tide', genre: 'Funk', date: '2026-07-24', time: '21:00', price: 20 },
  { id: 'g23', venueId: 'oaf', artist: 'Cassette Sunday', genre: 'Pop', date: '2026-07-25', time: '20:00', price: 42 },
  { id: 'g24', venueId: 'hornsby-rsl', artist: 'The Understudies', genre: 'Covers', date: '2026-07-25', time: '20:00', price: 25 },
  { id: 'g25', venueId: 'factory', artist: 'Bête Noire', genre: 'Alternative', date: '2026-07-26', time: '20:00', price: 49 },
  { id: 'g26', venueId: 'brass-monkey', artist: 'Saltbush Union', genre: 'Blues', date: '2026-07-26', time: '19:30', price: 35 },
  { id: 'g27', venueId: 'campbelltown-catholic-club', artist: 'The Greenhouse Effect', genre: 'Pop', date: '2026-07-31', time: '20:00', price: 28 },
  { id: 'g28', venueId: 'west-hq', artist: 'Ember & Oak', genre: 'Pop', date: '2026-08-01', time: '19:30', price: 65 },
]

// Join gigs to their venue and keep only upcoming ones, soonest first.
export function getUpcomingGigs(venues, fromDate = new Date()) {
  const byId = new Map(venues.map((v) => [v.id, v]))
  const from = new Date(fromDate)
  from.setHours(0, 0, 0, 0)

  return gigs
    .map((g) => {
      const v = byId.get(g.venueId)
      if (!v) return null
      return {
        ...g,
        start: new Date(`${g.date}T${g.time}`),
        venueName: v.name,
        suburb: v.suburb,
        region: v.region,
        type: v.type,
        lat: v.lat,
        lng: v.lng,
        website: v.website,
      }
    })
    .filter(Boolean)
    .filter((g) => g.start >= from)
    .sort((a, b) => a.start - b.start)
}

export const allGigGenres = Array.from(new Set(gigs.map((g) => g.genre))).sort()

export const attendKindLabels = {
  gig: 'Ticketed gigs',
  'open-mic': 'Open mic (free / amateur)',
  venue: 'Venues to explore',
}

// Build the full list of things a gig-goer can attend, combining:
//  - 'gig'      dated ticketed shows (from the sample gigs above)
//  - 'open-mic' free amateur / open-mic nights (from open-mic venues)
//  - 'venue'    rooms with regular live music but no specific listing yet
// Every item carries the venue's website for a direct link.
export function getAttendItems(venues, fromDate = new Date()) {
  const gigItems = getUpcomingGigs(venues, fromDate).map((g) => ({
    ...g,
    kind: 'gig',
    title: g.artist,
  }))

  const openMic = venues
    .filter((v) => v.categories?.includes('open-mic'))
    .map((v) => ({
      id: 'om-' + v.id,
      kind: 'open-mic',
      title: 'Open Mic Night',
      artist: 'Open Mic Night',
      venueId: v.id,
      venueName: v.name,
      suburb: v.suburb,
      region: v.region,
      type: v.type,
      lat: v.lat,
      lng: v.lng,
      website: v.website,
      genre: 'Open mic',
      price: 0,
      start: null,
    }))

  // Venues already represented by a dated gig or an open-mic night.
  const covered = new Set([...gigItems, ...openMic].map((i) => i.venueId))

  const regular = venues
    .filter((v) => !v.source && !v.categories && !covered.has(v.id))
    .map((v) => ({
      id: 'reg-' + v.id,
      kind: 'venue',
      title: v.name,
      artist: v.name,
      venueId: v.id,
      venueName: v.name,
      suburb: v.suburb,
      region: v.region,
      type: v.type,
      lat: v.lat,
      lng: v.lng,
      website: v.website,
      genre: v.genres?.[0] || 'Live music',
      price: null,
      start: null,
    }))

  return [...gigItems, ...openMic, ...regular]
}

// Nicely formatted date/time, e.g. "Fri 3 Jul · 8:00 PM".
export function formatGigDate(start) {
  const d = start.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const t = start.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${d} · ${t}`
}

export function formatPrice(price) {
  return price === 0 ? 'Free' : `$${price}`
}
