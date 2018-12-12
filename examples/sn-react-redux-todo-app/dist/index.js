"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const Root_1 = require("./components/Root");
require("./index.css");
const client_core_1 = require("@sensenet/client-core");
const redux_1 = require("@sensenet/redux");
const redux_2 = require("redux");
const todos_1 = require("./reducers/todos");
const lightBlue_1 = __importDefault(require("@material-ui/core/colors/lightBlue"));
const pink_1 = __importDefault(require("@material-ui/core/colors/pink"));
const createMuiTheme_1 = __importDefault(require("@material-ui/core/styles/createMuiTheme"));
const MuiThemeProvider_1 = __importDefault(require("@material-ui/core/styles/MuiThemeProvider"));
const authentication_jwt_1 = require("@sensenet/authentication-jwt");
const react_redux_1 = require("react-redux");
const redux_di_middleware_1 = require("redux-di-middleware");
const muiTheme = createMuiTheme_1.default({
    palette: {
        primary: lightBlue_1.default,
        secondary: pink_1.default,
    },
});
const sensenet = redux_1.Reducers.sensenet;
const myReducer = redux_2.combineReducers({
    sensenet,
    todoList: todos_1.todoListReducer,
});
exports.repository = new client_core_1.Repository({
    repositoryUrl: 'https://dmsservice.demo.sensenet.com',
});
exports.jwt = new authentication_jwt_1.JwtService(exports.repository);
const di = new redux_di_middleware_1.ReduxDiMiddleware();
di.setInjectable(exports.repository);
const store = redux_1.Store.createSensenetStore({
    repository: exports.repository,
    rootReducer: myReducer,
    logger: true,
    middlewares: [di.getMiddleware()],
});
ReactDOM.render(React.createElement(MuiThemeProvider_1.default, { theme: muiTheme },
    React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(Root_1.Root, null))), document.getElementById('root'));
//# sourceMappingURL=index.js.map