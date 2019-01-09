// tslint:disable:naming-convention

/**
 * Provides metadata about identity kind.
 */
export enum IdentityKind {
  All = 'All',
  Users = 'Users',
  Groups = 'Groups',
  OrganizationalUnits = 'OrganizationalUnits',
  UsersAndGroups = 'UsersAndGroups',
  UsersAndOrganizationalUnits = 'UsersAndOrganizationalUnits',
  GroupsAndOrganizationalUnits = 'GroupsAndOrganizationalUnits',
}
/**
 * Provides metadata about permission level.
 */
export enum PermissionLevel {
  AllowedOrDenied = 'AllowedOrDenied',
  Allowed = 'Allowed',
  Denied = 'Denied',
}
/**
 * Type to provide an Object with the permission information that has to be set.
 */
export class PermissionRequestBody {
  public identity!: string
  public localOnly?: boolean
  public RestrictedPreview?: PermissionValues
  public PreviewWithoutWatermakr?: PermissionValues
  public PreviewWithoutRedaction?: PermissionValues
  public Open?: PermissionValues
  public OpenMinor?: PermissionValues
  public Save?: PermissionValues
  public Publish?: PermissionValues
  public ForceUndoCheckout?: PermissionValues
  public AddNew?: PermissionValues
  public Approve?: PermissionValues
  public Delete?: PermissionValues
  public RecallOldVersion?: PermissionValues
  public DeleteOldVersion?: PermissionValues
  public SeePermissions?: PermissionValues
  public SetPermissions?: PermissionValues
  public RunApplication?: PermissionValues
  public ManageListsAndWorkspaces?: PermissionValues
  public TakeOwnership?: PermissionValues
  public Custom01?: PermissionValues
  public Custom02?: PermissionValues
  public Custom03?: PermissionValues
  public Custom04?: PermissionValues
  public Custom05?: PermissionValues
  public Custom06?: PermissionValues
  public Custom07?: PermissionValues
  public Custom08?: PermissionValues
  public Custom09?: PermissionValues
  public Custom10?: PermissionValues
  public Custom11?: PermissionValues
  public Custom12?: PermissionValues
  public Custom13?: PermissionValues
  public Custom14?: PermissionValues
}
/**
 * Provides metadata about permission values.
 */
export enum PermissionValues {
  undefined = 0,
  allow = 1,
  deny = 2,
}

/**
 * Provides metadata about permission inheritance.
 */
export enum Inheritance {
  Break = 'break',
  Unbreak = 'unbreak',
}
