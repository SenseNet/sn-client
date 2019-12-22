import { Disposable, Injectable, Injector, ObservableValue, ScopedLogger } from '@sensenet/client-utils'

/**
 * A context service to get/set the active theme
 */
@Injectable({ lifetime: 'singleton' })
export class ThemeService implements Disposable {
  public currentTheme = new ObservableValue<'dark' | 'light' | undefined>()

  private logger: ScopedLogger

  public async dispose() {
    this.currentTheme.dispose()
  }

  constructor(injector: Injector) {
    this.logger = injector.logger.withScope('SelectionService')

    this.currentTheme.subscribe(currentTheme =>
      this.logger.verbose({
        message: currentTheme ? `Current theme changed to ${currentTheme}` : `Current theme set to None`,
        data: {
          relatedContent: currentTheme,
        },
      }),
    )
  }
}
