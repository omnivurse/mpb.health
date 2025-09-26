// Age band configuration for rate calculations
export interface AgeBand {
  min: number
  max: number
  key: string
  label: string
}

export const AGE_BANDS: AgeBand[] = [
  { min: 0, max: 17, key: 'CHILD', label: 'Child (0-17)' },
  { min: 18, max: 24, key: '18-24', label: '18-24' },
  { min: 25, max: 29, key: '25-29', label: '25-29' },
  { min: 30, max: 34, key: '30-34', label: '30-34' },
  { min: 35, max: 39, key: '35-39', label: '35-39' },
  { min: 40, max: 44, key: '40-44', label: '40-44' },
  { min: 45, max: 49, key: '45-49', label: '45-49' },
  { min: 50, max: 54, key: '50-54', label: '50-54' },
  { min: 55, max: 59, key: '55-59', label: '55-59' },
  { min: 60, max: 64, key: '60-64', label: '60-64' },
  { min: 65, max: 120, key: '65+', label: '65+' }
]

export function getAgeBandKey(age: number): string {
  const band = AGE_BANDS.find(band => age >= band.min && age <= band.max)
  return band?.key || 'ALL'
}

export function getAgeBandLabel(age: number): string {
  const band = AGE_BANDS.find(band => age >= band.min && age <= band.max)
  return band?.label || 'All Ages'
}

export function isValidAge(age: number): boolean {
  return age >= 0 && age <= 120
}

// State abbreviations for rate lookups
export const US_STATES = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
  'DC': 'District of Columbia'
} as const

export type StateCode = keyof typeof US_STATES

export function getStateOptions(): Array<{ value: StateCode; label: string }> {
  return Object.entries(US_STATES).map(([code, name]) => ({
    value: code as StateCode,
    label: `${name} (${code})`
  }))
}

export function isValidState(state: string): state is StateCode {
  return state in US_STATES
}
