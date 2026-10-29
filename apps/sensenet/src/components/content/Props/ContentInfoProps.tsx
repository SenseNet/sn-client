import { GenericContent } from '@sensenet/default-content-types'

export interface ContentInfoProps<T extends GenericContent> {
  parentIdOrPath: number | string
  onActiveItemChange?: (item: T) => void
  onActivateItem: (item: T) => void
  onParentChange: (newParent: T) => void
  onTabRequest?: () => void
  containerRef?: (r: HTMLDivElement | null) => void
}
