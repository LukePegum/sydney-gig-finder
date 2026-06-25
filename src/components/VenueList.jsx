import { MapPin, Mic, Banknote } from 'lucide-react'
import {
  payModelLabels,
  payTierGlyph,
  responsivenessLabels,
} from '../data/venues.js'

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
              {!isOsm && typeof v.payTier === 'number' && (
                <span
                  className="venue-card__tier"
                  title={isOpenMic ? 'No pay (open mic)' : `Pay tier: ${'$'.repeat(v.payTier)}`}
                >
                  {payTierGlyph(v.payTier)}
                </span>
              )}
            </div>
            <p className="venue-card__meta">
              {[
                v.suburb,
                v.type,
                v.capacity ? `~${v.capacity} cap` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {!isOsm && v.responsiveness && (
              <p className="venue-card__resp">
                <span className={`dot dot--${v.responsiveness}`} />
                Response: {responsivenessLabels[v.responsiveness]}
              </p>
            )}
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
                <MapPin size={14} /> Community-mapped — booking & pay unverified
              </p>
            ) : isOpenMic ? (
              <p className="venue-card__openmic">
                <Mic size={14} /> Open mic — {v.payEstimate}
              </p>
            ) : (
              <p className="venue-card__pay">
                <Banknote size={14} /> {payModelLabels[v.payModel]} —{' '}
                {v.payEstimate}
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
