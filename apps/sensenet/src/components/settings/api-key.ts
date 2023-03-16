export interface Secret {
  id: string
  value: string
  creationDate: string
  validTill: string
}

export type ClientType = 'ExternalClient' | 'InternalClient'

export type SpaType = 'InternalSpa' | 'ExternalSpa'

export const spaTypes: SpaType[] = ['ExternalSpa', 'InternalSpa']
export const clientTypes: ClientType[] = ['ExternalClient', 'InternalClient']

export interface ApiKey {
  name: string
  repository: string
  clientId: string
  userName: string
  authority: string
  type: SpaType | ClientType
  secrets: Secret[]
}
