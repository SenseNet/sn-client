import { Injector } from '@furystack/inject'
import { addGoogleAuth } from '@sensenet/authentication-google'
import { JwtService } from '@sensenet/authentication-jwt'
import { FormsAuthenticationService, Repository } from '@sensenet/client-core'
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
  sessionLifetime: 'expiration',
})

export const dmsInjector = new Injector()

const formsAuthService = FormsAuthenticationService.Setup(repository)
dmsInjector.setExplicitInstance(formsAuthService)

const jwt = JwtService.setup(repository, { select: 'all' })

const googleOauthProvider = addGoogleAuth(jwt, {
  clientId: '188576321252-cad8ho16mf68imajdvai6e2cpl3iv8ss.apps.googleusercontent.com',
})
const repositoryEvents = new EventHub(repository)

dmsInjector.setExplicitInstance(repository)
dmsInjector.setExplicitInstance(jwt)
dmsInjector.setExplicitInstance(googleOauthProvider)
dmsInjector.setExplicitInstance(repositoryEvents)
