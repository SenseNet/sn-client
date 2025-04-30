import { TreeItemProps } from '@material-ui/lab'
import { GenericContent } from '@sensenet/default-content-types'
export default interface StyledTreeItemProps extends TreeItemProps {
  contentvalue: GenericContent
  activeitempath: string
  navigate: (item: GenericContent) => void
}
