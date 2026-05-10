export const DEFAULT_FORMULA = {
  minutes_0_59: 1,
  minutes_60_89: 2,
  minutes_90_plus: 3,
  goals: 6,
  assists: 4,
  shots_on_target: 1,
  cs: 4,
  tackles_won: 0.5,
  interceptions: 0.5,
  clearances: 0.5,
  blocks: 0.5,
  chances_created: 1,
  successful_dribbles: 0.5,
  accurate_crosses: 0.5,
  pass_acc_threshold: 85,
  pass_acc_bonus: 2,
  saves: 0.5,
  fouls_committed: -0.25,
  penalties_missed: -3,
  yellow_cards: -1,
  red_cards: -3,
}

export const PRESETS = {
  default: DEFAULT_FORMULA,
  aggressive_attack: {
    ...DEFAULT_FORMULA,
    goals: 7,
    assists: 5,
    shots_on_target: 1.5,
    chances_created: 1.5,
    successful_dribbles: 0.75,
    cs: 2,
  },
  balanced: {
    ...DEFAULT_FORMULA,
    goals: 6,
    assists: 4,
    tackles_won: 0.6,
    interceptions: 0.6,
    clearances: 0.6,
    blocks: 0.6,
    yellow_cards: -0.75,
    red_cards: -2.5,
  },
  defensive_value: {
    ...DEFAULT_FORMULA,
    goals: 5,
    assists: 3.5,
    cs: 5,
    tackles_won: 0.9,
    interceptions: 0.9,
    clearances: 0.9,
    blocks: 0.9,
    saves: 0.7,
    fouls_committed: -0.2,
  },
}

export const PRESET_LABELS = {
  default: 'Default',
  aggressive_attack: 'Aggressive Attack',
  balanced: 'Balanced',
  defensive_value: 'Defensive Value',
  custom: 'Custom',
}

export const FORMULA_GROUPS = [
  {
    id: 'attacking',
    label: 'Attacking',
    fields: [
      ['goals', 'Goals', 0.5, [-2, 12]],
      ['assists', 'Assists', 0.5, [-2, 10]],
      ['shots_on_target', 'Shots on Target', 0.25, [-1, 4]],
      ['chances_created', 'Chances Created', 0.25, [-1, 4]],
      ['successful_dribbles', 'Successful Dribbles', 0.25, [-1, 3]],
      ['accurate_crosses', 'Accurate Crosses', 0.25, [-1, 3]],
    ],
  },
  {
    id: 'defending',
    label: 'Defending',
    fields: [
      ['cs', 'Clean Sheet', 0.5, [-2, 8]],
      ['tackles_won', 'Tackles Won', 0.1, [-1, 2]],
      ['interceptions', 'Interceptions', 0.1, [-1, 2]],
      ['clearances', 'Clearances', 0.1, [-1, 2]],
      ['blocks', 'Blocks', 0.1, [-1, 2]],
    ],
  },
  {
    id: 'goalkeeping',
    label: 'Goalkeeping',
    fields: [
      ['saves', 'Saves', 0.1, [-1, 3]],
    ],
  },
  {
    id: 'discipline',
    label: 'Discipline & Fouls',
    fields: [
      ['fouls_committed', 'Fouls Committed', 0.05, [-2, 0]],
      ['penalties_missed', 'Penalty Missed', 0.5, [-6, 0]],
      ['yellow_cards', 'Yellow Card', 0.25, [-3, 0]],
      ['red_cards', 'Red Card', 0.5, [-6, 0]],
    ],
  },
  {
    id: 'minutes',
    label: 'Minute Tiers',
    fields: [
      ['minutes_0_59', 'Minutes 1-59', 0.5, [0, 6]],
      ['minutes_60_89', 'Minutes 60-89', 0.5, [0, 8]],
      ['minutes_90_plus', 'Minutes 90+', 0.5, [0, 10]],
    ],
  },
  {
    id: 'passing',
    label: 'Passing Bonus',
    fields: [
      ['pass_acc_threshold', 'Pass Acc Threshold (%)', 1, [50, 100]],
      ['pass_acc_bonus', 'Pass Acc Bonus', 0.25, [-2, 6]],
    ],
  },
]

export function calcMatchPoints(r, f) {
  const minutePoints =
    r.minutes_played >= 90
      ? f.minutes_90_plus
      : r.minutes_played >= 60
      ? f.minutes_60_89
      : r.minutes_played > 0
      ? f.minutes_0_59
      : 0
  const cleanSheet = r.team_goals_conceded === 0 ? f.cs : 0
  const passAccBonus = r.accurate_passes_percent >= f.pass_acc_threshold ? f.pass_acc_bonus : 0

  return (
    minutePoints +
    r.goals * f.goals +
    r.assists * f.assists +
    r.shots_on_target * f.shots_on_target +
    cleanSheet +
    r.tackles_won * f.tackles_won +
    r.interceptions * f.interceptions +
    r.clearances * f.clearances +
    r.blocks * f.blocks +
    r.chances_created * f.chances_created +
    r.successful_dribbles * f.successful_dribbles +
    r.accurate_crosses * f.accurate_crosses +
    passAccBonus +
    r.saves * f.saves +
    r.fouls_committed * f.fouls_committed +
    r.penalties_missed * f.penalties_missed +
    r.yellow_cards * f.yellow_cards +
    r.red_cards * f.red_cards
  )
}

/** Returns per-field point breakdown for a single match row. */
export function breakdownMatch(r, f) {
  const minutesLabel = r.minutes_played >= 90 ? '90+' : r.minutes_played >= 60 ? '60-89' : r.minutes_played > 0 ? '1-59' : 'DNP'
  const minutesPts = r.minutes_played >= 90 ? f.minutes_90_plus : r.minutes_played >= 60 ? f.minutes_60_89 : r.minutes_played > 0 ? f.minutes_0_59 : 0

  const items = [
    { key: 'minutes', label: `Minutes (${minutesLabel})`, count: r.minutes_played, weight: minutesPts, points: minutesPts },
    { key: 'goals', label: 'Goals', count: r.goals, weight: f.goals, points: r.goals * f.goals },
    { key: 'assists', label: 'Assists', count: r.assists, weight: f.assists, points: r.assists * f.assists },
    { key: 'shots_on_target', label: 'Shots on Target', count: r.shots_on_target, weight: f.shots_on_target, points: r.shots_on_target * f.shots_on_target },
    { key: 'cs', label: 'Clean Sheet', count: r.team_goals_conceded === 0 ? 1 : 0, weight: f.cs, points: r.team_goals_conceded === 0 ? f.cs : 0 },
    { key: 'tackles_won', label: 'Tackles Won', count: r.tackles_won, weight: f.tackles_won, points: r.tackles_won * f.tackles_won },
    { key: 'interceptions', label: 'Interceptions', count: r.interceptions, weight: f.interceptions, points: r.interceptions * f.interceptions },
    { key: 'clearances', label: 'Clearances', count: r.clearances, weight: f.clearances, points: r.clearances * f.clearances },
    { key: 'blocks', label: 'Blocks', count: r.blocks, weight: f.blocks, points: r.blocks * f.blocks },
    { key: 'chances_created', label: 'Chances Created', count: r.chances_created, weight: f.chances_created, points: r.chances_created * f.chances_created },
    { key: 'successful_dribbles', label: 'Successful Dribbles', count: r.successful_dribbles, weight: f.successful_dribbles, points: r.successful_dribbles * f.successful_dribbles },
    { key: 'accurate_crosses', label: 'Accurate Crosses', count: r.accurate_crosses, weight: f.accurate_crosses, points: r.accurate_crosses * f.accurate_crosses },
    { key: 'pass_acc', label: `Pass Acc ≥ ${f.pass_acc_threshold}%`, count: r.accurate_passes_percent >= f.pass_acc_threshold ? 1 : 0, weight: f.pass_acc_bonus, points: r.accurate_passes_percent >= f.pass_acc_threshold ? f.pass_acc_bonus : 0 },
    { key: 'saves', label: 'Saves', count: r.saves, weight: f.saves, points: r.saves * f.saves },
    { key: 'fouls_committed', label: 'Fouls Committed', count: r.fouls_committed, weight: f.fouls_committed, points: r.fouls_committed * f.fouls_committed },
    { key: 'penalties_missed', label: 'Penalty Missed', count: r.penalties_missed, weight: f.penalties_missed, points: r.penalties_missed * f.penalties_missed },
    { key: 'yellow_cards', label: 'Yellow Card', count: r.yellow_cards, weight: f.yellow_cards, points: r.yellow_cards * f.yellow_cards },
    { key: 'red_cards', label: 'Red Card', count: r.red_cards, weight: f.red_cards, points: r.red_cards * f.red_cards },
  ]
  const total = items.reduce((s, x) => s + x.points, 0)
  return { items, total }
}
