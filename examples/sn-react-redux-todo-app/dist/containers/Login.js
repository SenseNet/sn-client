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
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
const client_core_1 = require("@sensenet/client-core");
const redux_1 = require("@sensenet/redux");
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const dist_1 = require("../../../../packages/sn-controls-react/dist");
const styles = {
    button: {
        marginTop: '20px',
        color: '#fff',
    },
    container: {
        maxWidth: 500,
        margin: '0 auto',
        textAlign: 'center',
    },
    buttonRow: {
        textAlign: 'right',
        width: '100%',
    },
};
const mapStateToProps = (state) => {
    return {
        loginState: state.sensenet.session.loginState,
        currentUserId: state.sensenet.session.user.content.Id,
    };
};
const mapDispatchToProps = {
    onSubmit: redux_1.Actions.userLogin,
};
const userSchema = dist_1.reactControlMapper(new client_core_1.Repository()).getFullSchemaForContentType('User', 'new');
class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        userSchema.fieldMappings = userSchema.fieldMappings.filter(fieldSettings => fieldSettings.fieldSettings.Name === 'LoginName' || fieldSettings.fieldSettings.Name === 'Password');
        return (React.createElement("div", { style: styles.container },
            React.createElement("form", { onSubmit: e => {
                    e.preventDefault();
                    // tslint:disable-next-line:no-string-literal
                    const name = document.getElementById('LoginName')['value'];
                    // tslint:disable-next-line:no-string-literal
                    const password = document.getElementById('Password')['value'];
                    this.props.onSubmit(name, password);
                } },
                React.createElement(Grid_1.default, { container: true },
                    userSchema.fieldMappings.map((_e, i) => (React.createElement(Grid_1.default, { item: true, sm: 12, md: 12, lg: 12, key: i }, React.createElement(userSchema.fieldMappings[i].controlType, Object.assign({}, userSchema.fieldMappings[i].clientSettings, { 'data-actionName': 'new', 'data-fieldValue': '', className: userSchema.fieldMappings[i].clientSettings.key }))))),
                    React.createElement(Grid_1.default, { item: true, style: styles.buttonRow },
                        React.createElement(Button_1.default, { type: "submit", style: styles.button, variant: "raised", color: "primary" }, "Login"))))));
    }
}
exports.Login = Login;
const loginView = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Login);
exports.default = loginView;
//# sourceMappingURL=Login.js.map