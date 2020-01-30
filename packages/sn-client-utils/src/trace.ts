import { Disposable } from './disposable'
import { ObservableValue } from './observable-value'

/**
 * Options object for tracing method calls
 */
export interface TraceMethodOptions<T, TMethod extends (...args: TArgs) => any, TArgs extends any[]> {
  /**
   * The context object. Can be an instance or a constructor for static methods
   */
  object: T
  /**
   * The method reference that needs to be traced
   */
  method: TMethod
  /**
   * Unique identifier for the method
   */
  methodName: string
  /**
   * Callback that will be called right before executing the method
   */
  onCalled?: (newValue: TraceMethodCall<TArgs>) => void
  /**
   * Callback that will be called right after the method returns
   */
  onFinished?: (newValue: TraceMethodFinished<ReturnType<TMethod>, TArgs>) => void
  /**
   * Callback that will be called when a method throws an error
   */
  onError?: (newValue: TraceMethodError<TArgs>) => void

  /**
   * The method execution will be awaited if set
   */
  isAsync?: boolean
}

/**
 * Defines a trace method call object
 */
export interface TraceMethodCall<TArgs extends any[]> {
  /**
   * The timestamp when the event occured
   */
  startDateTime: Date

  /**
   * The provided arguments for the call
   */
  methodArguments: TArgs
}

/**
 * Defines a trace event when a method call has been finished
 */
export interface TraceMethodFinished<TReturns, TArgs extends any[]> extends TraceMethodCall<TArgs> {
  returned: TReturns
  finishedDateTime: Date
}

/**
 * Defines a trace event when an error was thrown during a method call
 */
export interface TraceMethodError<TArgs extends any[]> extends TraceMethodCall<TArgs> {
  error: any
  errorDateTime: Date
}

/**
 * Defines a method mapping object
 */
export interface MethodMapping<TReturns, TArgs extends any[]> {
  /**
   * The original method instance
   */
  originalMethod: (...args: TArgs) => TReturns
  /**
   * An observable for distributing the events
   */
  callObservable: ObservableValue<TraceMethodCall<TArgs>>

  finishedObservable: ObservableValue<TraceMethodFinished<any, TArgs>>
  errorObservable: ObservableValue<TraceMethodError<TArgs>>
}

/**
 * Defines an Object Trace mapping
 */
export interface ObjectTrace {
  /**
   * Map about the already wrapped methods
   */
  methodMappings: Map<string, MethodMapping<any, any[]>>
}

/**
 * Helper class that can be used to trace method calls programmatically
 *
 * Usage example:
 * ```ts
 * const methodTracer: Disposable = Trace.method({
 *     object: myObjectInstance,           // You can define an object constructor for static methods as well
 *     method: myObjectInstance.method,    // The method to be tracked
 *     methodName: 'method', // Unique identifier for the method
 *     isAsync: true,                      // if you set to async, method finished will be *await*-ed
 *     onCalled: (traceData) => {
 *         console.log("Method called:", traceData)
 *     },
 *     onFinished: (traceData) => {
 *         console.log("Method call finished:", traceData)
 *     },
 *     onError: (traceData) => {
 *         console.log("Method throwed an error:", traceData)
 *     }
 * });
 * ```
 */
export class Trace {
  private static objectTraces: Map<object, ObjectTrace> = new Map()

  private static getMethodTrace<TArgs extends any[], TReturns>(
    object: object,
    methodName: string,
  ): MethodMapping<TReturns, TArgs> {
    const objectTrace = (this.objectTraces.get(object) as any) as ObjectTrace
    return (objectTrace.methodMappings.get(methodName) as any) as MethodMapping<TReturns, TArgs>
  }

  private static traceStart<TReturns, TArgs extends any[]>(
    methodTrace: MethodMapping<TReturns, TArgs[]>,
    args: TArgs[],
  ) {
    const startDateTime = new Date()
    const traceValue = {
      methodArguments: args,
      startDateTime,
    }
    methodTrace.callObservable.setValue(traceValue)
    return traceValue
  }

  private static traceFinished<TReturns, TArgs extends any[]>(
    methodTrace: MethodMapping<TReturns, TArgs>,
    args: TArgs,
    callTrace: TraceMethodCall<TArgs>,
    returned: any,
  ) {
    const finishedTrace: TraceMethodFinished<TReturns, TArgs> = {
      methodArguments: args,
      startDateTime: callTrace.startDateTime,
      finishedDateTime: new Date(),
      returned,
    }
    methodTrace.finishedObservable.setValue(finishedTrace)
  }

  private static traceError<TReturns, TArgs extends any[]>(
    methodTrace: MethodMapping<TReturns, TArgs>,
    args: TArgs,
    callTrace: TraceMethodCall<TArgs>,
    error: any,
  ) {
    const errorTrace: TraceMethodError<TArgs> = {
      methodArguments: args,
      startDateTime: callTrace.startDateTime,
      errorDateTime: new Date(),
      error,
    }
    methodTrace.errorObservable.setValue(errorTrace)
    return errorTrace
  }

  private static callMethod<TArgs extends any[]>(object: object, methodName: string, args: TArgs) {
    const methodTrace = this.getMethodTrace(object, methodName)
    const start = this.traceStart(methodTrace, args)
    try {
      const returned = methodTrace.originalMethod.call(object, ...args)
      this.traceFinished(methodTrace, args, start, returned)
      return returned
    } catch (error) {
      this.traceError(methodTrace, args, start, error)
      throw error
    }
  }

  private static async callMethodAsync<TArgs extends any[]>(object: object, methodName: string, args: TArgs) {
    const methodTrace = this.getMethodTrace(object, methodName)
    const start = this.traceStart(methodTrace, args)
    try {
      const returned = await methodTrace.originalMethod.call(object, ...args)
      this.traceFinished(methodTrace, args, start, returned)
      return returned
    } catch (error) {
      this.traceError(methodTrace, args, start, error)
      throw error
    }
  }

  /**
   * Creates an observer that will be observe method calls, finishes and errors
   * @param options The options object for the trace
   */
  public static method<T extends object, TMethod extends (...args: TArgs) => any, TArgs extends any[]>(
    options: TraceMethodOptions<T, TMethod, TArgs>,
  ): Disposable {
    // add object mapping
    if (!this.objectTraces.has(options.object)) {
      this.objectTraces.set(options.object, {
        methodMappings: new Map(),
      })
    }
    // setup override if needed
    if (!((options.object as any)[options.methodName] as any).isTraced) {
      const overriddenMethod = options.isAsync
        ? (...args: TArgs) => this.callMethodAsync(options.object, options.methodName, args)
        : (...args: TArgs) => this.callMethod(options.object, options.methodName, args)
      Object.defineProperty(overriddenMethod, 'name', { value: options.methodName })
      Object.defineProperty(overriddenMethod, 'isTraced', { value: options.methodName })
      ;(options.object as any)[options.methodName] = overriddenMethod
    }
    const objectTrace = (this.objectTraces.get(options.object) as any) as ObjectTrace

    // add method mapping if needed
    if (!objectTrace.methodMappings.has(options.methodName)) {
      objectTrace.methodMappings.set(options.methodName, {
        originalMethod: options.method,
        callObservable: new ObservableValue<TraceMethodCall<TArgs>>(),
        finishedObservable: new ObservableValue<TraceMethodFinished<ReturnType<TMethod>, TArgs>>(),
        errorObservable: new ObservableValue<TraceMethodError<TArgs>>(),
      } as any)
    }
    const methodTrace = (objectTrace.methodMappings.get(options.methodName) as any) as MethodMapping<
      ReturnType<TMethod>,
      TArgs
    >
    const callbacks = [
      options.onCalled && methodTrace.callObservable.subscribe(options.onCalled),
      options.onFinished && methodTrace.finishedObservable.subscribe(options.onFinished),
      options.onError && methodTrace.errorObservable.subscribe(options.onError),
    ]

    // Subscribe and return the observer
    return {
      dispose: () => callbacks.forEach(c => c && c.dispose()),
    }
  }
}
