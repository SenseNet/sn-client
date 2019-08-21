import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { debounce } from '@sensenet/client-utils'
import { RootReducerType, setActivePages } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    documentName: state.sensenetDocumentViewer.documentState.document.documentName,
    activePages: state.sensenetDocumentViewer.viewer.activePages,
    pageCount: state.sensenetDocumentViewer.documentState.document.pageCount,
    gotoPage: state.sensenetDocumentViewer.localization.gotoPage,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setActivePages,
}

/**
 * Document widget component for paging
 */
export const DocumentTitlePagerComponent: React.FC<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = props => {
  const [isFocused, setIsFocused] = useState(false)

  const setPage = debounce((index: number) => {
    props.setActivePages([index])
  }, 200)

  const gotoPage = (page: string | number) => {
    let pageInt = typeof page === 'string' ? parseInt(page, 10) : page
    if (!isNaN(pageInt)) {
      pageInt = Math.max(pageInt, 1)
      pageInt = Math.min(pageInt, props.pageCount)
      setPage(pageInt)
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setIsFocused(false)}>
      <Typography
        onClick={() => setIsFocused(true)}
        variant="h6"
        color="inherit"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', overflow: 'hidden', margin: '0 2.5em' }}
        title={props.documentName}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {props.documentName}&nbsp;
        </div>
        {isFocused ? (
          <form onSubmit={event => event.preventDefault()}>
            <TextField
              style={{ flexShrink: 0 }}
              title={props.gotoPage}
              value={props.activePages[0]}
              onChange={ev => gotoPage(ev.currentTarget.value)}
              type="number"
              required={true}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 1,
                max: props.pageCount,
                style: { textAlign: 'center' },
              }}
              margin="dense"
            />
          </form>
        ) : (
          <div style={{ flexShrink: 0 }}>
            {props.activePages[0]} / {props.pageCount}
          </div>
        )}
      </Typography>
    </ClickAwayListener>
  )
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentTitlePagerComponent)

export { connectedComponent as DocumentTitlePager }
