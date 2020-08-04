export class PermissionType {
  /* Id */
  public value!: number
  /* From */
  public from!: string | null
  /* Identity */
  public identity?: string //TODO: It should be removed later (with getAcl action)
}
export class IdentityType {
  /* Id */
  public id!: number
  /* Path */
  public path!: string
  /* Name */
  public name!: string
  /* DisplayName */
  public displayName!: string
  /* Domain */
  public domain?: null | string
  /* Kind */
  public kind!: string
  /* Avatar */
  public avatar?: string
}

export class EntryType {
  /* Identity */
  public identity!: IdentityType
  /* Inherited */
  public inherited!: boolean
  /* Ancestor */
  public ancestor!: string | null
  /* Propagates */
  public propagates!: boolean
  /* Permissions */
  public permissions!: { [permissionName: string]: PermissionType }
}

export class AclResponseType {
  /* Id */
  public id!: number
  /* Path */
  public path!: string
  /* Inherits */
  public inherits!: boolean
  /* Entries */
  public entries!: EntryType[]
}
