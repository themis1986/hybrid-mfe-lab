// Made-up rows for the table demos, deterministic so every load looks the same.
export interface Person {
  id: string
  name: string
  team: string
  status: 'active' | 'away' | 'left'
  salary: number
  score: number
  joined: string
  children?: Person[]
}

const FIRST = [
  'Ada',
  'Linus',
  'Grace',
  'Alan',
  'Edsger',
  'Barbara',
  'Ken',
  'Margaret',
  'Dennis',
  'Radia',
]
const LAST = [
  'Lovelace',
  'Torvalds',
  'Hopper',
  'Turing',
  'Dijkstra',
  'Liskov',
  'Thompson',
  'Hamilton',
  'Ritchie',
  'Perlman',
]
const TEAMS = ['Platform', 'Design', 'Data', 'Support', 'Research']
const STATUSES: Person['status'][] = [
  'active',
  'active',
  'active',
  'away',
  'left',
]

export const TEAM_OPTIONS = TEAMS.map((team) => ({ value: team, label: team }))
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'away', label: 'Away' },
  { value: 'left', label: 'Left' },
]

/** One person, the same for the same index. */
export function makePerson(index: number): Person {
  const pad = (value: number) => String(value).padStart(2, '0')
  return {
    id: `p${index}`,
    name: `${FIRST[index % FIRST.length]} ${LAST[(index * 7 + 3) % LAST.length]}`,
    team: TEAMS[(index * 3) % TEAMS.length]!,
    status: STATUSES[(index * 11) % STATUSES.length]!,
    salary: 42000 + ((index * 7919) % 90) * 1000,
    score: (index * 37) % 101,
    joined: `20${pad(10 + (index % 16))}-${pad(1 + ((index * 5) % 12))}-${pad(1 + ((index * 13) % 28))}`,
  }
}

export function makePeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => makePerson(index))
}

/** Teams of people, three levels deep. */
export function makeTree(): Person[] {
  return TEAMS.map((team, teamIndex) => ({
    ...makePerson(teamIndex * 100),
    id: `team-${teamIndex}`,
    name: `${team} lead`,
    team,
    children: Array.from({ length: 3 }, (_, leadIndex) => ({
      ...makePerson(teamIndex * 100 + leadIndex + 1),
      id: `team-${teamIndex}-${leadIndex}`,
      team,
      children: Array.from({ length: 2 }, (_, memberIndex) => ({
        ...makePerson(teamIndex * 100 + leadIndex * 10 + memberIndex + 20),
        id: `team-${teamIndex}-${leadIndex}-${memberIndex}`,
        team,
      })),
    })),
  }))
}

export interface FakeQuery {
  pageIndex: number
  pageSize: number
  sorting: { id: string; desc: boolean }[]
  search: string
  statuses: string[]
}

/** A pretend server over 5,000 people: slow, and failing on demand. */
const SERVER_ROWS = makePeople(5000)

export async function fetchPeople(
  query: FakeQuery,
  { fail = false, delay = 400 }: { fail?: boolean; delay?: number } = {},
): Promise<{ rows: Person[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, delay))
  if (fail) throw new Error('The server is having a moment')
  const text = query.search.toLowerCase()
  let rows = SERVER_ROWS.filter(
    (person) =>
      (!text || person.name.toLowerCase().includes(text)) &&
      (!query.statuses.length || query.statuses.includes(person.status)),
  )
  const sort = query.sorting[0]
  if (sort) {
    const key = sort.id as keyof Person
    rows = [...rows].sort((a, b) => {
      const order = String(a[key]).localeCompare(String(b[key]), undefined, {
        numeric: true,
      })
      return sort.desc ? -order : order
    })
  }
  const start = query.pageIndex * query.pageSize
  return { rows: rows.slice(start, start + query.pageSize), total: rows.length }
}
