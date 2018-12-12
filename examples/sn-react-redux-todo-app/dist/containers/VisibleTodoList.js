"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const FetchError_1 = require("../components/FetchError");
const TodoList_1 = require("../components/TodoList");
const todos_1 = require("../reducers/todos");
const mapStateToProps = (state) => {
    return {
        visibleTasks: state.todoList.visibleTasks,
        errorMessage: state.todoList.error,
        isFetching: state.todoList.isFetching,
        visibilityFilter: state.todoList.filter,
    };
};
const mapDispatchToProps = {
    onTodoClick: todos_1.updateTodo,
    onDeleteClick: todos_1.removeTodo,
    fetchTodos: todos_1.fetch,
    updateFilter: todos_1.updateFilter,
};
const styles = {
    loader: {
        margin: '0 auto',
    },
};
class VisibleTodoList extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.fetchData(this.props.filter);
    }
    fetchData(filter) {
        this.props.fetchTodos();
        this.props.updateFilter(filter);
    }
    render() {
        if (this.props.isFetching && this.props.visibleTasks.length > 0) {
            return (React.createElement("div", { style: styles.loader },
                React.createElement(CircularProgress_1.default, null)));
        }
        if (this.props.errorMessage && this.props.visibleTasks.length > 0) {
            return React.createElement(FetchError_1.FetchError, { message: this.props.errorMessage, onRetry: () => this.fetchData(this.props.filter) });
        }
        return (React.createElement(TodoList_1.TodoList, { collection: this.props.visibleTasks, onTodoClick: this.props.onTodoClick, onDeleteClick: this.props.onDeleteClick }));
    }
}
const visibleTodoLista = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(VisibleTodoList);
exports.default = visibleTodoLista;
//# sourceMappingURL=VisibleTodoList.js.map