import { Repository } from '@sensenet/client-core'
import { Injector } from '@sensenet/client-utils'
import { EventHub } from '@sensenet/repository-events'
import { customSchema } from './assets/schema'

export const repository = new Repository({
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
})

export const dmsInjector = new Injector()
const repositoryEvents = new EventHub(repository)

dmsInjector.setExplicitInstance(repository)
dmsInjector.setExplicitInstance(repositoryEvents)
