export interface LoginResponse {
  accessToken?: string
  refreshToken?: string
  authToken?: string
  multiFactorRequired?: boolean
  qrCodeSetupImageUrl?: string
  manualEntryKey?: string
  multiFactorAuthToken?: string
}
