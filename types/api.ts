// TypeScript types generated from BFF OpenAPI schema

export interface DataResponse<T = any> {
  success: boolean
  message: string
  timestamp: string
  data?: T | null
}

export interface UserRegistrationRequest {
  email: string
  password: string
  full_name: string
}

export interface UserLoginRequest {
  email: string
  password: string
}

export interface BetCreationRequest {
  event_id: number
  selected_team: string
  amount: number
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

export interface ApiError {
  message: string
  status: number
  details?: string | ValidationError[]
}

// Query parameters interfaces
export interface EventsQuery {
  category?: string | null
  team?: string | null
  date_from?: string | null
  date_to?: string | null
  include_stats?: boolean
  limit?: number
}

export interface EventDetailQuery {
  include_recent_bets?: boolean
  include_statistics?: boolean
}

export interface PopularEventsQuery {
  limit?: number
}

export interface UserBetsQuery {
  status_filter?: string | null
  date_from?: string | null
  date_to?: string | null
  page?: number
  page_size?: number
  include_statistics?: boolean
}

// Response data types (these are the actual data structures returned in DataResponse.data)
export interface AuthData {
  token?: string
  email?: string
  fullName?: string
  balance?: number
  expiresAt?: string
  user?: UserProfileData
}

export interface UserProfileData {
  id: number
  email: string
  fullName: string
  balance: number
  createdAt: string
  totalBets?: number
  totalBetAmount?: number
}

export interface EventData {
  id: number
  name: string
  teamA: string
  teamB: string
  teamAOdds: number
  teamBOdds: number
  eventDate: string
  status: string
  canPlaceBets: boolean
  timeUntilEvent?: string
  totalBetsAmount?: number
  totalBetsCount?: number
  category?: string
  statistics?: EventStatistics
}

export interface EventStatistics {
  totalBets: number
  totalAmountBet: number
  teamAPercentage: number
  teamBPercentage: number
  lastBetDate?: string
  popularityScore?: number
}

export interface EventDetailData extends EventData {
  recentBets?: BetSummaryData[]
  teamStatistics?: { [key: string]: number }
}

export interface BetData {
  id: number
  eventId: number
  eventName: string
  selectedTeam: string
  amount: number
  odds: number
  potentialWin: number
  status: string
  createdAt: string
  eventStatus?: string
  eventDate: string
  canBeCancelled: boolean
  timeUntilEvent?: string
}

export interface BetSummaryData {
  id: number
  eventName: string
  selectedTeam: string
  amount: number
  status: string
  createdAt: string
}

export interface BetPreviewData {
  eventName: string
  selectedTeam: string
  amount: number
  odds: number
  potentialWin: number
  riskLevel: string
  warnings?: string[]
}

export interface UserBetsData {
  bets: BetData[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
  statistics?: BetStatistics
}

export interface BetStatistics {
  totalBets: number
  activeBets: number
  wonBets: number
  lostBets: number
  totalAmountBet: number
  totalWinnings: number
  currentPotentialWin: number
  winRate: number
  averageBetAmount: number
}

export interface DashboardData {
  user: UserProfileData
  recentBets: BetSummaryData[]
  statistics: BetStatistics
  popularEvents: EventData[]
  recommendations?: EventData[]
}

export interface HealthData {
  status: string
  timestamp: string
  version?: string
  uptime?: string
}

export interface ApiStatsData {
  totalRequests: number
  avgResponseTime: number
  errorRate: number
  activeUsers: number
  uptime: string
}