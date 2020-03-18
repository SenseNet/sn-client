import React from 'react'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '@sensenet/hooks-react'
import { useSelectionService } from '../../hooks'
import { ContentList, ContentListProps } from '../content-list/content-list'

export interface SimpleListComponentProps {
  parent: number | string
  rootPath?: string
  contentListProps?: Partial<ContentListProps>
}

export const SimpleList: React.FunctionComponent<SimpleListComponentProps> = props => {
  const selectionService = useSelectionService()

  return (
    <>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={props.parent}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={props.rootPath}>
              <ContentList
                enableBreadcrumbs={true}
                onActivateItem={() => null}
                style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%', width: '100%', position: 'relative' }}
                onParentChange={() => null}
                parentIdOrPath={props.parent}
                onSelectionChange={sel => {
                  selectionService.selection.setValue(sel)
                }}
                onActiveItemChange={item => selectionService.activeContent.setValue(item)}
                {...props.contentListProps}
                isOpenFrom={'simple'}
              />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </>
  )
}
