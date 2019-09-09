import React from 'react'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '@sensenet/hooks-react'
import { useSelectionService } from '../../hooks'
import { AddButton } from '../AddButton'
import { CollectionComponent, CollectionComponentProps } from '../content-list'

export interface SimpleListComponentProps {
  parent: number | string
  rootPath?: string
  collectionComponentProps?: Partial<CollectionComponentProps>
}

export const SimpleList: React.FunctionComponent<SimpleListComponentProps> = props => {
  const selectionService = useSelectionService()

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={props.parent}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={props.rootPath}>
              <CollectionComponent
                enableBreadcrumbs={true}
                onActivateItem={() => null}
                style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%', width: '100%' }}
                onParentChange={() => null}
                parentIdOrPath={props.parent}
                onSelectionChange={sel => {
                  selectionService.selection.setValue(sel)
                }}
                onActiveItemChange={item => selectionService.activeContent.setValue(item)}
                {...props.collectionComponentProps}
              />
              <AddButton />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </div>
  )
}
