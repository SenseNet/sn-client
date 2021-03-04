import { ListItem } from '@sensenet/default-content-types'

export type CalendarEvent = ListItem & {
  Location?: string
  StartDate?: string
  EndDate?: string
  Lead?: string
  AllDay?: boolean
  EventUrl?: string
  OwnerEmail?: string
}
