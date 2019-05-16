import Drawer, { DrawerProps } from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Create from '@material-ui/icons/Create'
import Delete from '@material-ui/icons/Delete'
import FileMove from '@material-ui/icons/FileCopy'
import FileCopy from '@material-ui/icons/FileCopyOutlined'
import Info from '@material-ui/icons/Info'
import React, { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRoutingContext, CurrentContentContext, LocalizationContext, ResponsiveContext } from '../context'
import { ContentInfoDialog } from './ContentInfoDialog'
import { CopyMoveDialog } from './CopyMoveDialog'
import { DeleteContentDialog } from './DeleteContentDialog'
import { EditPropertiesDialog } from './EditPropertiesDialog'
import { Icon } from './Icon'

export const ContentContextMenuComponent: React.FunctionComponent<
  {
    isOpened: boolean
    onOpen?: () => void
    onClose?: () => void
    menuProps?: Partial<MenuProps>
    drawerProps?: Partial<DrawerProps>
  } & RouteComponentProps
> = props => {
  const content = useContext(CurrentContentContext)
  const device = useContext(ResponsiveContext)
  const routing = useContext(ContentRoutingContext)
  const localization = useContext(LocalizationContext).values.contentContextMenu
  const [isDeleteOpened, setIsDeleteOpened] = useState(false)
  const [isEditPropertiesOpened, setIsEditPropertiesOpened] = useState(false)
  const [isInfoDialogOpened, setIsInfoDialogOpened] = useState(false)
  const [isCopyDialogOpened, setIsCopyDialogOpened] = useState(false)
  const [copyMoveOperation, setCopyMoveOperation] = useState<'copy' | 'move'>('copy')

  return (
    <div onKeyDown={ev => ev.stopPropagation()} onKeyPress={ev => ev.stopPropagation()}>
      <DeleteContentDialog
        dialogProps={{ open: isDeleteOpened, disablePortal: true, onClose: () => setIsDeleteOpened(false) }}
        content={[content]}
      />
      <EditPropertiesDialog
        content={content}
        dialogProps={{ open: isEditPropertiesOpened, onClose: () => setIsEditPropertiesOpened(false) }}
      />
      <ContentInfoDialog
        content={content}
        dialogProps={{ open: isInfoDialogOpened, onClose: () => setIsInfoDialogOpened(false) }}
      />
      <CopyMoveDialog
        content={[content]}
        currentParent={content}
        dialogProps={{ open: isCopyDialogOpened, onClose: () => setIsCopyDialogOpened(false) }}
        operation={copyMoveOperation}
      />
      {device === 'mobile' ? (
        <Drawer
          anchor="bottom"
          onClose={() => props.onClose && props.onClose()}
          disablePortal={true}
          open={props.isOpened}
          PaperProps={{ style: { paddingBottom: '2em' } }}>
          <List>
            <ListItem
              onClick={() => {
                setIsInfoDialogOpened(true)
                props.onClose && props.onClose()
              }}>
              <ListItemIcon>
                <Info color="action" />
              </ListItemIcon>
              <ListItemText primary={content.DisplayName || content.Name} />
            </ListItem>
            <ListItem button={true} onClick={() => props.history.push(routing.getPrimaryActionUrl(content))}>
              <ListItemIcon>
                <Icon item={content} />
              </ListItemIcon>
              <ListItemText primary={localization.open} />
            </ListItem>
            <ListItem
              button={true}
              onClick={() => {
                props.onClose && props.onClose()
                setIsEditPropertiesOpened(true)
              }}>
              <ListItemIcon>
                <Create />
              </ListItemIcon>
              <ListItemText primary={localization.editProperties} />
            </ListItem>
            <ListItem
              button={true}
              onClick={() => {
                setCopyMoveOperation('copy')
                setIsCopyDialogOpened(true)
                props.onClose && props.onClose()
              }}>
              <ListItemIcon>
                <FileCopy />
              </ListItemIcon>
              <ListItemText primary={localization.copy} />
            </ListItem>
            <ListItem
              button={true}
              onClick={() => {
                setCopyMoveOperation('move')
                setIsCopyDialogOpened(true)
                props.onClose && props.onClose()
              }}>
              <ListItemIcon>
                <FileMove />
              </ListItemIcon>
              <ListItemText primary={localization.move} />
            </ListItem>
            <ListItem
              button={true}
              onClick={ev => {
                ev.preventDefault()
                ev.stopPropagation()
                setIsDeleteOpened(true)
                props.onClose && props.onClose()
              }}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary={localization.delete} />
            </ListItem>
          </List>
        </Drawer>
      ) : (
        <Menu open={props.isOpened} {...props.menuProps}>
          <MenuItem
            disableRipple={true}
            style={{ display: 'flex', minWidth: 250, justifyContent: 'flex-start' }}
            onClick={() => {
              setIsInfoDialogOpened(true)
              props.onClose && props.onClose()
            }}>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <div style={{ flexGrow: 1 }}>{content.DisplayName || content.Name}</div>
          </MenuItem>
          <MenuItem
            button={true}
            onClick={() => {
              props.history.push(routing.getPrimaryActionUrl(content))
              props.onClose && props.onClose()
            }}>
            <ListItemIcon>
              <Icon item={content} />
            </ListItemIcon>
            {localization.open}
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onClose && props.onClose()
              setIsEditPropertiesOpened(true)
            }}>
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            {localization.editProperties}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsCopyDialogOpened(true)
              props.onClose && props.onClose()
            }}>
            <ListItemIcon>
              <FileCopy />
            </ListItemIcon>
            {localization.copy}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCopyMoveOperation('move')
              setIsCopyDialogOpened(true)
              props.onClose && props.onClose()
            }}>
            <ListItemIcon>
              <FileMove />
            </ListItemIcon>
            {localization.move}
          </MenuItem>
          <MenuItem
            onClick={ev => {
              ev.preventDefault()
              ev.stopPropagation()
              setIsDeleteOpened(true)
              props.onClose && props.onClose()
            }}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            {localization.delete}
          </MenuItem>
        </Menu>
      )}
    </div>
  )
}

const routed = withRouter(ContentContextMenuComponent)

export { routed as ContentContextMenu }
