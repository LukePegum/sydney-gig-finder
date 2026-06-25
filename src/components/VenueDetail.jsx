import {
  payModelLabels,
  originalityLabels,
} from '../data/venues.js'

export default function VenueDetail({ venue, onBack }) {
  const isOsm = venue.source === 'osm'

  return (
    <div className="detail">
      <button className="detail__back" onClick={onBack}>
        ← Back to list
      </button>

      <h2>{venue.name}</h2>
      <p className="detail__meta">
        {[
          venue.suburb,
          venue.type,
          venue.capacity ? `~${venue.capacity} capacity` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>

      {(venue.genres.length > 0 || !isOsm) && (
        <div className="detail__tags">
          {venue.genres.map((g) => (
            <span key={g} className="tag">
              {g}
            </span>
          ))}
          {!isOsm && (
            <span className="tag tag--alt">
              {originalityLabels[venue.originality]}
            </span>
          )}
        </div>
      )}

      {isOsm ? (
        <section className="detail__section detail__unverified">
          <h4>📍 Community-mapped venue (OpenStreetMap)</h4>
          <p>
            This venue was mapped by the OpenStreetMap community. We don't have
            verified booking requirements or pay for it. Treat it as a lead:
            check whether it actually programs live music, then contact the
            venue directly to ask about playing.
          </p>
        </section>
      ) : (
        <>
          <section className="detail__section detail__pay">
            <h4>💰 Potential pay</h4>
            <p className="detail__paymodel">{payModelLabels[venue.payModel]}</p>
            <p>{venue.payEstimate}</p>
          </section>

          <section className="detail__section">
            <h4>✅ Requirements to apply / play</h4>
            <ul>
              {venue.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          <section className="detail__section">
            <h4>📨 How to apply</h4>
            <p>{venue.howToApply}</p>
          </section>
        </>
      )}

      {venue.notes && (
        <section className="detail__section">
          <h4>📝 Notes</h4>
          <p>{venue.notes}</p>
        </section>
      )}

      {venue.website ? (
        <a
          className="detail__cta"
          href={venue.website}
          target="_blank"
          rel="noreferrer noopener"
        >
          Visit venue website ↗
        </a>
      ) : (
        <a
          className="detail__cta detail__cta--alt"
          href={`https://www.google.com/search?q=${encodeURIComponent(
            venue.name + ' ' + (venue.suburb || 'Sydney') + ' live music booking'
          )}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Search for this venue ↗
        </a>
      )}

      <p className="detail__disclaimer">
        {isOsm
          ? 'Location data from OpenStreetMap contributors. Booking details unverified — always confirm directly with the venue.'
          : 'Pay & requirements are indicative only — confirm current terms with the venue before applying.'}
      </p>
    </div>
  )
}
