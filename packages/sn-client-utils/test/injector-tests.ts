import { Disposable, Injectable, Injector, using, usingAsync } from '../src'
import 'reflect-metadata'

// tslint:disable:max-classes-per-file

describe('Injector', () => {
  it('Shold be constructed', () => {
    const i = new Injector()
    expect(i).toBeInstanceOf(Injector)
  })

  it('Parent should be the default instance, if not specified', () => {
    const i = new Injector()
    expect(i.options.parent).toBeUndefined()
  })

  it('Should throw an error on circular dependencies', () => {
    const i = new Injector()
    @Injectable()
    class InstanceClass {
      constructor(public ohgodno: InstanceClass) {
        /** */
      }
    }
    expect(() => i.getInstance(InstanceClass)).toThrow()
  })

  it('Should set and return instance from cache', () => {
    const i = new Injector()
    @Injectable({ lifetime: 'scoped' })
    class InstanceClass {}
    const instance = new InstanceClass()
    i.setExplicitInstance(instance)
    expect(i.getInstance(InstanceClass)).toBe(instance)
  })

  it('Should throw an error when setting an Injector instance', () => {
    using(new Injector(), i => {
      expect(() => i.setExplicitInstance(new Injector())).toThrowError('Cannot set an injector instance as injectable')
    })
  })

  it('Should return from a parent injector if available', () => {
    const parent = new Injector()
    const i = parent.createChild()
    @Injectable({ lifetime: 'singleton' })
    class InstanceClass {}
    const instance = new InstanceClass()
    parent.setExplicitInstance(instance)
    expect(i.getInstance(InstanceClass)).toBe(instance)
    // tslint:disable-next-line:no-string-literal
    expect(parent['cachedSingletons'].get(InstanceClass)).toBe(instance)
  })

  it('Should create instance on a parent injector if not available', () => {
    const parent = new Injector()
    const i = parent.createChild()
    @Injectable({ lifetime: 'singleton' })
    class InstanceClass {}
    expect(i.getInstance(InstanceClass)).toBeInstanceOf(InstanceClass)
    expect(
      // tslint:disable-next-line:no-string-literal
      parent['cachedSingletons'].get(InstanceClass),
    ).toBeInstanceOf(InstanceClass)
  })

  it('Should resolve parameters', () => {
    const i = new Injector()

    @Injectable()
    class Injected1 {}
    @Injectable()
    class Injected2 {}

    @Injectable()
    class InstanceClass {
      constructor(public injected1: Injected1, public injected2: Injected2) {
        /** */
      }
    }
    expect(i.getInstance(InstanceClass)).toBeInstanceOf(InstanceClass)
    expect(i.getInstance(InstanceClass).injected1).toBeInstanceOf(Injected1)
    expect(i.getInstance(InstanceClass).injected2).toBeInstanceOf(Injected2)
  })

  it('Should resolve parameters recursively', () => {
    const i = new Injector()

    @Injectable()
    class Injected1 {}
    @Injectable()
    class Injected2 {
      constructor(public injected1: Injected1) {}
    }

    @Injectable()
    class InstanceClass {
      constructor(public injected2: Injected2) {
        /** */
      }
    }
    expect(i.getInstance(InstanceClass)).toBeInstanceOf(InstanceClass)
    expect(i.getInstance(InstanceClass).injected2.injected1).toBeInstanceOf(Injected1)
  })

  it('Should be disposed', async () => {
    await usingAsync(new Injector(), async () => {
      /** */
    })
  })

  it('Should dispose cached entries on dispose and tolerate non-disposable ones', done => {
    class TestDisposable implements Disposable {
      public dispose() {
        done()
      }
    }
    class TestInstance {}

    usingAsync(new Injector(), async i => {
      i.setExplicitInstance(new TestDisposable())
      i.setExplicitInstance(new TestInstance())
    })
  })

  it('Remove should remove an entity from the cached singletons list', () => {
    using(new Injector(), i => {
      i.setExplicitInstance({}, Object)
      i.remove(Object)
      // tslint:disable-next-line: no-string-literal
      expect(i['cachedSingletons'].size).toBe(0)
    })
  })

  it('Requesting an Injector instance should return self', () => {
    using(new Injector(), i => {
      expect(i.getInstance(Injector)).toBe(i)
    })
  })

  it('Requesting an undecorated instance should throw an error', () => {
    class UndecoratedTestClass {}
    using(new Injector(), i => {
      expect(() => i.getInstance(UndecoratedTestClass, [Injector])).toThrowError(
        `No metadata found for 'UndecoratedTestClass'. Dependencies: Injector. Be sure that it's decorated with '@Injectable()' or added explicitly with SetInstance()`,
      )
    })
  })

  it('Singleton with transient dependencies should throw an error', () => {
    @Injectable({ lifetime: 'transient' })
    class Trs1 {}

    @Injectable({ lifetime: 'singleton' })
    class St1 {
      constructor(public lt: Trs1) {}
    }

    using(new Injector(), i => {
      expect(() => i.getInstance(St1)).toThrowError(
        `Injector error: Singleton type 'St1' depends on non-singleton injectables: Trs1:transient`,
      )
    })
  })

  it('Singleton with transient dependencies should throw an error', () => {
    @Injectable({ lifetime: 'scoped' })
    class Sc1 {}

    @Injectable({ lifetime: 'singleton' })
    class St2 {
      constructor(public sc: Sc1) {}
    }

    using(new Injector(), i => {
      expect(() => i.getInstance(St2)).toThrowError(
        `Injector error: Singleton type 'St2' depends on non-singleton injectables: Sc1:scoped`,
      )
    })
  })

  it('Scoped with transient dependencies should throw an error', () => {
    @Injectable({ lifetime: 'transient' })
    class Tr2 {}

    @Injectable({ lifetime: 'scoped' })
    class Sc2 {
      constructor(public sc: Tr2) {}
    }

    using(new Injector(), i => {
      expect(() => i.getInstance(Sc2)).toThrowError(
        `Injector error: Scoped type 'Sc2' depends on transient injectables: Tr2:transient`,
      )
    })
  })
})
