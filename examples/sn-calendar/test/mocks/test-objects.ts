export const CalendarTestEvent = {
  Id: 214124124,
  Name: 'Event 1',
  Path: '/Root/Content',
  Type: 'event type',
  Location: 'Budapest',
  StartDate: new Date('2019.01.01 13:00').toISOString(),
  EndDate: new Date('2019.01.01 14:00').toISOString(),
  AllDay: false,
  Description: 'Event description',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
}

export const CalendarTestEventAllDay = {
  Id: 214124124,
  Name: 'Event 2',
  Path: '/Root/Content',
  Type: 'event type',
  Location: 'Veszprém',
  StartDate: new Date('2019.01.01 13:00').toISOString(),
  EndDate: new Date('2019.01.01 14:00').toISOString(),
  AllDay: true,
  Description: 'All Event description',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
}

export const MaterialDialogProps = {
  fullScreen: true,
  fullWidth: false,
  maxWidth: 'lg',
  scroll: 'body',
  open: true,
  onClose: jest.fn(),
}

export const mockContent = {
  Id: 123,
  Path: '/Root/Content',
  Type: 'Folder',
  Name: 'Folder',
}
