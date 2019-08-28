import React from 'react'
import { ConstantContent } from '@sensenet/client-core'
import { Typography } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { RouteComponentProps, withRouter } from 'react-router'
import { useQuery } from '../hooks/use-query'
import { CurrentAncestorsContext, CurrentChildrenContext, CurrentContentContext, LoadSettingsContext } from '../context'
import { useContentRouting, useSelectionService } from '../hooks'
import { CollectionComponent } from './content-list'

const columns: Array<keyof GenericContent> = ['DisplayName', 'ModificationDate', 'ModifiedBy']

const Trash: React.FC<RouteComponentProps> = props => {
  const { loadChildrenSettings, setLoadChildrenSettings, items, error } = useQuery({
    columns,
    query: '+TypeIs: TrashBag',
  })
  const contentRouter = useContentRouting()
  const selectionService = useSelectionService()

  return (
    <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
      <CurrentChildrenContext.Provider value={items}>
        <CurrentAncestorsContext.Provider value={[]}>
          <LoadSettingsContext.Provider
            value={{
              loadAncestorsSettings: {},
              loadSettings: {},
              loadChildrenSettings,
              setLoadChildrenSettings: newSettings => {
                setLoadChildrenSettings({
                  ...loadChildrenSettings,
                  orderby: newSettings.orderby,
                })
              },
              setLoadSettings: () => ({}),
              setLoadAncestorsSettings: () => ({}),
            }}>
            <CollectionComponent
              disableSelection={false}
              hideHeader={false}
              fieldsToDisplay={columns}
              style={{
                overflow: 'auto',
                height: items.length < 1 ? 0 : '100%',
              }}
              enableBreadcrumbs={false}
              parentIdOrPath={0}
              onParentChange={() => {
                // props.history.push(contentRouter.getPrimaryActionUrl(p))
              }}
              onActivateItem={p => {
                props.history.push(contentRouter.getPrimaryActionUrl(p))
              }}
              onTabRequest={() => {
                /** */
              }}
              onSelectionChange={sel => {
                selectionService.selection.setValue(sel)
              }}
              onActiveItemChange={item => {
                selectionService.activeContent.setValue(item)
              }}
            />
            {error ? <Typography color="error">{error}</Typography> : null}
          </LoadSettingsContext.Provider>
        </CurrentAncestorsContext.Provider>
      </CurrentChildrenContext.Provider>
    </CurrentContentContext.Provider>
  )
}

export default withRouter(Trash)
