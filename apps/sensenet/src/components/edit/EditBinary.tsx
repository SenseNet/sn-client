import { CurrentContentProvider } from '@sensenet/hooks-react'
import React, { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'
import { useLoadContent, useSelectionService } from '../../hooks'
import { FullScreenLoader } from '../full-screen-loader'
import { TextEditor } from './TextEditor'

const useStyles = makeStyles(() => {
  return createStyles({
    editBinaryWrapper: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  })
})

export default function Editor() {
  const match = useRouteMatch<{ contentId: string }>()
  const contentId = parseInt(match.params.contentId, 10)
  const selectionService = useSelectionService()
  const { content } = useLoadContent({ idOrPath: contentId })
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  useEffect(() => {
    selectionService.activeContent.setValue(content)
  }, [content, selectionService.activeContent])

  return (
    <div className={clsx(globalClasses.full, classes.editBinaryWrapper)}>
      {content ? (
        <CurrentContentProvider idOrPath={contentId}>
          <TextEditor content={content} showBreadCrumb={false} />
        </CurrentContentProvider>
      ) : (
        <FullScreenLoader />
      )}
    </div>
  )
}
