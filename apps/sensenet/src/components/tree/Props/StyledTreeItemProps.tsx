import { TreeItemProps } from '@material-ui/lab'
import { GenericContent } from '@sensenet/default-content-types'
export default interface StyledTreeItemProps extends TreeItemProps {
  contentvalue: GenericContent
  isOpen: boolean
  activeItemPath: string
  parentisopen: boolean
  onNavigate: (item: GenericContent) => void
  // addItemToExpanded: (content: GenericContent) => void
  // expandedItems: string[]
  // getExpandedItems: () => string[]
}
