import {
  ArrowLeft,
  MapPin,
  Banknote,
  Clock,
  Upload,
  ListChecks,
  Send,
  StickyNote,
  ExternalLink,
  Search,
  FileText,
  FolderOpen,
  Video,
  Link2,
  Headphones,
  CircleCheck,
} from 'lucide-react'

const SUBMIT_ICON = {
  form: FileText,
  epk: FolderOpen,
  video: Video,
  socials: Link2,
  streaming: Headphones,
  none: CircleCheck,
}
import {
  payModelLabels,
  payTierLabels,
  originalityLabels,
  responsivenessLabels,
  submitLabels,
} from '../data/venues.js'

export default function VenueDetail({ venue, onBack }) {
  const isOsm = venue.source === 'osm'

  return (
    <div className="detail">
      <button className="detail__back" onClick={onBack}>
        <ArrowLeft size={15} /> Back to list
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
          <h4>
            <MapPin size={14} /> Community-mapped venue (OpenStreetMap)
          </h4>
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
            <h4>
              <Banknote size={14} /> Potential pay
            </h4>
            <p className="detail__paymodel">
              {payModelLabels[venue.payModel]}
              {typeof venue.payTier === 'number' && (
                <span className="detail__tier">
                  {' · '}
                  {payTierLabels[venue.payTier]}
                </span>
              )}
            </p>
            <p>{venue.payEstimate}</p>
          </section>

          {venue.responsiveness && (
            <section className="detail__section detail__resp">
              <h4>
                <Clock size={14} /> Estimated response time
              </h4>
              <p
                style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
              >
                <span className={`dot dot--${venue.responsiveness}`} />
                {responsivenessLabels[venue.responsiveness]}
              </p>
              <p className="detail__hint">
                Estimated from how this venue books (direct contact vs. a formal
                / ticketed process) — not a measured response time.
              </p>
            </section>
          )}

          {venue.submit && venue.submit.length > 0 && (
            <section className="detail__section">
              <h4>
                <Upload size={14} /> What to send / fill out
              </h4>
              <ul className="detail__submit">
                {venue.submit.map((s) => {
                  const Icon = SUBMIT_ICON[s] || FileText
                  return (
                    <li key={s}>
                      <Icon size={16} className="detail__submit-icon" />
                      {submitLabels[s] || s}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          <section className="detail__section">
            <h4>
              <ListChecks size={14} /> Requirements to apply / play
            </h4>
            <ul>
              {venue.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          <section className="detail__section">
            <h4>
              <Send size={14} /> How to apply
            </h4>
            <p>{venue.howToApply}</p>
          </section>
        </>
      )}

      {venue.notes && (
        <section className="detail__section">
          <h4>
            <StickyNote size={14} /> Notes
          </h4>
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
          Visit venue website <ExternalLink size={15} />
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
          <Search size={15} /> Search for this venue
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
