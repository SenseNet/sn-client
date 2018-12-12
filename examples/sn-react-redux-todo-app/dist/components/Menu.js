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
const Add_1 = __importDefault(require("@material-ui/icons/Add"));
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styles = {
    actionButton: {
        color: '#fff',
        position: 'fixed',
        bottom: 10,
        right: 10,
    },
};
class Menu extends React.Component {
    render() {
        return (React.createElement(Button_1.default, { variant: "fab", color: "primary", "aria-label": "add", style: styles.actionButton },
            React.createElement(react_router_dom_1.Link, { to: "/new/Task" },
                React.createElement(Add_1.default, { style: { color: '#fff', marginTop: 5 } }))));
    }
}
exports.Menu = Menu;
//# sourceMappingURL=Menu.js.map