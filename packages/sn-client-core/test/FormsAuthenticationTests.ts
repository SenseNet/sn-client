import { User } from '@sensenet/default-content-types'
import 'jest'
import {
  ConstantContent,
  FormsAuthenticationService,
  LoginState,
  ODataCollectionResponse,
  ODataResponse,
  Repository,
} from '../src'

describe('Forms Authentication', () => {
  it('Should be constructed', () => {
    const s = new FormsAuthenticationService({} as any)
    expect(s).toBeInstanceOf(FormsAuthenticationService)
  })

  it('Should be constructed with a static factory method', () => {
    const r: Repository = {} as any
    FormsAuthenticationService.Setup(r)
    expect(r.authentication).toBeInstanceOf(FormsAuthenticationService)
  })

  it('Should be disposed', async () => {
    const s = new FormsAuthenticationService({} as any)
    await s.dispose()
  })

  it('checkForUpdate should return false', async () => {
    const s = new FormsAuthenticationService({} as any)
    const result = await s.checkForUpdate()
    expect(result).toBe(false)
  })

  describe('Login', () => {
    it('Login should call a custom action endpoint', async () => {
      const actionCall = jest.fn(async () => true)
      const r = new Repository({})
      r.authentication = new FormsAuthenticationService(r)
      r.executeAction = actionCall
      await r.authentication.login('username', 'password')
      expect(actionCall).toBeCalledWith({
        body: {
          password: 'password',
          username: 'username',
        },
        idOrPath: 2,
        method: 'POST',
        name: 'Login',
      })
    })

    it('Login should update the Current User and the State', async () => {
      const r = new Repository({})
      const user: User = { Id: 666, Name: 'User', Path: 'IMS/Domain/User1', Type: 'User' }
      FormsAuthenticationService.Setup(r)

      r.executeAction = async () =>
        Promise.resolve({
          d: user,
        } as ODataResponse<User>) as any
      await r.authentication.login('username', 'password')
      expect(r.authentication.currentUser.getValue()).toEqual(user)
      expect(r.authentication.state.getValue()).toBe(LoginState.Authenticated)
    })

    it('Login should update the Current User and the State for Visitor', async () => {
      const r = new Repository({})
      FormsAuthenticationService.Setup(r)

      r.executeAction = async () =>
        Promise.resolve({
          d: ConstantContent.VISITOR_USER,
        } as ODataResponse<User>) as any
      await r.authentication.login('username', 'password')
      expect(r.authentication.currentUser.getValue()).toEqual(ConstantContent.VISITOR_USER)
      expect(r.authentication.state.getValue()).toBe(LoginState.Unauthenticated)
    })
  })

  describe('getCurrentUser', () => {
    it('Should return Visitor by default', async () => {
      const r = new Repository({})
      const authService = FormsAuthenticationService.Setup(r)
      const currentUser = await authService.getCurrentUser()
      expect(currentUser).toEqual(ConstantContent.VISITOR_USER)
    })

    it('Should execute a query for fetching the current user with the provided loader options', async () => {
      const actionCall = jest.fn()
      const r = new Repository({})
      const authService = FormsAuthenticationService.Setup(r, { select: 'all', expand: ['Manager'] })
      r.loadCollection = actionCall
      await authService.getCurrentUser()
      expect(actionCall).toBeCalledWith({
        oDataOptions: { query: 'Id:@@CurrentUser.Id@@', select: 'all', top: 1, expand: ['Manager'] },
        path: '/Root',
      })
    })

    it('Should update the current user from a valid response', async () => {
      const user: User = { Id: 666, Name: 'User', Path: 'IMS/Domain/User1', Type: 'User' }
      const r = new Repository({})
      const authService = FormsAuthenticationService.Setup(r)
      r.loadCollection = async () =>
        Promise.resolve<ODataCollectionResponse<User>>({
          d: {
            __count: 1,
            results: [user],
          },
        }) as any
      const receivedUser = await authService.getCurrentUser()
      expect(receivedUser).toEqual(user)
      expect(authService.currentUser.getValue()).toEqual(user)
      expect(authService.state.getValue()).toEqual(LoginState.Authenticated)
    })
    it("Should'nt update the current user from a response with multiple results", async () => {
      const r = new Repository({})
      const authService = FormsAuthenticationService.Setup(r)
      r.loadCollection = async () =>
        Promise.resolve({
          d: {
            __count: 2,
            results: [{}, {}],
          },
        }) as any
      const receivedUser = await authService.getCurrentUser()
      expect(receivedUser).toEqual(ConstantContent.VISITOR_USER)
      expect(authService.currentUser.getValue()).toEqual(ConstantContent.VISITOR_USER)
      expect(authService.state.getValue()).toEqual(LoginState.Unauthenticated)
    })

    it("Should'nt update the current user from a response with Visitor user", async () => {
      const r = new Repository({})
      const authService = FormsAuthenticationService.Setup(r)
      r.loadCollection = async () =>
        Promise.resolve({
          d: {
            __count: 1,
            results: [ConstantContent.VISITOR_USER],
          },
        }) as any
      const receivedUser = await authService.getCurrentUser()
      expect(receivedUser).toEqual(ConstantContent.VISITOR_USER)
      expect(authService.currentUser.getValue()).toEqual(ConstantContent.VISITOR_USER)
      expect(authService.state.getValue()).toEqual(LoginState.Unauthenticated)
    })
  })

  it('Logout should call a custom action endpoint and set the loginState to Unauthenticated', async () => {
    const actionCall = jest.fn()
    const r = new Repository({})
    FormsAuthenticationService.Setup(r)
    r.authentication.state.setValue(LoginState.Authenticated)
    r.executeAction = actionCall
    await r.authentication.logout()
    expect(actionCall).toBeCalledWith({ body: {}, idOrPath: 2, method: 'POST', name: 'Logout' })
    expect(r.authentication.state.getValue() === LoginState.Unauthenticated)
  })
})
