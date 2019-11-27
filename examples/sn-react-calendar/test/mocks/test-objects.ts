export const CalendarTestEvent = {
  Id: 214124124,
  Name: 'Event 1',
  Path: '/Root/Content',
  Type: 'event type',
  Location: 'Budapest',
  StartDate: '2019-01-01T12:00:00.000Z',
  EndDate: '2019-01-01T13:00:00.000Z',
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
  StartDate: '2019-01-01T12:00:00.000Z',
  EndDate: '2019-01-01T13:00:00.000Z',
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
