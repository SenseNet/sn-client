import { ObservableValue } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import Semaphor from 'semaphore-async-await'
import { AuthenticationService, ConstantContent, LoginState, ODataParams, ODataResponse, Repository } from '..'
import { isExtendedError } from '../Repository/Repository'

/**
 * Authentication Service class for using Forms authentication through OData Actions
 */
export class FormsAuthenticationService implements AuthenticationService {
  private statusLock = new Semaphor(1)

  /**
   * Static Factory Method for attaching the service to a Repository object
   * @param repository The repository instance
   * @param loadUserOptions Additional options for loading User content
   */
  public static Setup(repository: Repository, loadUserOptions?: ODataParams<User>) {
    const service = new FormsAuthenticationService(repository, loadUserOptions)
    service.getCurrentUser()
    return service
  }

  /**
   * This observable indicates the current state of the service
   * @default LoginState.Pending
   */
  public state: ObservableValue<LoginState> = new ObservableValue(LoginState.Unknown)

  /**
   * Observable value that will update with the current user on user change
   */
  public currentUser: ObservableValue<User> = new ObservableValue<User>(ConstantContent.VISITOR_USER)

  constructor(private repository: Repository, private readonly userLoadOptions: ODataParams<User> = { select: 'all' }) {
    this.repository.authentication = this
  }

  /**
   * Disposes the service, the state and currentUser observables
   */
  public async dispose(): Promise<void> {
    this.state.dispose()
    this.currentUser.dispose()
  }
  /**
   * Placehlolder to check if a token update is needed. Not used with Forms authentication
   */
  public async checkForUpdate(): Promise<boolean> {
    return false
  }

  /**
   * Returns the current user value
   */
  public async getCurrentUser(): Promise<User> {
    try {
      await this.statusLock.acquire()
      this.state.setValue(LoginState.Pending)
      try {
        const result = await this.repository.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            ...this.userLoadOptions,
            query: 'Id:@@CurrentUser.Id@@',
            top: 1,
          },
        })
        if (result.d.__count === 1) {
          if (result.d.results[0].Id !== ConstantContent.VISITOR_USER.Id) {
            this.state.setValue(LoginState.Authenticated)
            this.currentUser.setValue(result.d.results[0])
            return result.d.results[0]
          }
        }
      } catch {
        /** */
      }
      this.state.setValue(LoginState.Unauthenticated)
      this.currentUser.setValue(ConstantContent.VISITOR_USER)
      return ConstantContent.VISITOR_USER
    } finally {
      await this.statusLock.release()
    }
  }

  /**
   * Logs in with the provided credentials
   * @param username The username for the login
   * @param password The password for the login
   */
  public async login(username: string, password: string): Promise<boolean> {
    try {
      await this.statusLock.acquire()
      const user = await this.repository.executeAction<{ username: string; password: string }, ODataResponse<User>>({
        body: {
          username,
          password,
        },
        method: 'POST',
        idOrPath: ConstantContent.PORTAL_ROOT.Id,
        name: 'Login',
      })
      this.currentUser.setValue(user.d)
      const isVisitor = user.d.Id !== ConstantContent.VISITOR_USER.Id ? true : false
      this.state.setValue(isVisitor ? LoginState.Authenticated : LoginState.Unauthenticated)
      return isVisitor
    } catch (error) {
      return false
    } finally {
      this.statusLock.release()
    }
  }
  /**
   * Logs out and destroys the current session
   */
  public async logout(): Promise<boolean> {
    try {
      await this.repository.executeAction({
        method: 'POST',
        idOrPath: ConstantContent.PORTAL_ROOT.Id,
        name: 'Logout',
        body: {},
      })
    } catch (error) {
      //
      if (isExtendedError(error)) {
        if (!error.response.ok) {
          throw error
        }
      }
    }
    this.currentUser.setValue(ConstantContent.VISITOR_USER)
    this.state.setValue(LoginState.Unauthenticated)
    return true
  }
}
