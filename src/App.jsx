import { useState, useMemo, useCallback } from 'react'
import './App.css'

const C = {
  bg: '#0a0f1a',
  cd: '#111827',
  bd: '#1e293b',
  gd: '#f59e0b',
  gn: '#22c55e',
  rd: '#ef4444',
  bl: '#3b82f6',
  cy: '#06b6d4',
  pu: '#a855f7',
  tx: '#f1f5f9',
  dm: '#94a3b8',
  mt: '#475569',
}

const pC = { GK: C.gd, DEF: C.bl, MID: C.gn, FWD: C.rd }
const lC = [C.gd, C.gn, C.cy, C.pu, C.rd, C.bl]

const MK = ['mins', 'g', 'a', 'sot', 'cs', 'tkl', 'itc', 'clr', 'blk', 'kp', 'drb', 'crs', 'pa85', 'sv', 'fl', 'pm']

const DB = {
  GK: [
    {
      n: 'Ederson M.',
      t: 'MCI',
      p: 'GK',
      gp: 26,
      sv: 6,
      g: 0,
      a: 4,
      cs: 10,
      tk: 0,
      it: 1,
      cl: 16,
      dr: 0,
      s: 54,
      m: [
        [90, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 4, 0, 0],
        [90, 0, 1, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 5, 0, 0],
        [90, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0],
        [90, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 6, 0, 0],
      ],
    },
    {
      n: 'Pickford',
      t: 'EVE',
      p: 'GK',
      gp: 38,
      sv: 5,
      g: 0,
      a: 1,
      cs: 12,
      tk: 0,
      it: 1,
      cl: 52,
      dr: 0,
      s: 122,
      m: [
        [90, 0, 0, 0, 1, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0],
        [90, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
        [90, 0, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 6, 0, 0],
        [90, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0],
      ],
    },
  ],
  DEF: [
    {
      n: 'Virgil',
      t: 'LIV',
      p: 'DEF',
      gp: 37,
      sv: 8,
      g: 3,
      a: 1,
      cs: 14,
      tk: 20,
      it: 56,
      cl: 190,
      dr: 3,
      s: 0,
      m: [
        [90, 1, 0, 1, 0, 1, 1, 6, 0, 1, 0, 0, 1, 0, 1, 0],
        [90, 0, 1, 0, 0, 0, 1, 2, 1, 1, 0, 0, 1, 0, 2, 0],
        [90, 1, 0, 1, 0, 0, 1, 6, 0, 0, 0, 0, 1, 0, 1, 0],
        [90, 0, 0, 0, 1, 0, 1, 9, 3, 0, 0, 0, 1, 0, 1, 0],
      ],
    },
    {
      n: 'Gvardiol',
      t: 'MCI',
      p: 'DEF',
      gp: 37,
      sv: 7,
      g: 5,
      a: 0,
      cs: 13,
      tk: 39,
      it: 44,
      cl: 111,
      dr: 25,
      s: 0,
      m: [
        [90, 1, 0, 1, 0, 2, 2, 3, 2, 1, 1, 0, 1, 0, 2, 0],
        [90, 0, 0, 1, 1, 2, 3, 1, 0, 1, 1, 0, 0, 0, 1, 0],
        [90, 1, 0, 1, 0, 0, 3, 3, 1, 0, 0, 0, 1, 0, 0, 0],
        [90, 1, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0],
      ],
    },
  ],
  MID: [
    {
      n: 'M.Salah',
      t: 'LIV',
      p: 'MID',
      gp: 38,
      sv: 15,
      g: 29,
      a: 18,
      cs: 15,
      tk: 11,
      it: 9,
      cl: 5,
      dr: 58,
      s: 0,
      m: [
        [88, 2, 0, 3, 1, 0, 0, 0, 0, 2, 2, 1, 0, 0, 1, 0],
        [90, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
        [90, 1, 1, 2, 1, 1, 1, 1, 0, 3, 2, 1, 0, 0, 0, 0],
        [90, 2, 1, 2, 0, 1, 0, 0, 0, 3, 1, 1, 0, 0, 1, 0],
      ],
    },
    {
      n: 'Palmer',
      t: 'CHE',
      p: 'MID',
      gp: 37,
      sv: 12,
      g: 15,
      a: 8,
      cs: 10,
      tk: 20,
      it: 11,
      cl: 19,
      dr: 51,
      s: 0,
      m: [
        [90, 1, 0, 3, 0, 0, 0, 0, 0, 3, 1, 2, 0, 0, 1, 0],
        [90, 4, 0, 5, 0, 1, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0],
        [90, 1, 0, 1, 0, 0, 0, 0, 0, 5, 0, 1, 0, 0, 1, 0],
        [82, 1, 3, 1, 0, 0, 1, 0, 0, 4, 1, 0, 0, 0, 1, 0],
      ],
    },
  ],
  FWD: [
    {
      n: 'Haaland',
      t: 'MCI',
      p: 'FWD',
      gp: 31,
      sv: 15,
      g: 22,
      a: 3,
      cs: 10,
      tk: 6,
      it: 5,
      cl: 22,
      dr: 13,
      s: 0,
      m: [
        [90, 1, 0, 3, 1, 0, 0, 1, 0, 2, 2, 1, 0, 0, 0, 0],
        [90, 2, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [89, 3, 0, 4, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
        [90, 3, 0, 4, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      ],
    },
    {
      n: 'Isak',
      t: 'NEW',
      p: 'FWD',
      gp: 34,
      sv: 10,
      g: 23,
      a: 6,
      cs: 12,
      tk: 5,
      it: 3,
      cl: 17,
      dr: 42,
      s: 0,
      m: [
        [90, 1, 0, 1, 0, 1, 0, 0, 0, 2, 2, 0, 0, 0, 1, 0],
        [73, 3, 0, 5, 1, 0, 0, 0, 0, 2, 1, 1, 0, 0, 1, 0],
        [90, 1, 1, 1, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 3, 0],
        [79, 2, 0, 4, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0],
      ],
    },
  ],
}

const DEF_PTS = {
  g: 6,
  a: 4,
  sot: 1,
  cs: 4,
  tkl: 0.5,
  itc: 0.5,
  clr: 0.5,
  blk: 0.5,
  kp: 1,
  drb: 0.5,
  crs: 0.5,
  pa85: 2,
  sv: 0.5,
  fl: -0.25,
  pm: -3,
}

const DEF_TV = { anchor: 7, abs: 0.03, pct: 0.0004 }

const PT_LABELS = {
  g: 'Goal',
  a: 'Assist',
  sot: 'Shot on Tgt',
  cs: 'Clean Sheet',
  tkl: 'Tackle Won',
  itc: 'Interception',
  clr: 'Clearance',
  blk: 'Block',
  kp: 'Key Pass',
  drb: 'Dribble',
  crs: 'Cross',
  pa85: 'Pass Acc 85%',
  sv: 'Save',
  fl: 'Foul',
  pm: 'Pen Miss',
}

const PT_CATS = {
  ATK: ['g', 'a', 'sot', 'pm'],
  DEF_ACT: ['cs', 'tkl', 'itc', 'clr', 'blk'],
  SKILL: ['kp', 'drb', 'crs', 'pa85'],
  GK_ACT: ['sv'],
  DISC: ['fl'],
}

const CAT_LABELS = {
  ATK: 'Attacking',
  DEF_ACT: 'Defending',
  SKILL: 'Possession & Skill',
  GK_ACT: 'Goalkeeping',
  DISC: 'Discipline',
}

const CAT_COLORS = { ATK: C.gn, DEF_ACT: C.bl, SKILL: C.pu, GK_ACT: C.gd, DISC: C.rd }

const DEF_POS_TOGGLE = {}
Object.keys(PT_LABELS).forEach((k) => {
  DEF_POS_TOGGLE[k] = k === 'sv' ? { GK: true, DEF: false, MID: false, FWD: false } : { GK: true, DEF: true, MID: true, FWD: true }
})

function calcMP(match, pts, pos, posToggle) {
  let mp = match[0] >= 90 ? 3 : match[0] >= 60 ? 2 : 1
  MK.forEach((k, i) => {
    if (i > 0 && pts[k] !== undefined) {
      const enabled = posToggle?.[k] ? posToggle[k][pos] : true
      if (enabled) mp += match[i] * pts[k]
    }
  })
  return mp
}

function simTV(matches, stv, pts, tv, pos, posToggle) {
  let cur = stv
  return matches.map((m) => {
    const mp = calcMP(m, pts, pos, posToggle)
    const d = (mp - tv.anchor) * tv.abs + (mp - tv.anchor) * tv.pct * stv
    cur = Math.max(0, cur + d)
    return { mp: Math.round(mp * 10) / 10, tv: Math.round(cur * 100) / 100 }
  })
}

function exportCSV(all, pts, tv) {
  const rows = Object.values(all).sort((a, b) => b.finalTV - a.finalTV)
  const ptsStr = Object.entries(pts)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')
  const tvStr = `anchor=${tv.anchor}, abs_rate=${tv.abs}, pct_rate=${tv.pct}`

  let csv = '# Football Fantasy TV Report\n'
  csv += `# Points Config: ${ptsStr}\n`
  csv += `# TV Formula: ${tvStr}\n`
  csv += `# WC Equiv (x5): abs_rate=${(tv.abs * 5).toFixed(3)} pct_rate=${(tv.pct * 5).toFixed(4)}\n\n`
  csv += 'Rank,Player,Position,Team,GP,Goals,Assists,CS,Tackles,Interceptions,Clearances,Dribbles,Saves,Avg MP,Start $M,End $M,Change %,TV Delta $M\n'

  rows.forEach((p, i) => {
    csv += [
      i + 1,
      p.name,
      p.pos,
      p.team,
      p.gp,
      p.g,
      p.a,
      p.cs,
      p.tk,
      p.it,
      p.cl,
      p.dr,
      p.s,
      p.avgMP,
      p.stv,
      p.finalTV,
      p.pctChg,
      (p.finalTV - p.stv).toFixed(2),
    ].join(',') + '\n'
  })

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'football_fantasy_tv_report.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function Slider({ label, value, onChange, min, max, step, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0' }}>
      <div style={{ width: 85, fontSize: 9, color: C.dm, whiteSpace: 'nowrap', overflow: 'hidden' }}>{label}</div>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, height: 4, accentColor: color || C.gd }}
      />
      <input
        type='number'
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        style={{
          width: 44,
          background: C.bg,
          border: `1px solid ${C.bd}`,
          borderRadius: 4,
          color: color || C.gd,
          fontSize: 10,
          padding: '1px 3px',
          textAlign: 'center',
        }}
      />
    </div>
  )
}

export default function App() {
  const [pts, setPts] = useState({ ...DEF_PTS })
  const [tv, setTv] = useState({ ...DEF_TV })
  const [posF, setPosF] = useState('MID')
  const [sel, setSel] = useState(['M.Salah', 'Virgil', 'Haaland'])
  const [panel, setPanel] = useState(false)
  const [tuneTab, setTuneTab] = useState('pts')
  const [posToggle, setPosToggle] = useState(JSON.parse(JSON.stringify(DEF_POS_TOGGLE)))

  const updPt = (k, v) => setPts((p) => ({ ...p, [k]: v }))
  const updTv = (k, v) => setTv((p) => ({ ...p, [k]: v }))
  const togglePos = (action, pos) =>
    setPosToggle((p) => {
      const n = JSON.parse(JSON.stringify(p))
      n[action][pos] = !n[action][pos]
      return n
    })

  const toggle = useCallback(
    (n) => setSel((p) => (p.includes(n) ? p.filter((x) => x !== n) : p.length < 6 ? [...p, n] : p)),
    [],
  )

  const all = useMemo(() => {
    const m = {}
    Object.values(DB)
      .flat()
      .forEach((p) => {
        const trail = simTV(p.m, p.sv, pts, tv, p.p, posToggle)
        const avgMP = trail.length > 0 ? Math.round((trail.reduce((s, t) => s + t.mp, 0) / trail.length) * 10) / 10 : 0
        m[p.n] = {
          ...p,
          name: p.n,
          team: p.t,
          pos: p.p,
          stv: p.sv,
          trail,
          avgMP,
          finalTV: trail.length > 0 ? trail[trail.length - 1].tv : p.sv,
          pctChg: trail.length > 0 ? Math.round(((trail[trail.length - 1].tv - p.sv) / p.sv) * 1000) / 10 : 0,
        }
      })
    return m
  }, [pts, tv, posToggle])

  const sims = sel.map((n) => all[n]).filter(Boolean)
  const allTVs = sims.flatMap((s) => s.trail.map((t) => t.tv))
  const maxGW = Math.max(...sims.map((s) => s.trail.length), 1)
  const maxTV = allTVs.length > 0 ? Math.max(...allTVs) : 16
  const minTV = allTVs.length > 0 ? Math.min(...allTVs) : 3
  const range = maxTV - minTV || 1

  const posList = (DB[posF] || []).map((p) => all[p.n]).filter(Boolean)

  return (
    <div style={{ background: C.bg, color: C.tx, minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: panel ? 0 : -300,
          width: 300,
          height: '100vh',
          background: C.cd,
          borderLeft: `1px solid ${C.bd}`,
          zIndex: 100,
          transition: 'right 0.3s',
          overflowY: 'auto',
          padding: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gd, letterSpacing: 1 }}>TUNE FORMULA</div>
          <button onClick={() => setPanel(false)} style={{ background: 'none', border: 'none', color: C.dm, fontSize: 18, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
          {[
            { id: 'pts', label: 'Points' },
            { id: 'pos', label: 'Position Map' },
            { id: 'tv', label: 'TV Formula' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTuneTab(tab.id)}
              style={{
                flex: 1,
                background: tuneTab === tab.id ? `${C.gd}22` : C.bg,
                border: `1px solid ${tuneTab === tab.id ? C.gd : C.bd}`,
                color: tuneTab === tab.id ? C.gd : C.mt,
                borderRadius: 6,
                padding: '5px 2px',
                fontSize: 8,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 0.5,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tuneTab === 'pts' && (
          <div>
            {Object.entries(CAT_LABELS).map(([cat, catLabel]) => (
              <div key={cat}>
                <div style={{ fontSize: 8, fontWeight: 700, color: CAT_COLORS[cat], letterSpacing: 1, marginBottom: 2, marginTop: 8 }}>
                  {catLabel.toUpperCase()}
                </div>
                {PT_CATS[cat].map((k) => (
                  <Slider
                    key={k}
                    label={PT_LABELS[k]}
                    value={pts[k]}
                    onChange={(v) => updPt(k, v)}
                    min={k === 'fl' || k === 'pm' ? -6 : 0}
                    max={k === 'fl' ? 0 : 10}
                    step={0.25}
                    color={pts[k] < 0 ? C.rd : CAT_COLORS[cat]}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {tuneTab === 'pos' && (
          <div>
            <div style={{ fontSize: 8, color: C.dm, marginBottom: 8, lineHeight: 1.5 }}>Toggle which positions earn points for each action.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(4,1fr)', gap: 2, marginBottom: 4 }}>
              <div style={{ fontSize: 7, color: C.mt }}>ACTION</div>
              {['GK', 'DEF', 'MID', 'FWD'].map((pos) => (
                <div key={pos} style={{ fontSize: 8, fontWeight: 700, color: pC[pos], textAlign: 'center' }}>
                  {pos}
                </div>
              ))}
            </div>
            {Object.entries(CAT_LABELS).map(([cat, catLabel]) => (
              <div key={cat}>
                <div style={{ fontSize: 7, fontWeight: 700, color: CAT_COLORS[cat], letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>{catLabel}</div>
                {PT_CATS[cat].map((k) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '90px repeat(4,1fr)', gap: 2, marginBottom: 2, alignItems: 'center' }}>
                    <div style={{ fontSize: 8, color: C.dm }}>
                      {PT_LABELS[k]} <span style={{ color: C.mt, fontSize: 7 }}>({pts[k] > 0 ? '+' : ''}{pts[k]})</span>
                    </div>
                    {['GK', 'DEF', 'MID', 'FWD'].map((pos) => {
                      const on = posToggle[k]?.[pos] ?? true
                      return (
                        <button
                          key={pos}
                          onClick={() => togglePos(k, pos)}
                          style={{
                            background: on ? `${pC[pos]}22` : C.bg,
                            border: `1px solid ${on ? `${pC[pos]}88` : C.bd}`,
                            color: on ? pC[pos] : `${C.mt}55`,
                            borderRadius: 4,
                            padding: '3px 0',
                            fontSize: 8,
                            fontWeight: 700,
                            cursor: 'pointer',
                            opacity: on ? 1 : 0.35,
                          }}
                        >
                          {on ? 'ON' : '—'}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tuneTab === 'tv' && (
          <div>
            <div style={{ fontSize: 8, color: C.dm, marginBottom: 8 }}>Controls how Match Points convert to $ value changes.</div>
            <Slider label='Anchor (MP)' value={tv.anchor} onChange={(v) => updTv('anchor', v)} min={0} max={15} step={0.5} color={C.cy} />
            <Slider label='Abs Rate ($/MP)' value={tv.abs} onChange={(v) => updTv('abs', v)} min={0} max={0.5} step={0.005} color={C.cy} />
            <Slider label='Pct Rate' value={tv.pct} onChange={(v) => updTv('pct', v)} min={0} max={0.005} step={0.0001} color={C.cy} />
          </div>
        )}

        <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
          <button
            onClick={() => {
              setPts({ ...DEF_PTS })
              setTv({ ...DEF_TV })
              setPosToggle(JSON.parse(JSON.stringify(DEF_POS_TOGGLE)))
            }}
            style={{
              flex: 1,
              background: `${C.rd}22`,
              border: `1px solid ${C.rd}55`,
              color: C.rd,
              borderRadius: 6,
              padding: '6px',
              fontSize: 9,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            RESET ALL
          </button>
          <button
            onClick={() => exportCSV(all, pts, tv)}
            style={{
              flex: 1,
              background: `${C.gn}22`,
              border: `1px solid ${C.gn}55`,
              color: C.gn,
              borderRadius: 6,
              padding: '6px',
              fontSize: 9,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            EXPORT CSV
          </button>
        </div>
      </div>

      <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.gd, letterSpacing: 2 }}>FOOTBALL FANTASY TV</div>
            <div style={{ fontSize: 9, color: C.dm }}>Real PL 2024-25 · Adjustable points + formula</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => exportCSV(all, pts, tv)}
              style={{
                background: `${C.gn}22`,
                border: `1px solid ${C.gn}`,
                color: C.gn,
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 1,
              }}
            >
              EXPORT
            </button>
            <button
              onClick={() => setPanel(true)}
              style={{
                background: `${C.gd}22`,
                border: `1px solid ${C.gd}`,
                color: C.gd,
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 1,
              }}
            >
              TUNE
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {['GK', 'DEF', 'MID', 'FWD'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPosF(pos)}
              style={{
                flex: 1,
                background: posF === pos ? `${pC[pos]}22` : C.cd,
                border: `1px solid ${posF === pos ? pC[pos] : C.bd}`,
                color: posF === pos ? pC[pos] : C.dm,
                borderRadius: 8,
                padding: '7px',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer',
              }}
            >
              {pos}
            </button>
          ))}
        </div>

        <div style={{ background: C.cd, border: `1px solid ${C.bd}`, borderRadius: 10, overflow: 'auto', marginBottom: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 480 }}>
            <thead>
              <tr>
                {['Player', 'GP', 'G', 'A', 'CS', 'Tkl', 'Int', 'Clr', 'Drb', 'AvgMP', '$Start', '$End', '%', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '5px 3px',
                      color: C.mt,
                      fontSize: 8,
                      fontWeight: 600,
                      borderBottom: `1px solid ${C.bd}`,
                      textAlign: h === 'Player' ? 'left' : 'center',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posList.map((p) => {
                const isSel = sel.includes(p.name)
                return (
                  <tr key={p.name} style={{ background: isSel ? `${pC[posF]}10` : 'transparent' }}>
                    <td style={{ padding: '4px', color: isSel ? pC[posF] : C.tx, fontWeight: 500 }}>
                      {p.name} <span style={{ color: C.mt, fontSize: 8 }}>{p.team}</span>
                    </td>
                    <td style={{ padding: '3px', textAlign: 'center', color: C.dm }}>{p.gp}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: p.g > 0 ? C.gn : C.mt }}>{p.g}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: p.a > 0 ? C.cy : C.mt }}>{p.a}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: p.cs > 0 ? C.pu : C.mt }}>{p.cs}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: p.tk > 0 ? C.bl : C.mt }}>{p.tk}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: p.it > 0 ? C.bl : C.mt }}>{p.it}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: p.cl > 0 ? C.bl : C.mt }}>{p.cl}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: p.dr > 0 ? C.pu : C.mt }}>{p.dr}</td>
                    <td style={{ padding: '3px', textAlign: 'center', fontWeight: 700, color: C.gd }}>{p.avgMP}</td>
                    <td style={{ padding: '3px', textAlign: 'center', color: C.dm }}>${p.stv}M</td>
                    <td style={{ padding: '3px', textAlign: 'center', fontWeight: 700, color: p.pctChg >= 0 ? C.gn : C.rd }}>${p.finalTV}M</td>
                    <td style={{ padding: '3px', textAlign: 'center', fontSize: 9, color: p.pctChg >= 0 ? C.gn : C.rd }}>
                      {p.pctChg > 0 ? '+' : ''}
                      {p.pctChg}%
                    </td>
                    <td style={{ padding: '3px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggle(p.name)}
                        style={{
                          background: isSel ? `${C.rd}22` : `${C.gn}22`,
                          border: `1px solid ${isSel ? `${C.rd}55` : `${C.gn}55`}`,
                          color: isSel ? C.rd : C.gn,
                          borderRadius: 6,
                          padding: '2px 8px',
                          fontSize: 9,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isSel ? 'DROP' : 'ADD'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {sims.length > 0 && (
          <div style={{ background: C.cd, border: `1px solid ${C.bd}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: C.mt, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>TV PROGRESSION</div>
            <svg viewBox='0 0 700 200' style={{ width: '100%', height: 'auto' }}>
              {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                const y = 185 - f * 170
                const val = (minTV + f * range).toFixed(1)
                return (
                  <g key={f}>
                    <line x1={40} y1={y} x2={690} y2={y} stroke={C.bd} strokeWidth={0.5} />
                    <text x={36} y={y + 3} fill={C.mt} fontSize={7} textAnchor='end'>
                      ${val}
                    </text>
                  </g>
                )
              })}
              {sims.map((s, si) => {
                const pts2 = s.trail
                  .map((t, i) => {
                    const x = 40 + (i / Math.max(maxGW - 1, 1)) * 650
                    const y = 185 - ((t.tv - minTV) / range) * 170
                    return `${x},${y}`
                  })
                  .join(' ')
                return <polyline key={s.name} points={pts2} fill='none' stroke={lC[si]} strokeWidth={1.5} opacity={0.85} />
              })}
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
