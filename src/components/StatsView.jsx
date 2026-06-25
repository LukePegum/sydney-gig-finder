import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'
import { payTierLabels } from '../data/venues.js'

const PALETTE = ['#4f46e5', '#e11d48', '#0d9488', '#ea580c', '#d97706', '#7c3aed']
const AXIS = '#9ca3af'
const GRID = '#e6e7eb'

function countBy(items, keyFn) {
  const map = new Map()
  for (const it of items) {
    for (const k of [].concat(keyFn(it))) {
      if (k == null) continue
      map.set(k, (map.get(k) || 0) + 1)
    }
  }
  return map
}

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #e6e7eb',
  borderRadius: 8,
  color: '#18181b',
  fontSize: 13,
  boxShadow: '0 6px 20px rgba(16,18,32,0.1)',
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      {subtitle && <p className="stat-card__sub">{subtitle}</p>}
      <div className="stat-card__chart">{children}</div>
    </div>
  )
}

export default function StatsView({ venues }) {
  const stats = useMemo(() => {
    // Region (all venues)
    const byRegion = [...countBy(venues, (v) => v.region).entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Pay tier (only venues that have one)
    const tierMap = countBy(
      venues.filter((v) => typeof v.payTier === 'number'),
      (v) => v.payTier
    )
    const byTier = [0, 1, 2, 3, 4].map((t) => ({
      name: payTierLabels[t],
      count: tierMap.get(t) || 0,
    }))

    // Top genres
    const byGenre = [...countBy(venues, (v) => v.genres).entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return { byRegion, byTier, byGenre, total: venues.length }
  }, [venues])

  if (stats.total === 0) {
    return (
      <div className="stats stats--empty">
        <p>No venues match your filters — nothing to chart.</p>
      </div>
    )
  }

  return (
    <div className="stats">
      <p className="stats__intro">
        Charts reflect the <strong>{stats.total}</strong> venue
        {stats.total === 1 ? '' : 's'} currently matching your filters. Adjust
        the filters to slice the data.
      </p>

      <div className="stats__grid">
        <ChartCard title="Venues by region" subtitle="Where the gigs are">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={stats.byRegion}
              layout="vertical"
              margin={{ left: 10, right: 16 }}
            >
              <CartesianGrid horizontal={false} stroke={GRID} />
              <XAxis type="number" stroke={AXIS} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke={AXIS}
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {stats.byRegion.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Pay-tier spread"
          subtitle="Indicative pay level (curated venues)"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.byTier} margin={{ left: -10, right: 10 }}>
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 11 }} />
              <YAxis stroke={AXIS} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats.byTier.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top genres"
          subtitle="Most common across matching venues"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stats.byGenre}
              layout="vertical"
              margin={{ left: 10, right: 16 }}
            >
              <CartesianGrid horizontal={false} stroke={GRID} />
              <XAxis type="number" stroke={AXIS} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke={AXIS}
                width={110}
                tick={{ fontSize: 12 }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#6b3df5">
                {stats.byGenre.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
