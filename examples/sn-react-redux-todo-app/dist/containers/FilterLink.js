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
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const todos_1 = require("../reducers/todos");
exports.mapStateToProps = (state) => {
    return {
        currentFilter: state.todoList.filter,
    };
};
exports.mapDispatchToProps = {
    updateFilter: todos_1.updateFilter,
};
const styles = {
    active: {
        borderBottom: 'solid 2px #fff',
        color: '#fff',
        textDecoration: 'none',
    },
    tabButton: {
        color: '#fff',
    },
};
class InnerLink extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isActive: this.props.currentFilter === this.props.status,
        };
    }
    static getDerivedStateFromProps(props) {
        return {
            isActive: props.currentFilter === props.status,
        };
    }
    render() {
        return (React.createElement(Button_1.default, { color: "secondary", style: styles.tabButton },
            React.createElement(react_router_dom_1.Link, { to: this.props.children === 'All' ? '/browse/All' : '/browse/' + this.props.children, onClick: () => {
                    this.props.updateFilter(this.props.status);
                }, style: this.state.isActive ? styles.active : { color: '#fff', textDecoration: 'none' } }, this.props.children)));
    }
}
exports.InnerLink = InnerLink;
const filterLink = react_redux_1.connect(exports.mapStateToProps, exports.mapDispatchToProps)(InnerLink);
exports.default = filterLink;
//# sourceMappingURL=FilterLink.js.map