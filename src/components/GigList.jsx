import { MapPin, Clock, Ticket } from 'lucide-react'
import { formatPrice } from '../data/gigs.js'

// Short date parts for the calendar-style badge.
function dateParts(start) {
  return {
    day: start.toLocaleDateString('en-AU', { day: 'numeric' }),
    month: start.toLocaleDateString('en-AU', { month: 'short' }),
    weekday: start.toLocaleDateString('en-AU', { weekday: 'short' }),
    time: start.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }),
  }
}

export default function GigList({ gigs, selectedId, onSelect }) {
  if (gigs.length === 0) {
    return (
      <div className="empty">
        <p>No upcoming gigs match your filters.</p>
        <p className="empty__hint">Try clearing the genre, region or price.</p>
      </div>
    )
  }

  return (
    <ul className="gig-list">
      {gigs.map((g) => {
        const d = dateParts(g.start)
        const free = g.price === 0
        return (
          <li
            key={g.id}
            className={'gig-card' + (g.id === selectedId ? ' gig-card--active' : '')}
            onClick={() => onSelect(g.id)}
          >
            <div className="gig-card__date">
              <span className="gig-card__weekday">{d.weekday}</span>
              <span className="gig-card__day">{d.day}</span>
              <span className="gig-card__month">{d.month}</span>
            </div>
            <div className="gig-card__body">
              <h3>{g.artist}</h3>
              <p className="gig-card__venue">
                <MapPin size={13} /> {g.venueName} · {g.suburb}
              </p>
              <div className="gig-card__row">
                <span className="gig-card__time">
                  <Clock size={13} /> {d.time}
                </span>
                <span className="tag">{g.genre}</span>
                <span className={'gig-card__price' + (free ? ' is-free' : '')}>
                  <Ticket size={13} /> {formatPrice(g.price)}
                </span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
