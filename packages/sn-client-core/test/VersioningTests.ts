import 'jest'
import { Repository } from '../src/Repository/Repository'
import { Versioning } from '../src/Repository/Versioning'

// tslint:disable:completed-docs
describe('Versioning', () => {
  let versioning: Versioning
  let repository: Repository

  beforeEach(() => {
    repository = new Repository({}, async () => ({ ok: true, json: async () => ({}), text: async () => '' } as any))
    versioning = new Versioning(repository)
  })

  afterEach(() => {
    repository.dispose()
  })

  it('Should execute getVersions', () => {
    expect(versioning.getVersions(1)).toBeInstanceOf(Promise)
  })

  it('Should execute checkOut', () => {
    expect(versioning.checkOut(1)).toBeInstanceOf(Promise)
  })

  it('Should execute checkIn', () => {
    expect(versioning.checkIn(1)).toBeInstanceOf(Promise)
  })

  it('Should execute undoCheckOut', () => {
    expect(versioning.undoCheckOut(1)).toBeInstanceOf(Promise)
  })

  it('Should execute forceUndoCheckOut', () => {
    expect(versioning.forceUndoCheckOut(1)).toBeInstanceOf(Promise)
  })

  it('Should execute approve', () => {
    expect(versioning.approve(1)).toBeInstanceOf(Promise)
  })

  it('Should execute reject', () => {
    expect(versioning.reject(1)).toBeInstanceOf(Promise)
  })

  it('Should execute publish', () => {
    expect(versioning.publish(1)).toBeInstanceOf(Promise)
  })

  it('Should execute restoreVersion', () => {
    expect(versioning.restoreVersion(1)).toBeInstanceOf(Promise)
  })

  it('Should execute takeLockOver', () => {
    expect(versioning.takeLockOver(1)).toBeInstanceOf(Promise)
  })
})
