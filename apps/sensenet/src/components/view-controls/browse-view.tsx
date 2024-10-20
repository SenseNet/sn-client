/**
 * @module ViewControls
 */
import { BrowseView as SnBrowseView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { ReactElement, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { LocalizationObject } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePersonalSettings, useSelectionService } from '../../hooks'
import { navigateToAction } from '../../services'
import { reactControlMapper } from '../react-control-mapper'
import { useViewControlStyles } from './common/styles'
import { ViewTitle } from './common/view-title'

export interface BrowseViewProps {
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  contentPath: string
}

export const BrowseView: React.FC<BrowseViewProps> = (props) => {
  const repository = useRepository()
  const selectionService = useSelectionService()
  const [content, setContent] = useState<GenericContent>()
  const controlMapper = reactControlMapper(repository)
  const classes = useViewControlStyles()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const personalSettings = usePersonalSettings()

  useEffect(() => {
    async function getExpandedContent() {
      const expanedContentResponse = await repository.load({
        idOrPath: props.contentPath,
        oDataOptions: {
          select: 'all',
          expand: ['Manager', 'FollowedWorkspaces', 'ModifiedBy'] as any,
        },
      })
      setContent(expanedContentResponse.d)
      selectionService.activeContent.setValue(expanedContentResponse.d)
      selectionService.selection.setValue([expanedContentResponse.d])
    }
    getExpandedContent()
  }, [repository, props.contentPath, selectionService.activeContent, selectionService.selection])

  if (content === undefined) {
    return null
  }

  return (
    <SnBrowseView
      content={content}
      repository={repository}
      handleCancel={() => navigateToAction({ history, routeMatch })}
      controlMapper={controlMapper}
      localization={{ close: localization.forms.close, advancedFields: localization.forms.advancedFields }}
      locale={LocalizationObject[personalSettings.language].locale}
      classes={{
        ...classes,
        cancel: globalClasses.cancelButton,
      }}
      renderTitle={() => <ViewTitle actionName="browse" titleBold={content?.DisplayName} content={content} />}
    />
  )
}
