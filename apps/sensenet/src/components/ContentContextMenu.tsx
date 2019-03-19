import Drawer, { DrawerProps } from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Create from '@material-ui/icons/Create'
import Delete from '@material-ui/icons/Delete'
import FileMove from '@material-ui/icons/FileCopy'
import FileCopy from '@material-ui/icons/FileCopyOutlined'
import Info from '@material-ui/icons/Info'
import React from 'react'
import { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRoutingContext } from '../context/ContentRoutingContext'
import { CurrentContentContext } from '../context/CurrentContent'
import { ResponsiveContext } from '../context/ResponsiveContextProvider'
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
  const [isDeleteOpened, setIsDeleteOpened] = useState(false)
  const [isEditPropertiesOpened, setIsEditPropertiesOpened] = useState(false)

  return (
    <>
      <DeleteContentDialog
        dialogProps={{ open: isDeleteOpened, disablePortal: true, onClose: () => setIsDeleteOpened(false) }}
        content={[content]}
      />
      <EditPropertiesDialog
        content={content}
        dialogProps={{ open: isEditPropertiesOpened, onClose: () => setIsEditPropertiesOpened(false) }}
      />
      {device === 'mobile' ? (
        <Drawer
          anchor="bottom"
          onClose={() => props.onClose && props.onClose()}
          disablePortal={true}
          open={props.isOpened}
          PaperProps={{ style: { paddingBottom: '2em' } }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <Icon item={content} />
              </ListItemIcon>
              <ListItemText primary={content.DisplayName || content.Name} />
              <ListItemSecondaryAction style={{ marginRight: '1em' }}>
                <Info color="action" />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button={true} onClick={() => props.history.push(routing.getPrimaryActionUrl(content))}>
              <ListItemIcon>
                <Icon item={content} />
              </ListItemIcon>
              <ListItemText primary="Open" />
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
              <ListItemText primary="Edit properties" />
            </ListItem>
            <ListItem button={true} disabled={true}>
              <ListItemIcon>
                <FileCopy />
              </ListItemIcon>
              <ListItemText primary="Copy" />
            </ListItem>
            <ListItem button={true} disabled={true}>
              <ListItemIcon>
                <FileMove />
              </ListItemIcon>
              <ListItemText primary="Move" />
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
              <ListItemText primary="Delete" />
            </ListItem>
          </List>
        </Drawer>
      ) : (
        <Menu open={props.isOpened} {...props.menuProps}>
          <MenuItem disableRipple={true} style={{ display: 'flex', minWidth: 250, justifyContent: 'flex-start' }}>
            <ListItemIcon>
              <Icon item={content} />
            </ListItemIcon>
            <div style={{ flexGrow: 1 }}>{content.DisplayName || content.Name}</div>
            <Tooltip title="Show content info">
              <IconButton style={{ padding: 0 }} onClick={() => console.log('Open info')}>
                <Info />
              </IconButton>
            </Tooltip>
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onClose && props.onClose()
              setIsEditPropertiesOpened(true)
            }}>
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            Edit Properties
          </MenuItem>
          <MenuItem disabled={true}>
            <ListItemIcon>
              <FileCopy />
            </ListItemIcon>
            Copy
          </MenuItem>
          <MenuItem disabled={true}>
            <ListItemIcon>
              <FileMove />
            </ListItemIcon>
            Move
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
            Delete
          </MenuItem>
        </Menu>
      )}
    </>
  )
}

const routed = withRouter(ContentContextMenuComponent)

export { routed as ContentContextMenu }
