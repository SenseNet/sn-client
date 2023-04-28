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
export type PermissionRequestBody = {
  identity: string
  localOnly?: boolean
  inheritance?: Inheritance
  RestrictedPreview?: PermissionValue
  PreviewWithoutWatermakr?: PermissionValue
  PreviewWithoutRedaction?: PermissionValue
  See?: PermissionValue
  Open?: PermissionValue
  OpenMinor?: PermissionValue
  Save?: PermissionValue
  Publish?: PermissionValue
  ForceUndoCheckout?: PermissionValue
  AddNew?: PermissionValue
  Approve?: PermissionValue
  Delete?: PermissionValue
  RecallOldVersion?: PermissionValue
  DeleteOldVersion?: PermissionValue
  SeePermissions?: PermissionValue
  SetPermissions?: PermissionValue
  RunApplication?: PermissionValue
  ManageListsAndWorkspaces?: PermissionValue
  TakeOwnership?: PermissionValue
  Custom01?: PermissionValue
  Custom02?: PermissionValue
  Custom03?: PermissionValue
  Custom04?: PermissionValue
  Custom05?: PermissionValue
  Custom06?: PermissionValue
  Custom07?: PermissionValue
  Custom08?: PermissionValue
  Custom09?: PermissionValue
  Custom10?: PermissionValue
  Custom11?: PermissionValue
  Custom12?: PermissionValue
  Custom13?: PermissionValue
  Custom14?: PermissionValue
}

export const PermissionValues = {
  undefined: 0,
  allow: 1,
  deny: 2,
} as const

// a key for permission values usage permissionKeys[0] will be undefined and so on
export const permissionKeys = Object.keys(PermissionValues) as Array<keyof typeof PermissionValues>

export type PermissionValue = (typeof PermissionValues)[keyof typeof PermissionValues]
/**
 * Provides metadata about permission inheritance.
 */
export enum Inheritance {
  Break = 'break',
  Unbreak = 'unbreak',
}
