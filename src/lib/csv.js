export const NUMBER_FIELDS = [
  'gameweek',
  'minutes_played',
  'goals',
  'assists',
  'shots_on_target',
  'team_goals_conceded',
  'tackles_won',
  'interceptions',
  'clearances',
  'blocks',
  'chances_created',
  'successful_dribbles',
  'accurate_crosses',
  'accurate_passes',
  'accurate_passes_percent',
  'saves',
  'fouls_committed',
  'penalties_scored',
  'penalties_missed',
  'yellow_cards',
  'red_cards',
  'recoveries',
  'duels_won',
  'aerial_duels_won',
  'was_fouled',
  'xg',
  'xa',
]

export function splitCsvLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const headers = splitCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line)
    const row = {}
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? ''
    })
    NUMBER_FIELDS.forEach((f) => {
      row[f] = Number(row[f] || 0)
    })
    return row
  })
}

export function toCsv(rows, columns) {
  if (!rows.length) return ''
  const headers = columns.map((c) => c.label).join(',')
  const lines = rows.map((r) =>
    columns
      .map((c) => {
        const v = c.value(r)
        const s = v == null ? '' : String(v)
        return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
      })
      .join(','),
  )
  return [headers, ...lines].join('\n')
}

export function downloadBlob(content, filename, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
