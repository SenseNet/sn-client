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
const List_1 = __importDefault(require("@material-ui/core/List"));
const ListItem_1 = __importDefault(require("@material-ui/core/ListItem"));
const React = __importStar(require("react"));
const Todo_1 = require("./Todo");
const style = {
    emptyList: {
        marginTop: '20px',
        textAlign: 'center',
    },
};
class TodoList extends React.Component {
    render() {
        if (this.props.collection.length > 0) {
            return (React.createElement(List_1.default, null, this.props.collection.map((content, index) => {
                const c = content;
                return c !== undefined ? (React.createElement(ListItem_1.default, { key: c.Name + index },
                    React.createElement(Todo_1.Todo, { key: c.Id + index, content: c, onClick: t => this.props.onTodoClick(t), onDeleteClick: t => this.props.onDeleteClick(t) }))) : null;
            })));
        }
        else {
            return React.createElement("div", { style: style.emptyList }, "Add a task first!");
        }
    }
}
exports.TodoList = TodoList;
//# sourceMappingURL=TodoList.js.map