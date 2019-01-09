import { IdentityKind, Inheritance, PermissionLevel, PermissionValues } from '@sensenet/default-content-types'
import 'jest'
import { Repository } from '../src/Repository/Repository'
import { Security } from '../src/Repository/Security'

// tslint:disable:completed-docs
describe('Security', () => {
  let security: Security
  let repository: Repository

  beforeEach(() => {
    repository = new Repository({}, async () => ({ ok: true, json: async () => ({}), text: async () => '' } as any))
    security = new Security(repository)
  })

  afterEach(() => {
    repository.dispose()
  })

  it('Should execute setPermissionInheritance', () => {
    expect(security.setPermissionInheritance(1, Inheritance.Break)).toBeInstanceOf(Promise)
  })

  it('Should execute setPermissions', () => {
    expect(
      security.setPermissions(1, {
        AddNew: PermissionValues.allow,
        identity: 'root/users/user1',
      }),
    ).toBeInstanceOf(Promise)
  })

  it('Should execute getPermissions', () => {
    expect(security.getPermissionsForIdentity(1, 'root/users/user1')).toBeInstanceOf(Promise)
  })

  it('Should execute getPermissions w/o identity path', () => {
    expect(security.getAllPermissions(1)).toBeInstanceOf(Promise)
  })

  it('Should execute hasPermission', () => {
    expect(security.hasPermission(1, ['See'], 'root/users/user1')).toBeInstanceOf(Promise)
  })

  it('Should execute hasPermission w/o identity path', () => {
    expect(security.hasPermission(1, ['See'])).toBeInstanceOf(Promise)
  })

  it('Should evaulate if hasPermission returns false', async () => {
    // tslint:disable-next-line:no-string-literal
    repository['fetchMethod'] = async () => {
      return {
        ok: true,
        text: async () => 'false',
      } as any
    }
    const hasPermission = await security.hasPermission(1, ['See'], 'root/users/user1')
    expect(hasPermission).toBe(false)
  })

  it('Should throw if hasPermission fails', async () => {
    // tslint:disable-next-line:no-string-literal
    security['repository']['fetchMethod'] = async () => ({ ok: false } as any)
    try {
      await security.hasPermission(1, ['See'], 'root/users/user1')
      throw Error('Should throw!')
    } catch (error) {
      /** ignore */
    }
  })

  it('Should execute getRelatedIdentities', () => {
    expect(
      security.getRelatedIdentities({
        contentIdOrPath: 1,
        level: PermissionLevel.Allowed,
        kind: IdentityKind.All,
      }),
    ).toBeInstanceOf(Promise)
  })

  it('Should execute getRelatedPermissions', () => {
    expect(
      security.getRelatedPermissions({
        contentIdOrPath: 1,
        level: PermissionLevel.Allowed,
        explicitOnly: true,
        memberPath: 'root/user/member',
      }),
    ).toBeInstanceOf(Promise)
  })

  it('Should execute getRelatedItems', () => {
    expect(
      security.getRelatedItems({
        contentIdOrPath: 1,
        level: PermissionLevel.Allowed,
        explicitOnly: true,
        member: 'root/users/member1',
        permissions: [],
      }),
    ).toBeInstanceOf(Promise)
  })

  it('Should execute getRelatedIdentitiesByPermissions', () => {
    expect(
      security.getRelatedIdentitiesByPermissions({
        contentIdOrPath: 1,
        level: PermissionLevel.Allowed,
        kind: IdentityKind.All,
        permissions: [],
      }),
    ).toBeInstanceOf(Promise)
  })

  it('Should execute getRelatedItemsOneLevel', () => {
    expect(
      security.getRelatedItemsOneLevel({
        contentIdOrPath: 1,
        level: PermissionLevel.Allowed,
        member: 'root/users/member',
        permissions: [],
      }),
    ).toBeInstanceOf(Promise)
  })

  it('Should execute getAllowedUsers', () => {
    expect(
      security.getAllowedUsers({
        contentIdOrPath: 1,
        permissions: [],
      }),
    ).toBeInstanceOf(Promise)
  })

  it('Should execute getParentGroups', () => {
    expect(security.getParentGroups({ contentIdOrPath: 1, directOnly: true })).toBeInstanceOf(Promise)
  })

  it('Should execute addMembers', () => {
    expect(security.addMembers(1, [])).toBeInstanceOf(Promise)
  })

  it('Should execute removeMembers', () => {
    expect(security.removeMembers(1, [])).toBeInstanceOf(Promise)
  })
})
