import { ConstantContent } from '@sensenet/client-core'
import React from 'react'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '@sensenet/hooks-react'
import { useSelectionService } from '../../hooks'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { CollectionComponent } from '../content-list'
import { Tree } from '../tree/index'

export interface ExploreComponentProps {
  parent: number | string
  onNavigate: (newParent: GenericContent) => void
  onActivateItem: (item: GenericContent) => void
  fieldsToDisplay?: Array<keyof GenericContent>
  rootPath?: string
}

const treeLoadOptions = {
  orderby: [
    ['DisplayName', 'asc'],
    ['Name', 'asc'],
  ] as any,
}
export const Explore: React.FunctionComponent<ExploreComponentProps> = props => {
  const selectionService = useSelectionService()

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={props.parent}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={props.rootPath}>
              <div style={{ marginTop: '13px', paddingBottom: '12px', borderBottom: '1px solid rgba(128,128,128,.2)' }}>
                <ContentBreadcrumbs onItemClick={i => props.onNavigate(i.content)} />
              </div>
              <div style={{ display: 'flex', width: '100%', height: 'calc(100% - 62px)', position: 'relative' }}>
                <Tree
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                    borderRight: '1px solid rgba(128,128,128,.2)',
                    overflow: 'auto',
                  }}
                  parentPath={props.rootPath || ConstantContent.PORTAL_ROOT.Path}
                  loadOptions={treeLoadOptions}
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
                  fieldsToDisplay={props.fieldsToDisplay}
                  onActiveItemChange={item => selectionService.activeContent.setValue(item)}
                />
              </div>
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </div>
  )
}
