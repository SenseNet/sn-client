import 'reflect-metadata'
import { Injector } from './Injector'
import { Constructable } from './Types/Constructable'

/**
 * Options for the injectable instance
 */
export interface InjectableOptions {
  lifetime: 'transient' | 'singleton' | 'scoped'
}

/**
 * The default options for the injectable classes
 */
export const defaultInjectableOptions: InjectableOptions = {
  lifetime: 'transient',
}

/**
 * Decorator method for tagging a class as injectable
 * @param options The options object
 */
export const Injectable = (options?: Partial<InjectableOptions>) => {
  return <T extends Constructable<any>>(ctor: T) => {
    const meta = Reflect.getMetadata('design:paramtypes', ctor)
    const metaValue = {
      dependencies:
        (meta &&
          (meta as any[]).map(param => {
            return param
          })) ||
        [],
      options: { ...defaultInjectableOptions, ...options },
    }
    Injector.meta.set(ctor, metaValue)
  }
}
