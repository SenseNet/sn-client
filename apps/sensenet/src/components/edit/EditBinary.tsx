import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import { useLoadContent, useSelectionService } from '../../hooks'
import { FullScreenLoader } from '../FullScreenLoader'
import { TextEditor } from './TextEditor'

const Editor: React.FunctionComponent<RouteComponentProps<{ contentId?: string }>> = props => {
  const contentId = parseInt(props.match.params.contentId as string, 10)
  const selectionService = useSelectionService()
  const { content } = useLoadContent({ idOrPath: contentId })

  useEffect(() => {
    selectionService.activeContent.setValue(content)
  }, [content, selectionService.activeContent])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        padding: '.3em 0',
      }}>
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
