import { combineReducers } from "redux";

export interface IRootReducer {
    session: {
        isLoggedIn: boolean,
    };
}

export const rootReducer  = combineReducers<IRootReducer>({
});
