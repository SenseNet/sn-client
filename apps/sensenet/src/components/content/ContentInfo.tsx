import { Button, ListItemIcon, makeStyles, Theme } from '@material-ui/core'
import { ActionModel, GenericContent, isActionModel } from '@sensenet/default-content-types'
import { CurrentContentContext, useLogger, useWopi } from '@sensenet/hooks-react'
// @ts-ignore
// eslint-disable-next-line import/no-unresolved

import React, { useCallback, useContext, useEffect, useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { useLoadContent } from '../../hooks'
import { contextMenuODataOptions } from '../context-menu/context-menu-odata-options'
import { getIcon } from '../context-menu/icons'
import { useContextMenuActions } from '../context-menu/use-context-menu-actions'
import { Icon } from '../Icon'
import { ContentInfoProps } from './Props/ContentInfoProps'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))
export function ContentInfo<T extends GenericContent = GenericContent>(this: any, props: ContentInfoProps<T>) {
  const DISABLED_ACTIONS = ['Share', 'Preview', 'Delete']
  const logger = useLogger('context-menu')
  const [actions, setActions] = useState<ActionModel[]>()
  const parentContent = useContext(CurrentContentContext)
  const { content } = useLoadContent<GenericContent>({
    idOrPath: parentContent.Path,
    oDataOptions: contextMenuODataOptions,
    isOpened: true,
  })
  const { isWriteAvailable } = useWopi()
  const setActionsWopi = useCallback(
    (contentFromCallback: GenericContent) => {
      if (!isActionModel(contentFromCallback.Actions)) {
        logger.verbose({ message: 'There are no actions in content', data: contentFromCallback })
        return
      }
      const contentActions = contentFromCallback.Actions.filter((action) => !action.Forbidden).filter(
        (item, i, arr) => arr.findIndex((t) => t.Name === item.Name) === i,
      )

      if (contentActions.some((action) => action.Name === 'Browse') && contentFromCallback.IsFile) {
        contentActions.push({
          Name: 'Download',
          DisplayName: 'Download',
        } as ActionModel)
      }

      if (isWriteAvailable(contentFromCallback)) {
        // If write is available it means that we have two actions. We want to show only the open edit for the user.
        const actionsWithoutWopiRead = contentActions.filter((action) => action.Name !== 'WopiOpenView')
        setActions(actionsWithoutWopiRead)
      } else {
        setActions(contentActions)
      }
    },
    [isWriteAvailable, logger],
  )

  useEffect(() => {
    if (content) {
      console.log('#actions: cc==>', content)
      setActionsWopi(content)
    }
  }, [content, setActionsWopi])
  const { runAction } = useContextMenuActions(parentContent, false, setActionsWopi)
  const handleActivateItem = useCallback(
    (item: T) => {
      if (item.IsFolder) {
        props.onParentChange(item)
      } else {
        props.onActivateItem(item)
      }
    },
    [props],
  )
  return (
    <>
      <div className="gridTopPanel">
        <div className="iconArea" title={parentContent.Type}>
          <Icon item={parentContent} />
        </div>
        <h1 title="DisplayName">{parentContent.DisplayName}</h1>
        <label>Type:</label>
        <a
          href={`/content-types/explorer/edit-binary?content=%2FGenericContent%2FFolder%2F${parentContent.Type}`}
          target="_blank"
          rel="noreferrer">
          {parentContent.Type}
        </a>
        <label>Path:</label>
        <span> {parentContent.Path}</span>
        <div className="buttonPanel">
          {actions
            ?.filter((a: ActionModel) => {
              return a.Name !== 'Share' && a.Name !== 'Delete' && a.Name !== 'Browse'
            })
            .map((action) => {
              return (
                <Button
                  key={action.Name}
                  title={action.Name}
                  disableRipple={true}
                  disabled={DISABLED_ACTIONS.includes(action.Name)}
                  onClick={() => {
                    runAction(action.Name)
                  }}>
                  <ListItemIcon>{getIcon(action.Name.toLowerCase())}</ListItemIcon>
                  <div style={{ flexGrow: 1 }}>{action.DisplayName || action.Name}</div>
                </Button>
              )
            })}
        </div>
      </div>
    </>
  )
}
