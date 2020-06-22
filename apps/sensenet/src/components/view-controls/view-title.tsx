import { useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import { applicationPaths, resolvePathParams } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useDialogActionService, useSelectionService } from '../../hooks'
import { editviewFileResolver, Icon } from '../Icon'

interface ViewTitleProps {
  title: string
  titleBold?: string
}

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      height: '68px',
      fontSize: '20px',
    },
    textBolder: {
      fontWeight: 500,
    },
  })
})

export const ViewTitle: React.FunctionComponent<ViewTitleProps> = (props) => {
  const globalClasses = useGlobalStyles()
  const selectionService = useSelectionService()
  const dialogActionService = useDialogActionService()
  const history = useHistory()
  const repository = useRepository()
  const classes = useStyles()

  const getContentTypeId = useCallback(
    async (contentType: string) => {
      const result = await repository.loadCollection({
        path: '/Root/System/Schema/ContentTypes',
        oDataOptions: {
          query: `+TypeIs:'ContentType' AND Name:${contentType} .AUTOFILTERS:OFF`,
        },
      })
      return result.d.results[0].Id
    },
    [repository],
  )

  return (
    <div className={clsx(classes.title, globalClasses.centered)}>
      <span>
        {props.title} <span className={classes.textBolder}>{props.titleBold}</span>
      </span>
      <span
        title={`Open ${selectionService.activeContent.getValue()!.Type} CTD`}
        onClick={async () => {
          dialogActionService.activeAction.setValue(undefined)
          selectionService.activeContent.getValue() &&
            history.push(
              resolvePathParams({
                path: applicationPaths.editBinary,
                params: {
                  contentId: await getContentTypeId(selectionService.activeContent.getValue()!.Type),
                },
              }),
            )
        }}>
        <Icon
          resolvers={editviewFileResolver}
          style={{
            marginLeft: '9px',
            height: '24px',
            width: '24px',
            cursor: 'pointer',
          }}
          item={selectionService.activeContent.getValue()}
        />
      </span>
    </div>
  )
}
