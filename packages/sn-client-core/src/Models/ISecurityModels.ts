import { IdentityKind } from "@sensenet/default-content-types";

// tslint:disable:completed-docs

/**
 * Response model for gettins permission identities
 */
export interface IPermissionIdentity {
    id: number;
    path: string;
    name: string;
    displayName: string;
    domain: string;
    kind: IdentityKind;
}

/**
 * Response model for permission values
 */
export interface IPermissionValue {
    value: string;   // ToDo: to enum?
    from: string;
    identity: string;
}

/**
 * Response model for permission entries
 */
export interface IPermissionEntry {
    identity: IPermissionIdentity;
    propagates: boolean;
    permissions: {
        See: IPermissionValue | null,
        Preview: IPermissionValue | null,
        PreviewWithoutWatermark: IPermissionValue | null,
        PreviewWithoutRedaction: IPermissionValue | null,
        Open: IPermissionValue | null,
        OpenMinor: IPermissionValue | null,
        Save: IPermissionValue | null,
        Publish: IPermissionValue | null,
        ForceCheckin: IPermissionValue | null,
        AddNew: IPermissionValue | null,
        Approve: IPermissionValue | null,
        Delete: IPermissionValue | null,
        RecallOldVersion: IPermissionValue | null,
        DeleteOldVersion: IPermissionValue | null,
        SeePermissions: IPermissionValue | null,
        SetPermissions: IPermissionValue | null,
        RunApplication: IPermissionValue | null,
        ManageListsAndWorkspaces: IPermissionValue | null,
        TakeOwnership: IPermissionValue | null,
        Unused13: IPermissionValue | null,
        Unused12: IPermissionValue | null,
        Unused11: IPermissionValue | null,
        Unused10: IPermissionValue | null,
        Unused09: IPermissionValue | null,
        Unused08: IPermissionValue | null,
        Unused07: IPermissionValue | null,
        Unused06: IPermissionValue | null,
        Unused05: IPermissionValue | null,
        Unused04: IPermissionValue | null,
        Unused03: IPermissionValue | null,
        Unused02: IPermissionValue | null,
        Unused01: IPermissionValue | null,
        Custom01: IPermissionValue | null,
        Custom02: IPermissionValue | null,
        Custom03: IPermissionValue | null,
        Custom04: IPermissionValue | null,
        Custom05: IPermissionValue | null,
        Custom06: IPermissionValue | null,
        Custom07: IPermissionValue | null,
        Custom08: IPermissionValue | null,
        Custom09: IPermissionValue | null,
        Custom10: IPermissionValue | null,
        Custom11: IPermissionValue | null,
        Custom12: IPermissionValue | null,
        Custom13: IPermissionValue | null,
        Custom14: IPermissionValue | null,
        Custom15: IPermissionValue | null,
        Custom16: IPermissionValue | null,
        Custom17: IPermissionValue | null,
        Custom18: IPermissionValue | null,
        Custom19: IPermissionValue | null,
        Custom20: IPermissionValue | null,
        Custom21: IPermissionValue | null,
        Custom22: IPermissionValue | null,
        Custom23: IPermissionValue | null,
        Custom24: IPermissionValue | null,
        Custom25: IPermissionValue | null,
        Custom26: IPermissionValue | null,
        Custom27: IPermissionValue | null,
        Custom28: IPermissionValue | null,
        Custom29: IPermissionValue | null,
        Custom30: IPermissionValue | null,
        Custom31: IPermissionValue | null,
        Custom32: IPermissionValue | null,
    };
}

export interface IPermissionResponseModel {
    id: number;
    path: string;
    inherits: boolean;
    entries: IPermissionEntry[];
}
