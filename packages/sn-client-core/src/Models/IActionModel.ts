
/**
 * Model interface for custom actions
 */
 export interface IActionModel {
    /**
     * Name of the action
     */
    Name: string;
    /**
     * Name of the action
     */
    DisplayName: string;

    /**
     * Index of the action
     */
    Index: number;
    /**
     * Icon of the action
     */
    Icon: string;
    /**
     * URL of the action
     */
    Url: string;
    /**
     * IncludeBackUrl of the action
     */
    IncludeBackUrl: number;
    /**
     * Shows if an action is a client action
     */
    ClientAction: boolean;
    /**
     * Shows if the action is forbidden
     */
    Forbidden: boolean;
}
