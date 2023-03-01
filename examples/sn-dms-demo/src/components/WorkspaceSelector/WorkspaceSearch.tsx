import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { Component, KeyboardEvent } from 'react'

const styles = (theme: Theme) => ({
  wsSearchContainer: {
    display: 'flex',
    flexGrow: 1,
    background: '#fff',
    borderRadius: 3,
    boxShadow: '#015176 0px 2px 2px',
  },
  wsSearchInput: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    border: '0',
    fontSize: 16,
    padding: '10px 12px',
    width: '100%',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: 'Raleway Medium',
  },
  formControl: {
    width: '100%',
  },
  formControlMobile: {
    display: 'inline-flex',
    flexGrow: 1,
  },
  icon: {
    color: '#7b7b7b',
  },
  startAdornment: {
    margin: '4px 0 4px 5px',
  },
  searchContainer: {
    padding: '10px',
  },
  searchContainerMobile: {
    padding: '10px',
    display: 'flex',
  },
  closeIcon: {
    marginLeft: 12,
    marginTop: 6,
    color: '#fff',
  },
})

type C = 'wsSearchInput'

class WorkspaceSearch extends Component<
  {
    classes: any
    handleKeyup: (e: KeyboardEvent) => void
    matches: boolean
    closeDropDown: (open: boolean) => void
  } & WithStyles<C>,
  {}
> {
  constructor(props: WorkspaceSearch['props']) {
    super(props)
    this.handleKeyup = this.handleKeyup.bind(this)
  }
  public handleKeyup = (e: any) => {
    this.props.handleKeyup(e.target.value)
  }
  public closeDropdown = () => {
    this.props.closeDropDown(false)
  }
  public render() {
    const { classes, matches } = this.props
    return (
      <div className={matches ? classes.searchContainer : classes.searchContainerMobile}>
        <FormControl className={matches ? classes.formControl : classes.formControlMobile}>
          <TextField
            onKeyUp={(e) => this.handleKeyup(e)}
            placeholder="Search"
            InputProps={{
              disableUnderline: true,
              classes: {
                input: matches ? classes.wsSearchInput : classes.wsSearchInputMobile,
                root: classes.wsSearchContainer,
              },
              startAdornment: (
                <InputAdornment position="start" className={classes.startAdornment}>
                  <Icon type={iconType.materialui} iconName="search" className={classes.icon} />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        {matches ? null : (
          <Icon
            className={classes.closeIcon}
            onClick={() => this.closeDropdown()}
            type={iconType.materialui}
            iconName="close"
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles as any)(WorkspaceSearch)
