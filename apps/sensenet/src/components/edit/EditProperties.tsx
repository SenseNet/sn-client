import CircularProgress from '@material-ui/core/CircularProgress'
import { isExtendedError } from '@sensenet/client-core'
import { EditView } from '@sensenet/controls-react'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  CurrentAncestorsProvider,
  CurrentContentContext,
  CurrentContentProvider,
  useLogger,
  useRepository,
} from '@sensenet/hooks-react'
import { useLocalization, useSelectionService } from '../../hooks'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'

const GenericContentEditor: React.FunctionComponent<RouteComponentProps<{ contentId?: string }>> = props => {
  const repo = useRepository()
  const contentId = parseInt(props.match.params.contentId as string, 10)
  const logger = useLogger('EditProperties')
  const localization = useLocalization().editPropertiesDialog
  const selectionService = useSelectionService()

  return (
    <div style={{ width: '100%', height: '100%', padding: '1em', overflow: 'auto' }}>
      <CurrentContentProvider
        idOrPath={contentId}
        onContentLoaded={c => selectionService.activeContent.setValue(c)}
        oDataOptions={{ select: 'all' }}>
        <CurrentAncestorsProvider>
          <ContentBreadcrumbs />
          <CurrentContentContext.Consumer>
            {content => (
              <>
                {content && content.Id === contentId ? (
                  <EditView
                    content={content}
                    repository={repo}
                    onSubmit={(c, s) => {
                      repo
                        .patch({
                          idOrPath: c.Id,
                          content: s,
                        })
                        .then(response => {
                          logger.information({
                            message: localization.saveSuccessNotification.replace(
                              '{0}',
                              c.DisplayName || c.Name || content.DisplayName || content.Name,
                            ),
                            data: {
                              relatedContent: content,
                              content: response,
                              relatedRepository: repo.configuration.repositoryUrl,
                            },
                          })
                        })
                        .catch(error => {
                          logger.error({
                            message: localization.saveFailedNotification.replace(
                              '{0}',
                              c.DisplayName || c.Name || content.DisplayName || content.Name,
                            ),
                            data: {
                              relatedContent: content,
                              content: c,
                              relatedRepository: repo.configuration.repositoryUrl,
                              error: isExtendedError(error) ? repo.getErrorFromResponse(error.response) : error,
                            },
                          })
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
