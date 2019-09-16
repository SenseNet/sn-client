import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import NavigateNext from '@material-ui/icons/NavigateNext'
import React, { useCallback, useEffect, useState } from 'react'
import { useViewerState } from '../../hooks/useViewerState'
import { useDocumentData, useLocalization } from '../../hooks'

/**
 * Defines the own props for the PagerState component
 */
export interface PagerState {
  currentPage: number
  lastPage: number
}

export const PagerWidget: React.FC = () => {
  const viewerState = useViewerState()
  const localization = useLocalization()
  const { documentData } = useDocumentData()

  const [currentPage, setCurrentPage] = useState(viewerState.activePages[0] || 1)
  const [lastPage, setLastPage] = useState(documentData.pageCount || 1)

  useEffect(() => {
    setCurrentPage(viewerState.activePages[0] || 1)
  }, [viewerState.activePages])

  useEffect(() => {
    setLastPage(documentData.pageCount || 1)
  }, [documentData.pageCount])

  const gotoPage = useCallback(
    (pageNo: number) => {
      viewerState.updateState({ activePages: [pageNo] })
    },
    [viewerState],
  )

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton disabled={currentPage <= 1} title={localization.firstPage} onClick={() => gotoPage(1)} id="FirstPage">
        <FirstPage />
      </IconButton>

      <IconButton
        disabled={currentPage <= 1}
        title={localization.previousPage}
        onClick={() => gotoPage(viewerState.activePages[0] - 1)}
        id="NavigateBefore">
        <NavigateBefore />
      </IconButton>

      <TextField
        title={localization.gotoPage}
        value={currentPage}
        onChange={ev => gotoPage(parseInt(ev.currentTarget.value, 10))}
        type="number"
        required={true}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ min: 1, max: lastPage }}
        margin="dense"
      />

      <IconButton
        disabled={currentPage >= lastPage}
        title={localization.nextPage}
        color={'primary'}
        onClick={() => gotoPage(viewerState.activePages[0] + 1)}
        id="NavigateNext">
        <NavigateNext />
      </IconButton>

      <IconButton
        disabled={currentPage >= lastPage}
        title={localization.lastPage}
        onClick={() => gotoPage(lastPage)}
        id="LastPage">
        <LastPage />
      </IconButton>
    </div>
  )
}
