import { IDisposable } from "./Disposable";
import { ObservableValue, ValueChangeCallback } from "./ObservableValue";

/**
 * Defines a generic ValueObserver instance
 */
export class ValueObserver<T> implements IDisposable {
    /**
     * Disposes the ValueObserver instance. Unsubscribes from the observable
     */
    public dispose() {
        this.observable.unsubscribe(this);
    }

    /**
     * @constructs ValueObserver<T> the ValueObserver instance
     */
    constructor(private readonly observable: ObservableValue<T>, public callback: ValueChangeCallback<T>) {

    }
}
