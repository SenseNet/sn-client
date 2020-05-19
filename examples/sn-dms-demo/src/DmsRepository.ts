import { Injector } from '@sensenet/client-utils'
import { customSchema } from './assets/schema'

export const defaultRepositoryConfig = {
  repositoryUrl: process.env.REACT_APP_SERVICE_URL,
  requiredSelect: [
    'Id',
    'Path',
    'Name',
    'Type',
    'ParentId',
    'Actions',
    'Owner',
    'DisplayName',
    'Locked',
    'CheckedOutTo',
    'Approvable',
  ],
  defaultExpand: ['Actions', 'Owner', 'CheckedOutTo'],
  schemas: customSchema,
}

export const dmsInjector = new Injector()
