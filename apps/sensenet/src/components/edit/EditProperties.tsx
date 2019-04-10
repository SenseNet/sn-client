import CircularProgress from '@material-ui/core/CircularProgress'
import { EditView } from '@sensenet/controls-react'
import React, { useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  CurrentAncestorsProvider,
  CurrentContentContext,
  CurrentContentProvider,
  RepositoryContext,
} from '../../context'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'

const GenericContentEditor: React.FunctionComponent<RouteComponentProps<{ contentId?: string }>> = props => {
  const repo = useContext(RepositoryContext)
  const contentId = parseInt(props.match.params.contentId as string, 10)
  return (
    <div style={{ width: '100%', height: '100%', padding: '1em', overflow: 'auto' }}>
      <CurrentContentProvider idOrPath={contentId}>
        <CurrentAncestorsProvider>
          <ContentBreadcrumbs />
          <CurrentContentContext.Consumer>
            {content => (
              <>
                {content ? (
                  <EditView
                    content={content}
                    repository={repo}
                    contentTypeName={content.Type}
                    onSubmit={async (id, c) => {
                      repo.patch({
                        idOrPath: id,
                        content: c,
                      })
                    }}
                  />
                ) : (
                  <CircularProgress />
                )}
              </>
            )}
          </CurrentContentContext.Consumer>
        </CurrentAncestorsProvider>
      </CurrentContentProvider>
    </div>
  )
}

export default withRouter(GenericContentEditor)
