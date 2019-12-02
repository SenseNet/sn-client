export const TestContentA = {
  Id: 1498,
  Path: '/Root/Test',
  Name: 'Valami',
  DisplayName: 'Valami',
  Description: 'Brazzaville description',
  CreationDate: '2019-10-08T01:07:09.42Z',
  ModificationDate: '2019-10-08T05:07:09.42Z',
  Type: 'Task',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  ModifiedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  Status: ['active'],
  Actions: [
    {
      Name: 'Add',
      DisplayName: 'Add',
      Forbidden: false,
    },
    {
      Name: 'Remove',
      DisplayName: 'Add',
      Forbidden: false,
    },
  ],
}

export const TestContentB = {
  Id: 1645,
  Path: '/Root/TestB',
  Name: 'Calgary',
  DisplayName: 'Calgary',
  Description: 'Calgary description',
  CreationDate: '2019-10-08T01:07:09.42Z',
  ModificationDate: '2019-10-08T05:07:09.42Z',
  Type: 'Task',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  ModifiedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  Status: ['active'],
  Actions: [
    {
      Name: 'Add',
      DisplayName: 'Add',
      Forbidden: false,
    },
    {
      Name: 'Remove',
      DisplayName: 'Add',
      Forbidden: false,
    },
  ],
}

export const TestContentC = {
  Id: 5908,
  Path: '/Root/TestB',
  Name: 'LargeExcelFile.xlsx',
  DisplayName: 'LargeExcelFile.xlsx',
  Description: 'LargeExcelFile.xlsx description',
  CreationDate: '2019-10-08T01:07:09.42Z',
  ModificationDate: '2019-10-08T05:07:09.42Z',
  Type: 'Task',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  ModifiedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  Status: ['active'],
  Actions: [
    {
      Name: 'Remove',
      DisplayName: 'Add',
      Forbidden: false,
    },
  ],
}

export const sortedTodoList = [
  {
    Actions: [
      { DisplayName: 'Add', Forbidden: false, Name: 'Add' },
      { DisplayName: 'Add', Forbidden: false, Name: 'Remove' },
    ],
    CreatedBy: { Avatar: '/Root/Content', DisplayName: 'Test User' },
    CreationDate: '2019-10-08T01:07:09.42Z',
    Description: 'Calgary description',
    DisplayName: 'Calgary',
    Id: 1645,
    ModificationDate: '2019-10-08T05:07:09.42Z',
    ModifiedBy: { Avatar: '/Root/Content', DisplayName: 'Test User' },
    Name: 'Calgary',
    Path: '/Root/TestB',
    Status: ['active'],
    Type: 'Task',
  },
  {
    Actions: [
      { DisplayName: 'Add', Forbidden: false, Name: 'Add' },
      { DisplayName: 'Add', Forbidden: false, Name: 'Remove' },
    ],
    CreatedBy: { Avatar: '/Root/Content', DisplayName: 'Test User' },
    CreationDate: '2019-10-08T01:07:09.42Z',
    Description: 'Brazzaville description',
    DisplayName: 'Valami',
    Id: 1498,
    ModificationDate: '2019-10-08T05:07:09.42Z',
    ModifiedBy: { Avatar: '/Root/Content', DisplayName: 'Test User' },
    Name: 'Valami',
    Path: '/Root/Test',
    Status: ['active'],
    Type: 'Task',
  },
  {
    Actions: [{ DisplayName: 'Add', Forbidden: false, Name: 'Remove' }],
    CreatedBy: { Avatar: '/Root/Content', DisplayName: 'Test User' },
    CreationDate: '2019-10-08T01:07:09.42Z',
    Description: 'LargeExcelFile.xlsx description',
    DisplayName: 'LargeExcelFile.xlsx',
    Id: 5908,
    ModificationDate: '2019-10-08T05:07:09.42Z',
    ModifiedBy: { Avatar: '/Root/Content', DisplayName: 'Test User' },
    Name: 'LargeExcelFile.xlsx',
    Path: '/Root/TestB',
    Status: ['completed'],
    Type: 'Task',
  },
]

export const TestContentCollection = [TestContentC, TestContentB, TestContentA]
export const removedlist = [TestContentB, TestContentA]
