import { Disposable } from '../../src/Disposable'

/**
 * Defines a Mock Disposable class
 */
export class MockDisposable implements Disposable {
  private disposed = false
  /**
   * Returns if the Disposable is already disposed
   */
  public isDisposed = () => this.disposed
  /**
   * Disposes the MockDisposable instance, calls the dispose callback
   */
  public dispose = () => {
    this.disposed = true
    this.disposeCallback && this.disposeCallback()
  }

  /**
   * Mock to throw an error
   */
  public whooops() {
    throw Error('Whooops')
  }

  /**
   * Defines the callback that will be called on dispose
   */
  public disposeCallback!: () => void
}
