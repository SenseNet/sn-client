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
const client_core_1 = require("@sensenet/client-core");
const controls_react_1 = require("@sensenet/controls-react");
const redux_1 = require("@sensenet/redux");
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const __1 = require("..");
const Login_1 = __importDefault(require("../containers/Login"));
const VisibleTodoList_1 = __importDefault(require("../containers/VisibleTodoList"));
const todos_1 = require("../reducers/todos");
const FilterMenu_1 = require("./FilterMenu");
const Menu_1 = require("./Menu");
const styles = {
    loader: {
        textAlign: 'center',
    },
};
const mapStateToProps = (state) => {
    return {
        loginState: redux_1.Reducers.getAuthenticationStatus(state.sensenet),
        schema: redux_1.Reducers.getSchema(state.sensenet),
        selected: state.todoList.selected,
    };
};
const mapDispatchToProps = {
    loginClick: redux_1.Actions.userLogin,
    editSubmitClick: redux_1.Actions.updateContent,
    createSubmitClick: redux_1.Actions.createContent,
    getSchema: redux_1.Actions.getSchema,
    fetch: todos_1.fetch,
};
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: { Status: 'active', Path: '/Root/Sites/Default_Site/tasks', Type: 'Task' },
            // params: this.props,
            loginState: client_core_1.LoginState.Pending,
            name: '',
            password: '',
            listView: () => {
                return (React.createElement("div", null,
                    React.createElement("h4", null, "Todos"),
                    React.createElement(FilterMenu_1.FilterMenu, null),
                    React.createElement(VisibleTodoList_1.default, null)));
            },
            newView: () => (React.createElement(controls_react_1.NewView, { path: this.state.content.Path, contentTypeName: 'Task', repository: __1.repository, onSubmit: this.props.createSubmitClick, schema: this.props.schema })),
            editView: () => {
                if (this.props.selected) {
                    return (React.createElement(controls_react_1.EditView, { content: this.props.selected, contentTypeName: "Task", onSubmit: this.props.editSubmitClick, repository: __1.repository, schema: this.props.schema }));
                }
                else {
                    return null;
                }
            },
        };
        this.props.getSchema('Task');
    }
    /**
     * render
     */
    render() {
        const { loginState } = this.props;
        const isLoggedin = loginState === client_core_1.LoginState.Authenticated;
        const isPending = loginState === client_core_1.LoginState.Pending;
        const { listView, editView, newView } = this.state;
        if (isLoggedin) {
            this.props.fetch();
            return (React.createElement(react_router_dom_1.HashRouter, null,
                React.createElement("div", null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: listView }),
                    React.createElement(react_router_dom_1.Route, { path: "/edit/:id", component: editView }),
                    React.createElement(react_router_dom_1.Route, { path: "/new/:type", component: newView }),
                    React.createElement(react_router_dom_1.Route, { path: "/browse/:filter", component: listView }),
                    React.createElement(Menu_1.Menu, null))));
        }
        else if (isPending) {
            return (React.createElement("div", { style: styles.loader },
                React.createElement(CircularProgress_1.default, null)));
        }
        else {
            return (React.createElement("div", null,
                React.createElement(Login_1.default, null)));
        }
    }
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(App);
//# sourceMappingURL=App.js.map