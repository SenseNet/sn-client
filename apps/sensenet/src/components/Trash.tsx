import React from 'react'
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { GenericContent, TrashBin } from '@sensenet/default-content-types'
import { RouteComponentProps, withRouter } from 'react-router'
import { ConstantContent } from '@sensenet/client-core'
import { useQuery } from '../hooks/use-query'
import { CurrentAncestorsContext, CurrentChildrenContext, CurrentContentContext, LoadSettingsContext } from '../context'
import { useContentRouting, useLocalization, useSelectionService } from '../hooks'
import { useLoadContent } from '../hooks/use-loadContent'
import { CollectionComponent } from './content-list'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { padding: theme.spacing(2), margin: theme.spacing(2), height: '100%', width: '100%' },
  }),
)

const columns: Array<keyof GenericContent> = ['DisplayName', 'ModificationDate', 'ModifiedBy']

const Trash: React.FC<RouteComponentProps> = props => {
  const { loadChildrenSettings, setLoadChildrenSettings, items, error } = useQuery({
    columns,
    query: '+TypeIs: TrashBag',
  })
  const contentRouter = useContentRouting()
  const selectionService = useSelectionService()
  const localization = useLocalization().trash
  const trash = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash' })
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h5">{localization.title}</Typography>
      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        {trash.content ? trash.content.Path : null}
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
    </div>
  )
}

export default withRouter(Trash)
