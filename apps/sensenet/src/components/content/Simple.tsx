import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '@sensenet/hooks-react'
import React from 'react'
import { useSelectionService } from '../../hooks'
import { ContentList, ContentListProps } from '../content-list/content-list'

export interface SimpleListComponentProps {
  parent: number | string
  rootPath?: string
  contentListProps?: Partial<ContentListProps>
  loadChildrenSettings?: ODataParams<GenericContent>
}

export const SimpleList: React.FunctionComponent<SimpleListComponentProps> = (props) => {
  const selectionService = useSelectionService()

  return (
    <>
      <LoadSettingsContextProvider loadChildrenSettings={props.loadChildrenSettings}>
        <CurrentContentProvider idOrPath={props.parent}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={props.rootPath}>
              <ContentList
                enableBreadcrumbs={true}
                onActivateItem={(item) =>
                  props.contentListProps?.onActivateItem && props.contentListProps.onActivateItem(item)
                }
                style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%', width: '100%', position: 'relative' }}
                onParentChange={() => null}
                parentIdOrPath={props.parent}
                onSelectionChange={(sel) => {
                  selectionService.selection.setValue(sel)
                }}
                onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
                {...props.contentListProps}
              />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </>
  )
}
