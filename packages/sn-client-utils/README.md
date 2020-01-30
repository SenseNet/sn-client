# @sensenet/client-utils

> General sensenet independent client side utilities

[![NPM version](https://img.shields.io/npm/v/@sensenet/client-utils.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-utils)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/client-utils.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-utils)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/client-utils

# NPM
npm install @sensenet/client-utils
```

### Disposable

You can implement _disposable_ resources and use them with a _using()_ or _usingAsync()_ syntax.
Example:

```ts
class Resource implements Disposable {
  dispose() {
    // cleanup logics
  }
}

using(new Resource(), resource => {
  // do something with the resource
})

usingAsync(new Resource(), async resource => {
  // do something with the resource, allows awaiting promises
})
```

### ObservableValue and ValueObservers

You can track value changes using with this simple Observable implementation.

Example:

```ts
const observableValue = new ObservableValue<number>(0)
const observer = observableValue.subscribe(newValue => {
  console.log('Value changed:', newValue)
})

// To update the value
observableValue.setValue(Math.random())
// if you want to dispose a single observer
observer.dispose()
// if you want to dispose the whole observableValue with all of its observers:
observableValue.dispose()
```

### PathHelper

The class contains small helper methods for path transformation and manipulation.

### Retrier

Retrier is a utility that can keep trying an operation until it succeeds, times out or reach a specified retry limit.

```ts
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
```

### Trace

Trace is an utility that can be used to track method calls, method returns and errors

```ts
const methodTracer: Disposable = Trace.method({
  object: myObjectInstance, // You can define an object constructor for static methods as well
  method: myObjectInstance.method, // The method to be tracked
  methodName: 'method', // Unique identifier for the method
  isAsync: true, // if you set to async, method finished will be *await*-ed
  onCalled: traceData => {
    console.log('Method called:', traceData)
  },
  onFinished: traceData => {
    console.log('Method call finished:', traceData)
  },
  onError: traceData => {
    console.log('Method throwed an error:', traceData)
  },
})

// if you want to stop receiving events
methodTracer.dispose()
```

### Logging package

#### Initializing with @sensenet-client-utils/inject

You can start using the Logging service with an injector in the following way

```ts
import { ConsoleLogger, Injector } from '@sensenet/client-utils'

const myInjector = new Injector().useLogging(ConsoleLogger, Logger1, Logger2 /** ...your Logger implementations */)
```

You can retrieve the Logger instance with

```ts
const myLogger = myInjector.logger
```

#### Logging events

You can log a simple event with

```ts
myLogger.addEntry({
  level: LogLevel.Verbose,
  message: 'My log message',
  scope: 'logger/test',
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
  scope: '@sensenet/client-utils/test',
  data: {
    foo: 1,
    bar: 42,
  },
})
```

The two snippets do the same - they will add a log entry to _each_ registered logger.

###### Scoped loggers

At the most of the cases, you use a logger in a service with a specific scope. You can create and use a scoped logger in the following way

```ts
const scopedLogger = myLogger.withScope('logger/test')
scopedLogger.verbose({ message: 'FooBarBaz' })
```

###### Implementing your own logger

You can implement your own logging logic in the similar way as this custom log collector

```ts
import { AbstractLogger, Injectable, LeveledLogEntry } from '@sensenet/client-utils'

@Injectable({ lifetime: 'singleton' })
export class MyCustomLogCollector extends AbstractLogger {
  private readonly entries: Array<LeveledLogEntry<any>> = []

  public getEntries() {
    return [...this.entries]
  }

  public async addEntry<T>(entry: LeveledLogEntry<T>): Promise<void> {
    this.entries.push(entry)
  }

  constructor() {
    super()
  }
}
```

### Injector

Injectors act as _containers_, they are responsible for creating / retrieving service instances based on the provided Injectable metadata.
You can create an injector with simply instantiating the class

```ts
const myInjector = new Injector()
```

You can organize your injector(s) in trees by creating _child injectors_. You can use the children and services with _scoped_ lifetime for contextual services.

```ts
const childInjector = myInjector.createChild({ owner: 'myCustomContext' })
```

#### Injectable

##### Creating an Injectable service from a class

You can create an injectable service from a plain class when decorating with the `@Injectable()` decorator.

```ts
@Injectable({
  /** Injectable options */
})
export class MySercive {
  /** ...service implementation... */

  constructor(s1: OtherInjectableService, s2: AnotherInjectableService) {}
}
```

The constructor parameters (`s1: OtherInjectableService` and `s2: AnotherInjectableService`) should be also decorated and will be resolved recursively.

##### Lifetime

You can define a specific Lifetime for Injectable services on the decorator

```ts
@Injectable({
  lifetime: 'transient',
})
export class MySercive {
  /** ...service implementation... */
}
```

The lifetime can be

- **transient** - A new instance will be created each time when you get an instance
- **scoped** - A new instance will be created _if it doesn't exist on the current scope_. Can be useful for injectable services that can be used for contextual data.
- **singleton** - A new instance will be created only if it doesn't exists on the _root_ injector. It will act as a singleton in other cases.

Injectables can only depend on services with _longer lifetime_, e.g. a **transient** can depend on a **singleton**, but inversing it will throw an error

##### Retrieving your service from the injector

You can retrieve a service by calling

```ts
const service = myInjector.getInstance(MySercive)
```

##### Explicit instance setup

There are cases that you have to set a service instance explicitly. You can do that in the following way

```ts
class MyService {
  constructor(public readonly foo: string)
}

myInjector.setExplicitInstance(new MyService('bar'))
```
