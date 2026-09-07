import {
  AddCircleOutline,
  AppsOutlined,
  CheckBoxOutlineBlank,
  PhotoLibraryOutlined,
  ViewHeadlineOutlined,
  ViewListOutlined,
} from '@material-ui/icons'
import {
  CurrentChildrenContext,
  CurrentChildrenIsLoadingContext,
  CurrentContentContext,
  useInjector,
} from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useLocalization, usePersonalSettings, useSelectionService } from '../../hooks'
import { ContentIconSizes, ContentViewMode, PersonalSettings } from '../../services/PersonalSettings'
import { BatchActions } from '../BatchActions'
import { ExplorerActionMenu } from '../ExplorerActionMenu'
import { AUI_APPLICATION_CONTENT_TYPE } from './AUIApplicationView'
import { useExplorerFolderActions } from './ContentInfo'

const modes: Array<{ value: ContentViewMode; icon: typeof ViewListOutlined }> = [
  { value: 'details', icon: ViewListOutlined },
  { value: 'list', icon: ViewHeadlineOutlined },
  { value: 'icons', icon: AppsOutlined },
  { value: 'thumbnails', icon: PhotoLibraryOutlined },
]

const useSelectionCount = () => {
  const { selection } = useSelectionService()
  const [count, setCount] = useState(selection.getValue().length)
  useEffect(() => {
    const subscription = selection.subscribe((items) => setCount(items.length))
    return () => subscription.dispose()
  }, [selection])
  return count
}

export const ContentViewToolbar = ({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ContentViewMode
  onViewModeChange: (mode: ContentViewMode) => void
}) => {
  const localization = useLocalization().contentViews
  const settings = usePersonalSettings()
  const settingsService = useInjector().getInstance(PersonalSettings)
  const selectedCount = useSelectionCount()
  const children = useContext(CurrentChildrenContext)
  const isLoading = useContext(CurrentChildrenIsLoadingContext)
  const selectionService = useSelectionService()
  const parent = useContext(CurrentContentContext)
  const { creationActions, otherActions } = useExplorerFolderActions()
  const isApplication = parent.Type === AUI_APPLICATION_CONTENT_TYPE
  const viewActions = modes.map(({ value, icon: ViewIcon }) => ({
    id: `content-view-${value}`,
    label: localization[value],
    icon: <ViewIcon />,
    checked: viewMode === value,
    onClick: () => onViewModeChange(value),
  }))
  const sizeActions =
    viewMode === 'icons' || viewMode === 'thumbnails'
      ? ContentIconSizes.map((size, index) => ({
          id: `content-icon-size-${size}`,
          label: localization[size],
          checked: settings.contentIconSize === size,
          groupLabel: index === 0 ? localization.iconSize : undefined,
          onClick: () =>
            settingsService.setPersonalSettingsValue({
              ...settingsService.userValue.getValue(),
              contentIconSize: size,
            }),
        }))
      : []

  return (
    <div className="sn-explorer-toolbar-host">
      <div
        className={`sn-explorer-commandbar ${selectedCount ? 'has-selection' : ''}`}
        data-test="content-view-toolbar">
        <div className="sn-explorer-commandbar__new">
          <ExplorerActionMenu
            label={localization.newItem}
            icon={<AddCircleOutline />}
            dropdown
            testId="content-new-menu"
            items={creationActions}
          />
        </div>
        <span className="sn-explorer-commandbar__divider" aria-hidden="true" />
        {selectedCount > 0 && <BatchActions />}
        {!isApplication && (
          <div className="sn-explorer-commandbar__view">
            <ExplorerActionMenu
              label={localization.view}
              icon={<ViewListOutlined />}
              dropdown
              testId="content-view-menu"
              items={[...viewActions, ...sizeActions]}
            />
          </div>
        )}
        {selectedCount === 0 && (
          <>
            <ExplorerActionMenu label={localization.more} testId="content-header-more-actions" items={otherActions} />
            {!isApplication && (
              <button
                type="button"
                className="sn-explorer-commandbar__select-all"
                data-test="mobile-select-all"
                disabled={isLoading || !children.length}
                onClick={() => selectionService.selection.setValue(children)}>
                <CheckBoxOutlineBlank aria-hidden="true" />
                {localization.selectAll}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export const ExplorerStatusBar = () => {
  const children = useContext(CurrentChildrenContext)
  const isLoading = useContext(CurrentChildrenIsLoadingContext)
  const parent = useContext(CurrentContentContext)
  const selectedCount = useSelectionCount()
  const localization = useLocalization().contentViews
  if (parent.Type === AUI_APPLICATION_CONTENT_TYPE) return null
  return (
    <div className="sn-explorer-statusbar" data-test="explorer-statusbar" role="status">
      <span>{isLoading ? localization.loading : localization.itemCount.replace('{0}', String(children.length))}</span>
      {selectedCount > 0 && <span>{localization.selectedCount.replace('{0}', String(selectedCount))}</span>}
    </div>
  )
}
