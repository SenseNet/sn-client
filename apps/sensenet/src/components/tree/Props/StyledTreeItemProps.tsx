import { TreeItemProps } from '@material-ui/lab'
import { GenericContent } from '@sensenet/default-content-types'
export default interface StyledTreeItemProps extends TreeItemProps {
  contentValue: GenericContent
  isOpen: boolean
  parentIsOpen: boolean
  onNavigate: (item: GenericContent) => void
  addItemToExpanded: (content: GenericContent) => void
}
