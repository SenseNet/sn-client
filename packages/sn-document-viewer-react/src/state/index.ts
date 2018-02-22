import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { rootReducer } from "./RootReducer";

export const configureStore = () => {
    const store = createStore(rootReducer, undefined, applyMiddleware(thunk, createLogger({})));
    return store;
};
