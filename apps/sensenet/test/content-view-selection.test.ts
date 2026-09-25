import { GenericContent } from '@sensenet/default-content-types'
import { getContentViewSelection } from '../src/components/content/content-view-selection'

const items = [1, 2, 3, 4, 5].map((Id) => ({ Id, Name: `item-${Id}` } as GenericContent))
const ids = (selection: GenericContent[]) => selection.map((item) => item.Id)

describe('Explorer content selection', () => {
  it('replaces selection with the clicked item', () => {
    expect(ids(getContentViewSelection(items, [items[0], items[1]], 4, 1, false, false))).toEqual([4])
  })

  it('adds and removes items with Ctrl/Cmd while retaining visible order', () => {
    const added = getContentViewSelection(items, [items[3]], 2, 4, true, false)
    expect(ids(added)).toEqual([2, 4])
    expect(ids(getContentViewSelection(items, added, 4, 2, true, false))).toEqual([2])
  })

  it('selects a contiguous range from the original anchor in either direction', () => {
    expect(ids(getContentViewSelection(items, [items[4]], 4, 2, false, true))).toEqual([2, 3, 4])
    expect(ids(getContentViewSelection(items, [items[0]], 2, 4, false, true))).toEqual([2, 3, 4])
  })

  it('extends the existing selection with Ctrl/Cmd+Shift', () => {
    expect(ids(getContentViewSelection(items, [items[0], items[4]], 4, 3, true, true))).toEqual([1, 3, 4, 5])
  })

  it('selects only the target when the range anchor is no longer visible', () => {
    expect(ids(getContentViewSelection(items, [items[0]], 4, 100, false, true))).toEqual([4])
  })

  it('uses displayed order after sorting instead of numeric content IDs', () => {
    const reordered = [items[3], items[1], items[4], items[0], items[2]]
    expect(ids(getContentViewSelection(reordered, [], 1, 2, false, true))).toEqual([2, 5, 1])
  })

  it('drops stale selected items when updating selection and ignores a missing target', () => {
    const stale = { Id: 100 } as GenericContent
    expect(ids(getContentViewSelection(items, [stale], 2, undefined, true, false))).toEqual([2])
    expect(getContentViewSelection(items, [items[0]], 100, undefined, false, false)).toEqual([items[0]])
  })
})
