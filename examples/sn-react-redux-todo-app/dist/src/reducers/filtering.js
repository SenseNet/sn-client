"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_content_types_1 = require("@sensenet/default-content-types");
const redux_1 = require("@sensenet/redux");
const redux_2 = require("redux");
exports.createList = filter => {
    const handleToggle = (state, action, f) => {
        const { Id } = action.payload;
        const shouldRemove = (default_content_types_1.Status[0] === default_content_types_1.Status.active && f !== 'active' && f !== 'all') ||
            (default_content_types_1.Status[0] === default_content_types_1.Status.completed && f !== 'completed' && f !== 'all');
        return shouldRemove ? state.filter(id => id !== Id) : state;
    };
    const ids = (state = [], action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_SUCCESS':
                return action.payload.result;
            case 'CREATE_CONTENT_SUCCESS':
                return [...state, action.payload.result];
            case 'UPDATE_CONTENT_SUCCESS':
                return handleToggle(state, action, filter);
            case 'DELETE_CONTENT_SUCCESS':
                const index = state.indexOf(action.id);
                return [...state.slice(0, index), ...state.slice(index + 1)];
            default:
                return state;
        }
    };
    const isFetching = (state = false, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                return true;
            case 'FETCH_CONTENT_SUCCESS':
            case 'FETCH_CONTENT_FAILURE':
                return false;
            default:
                return state;
        }
    };
    const errorMessage = (state = null, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_FAILURE':
                return 'An error occured';
            case 'FETCH_CONTENT_REQUEST':
            case 'FETCH_CONTENT_SUCCESS':
                return null;
            default:
                return state;
        }
    };
    return redux_2.combineReducers({
        ids,
        isFetching,
        errorMessage,
    });
};
const visibilityFilter = (state = 'All', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};
exports.listByFilter = redux_2.combineReducers({
    All: exports.createList('all'),
    Active: exports.createList('active'),
    Completed: exports.createList('completed'),
    VisibilityFilter: visibilityFilter,
});
exports.getVisibleTodos = (state, filter) => {
    const ids = redux_1.Reducers.getIds(state.listByFilter[filter]);
    return ids.map(id => redux_1.Reducers.getContent(state.sensenet.children.entities, id));
};
exports.getIsFetching = (state, filter) => redux_1.Reducers.getFetching(state.listByFilter[filter]);
exports.getErrorMessage = (state, filter) => redux_1.Reducers.getError(state.listByFilter[filter]);
exports.getVisibilityFilter = state => state.sensenet.children.filter;
exports.setVisibilityFilter = filter => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter,
    };
};
//# sourceMappingURL=filtering.js.map