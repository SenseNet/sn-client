import { createStyles, makeStyles } from '@material-ui/core'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
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
      padding: '.3em 0',
    },
  })
})

const Editor: React.FunctionComponent<RouteComponentProps<{ contentId?: string }>> = props => {
  const contentId = parseInt(props.match.params.contentId as string, 10)
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

export default withRouter(Editor)
