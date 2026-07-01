import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Mic,
  Repeat,
  ExternalLink,
  Search,
} from 'lucide-react'
import { formatGigDate, formatPrice } from '../data/gigs.js'

export default function GigDetail({ gig, onBack }) {
  const free = gig.price === 0
  const isGig = gig.kind === 'gig'
  const isOpenMic = gig.kind === 'open-mic'

  return (
    <div className="detail">
      <button className="detail__back" onClick={onBack}>
        <ArrowLeft size={15} /> Back to list
      </button>

      <h2>{gig.title}</h2>
      <p className="detail__meta">
        {isOpenMic
          ? 'Open mic · free / amateur night'
          : gig.kind === 'venue'
          ? 'Venue with regular live music'
          : gig.genre}
      </p>

      <div className="gig-detail__facts">
        {isGig ? (
          <>
            <div className="gig-fact">
              <Calendar size={16} />
              <span>{formatGigDate(gig.start).split(' · ')[0]}</span>
            </div>
            <div className="gig-fact">
              <Clock size={16} />
              <span>
                {gig.start.toLocaleTimeString('en-AU', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div
              className={'gig-fact gig-fact--price' + (free ? ' is-free' : '')}
            >
              <Ticket size={16} />
              <span>{formatPrice(gig.price)}</span>
            </div>
          </>
        ) : isOpenMic ? (
          <>
            <div className="gig-fact">
              <Mic size={16} />
              <span>Open mic</span>
            </div>
            <div className="gig-fact gig-fact--price is-free">
              <Ticket size={16} />
              <span>Free</span>
            </div>
          </>
        ) : (
          <div className="gig-fact">
            <Repeat size={16} />
            <span>Regular live music</span>
          </div>
        )}
      </div>

      <section className="detail__section">
        <h4>
          <MapPin size={14} /> Venue
        </h4>
        <p>
          <strong>{gig.venueName}</strong>
          <br />
          {gig.suburb} · {gig.type}
        </p>
      </section>

      {gig.website ? (
        <a
          className="detail__cta"
          href={gig.website}
          target="_blank"
          rel="noreferrer noopener"
        >
          {isGig ? 'Tickets & info' : "See what's on"}{' '}
          <ExternalLink size={15} />
        </a>
      ) : (
        <a
          className="detail__cta detail__cta--alt"
          href={`https://www.google.com/search?q=${encodeURIComponent(
            gig.title + ' ' + gig.venueName + ' live music'
          )}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Search size={15} /> Search online
        </a>
      )}

      <p className="detail__disclaimer">
        {isGig
          ? 'Sample listing for demonstration — not a real event. Always check the venue’s own what’s-on / ticketing page for actual dates and prices.'
          : isOpenMic
          ? 'Open-mic nights are free to watch but run on changing schedules — confirm the current night on the venue’s page before heading down.'
          : 'This venue hosts live music regularly but has no specific listing here — check its what’s-on page for upcoming shows.'}
      </p>
    </div>
  )
}
