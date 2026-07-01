import { MapPin, Clock, Ticket, Mic, Repeat, ExternalLink } from 'lucide-react'
import { formatPrice } from '../data/gigs.js'

function dateParts(start) {
  return {
    day: start.toLocaleDateString('en-AU', { day: 'numeric' }),
    month: start.toLocaleDateString('en-AU', { month: 'short' }),
    weekday: start.toLocaleDateString('en-AU', { weekday: 'short' }),
    time: start.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }),
  }
}

// The left-hand badge differs per item kind.
function Badge({ item }) {
  if (item.kind === 'gig') {
    const d = dateParts(item.start)
    return (
      <div className="gig-card__date">
        <span className="gig-card__weekday">{d.weekday}</span>
        <span className="gig-card__day">{d.day}</span>
        <span className="gig-card__month">{d.month}</span>
      </div>
    )
  }
  if (item.kind === 'open-mic') {
    return (
      <div className="gig-card__date gig-card__date--openmic">
        <Mic size={20} />
        <span className="gig-card__badge-label">Open mic</span>
      </div>
    )
  }
  return (
    <div className="gig-card__date gig-card__date--venue">
      <Repeat size={20} />
      <span className="gig-card__badge-label">Regular</span>
    </div>
  )
}

export default function GigList({ gigs, selectedId, onSelect }) {
  if (gigs.length === 0) {
    return (
      <div className="empty">
        <p>Nothing matches your filters.</p>
        <p className="empty__hint">Try clearing the type, genre or region.</p>
      </div>
    )
  }

  return (
    <ul className="gig-list">
      {gigs.map((g) => {
        const d = g.start ? dateParts(g.start) : null
        const free = g.price === 0
        return (
          <li
            key={g.id}
            className={'gig-card' + (g.id === selectedId ? ' gig-card--active' : '')}
            onClick={() => onSelect(g.id)}
          >
            <Badge item={g} />

            <div className="gig-card__body">
              <h3>{g.title}</h3>

              {g.kind === 'venue' ? (
                <p className="gig-card__venue">
                  <MapPin size={13} /> {g.suburb} · {g.type}
                </p>
              ) : (
                <p className="gig-card__venue">
                  <MapPin size={13} /> {g.venueName} · {g.suburb}
                </p>
              )}

              <div className="gig-card__row">
                {g.kind === 'gig' && (
                  <span className="gig-card__time">
                    <Clock size={13} /> {d.time}
                  </span>
                )}
                {g.kind === 'open-mic' && (
                  <span className="gig-card__time">Turn up &amp; watch</span>
                )}
                {g.kind === 'venue' && (
                  <span className="gig-card__time">See what's on</span>
                )}

                {g.genre && g.genre !== 'Open mic' && (
                  <span className="tag">{g.genre}</span>
                )}

                <span className="gig-card__right">
                  {g.price != null && (
                    <span
                      className={'gig-card__price' + (free ? ' is-free' : '')}
                    >
                      <Ticket size={13} /> {formatPrice(g.price)}
                    </span>
                  )}
                  {g.website && (
                    <a
                      className="gig-card__web"
                      href={g.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      title="Venue website"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
