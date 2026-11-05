export interface MultiFactorLoginRequest {
  multiFactorAuthToken: string
  multiFactorCode: string
  siteUrl?: string
}
