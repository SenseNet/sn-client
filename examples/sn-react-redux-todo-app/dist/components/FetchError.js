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
/**
 * class
 */
class FetchError extends React.Component {
    /**
     * render
     */
    render() {
        return (React.createElement("div", null,
            React.createElement("p", null,
                "Could not fetch content. ",
                this.props.message.toString()),
            React.createElement(Button_1.default, { variant: "raised", color: "primary", onClick: this.props.onRetry }, "Retry")));
    }
}
exports.FetchError = FetchError;
//# sourceMappingURL=FetchError.js.map