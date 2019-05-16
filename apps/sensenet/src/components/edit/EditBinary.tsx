import React, { useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { CurrentAncestorsProvider, CurrentContentContext, CurrentContentProvider, InjectorContext } from '../../context'
import { SelectionService } from '../../services/SelectionService'
import { FullScreenLoader } from '../FullScreenLoader'
import { TextEditor } from './TextEditor'

const Editor: React.FunctionComponent<RouteComponentProps<{ contentId?: string }>> = props => {
  const contentId = parseInt(props.match.params.contentId as string, 10)
  const selectionService = useContext(InjectorContext).getInstance(SelectionService)

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
      <CurrentContentProvider idOrPath={contentId} onContentLoaded={c => selectionService.activeContent.setValue(c)}>
        <CurrentAncestorsProvider>
          <CurrentContentContext.Consumer>
            {currentContent => <>{currentContent ? <TextEditor content={currentContent} /> : <FullScreenLoader />}</>}
          </CurrentContentContext.Consumer>
        </CurrentAncestorsProvider>
      </CurrentContentProvider>
      ) : ( )}
    </div>
  )
}

export default withRouter(Editor)
