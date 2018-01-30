import { PathHelper } from "@sensenet/client-utils";
import { Group, IdentityKind, Inheritance, PermissionLevel, PermissionRequestBody, User } from "@sensenet/default-content-types";
import { IODataCollectionResponse } from "../Models/IODataCollectionResponse";
import { IPermissionResponseModel } from "../Models/ISecurityModels";
import { Repository } from "./Repository";

/**
 * Shortcut for security-related custom content actions
 */
export class Security {
    constructor(private readonly repository: Repository) {    }

    /**
     * Sets permission inheritance on the requested content.
     * @param {string | number} idOrPath A content id or path
     * @param {Inheritance} inheritance inheritance: break or unbreak
     * @returns {Promise<IPermissionResponseModel>} A promise with a response model
     */
    public setPermissionInheritance = (idOrPath: string | number, inheritance: Inheritance) =>
        this.repository.executeAction<{ inheritance: Inheritance }, IPermissionResponseModel>({
            name: "SetPermissions",
            idOrPath,
            method: "POST",
            body: {
                inheritance: inheritance as Inheritance,
            },
        })

    /**
     * Sets permissions on the requested content.
     * You can add or remove permissions for one ore more users or groups using this action.
     * @param {string | number} idOrPath A content id or path
     * @param {PermissionRequestBody} permissionRequestBody inheritance: break or unbreak
     * @returns {Promise<IPermissionResponseModel>} A promise with a response model
     */
    public setPermissions = (idOrPath: string | number, permissionRequestBody: PermissionRequestBody): Promise<IPermissionResponseModel> =>
        this.repository.executeAction<{ entryList: PermissionRequestBody }, IPermissionResponseModel>({
            name: "SetPermissions",
            idOrPath,
            method: "POST",
            body: {
                entryList: permissionRequestBody as PermissionRequestBody,
            },
        })

    /**
     * Gets permissions for the requested content. If no identity is given, all the permission entries will be returned.
     *
     * Required permissions to call this action: See permissions.
     * @param {string | number} contentIdOrPath The path or id for the content
     * @param {string | undefined} identityPath Optional path of the identity whose permissions must be returned (user, group or organizational unit)
     * @returns {Promise<IPermissionResponseModel>} A promise with the permission response
     */
    public getPermissions = (contentIdOrPath: string | number, identityPath?: string): Promise<IPermissionResponseModel> =>
        this.repository.executeAction<{ identity: string }, IPermissionResponseModel>({
            idOrPath: contentIdOrPath,
            name: "GetPermissions",
            method: "GET",
            body: {
                identity: identityPath || "",
            },
        })

    /**
     * Gets if the given user has the specified permissions for the requested content.
     *
     * Required permissions to call this action: See permissions.
     * @param {string[]} permissions list of permission names (e.g. Open, Save)
     * @param {string} user path of the user (or the current user, if not provided)
     * @returns {Promise<boolean>} A promise with the response value
     */
    public async hasPermission(contentIdOrPath: string | number,
                               permissions: Array<"See" | "Preview" | "PreviewWithoutWatermark" | "PreviewWithoutRedaction" | "Open" |
                            "OpenMinor" | "Save" | "Publish" | "ForceCheckin" | "AddNew" |
                            "Approve" | "Delete" | "RecallOldVersion" | "DeleteOldVersion" | "SeePermissions" |
                            "SetPermissions" | "RunApplication" | "ManageListsAndWorkspaces" | "TakeOwnership" |
                            "Custom01" | "Custom02" | "Custom03" | "Custom04" | "Custom05" | "Custom06" | "Custom07" | "Custom08" | "Custom09" |
                            "Custom10" | "Custom11" | "Custom12" | "Custom13" | "Custom14" | "Custom15" | "Custom16" | "Custom17" |
                            "Custom18" | "Custom19" | "Custom20" | "Custom21" | "Custom22" | "Custom23" | "Custom24" | "Custom25" |
                            "Custom26" | "Custom27" | "Custom28" | "Custom29" | "Custom30" | "Custom31" | "Custom32">,
                               identityPath: string): Promise<boolean> {

        let params = `permissions=${permissions.join(",")}`;
        params += `&identity=${identityPath}`;
        const response = await this.repository.fetch(`${PathHelper.getContentUrl(contentIdOrPath)}/HasPermission?${params}`);
        if (response.ok) {
            return await response.text() === "true" || false;
        } else {
            throw Error(response.statusText);
        }
    }
    /**
     * Identity list that contains every users/groups/organizational units
     * that have any permission setting (according to permission level)
     * in the subtree of the context content.
     * @param {string | number} contentIdOrPath The id or path for the content to check
     * @param {PermissionLevel} level  The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @param  {IdentityKind} kind The value can be: All, Users, Groups, OrganizationalUnits, UsersAndGroups, UsersAndOrganizationalUnits, GroupsAndOrganizationalUnits
     * @returns {Promise<>} An observable with the collection of the related users and / or groups
     */
    public getRelatedIdentities = (contentIdOrPath: (string | number),
                                   level: PermissionLevel,
                                   kind: IdentityKind) =>
        this.repository.executeAction<{}, IODataCollectionResponse<User | Group>>({
            name: "GetRelatedIdentities",
            idOrPath: contentIdOrPath,
            method: "POST",
            body: {
                level,
                kind,
            },
        })

    /**
     * Permission list of the selected identity with the count of related content. 0 indicates that this permission has no related content so the GUI does not have to display it as a tree node
     * @param {string | number} contentIdOrPath The Id or Path to the Content to check
     * @param {PermissionLevel} level The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @param {boolean} explicitOnlyThe value "true" is required because "false" is not implemented yet.
     * @param {string} member Fully qualified path of the selected identity (e.g. /Root/IMS/BuiltIn/Portal/Visitor).
     * @param {string[]} includedTypes An item can increment the counters if its type or any ancestor type is found in the 'includedTypes'. Null means filtering off. If the array is empty, there
     * is no element that increases the counters. This filter can reduce the execution speed dramatically so do not use if it is possible.
     * @returns {Promise<IODataCollectionResponse<TMemberType>>} A promise with the related users / groups
     */
    public getRelatedPermissions = <TMemberType extends (User | Group) = (User | Group)>(contentIdOrPath: string | number, level: PermissionLevel, explicitOnly: boolean, memberPath: string, includedTypes?: string[]): Promise<IODataCollectionResponse<TMemberType>> =>
        this.repository.executeAction({
            name: "GetRelatedPermissions",
            idOrPath: contentIdOrPath,
            method: "POST",
            body: {
                level,
                explicitOnly,
                member: memberPath,
                includedTypes,
            },
        })

    /**
     * Content list that have explicite/effective permission setting for the selected user in the current subtree.
     * @param {string | number} contentIdOrPath Id or path for the content
     * @param {PermissionLevel} level  The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @param {boolean} explicitOnly The value "true" is required because "false" is not implemented yet.
     * @param {string} member Fully qualified path of the selected identity (e.g. /Root/IMS/BuiltIn/Portal/Visitor).
     * @param {string[]} permissions related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Promise<>} A promise with the response data
     */
    public getRelatedItems = (contentIdOrPath: string | number, level: PermissionLevel, explicitOnly: boolean, member: string, permissions: string[]) =>
        this.repository.executeAction({
            name: "GetRelatedItems",
            idOrPath: contentIdOrPath,
            method: "POST",
            body: {
                level, explicitOnly, member, permissions,
            },
        })

    /**
     * This structure is designed for getting tree of content that are permitted or denied for groups/organizational units in the selected subtree. The result content are not in a paged list:
     * they are organized in a tree.
     * @param {number | string } contentIdOrPath Id or path for the content
     * @param {PermissionLevel} level The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @param {IdentityKind} kind The value can be: All, Users, Groups, OrganizationalUnits, UsersAndGroups, UsersAndOrganizationalUnits, GroupsAndOrganizationalUnits
     * @param {string[]} permissions related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Promise} Returns an RxJS observable that you can subscribe of in your code.
     */
     public getRelatedIdentitiesByPermissions = (contentIdOrPath: number | string, level: PermissionLevel, kind: IdentityKind, permissions: string[]) =>
         this.repository.executeAction({
             name: "GetRelatedIdentitiesByPermissions",
             idOrPath: contentIdOrPath,
             method: "POST",
             body: {
                level, kind, permissions,
             },
         })

    /**
     * This structure is designed for getting tree of content that are permitted or denied for groups/organizational units in the selected subtree. The result content are not in a paged list:
     * they are organized in a tree.
     * @param {PermissionLevel} level The value is "AllowedOrDenied". "Allowed" or "Denied" are not implemented yet.
     * @param {string} member Fully qualified path of the selected identity (e.g. /Root/IMS/BuiltIn/Portal/Visitor).
     * @param {string[]} permissions related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     */
    public getRelatedItemsOneLevel = (contentIdOrPath: number | string, level: PermissionLevel, member: string, permissions: string[]) =>
        this.repository.executeAction({
            name: "GetRelatedItemsOneLevel",
            idOrPath: contentIdOrPath,
            method: "POST",
            body: {
                level, member, permissions,
            },
        })

    /**
     * Returns a content collection that represents users who have enough permissions to a requested resource. The permissions effect on the user and through direct or indirect group membership
     * too. The function parameter is a permission name list that must contain at least one item.
     * @param {number | string} contentIdOrPath The id or path to the content to check
     * @param {string[]} permissions related permission list. Item names are case sensitive. In most cases only one item is used (e.g. "See" or "Save" etc.) but you can pass any permission
     * type name (e.g. ["Open","Save","Custom02"]).
     * @returns {Observable} Returns an RxJS observable that you can subscribe of in your code.
     */
    public getAllowedUsers = (contentIdOrPath: number | string, permissions: string[]) =>
        this.repository.executeAction({
            idOrPath: contentIdOrPath,
            name: "GetAllowedUsers",
            method: "POST",
            body: {
                permissions,
            },
        })

    /**
     * Returns a content collection that represents groups where the given user or group is member directly or indirectly. This function can be used only on a resource content that is
     * Group or User or any inherited type. If the value of the "directOnly" parameter is false, all indirect members are listed.
     * @param {number|string} contentIdOrPath The path or id of the content to check
     * @param {boolean} directOnly If the value of the "directOnly" parameter is false, all indirect members are listed.
     * @returns {Promise} A promise with the response
     */
    public getParentGroups = (contentIdOrPath: number | string, directOnly: boolean): Promise<{}> =>
        this.repository.executeAction({
            name: "GetParentGroups",
            idOrPath: contentIdOrPath,
            method: "POST",
            body: {
                directOnly,
            },
        })

    /**
     * Administrators can add new members to a group using this action. The list of new members can be provided using the 'contentIds' parameter (list of user or group ids).
     * @param {string | number} contentIdOrPath A Path or Id to the content to check
     * @param  {number[]} contentIds List of the member ids.
     * @returns {Promise} A Promise with the response object
     */
    public addMembers = (contentIdOrPath: string | number, contentIds: number[]) =>
        this.repository.executeAction({
            name: "AddMembers",
            idOrPath: contentIdOrPath,
            method: "POST",
            body: {
                contentIds,
            },
        })
    /**
     * Administrators can remove members from a group using this action. The list of removable members can be provided using the 'contentIds' parameter (list of user or group ids).
     * @param {string | number} contentIdOrPath A Path or Id to the content to check
     * @param {number[]}  contentIds List of the member ids.
     * @returns {Promise} Returns an RxJS observable that you can subscribe of in your code.
     */
    public removeMembers = (contentIdOrPath: string | number, contentIds: number[]) =>
        this.repository.executeAction({
            name: "RemoveMembers",
            idOrPath: contentIdOrPath,
            method: "POST",
            body: {
                contentIds,
            },
        })
}
