import { Disposable } from './Disposable'
import { ValueObserver } from './ValueObserver'

/**
 * Callback type for observable value changes
 */
export type ValueChangeCallback<T> = (next: T) => void

/**
 * Defines an ObservableValue value object.
 *
 * You can set and get its value with it's *setValue()* and *getValue()* methods and you can subscribe to value changes with *subscribe()*
 *
 * Usage example:
 * ```ts
 * const observableValue = new ObservableValue<number>(0);
 * const observer = observableValue.subscribe((newValue) => {
 *    console.log("Value changed:", newValue);
 * });
 * // To update the value
 * observableValue.setValue(Math.random());
 * // if you want to dispose a single observer
 * observer.dispose();
 * // if you want to dispose the whole observableValue with all of its observers:
 * observableValue.dispose();
 * ```
 *
 * @param T Generic argument to indicate the value type
 */
export class ObservableValue<T> implements Disposable {
  /**
   * Disposes the ObservableValue object, removes all observers
   */
  public dispose() {
    this.observers.clear()
  }
  private observers: Set<ValueObserver<T>> = new Set()
  private currentValue!: T

  /**
   * Subscribes to a value changes
   * @param {ValueChangeCallback<T>} callback The callback method that will be called on each change
   * @param {boolean} getLast Will call the callback with the last known value right after subscription
   * @returns {ValueObserver<T>} The ValueObserver instance
   */
  public subscribe(callback: ValueChangeCallback<T>, getLast = false): ValueObserver<T> {
    const observer = new ValueObserver<T>(this, callback)
    this.observers.add(observer)
    if (getLast) {
      callback(this.currentValue)
    }
    return observer
  }

  /**
   * The observer will unsubscribe from the Observable
   * @param {ValueObserver<T>} observer The ValueObserver instance
   * @returns if unsubscribing was successfull
   */
  public unsubscribe(observer: ValueObserver<T>): boolean {
    return this.observers.delete(observer)
  }

  /**
   * Gets the current Value
   * @returns {T} The current value
   */
  public getValue(): T {
    return this.currentValue
  }

  /**
   * Sets a new value and notifies the observers.
   * @param {T} newValue The new value to be set
   */
  public setValue(newValue: T) {
    if (this.currentValue !== newValue) {
      this.currentValue = newValue
      for (const subscription of this.observers) {
        subscription.callback(newValue)
      }
    }
  }

  /**
   * Gets the observers
   * @returns {ReadonlyArray<ValueObserver<T>>} The subscribed observers
   */
  public getObservers(): ReadonlyArray<ValueObserver<T>> {
    return Array.from(this.observers)
  }

  /**
   * @constructs The ObservableValue object
   * @param {T} initialValue Optional initial value
   */
  constructor(initialValue?: T) {
    if (initialValue) {
      this.currentValue = initialValue
    }
  }
}
