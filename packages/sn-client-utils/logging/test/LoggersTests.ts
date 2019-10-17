import { ConsoleLogger, defaultFormatter, LoggerCollection, verboseFormatter } from '../src'
import { LogLevel } from '../src/LogEntries'
import { TestLogger } from '../src/TestLogger'

describe('Loggers', () => {
  describe('LoggerCollection', () => {
    it('Should be constructed', () => {
      const loggers = new LoggerCollection()
      expect(loggers).toBeInstanceOf(LoggerCollection)
    })

    it('Should forward Verbose event', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
          expect(e.level).toBe(LogLevel.Verbose)
          done()
        }),
      )
      loggers.verbose({
        message: 'alma',
        scope: 'alma',
      })
    })

    it('Should forward Debug event', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
          expect(e.level).toBe(LogLevel.Debug)
          done()
        }),
      )
      loggers.debug({
        message: 'alma',
        scope: 'alma',
      })
    })

    it('Should forward Information event', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
          expect(e.level).toBe(LogLevel.Information)
          done()
        }),
      )
      loggers.information({
        message: 'alma',
        scope: 'alma',
      })
    })

    it('Should forward Warning event', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
          expect(e.level).toBe(LogLevel.Warning)
          done()
        }),
      )
      loggers.warning({
        message: 'alma',
        scope: 'alma',
      })
    })

    it('Should forward Error event', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
          expect(e.level).toBe(LogLevel.Error)
          done()
        }),
      )
      loggers.error({
        message: 'alma',
        scope: 'alma',
      })
    })

    it('Should raise an Error event if failed to insert below Error', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
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

    it('Should raise a Fatal event if failed to insert an Error', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
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

    it('Should forward Fatal event', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(async e => {
          expect(e.level).toBe(LogLevel.Fatal)
          done()
        }),
      )
      loggers.fatal({
        message: 'alma',
        scope: 'alma',
      })
    })

    it('Should skip filtered events in a simple logger', done => {
      const logger = new TestLogger(
        async e => {
          expect(e.level).toBe(LogLevel.Error)
          done()
        },
        {
          filter: ev => ev.level === LogLevel.Error,
        },
      )
      logger.verbose({
        message: 'alma',
        scope: 'alma',
      })
      logger.error({
        message: 'alma',
        scope: 'alma',
      })
    })

    it('Should skip filtered events in a collection', done => {
      const loggers = new LoggerCollection()
      loggers.attachLogger(
        new TestLogger(
          async e => {
            expect(e.level).toBe(LogLevel.Error)
            done()
          },
          {
            filter: ev => ev.level === LogLevel.Error,
          },
        ),
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
    const consoleLogger = new ConsoleLogger()
    it('Should print Verbose', () => consoleLogger.verbose({ scope: 'scope', message: 'Example Verbose Message' }))
    it('Should print Debug', () => consoleLogger.debug({ scope: 'scope', message: 'Example Debug Message' }))
    it('Should print Information', () =>
      consoleLogger.information({ scope: 'scope', message: 'Example Information Message' }))
    it('Should print Warning', () => consoleLogger.warning({ scope: 'scope', message: 'Example Warning Message' }))
    it('Should print Error', () => consoleLogger.error({ scope: 'scope', message: 'Example Error Message' }))
    it('Should print Fatal', () => consoleLogger.fatal({ scope: 'scope', message: 'Example Fatal Message' }))

    it('Should print additional data', () =>
      consoleLogger.fatal({ scope: 'scope', message: 'Example Fatal Message', data: { a: 1 } }))
  })

  describe('defaultFormatter', () => {
    it('Should print compact messages', () =>
      expect(
        defaultFormatter({
          level: LogLevel.Debug,
          scope: 'scope',
          message: 'message',
          data: {},
        }),
      ).toEqual(['\u001b[34m%s\u001b[0m', 'scope', 'message']))
  })

  describe('verboseFormatter', () => {
    it('Should print compact messages', () =>
      expect(
        verboseFormatter({
          level: LogLevel.Debug,
          scope: 'scope',
          message: 'message',
        }),
      ).toEqual(['\u001b[34m%s\u001b[0m', 'scope', 'message']))

    it('Should print verbose messages with data', () =>
      expect(
        verboseFormatter({
          level: LogLevel.Debug,
          scope: 'scope',
          message: 'message',
          data: {},
        }),
      ).toEqual(['\u001b[34m%s\u001b[0m', 'scope', 'message', {}]))
  })
})
