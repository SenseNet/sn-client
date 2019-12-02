export const TestContentA = {
  Id: 1498,
  Path: '/Root/Test',
  Name: 'Brazzaville',
  DisplayName: 'Brazzaville',
  Description: 'Brazzaville description',
  CreationDate: '2019-10-08T01:07:09.42Z',
  ModificationDate: '2019-10-08T05:07:09.42Z',
  Type: 'Folder',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  ModifiedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
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
  Type: 'Folder',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  ModifiedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
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

export const TestContentFile = {
  Id: 5908,
  Path: '/Root/TestB',
  Name: 'LargeExcelFile.xlsx',
  DisplayName: 'LargeExcelFile.xlsx',
  Description: 'LargeExcelFile.xlsx description',
  CreationDate: '2019-10-08T01:07:09.42Z',
  Size: 432342000000,
  ModificationDate: '2019-10-08T05:07:09.42Z',
  Type: 'File',
  CreatedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  ModifiedBy: {
    DisplayName: 'Test User',
    Avatar: '/Root/Content',
  },
  Actions: [
    {
      Name: 'Remove',
      DisplayName: 'Add',
      Forbidden: false,
    },
  ],
}

export const TestContentCollection = [TestContentFile, TestContentB, TestContentA]
export const TestContentCollectionForOrders = [TestContentB, TestContentA, TestContentFile]
