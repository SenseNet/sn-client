import {
  createStyles,
  FormControl,
  IconButton,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import { ConstantContent, ODataFieldParameter } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  useRepository,
} from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useSearch } from '../../context/search'
import { useSelectionService, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'
import { searchColumnDefs } from '../grid/Cols/ColumnDefs.'
import { Grid } from '../grid/Grid'

const useStyles = makeStyles(() =>
  createStyles({
    paginationControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      padding: '0 10px',
    },
    noSpin: {
      '& input[type=number]::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
      },
      '& input[type=number]::-webkit-outer-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
      },
      '& input[type=number]': {
        MozAppearance: 'textfield',
      },
    },
    containerRelative: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    linearProgressOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99,
    },
  }),
)

export const SearchResults = ({
  currentPage,
  setCurrentPage,
  maxSearchResult,
  setMaxSearchResult,
}: {
  currentPage: number
  setCurrentPage: (val: number) => void
  maxSearchResult: number
  setMaxSearchResult: (val: number) => void
}) => {
  const repository = useRepository()
  const history = useHistory()
  const { location } = history
  const selectionService = useSelectionService()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const snRoute = useSnRoute()
  const classes = useStyles()
  const searchState = useSearch()

  const totalPages = Math.ceil(searchState.resultCount / maxSearchResult)
  const startItem = (currentPage - 1) * maxSearchResult + 1
  const endItem = Math.min(currentPage * maxSearchResult, searchState.resultCount)

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value)
    if (isNaN(value)) return
    value = Math.min(Math.max(1, value), totalPages)
    setCurrentPage(value)
  }

  return (
    <div className={classes.containerRelative}>
      {searchState.error ? (
        <Typography color="error" variant="caption" style={{ margin: '0 1rem 1rem' }}>
          {searchState.error}
        </Typography>
      ) : null}

      {searchState.isLoading && <LinearProgress className={classes.linearProgressOverlay} />}

      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        <CurrentChildrenContext.Provider value={searchState.result}>
          <CurrentAncestorsContext.Provider value={[]}>
            <Grid
              colDef={searchColumnDefs}
              parentIdOrPath={0}
              onParentChange={(p) => {
                history.push(getPrimaryActionUrl({ content: p, repository, uiSettings, location, snRoute }))
              }}
              onActivateItem={async (item) => {
                const expandedItem = await repository.load({
                  idOrPath: item.Id,
                  oDataOptions: {
                    select: Array.isArray(repository.configuration.requiredSelect)
                      ? ([
                          ...repository.configuration.requiredSelect,
                          'Actions/Name',
                        ] as ODataFieldParameter<GenericContent>)
                      : repository.configuration.requiredSelect,
                    expand: ['Actions'] as ODataFieldParameter<GenericContent>,
                  },
                })
                history.push(
                  getPrimaryActionUrl({ content: expandedItem.d, repository, uiSettings, location, snRoute }),
                )
              }}
              onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
            />
          </CurrentAncestorsContext.Provider>
        </CurrentChildrenContext.Provider>
      </CurrentContentContext.Provider>

      {/* Pagination Controls */}
      <div className={classes.paginationControls}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Typography variant="body2" component="label" htmlFor="per-page" style={{ fontWeight: '500' }}>
            Items per page
          </Typography>
          <FormControl variant="outlined" size="small" style={{ minWidth: 70 }}>
            <Select
              labelId="per-page-label"
              id="per-page"
              value={maxSearchResult}
              onChange={(e) => {
                setMaxSearchResult(Number(e.target.value))
                setCurrentPage(1)
              }}>
              {[50, 100, 200, 500].map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" component="span" style={{ fontWeight: '500' }}>
            {startItem}-{endItem} of {searchState.resultCount}
          </Typography>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            size="small">
            <ChevronLeft />
          </IconButton>

          <TextField
            type="number"
            inputProps={{
              min: 1,
              max: totalPages,
              style: { textAlign: 'center' },
            }}
            value={currentPage}
            onChange={handlePageInputChange}
            variant="outlined"
            size="small"
            className={classes.noSpin}
            style={{
              width: 50,
              padding: 4,
              borderRadius: 4,
            }}
          />
          <Typography variant="body1" component="span" style={{ fontWeight: '500' }}>
            of {totalPages}
          </Typography>

          <IconButton
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            size="small">
            <ChevronRight />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
