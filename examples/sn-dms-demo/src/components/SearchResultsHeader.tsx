import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Close from '@material-ui/icons/Close'
import Save from '@material-ui/icons/Save'
import React from 'react'
import { connect } from 'react-redux'
import { openDialog } from '../Actions'
import { resources } from '../assets/resources'
import { saveQuery } from '../store/queries'
import { rootStateType } from '../store/rootReducer'

interface SearchResultsHeaderProps {
  clearResults: () => void
  query: string
}

interface SearchResultsHeaderState {
  isSaveDialogOpened: boolean
  queryName: string
}

const mapStateToProps = (state: rootStateType) => ({
  doclib: state.dms.documentLibrary.parentIdOrPath,
  contains: state.dms.documentLibrary.searchState.contains,
})

const mapDispatchToProps = {
  openDialog,
  saveQuery,
}

class SearchResultsHeader extends React.Component<
  SearchResultsHeaderProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  SearchResultsHeaderState
> {
  public state: SearchResultsHeaderState = {
    isSaveDialogOpened: false,
    queryName: this.props.contains
      ? `${resources.SEARCH_RESULTS_FOR} '${this.props.contains}'`
      : resources.SEARCH_RESULTS,
  }
  private handleOpenSaveQueryDialog() {
    this.setState({
      isSaveDialogOpened: true,
      queryName:
        this.state.queryName || this.props.contains
          ? `${resources.SEARCH_RESULTS_FOR} '${this.props.contains}'`
          : resources.SEARCH_RESULTS,
    })
  }

  private handleSaveQuery() {
    this.props.doclib && this.props.saveQuery(this.props.doclib, this.props.query, this.state.queryName, 'Private')
    this.setState({ isSaveDialogOpened: false, queryName: '' })
  }
  constructor(props: SearchResultsHeader['props']) {
    super(props)
    this.handleOpenSaveQueryDialog = this.handleOpenSaveQueryDialog.bind(this)
    this.handleSaveQuery = this.handleSaveQuery.bind(this)
  }
  public render() {
    return (
      <Typography variant="h4" style={{ margin: '.5em' }}>
        {this.props.contains ? `${resources.SEARCH_RESULTS_FOR} '${this.props.contains}'` : resources.SEARCH_RESULTS}
        <IconButton style={{ marginLeft: '2em' }} onClick={this.handleOpenSaveQueryDialog}>
          <Save />
        </IconButton>
        <IconButton onClick={this.props.clearResults}>
          <Close />
        </IconButton>
        <Dialog open={this.state.isSaveDialogOpened} fullWidth={true}>
          <DialogTitle>{resources.SAVE_QUERY_DIALOG_TITLE}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth={true}
              margin="dense"
              label={resources.SAVE_QUERY_NAME}
              value={this.state.queryName}
              onChange={ev => this.setState({ queryName: ev.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ isSaveDialogOpened: false })}>Cancel</Button>
            <Button color="secondary" variant="contained" onClick={this.handleSaveQuery}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Typography>
    )
  }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(SearchResultsHeader)

export { connectedComponent as SearchResultsHeader }
