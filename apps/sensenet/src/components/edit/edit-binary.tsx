import { CurrentContentProvider } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../../globalStyles'
import { useLoadContent, useSelectionService } from '../../hooks'
import { navigateToAction } from '../../services'
import { TextEditor } from '../editor/text-editor'
import { FullScreenLoader } from '../full-screen-loader'

const useStyles = makeStyles(() => {
  return createStyles({
    editBinaryWrapper: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  })
})

interface EditBinaryProps {
  contentPath: string
}

export function EditBinary({ contentPath }: EditBinaryProps) {
  const routeMatch = useRouteMatch<{ browseType: string; action: string }>()
  const selectionService = useSelectionService()
  const { content } = useLoadContent({ idOrPath: contentPath })
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const history = useHistory()

  useEffect(() => {
    selectionService.activeContent.setValue(content)
  }, [content, selectionService.activeContent])

  return (
    <div className={clsx(globalClasses.full, classes.editBinaryWrapper)}>
      {content ? (
        <CurrentContentProvider idOrPath={contentPath}>
          <TextEditor
            content={content}
            showBreadCrumb={false}
            handleCancel={() => {
              navigateToAction({ history, routeMatch })
            }}
          />
        </CurrentContentProvider>
      ) : (
        <FullScreenLoader />
      )}
    </div>
  )
}
