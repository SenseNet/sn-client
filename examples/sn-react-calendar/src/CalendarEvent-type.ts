import { ListItem } from '@sensenet/default-content-types'

export default class CalendarEvent extends ListItem {
  public Location?: string
  public StartDate?: string
  public EndDate?: string
  public Lead?: string
  public AllDay?: boolean
  public EventUrl?: string
  public OwnerEmail?: string
}
