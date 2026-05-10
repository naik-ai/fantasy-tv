export function fmt(v, d = 2) {
  return Number(v || 0).toFixed(d)
}

export function round(v) {
  return Number.parseFloat(String(v ?? 0))
}

/** Map a delta value (rank or points) to one of the cockpit zone tokens. */
export function deltaZone(delta, kind = 'rank') {
  if (kind === 'rank') {
    if (delta >= 5) return 'cruise'
    if (delta >= 1) return 'idle'
    if (delta === 0) return 'dim'
    if (delta >= -4) return 'high'
    return 'redline'
  }
  // points delta (continuous)
  if (delta >= 8) return 'max'
  if (delta >= 2) return 'cruise'
  if (delta >= 0) return 'idle'
  if (delta >= -4) return 'high'
  return 'redline'
}

export function zoneTextClass(zone) {
  return {
    idle: 'text-[var(--zone-idle)]',
    slow: 'text-[var(--zone-slow)]',
    cruise: 'text-[var(--zone-cruise)]',
    high: 'text-[var(--zone-high)]',
    max: 'text-[var(--zone-max)]',
    redline: 'text-[var(--zone-redline)]',
    dim: 'text-[var(--dim)]',
  }[zone] || 'text-[var(--ink)]'
}
