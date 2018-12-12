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
const AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const default_content_types_1 = require("@sensenet/default-content-types");
const React = __importStar(require("react"));
const FilterLink_1 = __importDefault(require("../containers/FilterLink"));
/**
 * class
 */
class FilterMenu extends React.Component {
    /**
     * render
     */
    render() {
        return (React.createElement(AppBar_1.default, { position: "static" },
            React.createElement(Toolbar_1.default, null,
                React.createElement(FilterLink_1.default, { name: "All", status: 'all' }, "All"),
                React.createElement(FilterLink_1.default, { name: "Active", status: default_content_types_1.Status.active }, "Active"),
                React.createElement(FilterLink_1.default, { name: "Completed", status: default_content_types_1.Status.completed }, "Completed"))));
    }
}
exports.FilterMenu = FilterMenu;
//# sourceMappingURL=FilterMenu.js.map