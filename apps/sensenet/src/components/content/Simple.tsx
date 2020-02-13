import React from 'react'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '@sensenet/hooks-react'
import { useSelectionService } from '../../hooks'
import { ReactVirtualizedTable, ReactVirtualizedTableProps } from '../content-list/react-virtualized-table'

export interface SimpleListComponentProps {
  parent: number | string
  rootPath?: string
  reactVirtualizedTableProps?: Partial<ReactVirtualizedTableProps>
}

export const SimpleList: React.FunctionComponent<SimpleListComponentProps> = props => {
  const selectionService = useSelectionService()

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={props.parent}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={props.rootPath}>
              <ReactVirtualizedTable
                enableBreadcrumbs={true}
                onActivateItem={() => null}
                style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%', width: '100%' }}
                onParentChange={() => null}
                parentIdOrPath={props.parent}
                onSelectionChange={sel => {
                  selectionService.selection.setValue(sel)
                }}
                onActiveItemChange={item => selectionService.activeContent.setValue(item)}
                {...props.reactVirtualizedTableProps}
              />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </div>
  )
}
