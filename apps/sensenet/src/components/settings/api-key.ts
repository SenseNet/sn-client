export interface Secret {
  id: string
  value: string
  creationDate: string
  validTill: string
}

export enum ApiKeyType {
  ExternalClient = 'ExternalClient',
  ExternalSpa = 'ExternalSpa',
}

export interface ApiKey {
  name: string
  repository: string
  clientId: string
  userName: string
  authority: string
  type: ApiKeyType
  secrets: Secret[]
}
