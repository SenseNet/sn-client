import { ConstantContent } from '@sensenet/client-core'
import React from 'react'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '../../context'
import { useSelectionService } from '../../hooks'
import { AddButton } from '../AddButton'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { CollectionComponent } from '../content-list'
import { Tree } from '../tree/index'

export interface ExploreComponentProps {
  parent: number | string
  onNavigate: (newParent: GenericContent) => void
  onActivateItem: (item: GenericContent) => void
}

export const Explore: React.FunctionComponent<ExploreComponentProps> = props => {
  const selectionService = useSelectionService()

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={props.parent}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider>
              <div style={{ marginTop: '13px', paddingBottom: '12px', borderBottom: '1px solid rgba(128,128,128,.2)' }}>
                <ContentBreadcrumbs />
              </div>
              <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <Tree
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                    borderRight: '1px solid rgba(128,128,128,.2)',
                    overflow: 'auto',
                  }}
                  parentPath={ConstantContent.PORTAL_ROOT.Path}
                  loadOptions={{
                    orderby: [['DisplayName', 'asc'], ['Name', 'asc']],
                  }}
                  onItemClick={item => {
                    selectionService.activeContent.setValue(item)
                    props.onNavigate(item)
                  }}
                  activeItemIdOrPath={props.parent}
                />

                <CollectionComponent
                  enableBreadcrumbs={false}
                  onActivateItem={props.onActivateItem}
                  style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
                  onParentChange={props.onNavigate}
                  onSelectionChange={sel => {
                    selectionService.selection.setValue(sel)
                  }}
                  parentIdOrPath={props.parent}
                  onTabRequest={() => {
                    /** */
                  }}
                  onActiveItemChange={item => selectionService.activeContent.setValue(item)}
                />

                <AddButton />
              </div>
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </div>
  )
}
