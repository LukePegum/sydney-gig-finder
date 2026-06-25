import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Centred on greater Sydney; the map then auto-fits to the visible venues.
const SYDNEY_CENTER = [-33.85, 151.05]

function markerIcon(active, venue) {
  const isOsm = venue.source === 'osm'
  const isOpenMic = venue.categories?.includes('open-mic')
  const color = active
    ? '#ff3d68'
    : isOpenMic
    ? '#f5a623'
    : isOsm
    ? '#16b3a6'
    : '#6b3df5'
  const size = active ? 34 : 26
  return L.divIcon({
    className: 'venue-marker',
    html: `<div class="pin ${active ? 'pin--active' : ''}" style="--pin-color:${color};--pin-size:${size}px"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

// Pan/zoom to the selected venue when it changes.
function FlyToSelected({ venues, selectedId }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedId) return
    const v = venues.find((x) => x.id === selectedId)
    if (v) map.flyTo([v.lat, v.lng], 15, { duration: 0.6 })
  }, [selectedId, venues, map])
  return null
}

// Fit the map to show every visible venue across Sydney. Re-runs when the set
// of venues changes, but not while a specific venue is selected.
function FitToVenues({ venues, selectedId }) {
  const map = useMap()
  const key = venues.map((v) => v.id).join(',')
  useEffect(() => {
    if (selectedId || venues.length === 0) return
    const bounds = L.latLngBounds(venues.map((v) => [v.lat, v.lng]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return null
}

export default function MapView({ venues, selectedId, onSelect }) {
  return (
    <MapContainer
      center={SYDNEY_CENTER}
      zoom={10}
      scrollWheelZoom
      className="leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToVenues venues={venues} selectedId={selectedId} />
      <FlyToSelected venues={venues} selectedId={selectedId} />
      {venues.map((v) => (
        <Marker
          key={v.id}
          position={[v.lat, v.lng]}
          icon={markerIcon(v.id === selectedId, v)}
          eventHandlers={{ click: () => onSelect(v.id) }}
        >
          <Popup>
            <strong>{v.name}</strong>
            <br />
            {v.suburb} · {v.type}
            <br />
            <button className="popup-btn" onClick={() => onSelect(v.id)}>
              View details →
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
