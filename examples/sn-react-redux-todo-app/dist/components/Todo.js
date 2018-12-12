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
const Checkbox_1 = __importDefault(require("@material-ui/core/Checkbox"));
const FormControlLabel_1 = __importDefault(require("@material-ui/core/FormControlLabel"));
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Create_1 = __importDefault(require("@material-ui/icons/Create"));
const Delete_1 = __importDefault(require("@material-ui/icons/Delete"));
const default_content_types_1 = require("@sensenet/default-content-types");
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comp: this.props.content.Status && this.props.content.Status[0] === 'completed' ? true : false,
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        const selected = this.state.comp ? false : true;
        this.props.content.Status = selected ? default_content_types_1.Status.completed : default_content_types_1.Status.active;
        this.setState({
            comp: selected,
        });
    }
    render() {
        const link = `/edit/` + this.props.content.Id;
        const { content } = this.props;
        return (React.createElement(Grid_1.default, { container: true },
            React.createElement(Grid_1.default, { item: true, sm: 12, md: 8, lg: 8, style: { paddingTop: 7 } },
                React.createElement(FormControlLabel_1.default, { control: React.createElement(Checkbox_1.default, { checked: this.state.comp, onClick: () => {
                            this.handleClick();
                            this.props.onClick(content);
                        }, value: "comp" }), label: content.DisplayName })),
            React.createElement(Grid_1.default, { item: true, sm: 12, md: 4, lg: 4, style: { textAlign: 'center' } },
                React.createElement(react_router_dom_1.Link, { to: link },
                    React.createElement(IconButton_1.default, { "aria-label": "Edit" },
                        React.createElement(Create_1.default, null))),
                React.createElement(IconButton_1.default, { "aria-label": "Delete", onClick: () => this.props.onDeleteClick(content) },
                    React.createElement(Delete_1.default, null)))));
    }
}
exports.Todo = Todo;
//# sourceMappingURL=Todo.js.map