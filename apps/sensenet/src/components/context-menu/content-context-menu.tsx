import Drawer, { DrawerProps } from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ConstantContent } from '@sensenet/client-core'
import { CurrentContentContext, useDownload, useLogger, useRepository, useWopi } from '@sensenet/hooks-react'
import { ActionModel } from '@sensenet/default-content-types'
import { ResponsiveContext } from '../../context'
import { useContentRouting, useLocalization } from '../../hooks'
import { useDialog } from '../dialogs'
import { useLoadContent } from '../../hooks/use-loadContent'
import { getIcon } from './icons'

export const CONTEXT_MENU_SCENARIO = 'ContextMenu'

export const ContentContextMenuComponent: React.FunctionComponent<{
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  menuProps?: Partial<MenuProps>
  drawerProps?: Partial<DrawerProps>
} & RouteComponentProps> = props => {
  const content = useContext(CurrentContentContext)
  const parent = useLoadContent({ idOrPath: content.ParentId || ConstantContent.PORTAL_ROOT.Path }).content
  const logger = useLogger('context-menu')
  const device = useContext(ResponsiveContext)
  const routing = useContentRouting()
  const localization = useLocalization().contentContextMenu
  const { openDialog } = useDialog()
  const repo = useRepository()
  const download = useDownload(content)
  const wopi = useWopi(content)
  const actions: ActionModel[] = content.Actions ? [...(content.Actions as ActionModel[])] : []

  if (download.isFile) {
    actions.push({ Name: 'Download', DisplayName: localization.download } as any)
  }

  const runAction = (actionName: string) => {
    switch (actionName) {
      case 'Delete':
        openDialog({ name: 'delete', props: { content: [content] } })
        break
      case 'Edit':
        openDialog({ name: 'edit', props: { contentId: content.Id } })
        break
      case 'Browse':
        openDialog({ name: 'info', props: { content } })
        break
      case 'MoveTo':
      case 'CopyTo': {
        const operation = actionName === 'CopyTo' ? 'copy' : 'move'
        openDialog({
          name: 'copy-move',
          props: { content: [content], currentParent: parent!, operation },
        })
        break
      }
      case 'Preview':
        props.history.push(routing.getPrimaryActionUrl(content))
        break
      case 'CheckOut':
        repo.versioning.checkOut(content.Id)
        break
      case 'CheckIn':
        openDialog({ name: 'check-in', props: { content } })
        break
      case 'Download':
        download.download()
        break
      case 'WopiOpenView':
      case 'WopiOpenEdit':
        {
          props.onClose?.()
          props.history.push(
            `/${btoa(repo.configuration.repositoryUrl)}/wopi/${content.Id}/${wopi.isWriteAwailable ? 'edit' : 'view'}`,
          )
        }
        break
      case 'Versions':
        openDialog({ name: 'versions', props: { content }, dialogProps: { maxWidth: 'lg', open: true } })
        break
      default:
        logger.warning({ message: `${actionName} is not implemented yet. Try to use it from command palette.` })
    }
  }

  return (
    <div onKeyDown={ev => ev.stopPropagation()} onKeyPress={ev => ev.stopPropagation()}>
      {device === 'mobile' ? (
        <Drawer
          anchor="bottom"
          onClose={() => props.onClose?.()}
          disablePortal={true}
          open={props.isOpened}
          PaperProps={{ style: { paddingBottom: '2em' } }}>
          <List>
            {actions.map(action => {
              return (
                <ListItem
                  key={action.Name}
                  onClick={() => {
                    props.onClose?.()
                    runAction(action.Name)
                  }}>
                  <ListItemIcon>{getIcon(action.Name.toLowerCase())}</ListItemIcon>
                  <ListItemText primary={action.DisplayName || action.Name} />
                </ListItem>
              )
            })}
          </List>
        </Drawer>
      ) : (
        <Menu open={props.isOpened} {...props.menuProps}>
          {actions.map(action => {
            return (
              <MenuItem
                key={action.Name}
                disableRipple={true}
                onClick={() => {
                  props.onClose?.()
                  runAction(action.Name)
                }}>
                <ListItemIcon>{getIcon(action.Name.toLowerCase())}</ListItemIcon>
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
