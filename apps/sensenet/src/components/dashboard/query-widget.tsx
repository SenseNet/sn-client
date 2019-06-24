import React, { useState, useEffect } from 'react'
import { Typography } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { RouteComponentProps, withRouter } from 'react-router'
import { QueryWidget as QueryWidgetModel } from '../../services/PersonalSettings'
import { useRepository, useContentRouting } from '../../hooks'
import { CollectionComponent, isReferenceField } from '../ContentListPanel'
import {
  CurrentContentContext,
  CurrentChildrenContext,
  CurrentAncestorsContext,
  LoadSettingsContext,
} from '../../context'

const QueryWidget: React.FunctionComponent<QueryWidgetModel<GenericContent> & RouteComponentProps> = props => {
  const [items, setItems] = useState<GenericContent[]>([])
  const [loadChildrenSettings, setLoadChildrenSettings] = useState<ODataParams<GenericContent>>({})
  const repo = useRepository()
  const contentRouter = useContentRouting()

  useEffect(() => {
    setLoadChildrenSettings({
      query: props.settings.query,
      top: props.settings.top,
      select: ['Actions', ...props.settings.columns],
      expand: ['Actions', ...props.settings.columns.filter(f => isReferenceField(f, repo))],
    })
  }, [props.settings.columns, props.settings.query, props.settings.top, repo])

  useEffect(() => {
    if (loadChildrenSettings.query) {
      ;(async () => {
        /** */
        const result = await repo.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: loadChildrenSettings,
        })
        setItems(result.d.results)
      })()
    }
  }, [repo, props.settings.query, props.settings.top, loadChildrenSettings])

  return (
    <div style={{ minHeight: 250 }}>
      <Typography gutterBottom={true} variant="h5">
        {props.title}
      </Typography>

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
                fieldsToDisplay={props.settings.columns}
                style={{
                  height: 'calc(100% - 75px)',
                  overflow: 'auto',
                }}
                enableBreadcrumbs={false}
                parentId={0}
                onParentChange={() => {
                  // props.history.push(contentRouter.getPrimaryActionUrl(p))
                }}
                onActivateItem={p => {
                  props.history.push(contentRouter.getPrimaryActionUrl(p))
                }}
                onTabRequest={() => {
                  /** */
                }}
              />
            </LoadSettingsContext.Provider>
          </CurrentAncestorsContext.Provider>
        </CurrentChildrenContext.Provider>
      </CurrentContentContext.Provider>
    </div>
  )
}

const routed = withRouter(QueryWidget)
export { routed as QueryWidget }
