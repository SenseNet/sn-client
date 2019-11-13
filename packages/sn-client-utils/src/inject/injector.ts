import { Disposable } from '../disposable'
import { Logger, LoggerCollection } from '../index'
import { defaultInjectableOptions } from './injectable'
import { Constructable } from './constructable'

/**
 * Container for injectable instances
 */
export class Injector implements Disposable {
  /**
   * Returns the registered Logger instance
   */
  public get logger(): LoggerCollection {
    return this.getInstance(LoggerCollection)
  }

  /**
   * Registers a Logger service to the injector container with the provided loggers.
   */
  public useLogging(...loggers: Array<Constructable<Logger>>) {
    const loggerInstances = loggers.map(l => this.getInstance(l))
    const collection = this.getInstance(LoggerCollection)
    collection.attachLogger(...loggerInstances)
    this.setExplicitInstance(collection, LoggerCollection)
    return this
  }

  /**
   * Disposes the Injector object and all its disposable injectables
   */
  public async dispose() {
    /** */
    const singletons = Array.from(this.cachedSingletons.entries()).map(e => e[1])
    const disposeRequests = singletons
      .filter(s => s !== this)
      .map(async s => {
        if (s.dispose) {
          return s.dispose() || Promise.resolve()
        }
      })
    await Promise.all(disposeRequests)
    this.cachedSingletons.clear()
  }

  /**
   * Options object for an injector instance
   */
  public options: { parent?: Injector; owner?: any } = {}

  /**
   * Static class metadata map, filled by the @Injectable() decorator
   */
  public static meta: Map<
    Constructable<any>,
    {
      dependencies: Array<Constructable<any>>
      options: import('./injectable').InjectableOptions
    }
  > = new Map()

  public readonly cachedSingletons: Map<Constructable<any>, any> = new Map()

  public remove = <T>(ctor: Constructable<T>) => this.cachedSingletons.delete(ctor)

  /**
   *
   * @param ctor The constructor object (e.g. MyClass)
   * @param dependencies Resolved dependencies (usually provided by the framework)
   */
  public getInstance<T>(ctor: Constructable<T>, dependencies: Array<Constructable<T>> = []): T {
    if (ctor === this.constructor) {
      return (this as any) as T
    }
    const meta = Injector.meta.get(ctor)
    if (!meta) {
      throw Error(
        `No metadata found for '${ctor.name}'. Dependencies: ${dependencies
          .map(d => d.name)
          .join(',')}. Be sure that it's decorated with '@Injectable()' or added explicitly with SetInstance()`,
      )
    }
    if (dependencies.includes(ctor)) {
      throw Error(`Circular dependencies found.`)
    }

    if (meta.options.lifetime === 'singleton') {
      const invalidDeps = meta.dependencies
        .map(dep => ({ meta: Injector.meta.get(dep), dep }))
        .filter(m => m.meta && (m.meta.options.lifetime === 'scoped' || m.meta.options.lifetime === 'transient'))
        .map(i => i.meta && `${i.dep.name}:${i.meta.options.lifetime}`)
      if (invalidDeps.length) {
        throw Error(
          `Injector error: Singleton type '${ctor.name}' depends on non-singleton injectables: ${invalidDeps.join(
            ',',
          )}`,
        )
      }
    } else if (meta.options.lifetime === 'scoped') {
      const invalidDeps = meta.dependencies
        .map(dep => ({ meta: Injector.meta.get(dep), dep }))
        .filter(m => m.meta && m.meta.options.lifetime === 'transient')
        .map(i => i.meta && `${i.dep.name}:${i.meta.options.lifetime}`)
      if (invalidDeps.length) {
        throw Error(
          `Injector error: Scoped type '${ctor.name}' depends on transient injectables: ${invalidDeps.join(',')}`,
        )
      }
    }

    if (meta.options.lifetime !== 'transient' && this.cachedSingletons.has(ctor)) {
      return this.cachedSingletons.get(ctor) as T
    }
    const fromParent =
      meta.options.lifetime === 'singleton' && this.options.parent && this.options.parent.getInstance(ctor)
    if (fromParent) {
      return fromParent
    }
    const deps = meta.dependencies.map(dep => this.getInstance(dep, [...dependencies, ctor]))
    const newInstance = new ctor(...deps)
    this.setExplicitInstance(newInstance)
    return newInstance
  }

  /**
   * Sets explicitliy an instance for a key in the store
   * @param instance The created instance
   * @param key The class key to be persisted (optional, calls back to the instance's constructor)
   */
  public setExplicitInstance<T extends object>(instance: T, key?: Constructable<any>) {
    const ctor = key || (instance.constructor as Constructable<T>)
    if (!Injector.meta.has(ctor)) {
      const meta = Reflect.getMetadata('design:paramtypes', ctor)
      Injector.meta.set(ctor, {
        dependencies:
          (meta &&
            (meta as any[]).map(param => {
              return param
            })) ||
          [],
        options: { ...defaultInjectableOptions, lifetime: 'explicit' as any },
      })
    }
    if (instance.constructor === this.constructor) {
      throw Error('Cannot set an injector instance as injectable')
    }
    this.cachedSingletons.set(ctor, instance)
  }

  /**
   * Creates a child injector instance
   * @param options Additional injector options
   */
  public createChild(options?: Partial<Injector['options']>) {
    const i = new Injector()
    i.options = i.options || options
    i.options.parent = this
    return i
  }
}
