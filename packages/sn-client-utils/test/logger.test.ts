import {
  BrowserConsoleLogger,
  browserFormatter,
  ConsoleLogger,
  defaultFormatter,
  LoggerCollection,
  LogLevel,
} from '../src'
import { TestLogger } from './__Mocks__/test-logger'

describe('Loggers', () => {
  describe('LoggerCollection', () => {
    it('Should be constructed', () => {
      const loggers = new LoggerCollection()

      expect(loggers).toBeInstanceOf(LoggerCollection)
    })

    it('Should forward Verbose event', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          expect(e.level).toBe(LogLevel.Verbose)

          done()
        }),
      )

      loggers.verbose({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should forward Debug event', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          expect(e.level).toBe(LogLevel.Debug)

          done()
        }),
      )

      loggers.debug({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should forward Information event', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          expect(e.level).toBe(LogLevel.Information)

          done()
        }),
      )

      loggers.information({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should forward Warning event', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          expect(e.level).toBe(LogLevel.Warning)

          done()
        }),
      )

      loggers.warning({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should forward Error event', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          expect(e.level).toBe(LogLevel.Error)

          done()
        }),
      )

      loggers.error({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should raise an Error event if failed to insert below Error', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          if (e.level < LogLevel.Error) {
            throw new Error('Nooo')
          } else {
            expect(e.level).toBe(LogLevel.Error)

            done()
          }
        }),
      )

      loggers.verbose({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should raise a Fatal event if failed to insert an Error', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          if (e.level < LogLevel.Fatal) {
            throw new Error('Nooo')
          } else {
            expect(e.level).toBe(LogLevel.Fatal)

            done()
          }
        }),
      )

      loggers.verbose({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should forward Fatal event', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          expect(e.level).toBe(LogLevel.Fatal)

          done()
        }),
      )

      loggers.fatal({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should skip filtered events in a simple logger', (done) => {
      const logger = new TestLogger(async (e: any) => {
        expect(e.level).toBe(LogLevel.Error)

        done()
      })

      logger.verbose({
        message: 'alma',

        scope: 'alma',
      })

      logger.error({
        message: 'alma',

        scope: 'alma',
      })
    })

    it('Should skip filtered events in a collection', (done) => {
      const loggers = new LoggerCollection()

      loggers.attachLogger(
        new TestLogger(async (e) => {
          expect(e.level).toBe(LogLevel.Error)

          done()
        }),
      )

      loggers.verbose({
        message: 'alma',

        scope: 'alma',
      })

      loggers.error({
        message: 'alma',

        scope: 'alma',
      })
    })
  })

  describe('ConsoleLogger', () => {
    beforeEach(() => {
      console.log = jest.fn()
    })
    afterEach(() => {
      ;(console.log as any).mockRestore()
    })
    const consoleLogger = new ConsoleLogger()
    it('Should print Verbose', () => {
      consoleLogger.verbose({ scope: 'scope', message: 'Example Verbose Message' })
      expect(console.log).toBeCalledWith('\u001b[34m%s\u001b[0m', 'scope', 'Example Verbose Message')
    })

    it('Should print Debug', () => {
      consoleLogger.debug({ scope: 'scope', message: 'Example Debug Message' })
      expect(console.log).toBeCalledWith('\u001b[34m%s\u001b[0m', 'scope', 'Example Debug Message')
    })

    it('Should print Information', () => {
      consoleLogger.information({ scope: 'scope', message: 'Example Information Message' })
      expect(console.log).toBeCalledWith('\u001b[32m%s\u001b[0m', 'scope', 'Example Information Message')
    })

    it('Should print Warning', () => {
      consoleLogger.warning({ scope: 'scope', message: 'Example Warning Message' })
      expect(console.log).toBeCalledWith('\u001b[33m%s\u001b[0m', 'scope', 'Example Warning Message')
    })

    it('Should print Error', () => {
      consoleLogger.error({ scope: 'scope', message: 'Example Error Message' })
      expect(console.log).toBeCalledWith('\u001b[31m%s\u001b[0m', 'scope', 'Example Error Message')
    })

    it('Should print Fatal', () => {
      consoleLogger.fatal({ scope: 'scope', message: 'Example Fatal Message' })
      expect(console.log).toBeCalledWith('\u001b[31m%s\u001b[0m', 'scope', 'Example Fatal Message')
    })

    it('Should print additional data in verbose', () => {
      consoleLogger.verbose({ scope: 'scope', message: 'Example Verbose Message', data: { a: 1 } })
      expect(console.log).toBeCalledWith('\u001b[34m%s\u001b[0m', 'scope', 'Example Verbose Message', { a: 1 })
    })
  })

  describe('defaultFormatter', () => {
    it('Should print compact messages', () =>
      expect(
        defaultFormatter(
          {
            level: LogLevel.Debug,
            scope: 'scope',
            message: 'message',
            data: {},
          },
          false,
        ),
      ).toEqual(['\u001b[34m%s\u001b[0m', 'scope', 'message']))
  })

  describe('BrowserConsoleLogger', () => {
    const browserLogger = new BrowserConsoleLogger().withScope('scope')
    beforeEach(() => {
      console.log = jest.fn()
    })
    afterEach(() => {
      ;(console.log as any).mockRestore()
    })
    const tests = [
      {
        method: browserLogger.debug,
        methodName: 'Debug',
        expectation: ['%c[scope]:', 'color: darkblue', 'Example Message'],
      },
      {
        method: browserLogger.error,
        methodName: 'Error',
        expectation: ['%c[scope]:', 'color: darkred', 'Example Message'],
      },
      {
        method: browserLogger.fatal,
        methodName: 'Fatal',
        expectation: ['%c[scope]:', 'color: darkred', 'Example Message'],
      },
      {
        method: browserLogger.information,
        methodName: 'Information',
        expectation: ['%c[scope]:', 'color: darkgreen', 'Example Message'],
      },
      {
        method: browserLogger.verbose,
        methodName: 'Information',
        expectation: ['%c[scope]:', 'color: darkblue', 'Example Message'],
      },
      {
        method: browserLogger.warning,
        methodName: 'Information',
        expectation: ['%c[scope]:', 'color: darkorange', 'Example Message'],
      },
    ]
    tests.forEach((test) => {
      it(`should print colored log for ${test.methodName}`, () => {
        test.method({ message: 'Example Message' })
        expect(console.log).toBeCalledWith(...test.expectation)
      })
    })

    it('should print colored log when addEntry called', () => {
      browserLogger.addEntry({
        level: LogLevel.Information,
        message: 'message',
        data: { someProp: 'someProp' },
      })
      expect(console.log).toBeCalledWith('%c[scope]:', 'color: darkgreen', 'message', { someProp: 'someProp' })
    })
  })

  describe('browserFormatter', () => {
    it('should print logentry with data if it is provided', () => {
      expect(
        browserFormatter<{ someProp: string }>({
          level: LogLevel.Information,
          message: 'message',
          scope: 'scope',
          data: { someProp: 'someProp' },
        }),
      ).toEqual(['%c[scope]:', 'color: darkgreen', 'message', { someProp: 'someProp' }])
    })

    it('should not color anything if there is no scope', () => {
      expect(
        browserFormatter<{ someProp: string }>({
          level: LogLevel.Information,
          message: 'message',
          data: { someProp: 'someProp' },
        }),
      ).toEqual(['message', { someProp: 'someProp' }])
      expect(
        browserFormatter<{ someProp: string }>({
          level: LogLevel.Information,
          message: 'message',
        }),
      ).toEqual(['message'])
    })
  })
})
