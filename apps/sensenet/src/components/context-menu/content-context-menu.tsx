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
import React, { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ConstantContent } from '@sensenet/client-core'
import { CurrentContentContext, CurrentContentProvider, useDownload, useLogger, useWopi } from '@sensenet/hooks-react'
import { ActionModel } from '@sensenet/default-content-types'
import { iconType, Icon as SnIcon } from '@sensenet/icons-react'
import { ResponsiveContext } from '../../context'
import { useContentRouting, useLocalization } from '../../hooks'
import { ContentInfoDialog, CopyMoveDialog, EditPropertiesDialog } from '../dialogs'
import { Icon } from '../Icon'
import { useDialogDispatch } from '../dialogs/dialog-provider'
import { icons } from './icons'

export const CONTEXT_MENU_SCENARIO = 'ContextMenu'

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
  const logger = useLogger('context-menu')
  const device = useContext(ResponsiveContext)
  const routing = useContentRouting()
  const localization = useLocalization().contentContextMenu
  const dispatchDialogAction = useDialogDispatch()
  const [isEditPropertiesOpened, setIsEditPropertiesOpened] = useState(false)
  const [isInfoDialogOpened, setIsInfoDialogOpened] = useState(false)
  const [isCopyDialogOpened, setIsCopyDialogOpened] = useState(false)
  const [copyMoveOperation, setCopyMoveOperation] = useState<'copy' | 'move'>('copy')
  const download = useDownload(content)
  const wopi = useWopi(content)

  // const wopiOpen = useCallback(async () => {
  //   props.onClose && props.onClose()
  //   props.history.push(
  //     `/${btoa(repo.configuration.repositoryUrl)}/wopi/${content.Id}/${wopi.isWriteAwailable ? 'edit' : 'view'}`,
  //   )
  // }, [content.Id, props, repo.configuration.repositoryUrl, wopi.isWriteAwailable])

  const runAction = (actionName: string) => {
    switch (actionName) {
      case 'Delete':
        dispatchDialogAction({ type: 'PUSH_DIALOG', dialog: { name: 'delete', props: { content: [content] } } })
        break
      default:
        logger.warning({ message: `There is no action with name: ${actionName}` })
    }
  }

  return (
    <div onKeyDown={ev => ev.stopPropagation()} onKeyPress={ev => ev.stopPropagation()}>
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
          {content.Actions &&
            (content.Actions as ActionModel[]).map(action => {
              return (
                <MenuItem
                  key={action.Name}
                  disableRipple={true}
                  onClick={() => {
                    props.onClose && props.onClose()
                    runAction(action.Name)
                  }}>
                  <ListItemIcon>
                    <SnIcon
                      type={iconType.materialui}
                      iconName={
                        action.Icon === 'Application'
                          ? icons[action.Name.toLowerCase() as keyof typeof icons]
                          : icons[action.Icon.toLowerCase() as keyof typeof icons]
                      }
                    />
                  </ListItemIcon>
                  <div style={{ flexGrow: 1 }}>{action.DisplayName || action.Name}</div>
                </MenuItem>
              )
            })}
        </Menu>
      )}
    </div>
  )
}

const routed = withRouter(ContentContextMenuComponent)

export { routed as ContentContextMenu }
