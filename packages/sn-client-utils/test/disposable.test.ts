import { using, usingAsync } from '../src'
import { MockDisposable } from './__Mocks__/MockDisposable'

/**
 * Unit tests for disposables
 */
export const disposableTests = describe('Disposable', () => {
  it('Can be constructed', () => {
    using(new MockDisposable(), (d) => {
      expect(d).toBeInstanceOf(MockDisposable)
    })
  })

  it('Should return a value from a callback', () => {
    const returned = using(new MockDisposable(), () => {
      return 1
    })
    expect(returned).toBe(1)
  })

  it('Should return a value from an async callback', async () => {
    const returned = await usingAsync(new MockDisposable(), async () => {
      return 2
    })
    expect(returned).toBe(2)
  })

  describe('isDisposed', () => {
    it('should return a correct value before and after disposition', () => {
      const d = new MockDisposable()
      expect(d.isDisposed()).toBe(false)
      d.dispose()
      expect(d.isDisposed()).toBe(true)
    })
  })

  describe('dispose()', () => {
    it('should be called on error', (done) => {
      try {
        using(new MockDisposable(), (d) => {
          d.disposeCallback = () => {
            done()
          }

          d.whooops()
        })
      } catch {
        /** ignore */
      }
    })

    it('should be called with usingAsync()', (done) => {
      usingAsync(new MockDisposable(), async (d) => {
        d.disposeCallback = () => {
          done()
        }
        return new Promise((resolve) => {
          setTimeout(resolve, 1)
        })
      })
    })

    it('should be called when async fails', (done) => {
      usingAsync(new MockDisposable(), async (d) => {
        d.disposeCallback = () => {
          done()
        }
        return new Promise((_resolve, reject) => {
          setTimeout(reject, 1)
        })
      }).catch(() => {
        /** ignore */
      })
    })

    it('should await dispose for asyncs with usingAsync()', async () => {
      class AsyncDispose {
        /** flag */
        public isDisposed = false
        /** set isDisposed with a timeout */
        public async dispose() {
          await new Promise((resolve) =>
            setTimeout(() => {
              this.isDisposed = true
              resolve()
            }, 10),
          )
        }
      }

      const asyncDispose = new AsyncDispose()
      await usingAsync(asyncDispose, async () => {
        /** */
      })
      expect(asyncDispose.isDisposed).toBe(true)
    })
  })
})
