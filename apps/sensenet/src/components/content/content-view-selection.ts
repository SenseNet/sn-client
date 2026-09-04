import { GenericContent } from '@sensenet/default-content-types'

/** Applies Explorer selection rules in the current visible item order. */
export const getContentViewSelection = (
  items: GenericContent[],
  selected: GenericContent[],
  itemId: number,
  anchorId: number | undefined,
  additive: boolean,
  range: boolean,
) => {
  const index = items.findIndex((item) => item.Id === itemId)
  if (index < 0) return selected

  if (range) {
    const anchorIndex = items.findIndex((item) => item.Id === anchorId)
    const startIndex = anchorIndex < 0 ? index : anchorIndex
    const selectedRange = items.slice(Math.min(index, startIndex), Math.max(index, startIndex) + 1)
    const ids = new Set([...(additive ? selected : []), ...selectedRange].map((item) => item.Id))
    return items.filter((item) => ids.has(item.Id))
  }

  if (additive) {
    const ids = new Set(selected.map((item) => item.Id))
    ids.has(itemId) ? ids.delete(itemId) : ids.add(itemId)
    return items.filter((item) => ids.has(item.Id))
  }

  return [items[index]]
}
