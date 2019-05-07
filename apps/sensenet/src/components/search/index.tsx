import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Save from '@material-ui/icons/Save'
import { ConstantContent } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { generatePath, RouteComponentProps, withRouter } from 'react-router'
import Semaphore from 'semaphore-async-await'
import {
  ContentRoutingContext,
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  LocalizationContext,
  RepositoryContext,
  ResponsivePersonalSetttings,
} from '../../context'
import { CollectionComponent } from '../ContentListPanel'

const loadCount = 20

const Search: React.FunctionComponent<RouteComponentProps<{ query?: string }>> = props => {
  const repo = useContext(RepositoryContext)
  const ctx = useContext(ContentRoutingContext)

  const localization = useContext(LocalizationContext).values.search
  const [contentQuery, setContentQuery] = useState(decodeURIComponent(props.match.params.query || ''))
  const [reloadToken, setReloadToken] = useState(Math.random())
  const [scrollToken, setScrollToken] = useState(Math.random())

  const [scrollLock] = useState(new Semaphore(1))

  const [requestReload] = useState(() => debounce(() => setReloadToken(Math.random()), 250))
  const [requestScroll] = useState(() =>
    debounce((div: HTMLDivElement, total: number, loaded: number, update: (token: number) => void) => {
      const table = div.querySelector('table')
      if (table && total > loaded && table.getBoundingClientRect().bottom <= window.innerHeight) {
        update(Math.random())
      }
    }, 250),
  )

  const [result, setResult] = useState<GenericContent[]>([])
  const [count, setCount] = useState(0)
  const loadSettingsContext = useContext(LoadSettingsContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)
  const [isSaveOpened, setIsSaveOpened] = useState(false)

  const [saveName, setSaveName] = useState('')
  const [savePublic, setSavePublic] = useState(false)

  useEffect(() => {
    props.history.push(
      generatePath(props.match.path, { ...props.match.params, query: encodeURIComponent(contentQuery) || undefined }),
    )
    repo
      .loadCollection({
        path: ConstantContent.PORTAL_ROOT.Path,
        oDataOptions: {
          ...loadSettingsContext.loadChildrenSettings,
          query: personalSettings.commandPalette.wrapQuery.replace('{0}', contentQuery),
          top: loadCount,
        },
      })
      .then(r => {
        setResult(r.d.results), setCount(r.d.__count)
      })
  }, [reloadToken, loadSettingsContext.loadChildrenSettings])

  useEffect(() => {
    ;(async () => {
      try {
        await scrollLock.acquire()
        const response = await repo.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            ...loadSettingsContext.loadChildrenSettings,
            query: personalSettings.commandPalette.wrapQuery.replace('{0}', contentQuery),
            top: loadCount,
            skip: result.length,
          },
        })
        setResult([...result, ...response.d.results])
        setCount(response.d.__count)
      } finally {
        scrollLock.release()
      }
    })()
  }, [scrollToken])

  return (
    <div style={{ padding: '1em', margin: '1em', height: '100%', width: '100%' }}>
      <Typography variant="h5">{localization.title}</Typography>
      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ marginLeft: '1em', width: '100%', display: 'flex' }}>
          <TextField
            label={localization.queryLabel}
            helperText={localization.queryHelperText}
            defaultValue={contentQuery}
            fullWidth={true}
            onChange={ev => {
              setContentQuery(ev.target.value)
              requestReload()
            }}
          />
          <Button style={{ flexShrink: 0 }} title={localization.saveQuery} onClick={() => setIsSaveOpened(true)}>
            <Save style={{ marginRight: 8 }} />
            {localization.saveQuery}
          </Button>
          <Dialog open={isSaveOpened} onClose={() => setIsSaveOpened(false)}>
            <DialogTitle>{localization.saveQuery}</DialogTitle>
            <DialogContent style={{ minWidth: 450 }}>
              <TextField
                fullWidth={true}
                defaultValue={`Search results for '${contentQuery}'`}
                onChange={ev => setSaveName(ev.currentTarget.value)}
              />
              <br />
              <FormControlLabel
                label={localization.public}
                control={<Checkbox onChange={ev => setSavePublic(ev.target.checked)} />}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsSaveOpened(false)}>{localization.cancel}</Button>
              <Button
                onClick={() => {
                  repo
                    .executeAction({
                      idOrPath:
                        repo.authentication.currentUser.getValue().ProfilePath || ConstantContent.PORTAL_ROOT.Path,
                      name: 'SaveQuery',
                      method: 'POST',
                      body: {
                        query: contentQuery,
                        displayName: saveName,
                        queryType: savePublic ? 'Public' : 'Private',
                      },
                    })
                    .then(() => {
                      setIsSaveOpened(false)
                    })
                }}
                color="primary">
                {localization.save}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        <CurrentChildrenContext.Provider value={result}>
          <CurrentAncestorsContext.Provider value={[]}>
            <CollectionComponent
              style={{
                height: 'calc(100% - 75px)',
                overflow: 'auto',
              }}
              containerProps={{
                onScroll: ev => requestScroll(ev.currentTarget, count, result.length, setScrollToken),
              }}
              enableBreadcrumbs={false}
              parentId={0}
              onParentChange={p => {
                props.history.push(ctx.getPrimaryActionUrl(p))
              }}
              onActivateItem={p => {
                props.history.push(ctx.getPrimaryActionUrl(p))
              }}
              onTabRequest={() => {
                /** */
              }}
            />
          </CurrentAncestorsContext.Provider>
        </CurrentChildrenContext.Provider>
      </CurrentContentContext.Provider>
    </div>
  )
}

export default withRouter(Search)
