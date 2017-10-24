
import { Observable } from 'rx';

export module ClickHandlers {
    export const getObservables = (domItems) => {
        const click = Observable.fromEvent(domItems, 'click');
        return { click };
    }
}