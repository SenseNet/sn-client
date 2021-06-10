export type WebhookStatInput = {
  Url: string
  RequestTime: string
  ResponseTime: string
  RequestLength: number
  ResponseLength: number
  ResponseStatusCode: number
  WebhookId: number | string
  ContentId: number | string
  EventName: string
  ErrorMessage: string | null
}
