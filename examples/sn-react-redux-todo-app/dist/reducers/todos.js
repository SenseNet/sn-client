"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_core_1 = require("@sensenet/client-core");
const default_content_types_1 = require("@sensenet/default-content-types");
const query_1 = require("@sensenet/query");
exports.fetch = () => ({
    type: 'FETCH_TASKS',
    inject: (options) => __awaiter(this, void 0, void 0, function* () {
        /** */
        if (!options.getState().todoList.isFetching) {
            options.dispatch(exports.startFetching());
            try {
                const todos = yield options.getInjectable(client_core_1.Repository).loadCollection({
                    path: '/Root/Sites/Default_Site/tasks',
                    oDataOptions: {
                        query: new query_1.Query(q => q.typeIs(default_content_types_1.Task)).toString(),
                        select: ['Status', 'Name', 'DisplayName'],
                    },
                });
                options.dispatch(exports.finishFetching(todos.d.results));
            }
            catch (error) {
                options.dispatch(exports.fetchingError(error));
            }
            options.dispatch(exports.updateFilter());
        }
    }),
});
exports.updateTodo = (todo) => ({
    type: 'UPDATE_TODO',
    inject: (options) => __awaiter(this, void 0, void 0, function* () {
        /** */
        try {
            const updated = yield options.getInjectable(client_core_1.Repository).patch({
                idOrPath: todo.Id,
                content: todo,
                oDataOptions: {
                    select: ['Status', 'Name', 'DisplayName'],
                },
            });
            options.dispatch(exports.todoUpdated(updated.d));
        }
        catch (error) {
            options.dispatch(exports.fetchingError(error));
        }
        options.dispatch(exports.updateFilter());
    }),
});
exports.todoUpdated = (todo) => ({
    type: 'TODO_UPDATED',
    todo,
});
exports.removeTodo = (todo) => ({
    type: 'UPDATE_TODO',
    inject: (options) => __awaiter(this, void 0, void 0, function* () {
        /** */
        try {
            const result = yield options.getInjectable(client_core_1.Repository).delete({
                idOrPath: todo.Id,
            });
            options.dispatch(exports.todoRemoved(result.d.results[0]));
        }
        catch (error) {
            options.dispatch(exports.fetchingError(error));
        }
        options.dispatch(exports.updateFilter());
    }),
});
exports.todoRemoved = (todo) => ({
    type: 'TODO_REMOVED',
    todo,
});
exports.startFetching = () => ({
    type: 'START_FETCHING',
});
exports.finishFetching = (tasks) => ({
    type: 'FINISH_FETCHING',
    tasks,
});
exports.fetchingError = (error) => ({
    type: 'FETCHING_ERROR',
    error,
});
exports.updateFilter = (filter) => ({
    type: 'UPDATE_FILTER',
    filter,
});
exports.selectTask = (id) => ({
    type: 'SELECT_TASK',
    id,
});
exports.todoListReducer = (state = {
    isFetching: false,
    allTasks: [],
    visibleTasks: [],
    filter: 'all',
}, action) => {
    switch (action.type) {
        case 'START_FETCHING':
            return Object.assign({}, state, { isFetching: true });
        case 'FINISH_FETCHING':
            return Object.assign({}, state, { isFetching: false, allTasks: action.tasks });
        case 'FETCHING_ERROR':
            return Object.assign({}, state, { isFetching: false, error: action.error });
        case 'UPDATE_FILTER':
            const filter = action.filter || state.filter || 'all';
            return Object.assign({}, state, { filter, visibleTasks: filter
                    ? state.allTasks.filter(t => filter === 'all' || t.Status === filter || t.Status.indexOf(filter) > -1)
                    : state.allTasks });
        case 'TODO_UPDATED': {
            const updateAction = action;
            return Object.assign({}, state, { allTasks: state.allTasks.map(t => {
                    if (t.Id === updateAction.todo.Id) {
                        return updateAction.todo;
                    }
                    return t;
                }) });
        }
        case 'TODO_REMOVED':
            const a = action;
            return Object.assign({}, state, { allTasks: state.allTasks.filter(t => t.Id !== a.todo.Id) });
        case 'SELECT_TASK':
            return Object.assign({}, state, { selected: state.allTasks.find(t => t.Id === action.id) });
    }
    return state;
};
//# sourceMappingURL=todos.js.map