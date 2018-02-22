import { combineReducers } from 'redux'

export interface RootReducer {
    session: {
        isLoggedIn: boolean,
    }
}

export const rootReducer  = combineReducers<RootReducer>({
})
