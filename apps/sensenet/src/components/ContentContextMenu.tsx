import Drawer, { DrawerProps } from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import CloudDownloadTwoTone from '@material-ui/icons/CloudDownloadTwoTone'
import Create from '@material-ui/icons/Create'
import Delete from '@material-ui/icons/Delete'
import FileMove from '@material-ui/icons/FileCopy'
import FileCopy from '@material-ui/icons/FileCopyOutlined'
import Info from '@material-ui/icons/Info'
import React, { useCallback, useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ConstantContent } from '@sensenet/client-core'
import {
  CurrentContentContext,
  CurrentContentProvider,
  useDownload,
  useRepository,
  useWopi,
} from '@sensenet/hooks-react'
import { ResponsiveContext } from '../context'
import { useContentRouting, useLocalization } from '../hooks'
import { ContentInfoDialog, CopyMoveDialog, DeleteContentDialog, EditPropertiesDialog } from './dialogs'
import { Icon } from './Icon'

export const ContentContextMenuComponent: React.FunctionComponent<{
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  menuProps?: Partial<MenuProps>
  drawerProps?: Partial<DrawerProps>
} & RouteComponentProps> = props => {
  const content = useContext(CurrentContentContext)
  const device = useContext(ResponsiveContext)
  const routing = useContentRouting()
  const localization = useLocalization().contentContextMenu
  const [isDeleteOpened, setIsDeleteOpened] = useState(false)
  const [isEditPropertiesOpened, setIsEditPropertiesOpened] = useState(false)
  const [isInfoDialogOpened, setIsInfoDialogOpened] = useState(false)
  const [isCopyDialogOpened, setIsCopyDialogOpened] = useState(false)
  const [copyMoveOperation, setCopyMoveOperation] = useState<'copy' | 'move'>('copy')
  const repo = useRepository()
  const download = useDownload(content)
  const wopi = useWopi(content)

  const wopiOpen = useCallback(async () => {
    props.onClose && props.onClose()
    props.history.push(
      `/${btoa(repo.configuration.repositoryUrl)}/wopi/${content.Id}/${wopi.isWriteAwailable ? 'edit' : 'view'}`,
    )
  }, [content.Id, props, repo.configuration.repositoryUrl, wopi.isWriteAwailable])

  return (
    <div onKeyDown={ev => ev.stopPropagation()} onKeyPress={ev => ev.stopPropagation()}>
      {isDeleteOpened ? (
        <DeleteContentDialog
          dialogProps={{
            open: isDeleteOpened,
            disablePortal: true,
            onClose: () => setIsDeleteOpened(false),
            keepMounted: false,
          }}
          content={[content]}
        />
      ) : null}
      {isEditPropertiesOpened ? (
        <EditPropertiesDialog
          content={content}
          dialogProps={{
            open: isEditPropertiesOpened,
            onClose: () => setIsEditPropertiesOpened(false),
            keepMounted: false,
          }}
        />
      ) : null}
      {isInfoDialogOpened ? (
        <ContentInfoDialog
          content={content}
          dialogProps={{ open: isInfoDialogOpened, onClose: () => setIsInfoDialogOpened(false), keepMounted: false }}
        />
      ) : null}
      {isCopyDialogOpened ? (
        <CurrentContentProvider idOrPath={content.ParentId || ConstantContent.PORTAL_ROOT.Path}>
          <CurrentContentContext.Consumer>
            {parent => (
              <CopyMoveDialog
                content={[content]}
                currentParent={parent}
                dialogProps={{
                  open: isCopyDialogOpened,
                  onClose: () => setIsCopyDialogOpened(false),
                  keepMounted: false,
                }}
                operation={copyMoveOperation}
              />
            )}
          </CurrentContentContext.Consumer>
        </CurrentContentProvider>
      ) : null}
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
            {wopi.isWriteAwailable || wopi.isReadAwailable ? (
              <ListItem button={true} onClick={() => props.history.push(routing.getPrimaryActionUrl(content))}>
                <ListItemIcon>
                  <Icon item={content} />
                </ListItemIcon>
                <ListItemText primary={wopi.isWriteAwailable ? localization.wopiEdit : localization.wopiRead} />
              </ListItem>
            ) : null}
            {download.isFile ? (
              <ListItem
                button={true}
                onClick={() => {
                  download.download()
                  props.onClose && props.onClose()
                }}>
                <ListItemIcon>
                  <CloudDownloadTwoTone />
                </ListItemIcon>
                {localization.download}
              </ListItem>
            ) : null}
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

          {wopi.isWriteAwailable || wopi.isReadAwailable ? (
            <MenuItem button={true} onClick={wopiOpen}>
              <ListItemIcon>
                <Icon item={content} />
              </ListItemIcon>
              {wopi.isWriteAwailable ? localization.wopiEdit : localization.wopiRead}
            </MenuItem>
          ) : null}

          {download.isFile ? (
            <MenuItem
              button={true}
              onClick={() => {
                download.download()
                props.onClose && props.onClose()
              }}>
              <ListItemIcon>
                <CloudDownloadTwoTone />
              </ListItemIcon>
              {localization.download}
            </MenuItem>
          ) : null}
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
