import { Retrier } from '../src'

/**
 * Retrier tests
 */
export const retrierTests = describe('Retrier', () => {
  describe('Counter', () => {
    it('Should be able to count to 3', async () => {
      let count = 0
      await Retrier.create(async () => {
        count = count + 1
        return count === 3
      }).run()
      expect(count).toBe(3)
    })
  })

  describe('events', () => {
    it('should trigger onSuccess on success', async () => {
      let triggered = false
      await Retrier.create(async () => true)
        .setup({
          onSuccess: () => {
            triggered = true
          },
        })
        .run()

      expect(triggered).toBe(true)
    })

    it('should trigger onTimeout on timeout', async () => {
      let triggered = false
      await Retrier.create(async () => false)
        .setup({
          onFail: () => {
            triggered = true
          },
          timeoutMs: 1,
        })
        .run()

      expect(triggered).toBe(true)
    })

    it('should trigger onTry on each try', async () => {
      let triggered = false
      await Retrier.create(async () => true)
        .setup({
          onTry: () => {
            triggered = true
          },
        })
        .run()
      expect(triggered).toBe(true)
    })
  })

  it('should work with an example test', async () => {
    const funcToRetry: () => Promise<boolean> = async () => {
      const hasSucceeded = false
      // ...
      // custom logic
      // ...
      return hasSucceeded
    }
    const retrierSuccess = await Retrier.create(funcToRetry)
      .setup({
        Retries: 3,
        RetryIntervalMs: 1,
        timeoutMs: 1000,
      })
      .run()

    expect(retrierSuccess).toBe(false)
  })

  it('should throw error when started twice', async () => {
    const retrier = Retrier.create(async () => false)
    retrier.run()
    try {
      await retrier.run()
      throw Error('Should have been failed')
    } catch (error) {
      // ignore
    }
  })

  it('should throw an error when trying to set up after started', () => {
    const retrier = Retrier.create(async () => false)
    retrier.run()
    expect(() => {
      retrier.setup({
        Retries: 2,
      })
    }).toThrow()
  })
})
