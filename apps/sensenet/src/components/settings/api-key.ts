export interface Secret {
  id: string
  value: string
  creationDate: string
  validTill: string
}

export const ClientsKeys = {
  ExternalClient: 'ExternalClient',
  InternalClient: 'InternalClient',
} as const

export type ClientType = (typeof ClientsKeys)[keyof typeof ClientsKeys]

export const SpaKeys = {
  InternalSpa: 'InternalSpa',
  ExternalSpa: 'ExternalSpa',
} as const

export type SpaType = (typeof SpaKeys)[keyof typeof SpaKeys]

export interface ApiKey {
  name: string
  repository: string
  clientId: string
  userName: string
  authority: string
  type: SpaType | ClientType
  secrets: Secret[]
}
