import { createStyles, makeStyles } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { useDocumentData, useLocalization, useViewerState } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    typography: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      margin: '0 2.5em',
    },
    nameWrapper: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    textField: {
      flexShrink: 0,
    },
    notFocusedText: {
      flexShrink: 0,
    },
  })
})

type DocumentTitlePagerClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component for paging
 */
export const DocumentTitlePager: React.FunctionComponent<{ classes?: DocumentTitlePagerClassKey }> = (props) => {
  const classes = useStyles(props)
  const { documentData } = useDocumentData()
  const viewerState = useViewerState()
  const localization = useLocalization()
  const [isFocused, setIsFocused] = useState(false)
  const [currentValue, setCurrentValue] = useState<number | string>(viewerState.activePage)

  const gotoPage = (page: string | number) => {
    let pageInt = typeof page === 'string' ? parseInt(page, 10) : page
    if (!isNaN(pageInt)) {
      pageInt = Math.max(pageInt, 1)
      pageInt = Math.min(pageInt, documentData.pageCount)
      viewerState.pageToGo.setValue({ page: pageInt })
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setIsFocused(false)}>
      <Typography
        onClick={() => setIsFocused(true)}
        variant="h6"
        color="inherit"
        title={documentData.documentName}
        className={classes.typography}>
        <div className={classes.nameWrapper}>{documentData.documentName}&nbsp;</div>
        {isFocused ? (
          <form
            onSubmit={(ev) => {
              gotoPage(currentValue)
              ev.preventDefault()
            }}>
            <TextField
              className={classes.textField}
              title={localization.gotoPage}
              onChange={(ev) => setCurrentValue(ev.currentTarget.value)}
              onBlur={() => gotoPage(currentValue)}
              defaultValue={viewerState.activePage}
              type="number"
              required={true}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 1,
                max: documentData.pageCount,
                style: { textAlign: 'center' },
              }}
              margin="dense"
            />
          </form>
        ) : (
          <div className={classes.notFocusedText}>
            {viewerState.activePage} / {documentData.pageCount}
          </div>
        )}
      </Typography>
    </ClickAwayListener>
  )
}
