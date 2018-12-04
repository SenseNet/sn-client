import { Injector } from '@furystack/inject'
import { addGoogleAuth } from '@sensenet/authentication-google'
import { JwtService } from '@sensenet/authentication-jwt'
import { Repository } from '@sensenet/client-core'
import { EventHub } from '@sensenet/repository-events'
import { customSchema } from './assets/schema'

export const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL,
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'Actions', 'Avatar', 'Owner', 'DisplayName', 'Locked', 'CheckedOutTo', 'Approvable'] as any,
    defaultExpand: ['Actions', 'Owner', 'CheckedOutTo'] as any,
    schemas: customSchema,
    sessionLifetime: 'expiration',
})

const jwt = new JwtService(repository)
const googleOauthProvider = addGoogleAuth(jwt, { clientId: '188576321252-cad8ho16mf68imajdvai6e2cpl3iv8ss.apps.googleusercontent.com' })
const repositoryEvents = new EventHub(repository)

Injector.Default.SetInstance(repository)
Injector.Default.SetInstance(jwt)
Injector.Default.SetInstance(googleOauthProvider)
Injector.Default.SetInstance(repositoryEvents)
