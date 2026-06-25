// Fetch live-music-ish venues across Greater Sydney from OpenStreetMap via the
// Overpass API. This captures many small / unadvertised spots that locals have
// tagged but that aren't in our curated list.
//
// What we CAN'T get from OSM: application requirements or pay — nobody tags
// that. So these come back as "location only" and are flagged unverified.

// Greater Sydney bounding box: south, west, north, east
const BBOX = '-34.20,150.50,-33.45,151.40'

// nwr = nodes + ways + relations. The first clause grabs ANY feature tagged
// with advertised live music (cafés, restaurants, breweries, halls, etc. — not
// just pubs/clubs); the rest add dedicated music venue types.
// First clause grabs ANY feature that advertises live music (cafés,
// restaurants, breweries, halls, events venues, etc.). The other two add
// dedicated music venue types. We deliberately DON'T pull every events_venue /
// theatre, since most are function centres or drama theatres, not gig rooms —
// those only appear if they're explicitly tagged with live music.
const QUERY = `
[out:json][timeout:30];
(
  nwr["live_music"="yes"](${BBOX});
  nwr["amenity"="nightclub"](${BBOX});
  nwr["amenity"="concert_hall"](${BBOX});
);
out center tags;
`

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

const AMENITY_LABELS = {
  nightclub: 'Nightclub',
  concert_hall: 'Concert hall',
  theatre: 'Theatre',
  events_venue: 'Events venue',
  pub: 'Pub',
  bar: 'Bar',
  cafe: 'Café',
  restaurant: 'Restaurant',
  biergarten: 'Beer garden',
  community_centre: 'Community centre',
  arts_centre: 'Arts centre',
  social_club: 'Social club',
  brewery: 'Brewery',
  winery: 'Winery',
}

function humanise(value) {
  return value
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

function typeLabel(tags) {
  const base =
    AMENITY_LABELS[tags.amenity] ||
    (tags.craft === 'brewery' ? 'Brewery' : null) ||
    (tags.leisure ? humanise(tags.leisure) : null) ||
    (tags.tourism ? humanise(tags.tourism) : null) ||
    (tags.shop ? humanise(tags.shop) : null) ||
    (tags.amenity ? humanise(tags.amenity) : null) ||
    'Venue'
  // Mark the ones explicitly advertising live music.
  return tags.live_music === 'yes' ? `${base} · live music` : base
}

function normalise(el) {
  const tags = el.tags || {}
  const lat = el.lat ?? el.center?.lat
  const lng = el.lon ?? el.center?.lon
  if (!tags.name || lat == null || lng == null) return null
  return {
    id: 'osm-' + el.type + '-' + el.id,
    name: tags.name,
    suburb: tags['addr:suburb'] || tags['addr:city'] || '',
    region: 'Community-mapped',
    lat,
    lng,
    type: typeLabel(tags),
    capacity: null,
    genres: [],
    categories: ['live-music'],
    originality: 'both',
    payModel: null,
    payEstimate: null,
    requirements: null,
    howToApply: null,
    website:
      tags.website || tags['contact:website'] || tags.url || '',
    source: 'osm',
    notes:
      'Mapped by the OpenStreetMap community. Booking, requirements and pay are NOT verified — research and contact the venue directly.',
  }
}

export async function fetchOsmVenues() {
  let lastError
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(QUERY),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      if (!res.ok) throw new Error('Overpass HTTP ' + res.status)
      const json = await res.json()
      const seen = new Set()
      const out = []
      for (const el of json.elements || []) {
        const v = normalise(el)
        if (!v) continue
        const key = v.name.toLowerCase() + '|' + v.lat.toFixed(4)
        if (seen.has(key)) continue
        seen.add(key)
        out.push(v)
      }
      return out
    } catch (err) {
      lastError = err
    }
  }
  throw lastError || new Error('Could not reach OpenStreetMap')
}
