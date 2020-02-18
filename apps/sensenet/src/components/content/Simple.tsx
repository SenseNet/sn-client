import React from 'react'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
  RepositoryContext,
} from '@sensenet/hooks-react'
import { useSelectionService } from '../../hooks'
import { CollectionComponent, CollectionComponentProps } from '../content-list'
import { useRepoState } from '../../services'

export interface SimpleListComponentProps {
  parent: number | string
  rootPath?: string
  collectionComponentProps?: Partial<CollectionComponentProps>
}

export const SimpleList: React.FunctionComponent<SimpleListComponentProps> = props => {
  const selectionService = useSelectionService()
  const { repository } = useRepoState().getCurrentRepoState()!

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <RepositoryContext.Provider value={repository}>
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
              </CurrentAncestorsProvider>
            </CurrentChildrenProvider>
          </CurrentContentProvider>
        </LoadSettingsContextProvider>
      </RepositoryContext.Provider>
    </div>
  )
}
