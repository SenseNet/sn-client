export type WebhookStatInput = {
  Url: string
  CreationTime: string
  Duration: string
  RequestLength: number
  ResponseLength: number
  ResponseStatusCode: number
  WebHookId: number | string
  ContentId: number | string
  EventName: string
  ErrorMessage: string | null
}
