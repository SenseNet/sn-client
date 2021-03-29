export interface DashboardData {
  name?: string
  displayName?: string
  host: string
  pending: boolean
  version: DashboardVersion
  subscription: DashboardSubscription
  usage: DashboardUsage
}
export interface DashboardVersion {
  title: string
  date: string
  latest: boolean
}
export interface DashboardSubscription {
  plan: DashboardPlan
  expirationDate: string
}
export interface DashboardPlan {
  displayName: string
  name: string
  baseprice?: number
  limitations: DashboardLimitations
}

export interface DashboardLimitations {
  content: number
  user: number
  group: number
  storage: number
  workspace: number
  contentType: number
}

export interface DashboardUsage {
  content: number
  user: number
  group: number
  storage: StorageUsage
  workspace: number
  contentType: number
}

export interface StorageUsage {
  available: number
  files: number
  content: number
  oldVersions: number
  log: number
  system: number
}
