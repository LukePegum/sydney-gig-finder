import { payModelLabels } from '../data/venues.js'

export default function VenueList({ venues, selectedId, onSelect }) {
  if (venues.length === 0) {
    return (
      <div className="empty">
        <p>No venues match your filters.</p>
        <p className="empty__hint">Try clearing the genre or search.</p>
      </div>
    )
  }

  return (
    <ul className="venue-list">
      {venues.map((v) => {
        const isOsm = v.source === 'osm'
        const isOpenMic = v.categories?.includes('open-mic')
        return (
          <li
            key={v.id}
            className={
              'venue-card' +
              (v.id === selectedId ? ' venue-card--active' : '') +
              (isOsm ? ' venue-card--osm' : '')
            }
            onClick={() => onSelect(v.id)}
          >
            <div className="venue-card__top">
              <h3>{v.name}</h3>
              {v.capacity ? (
                <span className="venue-card__cap">~{v.capacity} cap</span>
              ) : (
                <span className="venue-card__badge">OSM</span>
              )}
            </div>
            <p className="venue-card__meta">
              {[v.suburb, v.type].filter(Boolean).join(' · ')}
            </p>
            {v.genres.length > 0 && (
              <div className="venue-card__tags">
                {v.genres.slice(0, 3).map((g) => (
                  <span key={g} className="tag">
                    {g}
                  </span>
                ))}
              </div>
            )}
            {isOsm ? (
              <p className="venue-card__unverified">
                📍 Community-mapped — booking & pay unverified
              </p>
            ) : isOpenMic ? (
              <p className="venue-card__openmic">🎤 Open mic — {v.payEstimate}</p>
            ) : (
              <p className="venue-card__pay">
                💰 {payModelLabels[v.payModel]} — {v.payEstimate}
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
