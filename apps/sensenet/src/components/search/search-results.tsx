import { ConstantContent } from '@sensenet/client-core'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  useRepository,
} from '@sensenet/hooks-react'
import { Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useSearch } from '../../context/search'
import { useSelectionService, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'
import { ContentList } from '../content-list'

export const SearchResults = () => {
  const repository = useRepository()
  const history = useHistory()
  const { location } = history
  const selectionService = useSelectionService()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const snRoute = useSnRoute()

  const searchState = useSearch()

  return (
    <>
      {searchState.error ? (
        <Typography color="error" variant="caption" style={{ margin: '0 1rem 1rem' }}>
          {searchState.error}
        </Typography>
      ) : null}

      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        <CurrentChildrenContext.Provider value={searchState.result}>
          <CurrentAncestorsContext.Provider value={[]}>
            <ContentList
              style={{
                height: '100%',
                overflow: 'auto',
              }}
              enableBreadcrumbs={false}
              parentIdOrPath={0}
              onParentChange={(p) => {
                history.push(getPrimaryActionUrl({ content: p, repository, uiSettings, location, snRoute }))
              }}
              onActivateItem={(p) => {
                history.push(getPrimaryActionUrl({ content: p, repository, uiSettings, location, snRoute }))
              }}
              onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
            />
          </CurrentAncestorsContext.Provider>
        </CurrentChildrenContext.Provider>
      </CurrentContentContext.Provider>
    </>
  )
}
