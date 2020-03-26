import { createStyles, makeStyles } from '@material-ui/core'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import { CurrentAncestorsProvider, CurrentContentProvider, useLogger, useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService } from '../../hooks'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { NewView } from '../view-controls/new-view'

const useStyles = makeStyles(() => {
  return createStyles({
    editWrapper: {
      padding: '0',
      overflow: 'auto',
    },
    breadcrumbsWrapper: {
      height: globals.common.drawerItemHeight,
      boxSizing: 'border-box',
    },
  })
})

export default function GenericContentEditor() {
  const match = useRouteMatch<{ contentId: string }>()
  const history = useHistory<{ schema: Schema }>()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const localization = useLocalization().addButton
  const logger = useLogger('AddDialog')
  const [currentContent, setCurrentContent] = useState<GenericContent | undefined>(undefined)
  const contentTypeName = history.location.state.schema.ContentTypeName

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={match.params.contentId}
        onContentLoaded={c => {
          selectionService.activeContent.setValue(c)
          setCurrentContent(c)
        }}
        oDataOptions={{ select: 'all' }}>
        <CurrentAncestorsProvider>
          <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
            <ContentBreadcrumbs />
          </div>
          <NewView
            handleCancel={history.goBack}
            repository={repo}
            contentTypeName={contentTypeName}
            onSubmit={async content => {
              try {
                const created = await repo.post({
                  contentType: contentTypeName,
                  parentPath: currentContent!.Path,
                  content,
                  contentTemplate: contentTypeName,
                })
                logger.information({
                  message: localization.contentCreatedNotification.replace(
                    '{0}',
                    created.d.DisplayName || created.d.Name,
                  ),
                  data: {
                    relatedContent: created,
                    relatedRepository: repo.configuration.repositoryUrl,
                  },
                })
              } catch (error) {
                logger.error({
                  message: localization.errorPostingContentNotification,
                  data: {
                    details: { error },
                  },
                })
              } finally {
                history.goBack()
              }
            }}
          />
        </CurrentAncestorsProvider>
      </CurrentContentProvider>
    </div>
  )
}
