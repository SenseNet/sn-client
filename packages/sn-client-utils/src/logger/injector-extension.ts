import { Constructable } from '@furystack/inject'

import { Injector } from '@furystack/inject/dist/Injector'

import { Logger } from './logger'

import { LoggerCollection } from './logger-collection'

declare module '@furystack/inject/dist/Injector' {
  /**
  
     * Defines an extended Injector instance
  
     */

  interface Injector {
    /**
    
         * Registers a Logger service to the injector container with the provided loggers.
    
         */

    useLogging: (...loggers: Array<Constructable<Logger>>) => Injector

    /**
    
         * Returns the registered Logger instance
    
         */

    readonly logger: Logger
  }
}

Injector.prototype.useLogging = function(...loggers) {
  const loggerInstances = loggers.map(l => this.getInstance(l))

  const collection = this.getInstance(LoggerCollection)

  collection.attachLogger(...loggerInstances)

  this.setExplicitInstance(collection, LoggerCollection)

  return this
}

Object.defineProperty(Injector.prototype, 'logger', {
  // tslint:disable-next-line: object-literal-shorthand

  get() {
    return this.getInstance(LoggerCollection)
  },
})
