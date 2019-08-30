import React, { useState } from 'react'
import { createStyles, Grid, IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { GenericContent, TrashBin } from '@sensenet/default-content-types'
import { RouteComponentProps, withRouter } from 'react-router'
import { ConstantContent } from '@sensenet/client-core'
import { Settings } from '@material-ui/icons'
import { useQuery } from '../hooks/use-query'
import { CurrentAncestorsContext, CurrentChildrenContext, CurrentContentContext, LoadSettingsContext } from '../context'
import { useContentRouting, useLocalization, useSelectionService } from '../hooks'
import { useLoadContent } from '../hooks/use-loadContent'
import { CollectionComponent } from './content-list'
import { EditPropertiesDialog } from './dialogs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { padding: theme.spacing(2), margin: theme.spacing(2), height: '100%', width: '100%' },
    title: { display: 'flex', alignItems: 'center' },
    grow: { flexGrow: 1 },
  }),
)

const columns: Array<keyof GenericContent> = ['DisplayName', 'ModificationDate', 'ModifiedBy']

const Trash: React.FC<RouteComponentProps> = props => {
  const { loadChildrenSettings, setLoadChildrenSettings, items, error } = useQuery({
    columns,
    query: '+TypeIs: TrashBag',
  })
  const [isEditPropertiesOpened, setIsEditPropertiesOpened] = useState(false)
  const contentRouter = useContentRouting()
  const selectionService = useSelectionService()
  const localization = useLocalization().trash
  const trash = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions: { select: 'all' } })
  const classes = useStyles()
  const infos = [
    { title: localization.retentionTime, value: trash.content && trash.content.MinRetentionTime },
    { title: localization.sizeQuota, value: trash.content && trash.content.SizeQuota },
    { title: localization.capacity, value: trash.content && trash.content.BagCapacity },
  ]

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2} alignItems="center">
        <Grid item={true} className={classes.title}>
          <Typography variant="h5">{localization.title}</Typography>
          <IconButton onClick={() => setIsEditPropertiesOpened(!isEditPropertiesOpened)}>
            <Settings />
          </IconButton>
        </Grid>
        <Grid item={true} className={classes.grow} />
        {trash.content
          ? infos.map(info => (
              <Grid item={true} key={info.title}>
                <Typography>
                  {info.title} : {info.value}
                </Typography>
              </Grid>
            ))
          : null}
      </Grid>
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
      {trash.content ? (
        <EditPropertiesDialog
          content={trash.content}
          dialogProps={{
            open: isEditPropertiesOpened,
            onClose: () => setIsEditPropertiesOpened(false),
            keepMounted: false,
          }}
        />
      ) : null}
    </div>
  )
}

export default withRouter(Trash)
