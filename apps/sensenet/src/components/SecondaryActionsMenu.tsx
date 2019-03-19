import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Create from '@material-ui/icons/Create'
import Delete from '@material-ui/icons/Delete'
import FileMove from '@material-ui/icons/FileCopy'
import FileCopy from '@material-ui/icons/FileCopyOutlined'
import Info from '@material-ui/icons/Info'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import React, { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRoutingContext } from '../context/ContentRoutingContext'
import { CurrentContentContext } from '../context/CurrentContent'
import { ResponsiveContext } from '../context/ResponsiveContextProvider'
import { DeleteContentDialog } from './DeleteContentDialog'
import { Icon } from './Icon'

export const SecondaryActionsMenuComponent: React.FunctionComponent<
  {
    style?: React.CSSProperties
  } & RouteComponentProps
> = props => {
  const device = useContext(ResponsiveContext)
  const content = useContext(CurrentContentContext)
  const routing = useContext(ContentRoutingContext)
  const [isOpened, setIsOpened] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  const [isDeleteOpened, setIsDeleteOpened] = useState(false)

  return (
    <div style={props.style}>
      <DeleteContentDialog
        dialogProps={{ open: isDeleteOpened, disablePortal: true, onClose: () => setIsDeleteOpened(false) }}
        content={[content]}
      />
      <IconButton
        buttonRef={r => setRef(r)}
        onClick={ev => {
          ev.preventDefault()
          ev.stopPropagation()
          setRef(ev.currentTarget)
          setIsOpened(true)
        }}>
        <MoreHoriz />
      </IconButton>
      {device === 'desktop' ? (
        <Menu
          anchorEl={ref}
          onClose={() => {
            setIsOpened(false)
          }}
          open={isOpened}
          disablePortal={true}>
          <MenuItem disableRipple={true} style={{ display: 'flex', minWidth: 250, justifyContent: 'flex-start' }}>
            <ListItemIcon>
              <Icon item={content} />
            </ListItemIcon>
            <div style={{ flexGrow: 1 }}>{content.DisplayName || content.Name}</div>
            <Tooltip title="Show content info">
              <IconButton style={{ padding: 0 }} onClick={() => setIsOpened(false)}>
                <Info />
              </IconButton>
            </Tooltip>
          </MenuItem>
          <MenuItem onClick={() => props.history.push(routing.getActionUrl(content, 'EditProperties'))}>
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
              setIsOpened(false)
            }}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      ) : (
        <Drawer
          anchor="bottom"
          onClose={() => setIsOpened(false)}
          disablePortal={true}
          open={isOpened}
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
            <ListItem button={true} onClick={() => props.history.push(routing.getActionUrl(content, 'EditProperties'))}>
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
                setIsOpened(false)
              }}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </ListItem>
          </List>
        </Drawer>
      )}
    </div>
  )
}

const routed = withRouter(SecondaryActionsMenuComponent)

export { routed as SecondaryActionsMenu }
