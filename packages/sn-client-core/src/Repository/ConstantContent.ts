import {IContent} from "../Models/IContent";

/**
 * Constant content definitions for sensenet ECM
 */
export class ConstantContent {
    /**
     * Defines a visitor user content
     */
    public static VISITOR_USER: IContent & {DisplayName: any, Domain: any, LoginName: any} = {
        Id: 6,
        DisplayName: "Visitor",
        Domain: "BuiltIn",
        Name: "Visitor",
        Path: "/Root/IMS/BuiltIn/Portal/Visitor",
        LoginName: "Visitor",
        Type: "User",
    };

    /**
     * Defines a portal root content
     */
    public static PORTAL_ROOT: IContent & {DisplayName: string} = {
        Id: 2,
        Path: "/Root",
        Name: "Root",
        DisplayName: "Root",
        Type: "PortalRoot",
    };
}
