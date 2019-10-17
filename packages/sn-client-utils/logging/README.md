# @furystack/logging

Logging package for FuryStack

## Initializing with @furystack/inject

You can start using the Logging service with an injector in the following way

```ts
import { ConsoleLogger } from '@furystack/logging'

const myInjector = new Injector().useLogging(ConsoleLogger, Logger1, Logger2 /** ...your Logger implementations */)
```

You can retrieve the Logger instance with

```ts
const myLogger = myInjector.logger
```

## Logging events

You can log a simple event with

```ts
myLogger.addEntry({
  level: LogLevel.Verbose,
  message: 'My log message',
  scope: '@furystack/logging/test',
  data: {
    foo: 1,
    bar: 42,
  },
})
```

or

```ts
myLogger.verbose({
  message: 'My log message',
  scope: '@furystack/logging/test',
  data: {
    foo: 1,
    bar: 42,
  },
})
```

The two snippets do the same - they will add a log entry to _each_ registered logger.

### Scoped loggers

At the most of the cases, you use a logger in a service with a specific scope. You can create and use a scoped logger in the following way

```ts
const scopedLogger = myLogger.withScope('@furystack/logging/test')
scopedLogger.verbose({ message: 'FooBarBaz' })
```

### Implementing your own logger

You can implement your own logging logic in the similar way as this custom log collector

```ts
import { AbstractLogger, ILeveledLogEntry } from '@furystack/logging'

@Injectable({ lifetime: 'singleton' })
export class MyCustomLogCollector extends AbstractLogger {
  private readonly entries: Array<ILeveledLogEntry<any>> = []

  public getEntries() {
    return [...this.entries]
  }

  public async addEntry<T>(entry: ILeveledLogEntry<T>): Promise<void> {
    this.entries.push(entry)
  }

  constructor() {
    super()
  }
}
```
