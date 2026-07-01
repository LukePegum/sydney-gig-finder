import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ExternalLink,
  Search,
} from 'lucide-react'
import { formatGigDate, formatPrice } from '../data/gigs.js'

export default function GigDetail({ gig, onBack }) {
  const free = gig.price === 0
  return (
    <div className="detail">
      <button className="detail__back" onClick={onBack}>
        <ArrowLeft size={15} /> Back to gigs
      </button>

      <h2>{gig.artist}</h2>
      <p className="detail__meta">{gig.genre}</p>

      <div className="gig-detail__facts">
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
        <div className={'gig-fact gig-fact--price' + (free ? ' is-free' : '')}>
          <Ticket size={16} />
          <span>{formatPrice(gig.price)}</span>
        </div>
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
          Tickets &amp; info <ExternalLink size={15} />
        </a>
      ) : (
        <a
          className="detail__cta detail__cta--alt"
          href={`https://www.google.com/search?q=${encodeURIComponent(
            gig.artist + ' ' + gig.venueName + ' tickets'
          )}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Search size={15} /> Find tickets
        </a>
      )}

      <p className="detail__disclaimer">
        Sample listing for demonstration — not a real event. Always check the
        venue's own what's-on / ticketing page for actual dates and prices.
      </p>
    </div>
  )
}
