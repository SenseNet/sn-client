# @furystack/inject

dependency injection provider for FuryStack

## Injector

Injectors act as _containers_, they are responsible for creating / retrieving service instances based on the provided Injectable metadata. You can create an injector with simply instantiating the class

```ts
const myInjector = new Injector()
```

You can organize your injector(s) in trees by creating _child injectors_. You can use the children and services with _scoped_ lifetime for contextual services.

```ts
const childInjector = myInjector.createChild({ owner: 'myCustomContext' })
```

## Injectable

### Creating an Injectable service from a class

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

### Lifetime

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

### Retrieving your service from the injector

You can retrieve a service by calling

```ts
const service = myInjector.getInstance(MySercive)
```

### Explicit instance setup

There are cases that you have to set a service instance explicitly. You can do that in the following way

```ts
class MyService {
  constructor(public readonly foo: string)
}

myInjector.setExplicitInstance(new MyService('bar'))
```
