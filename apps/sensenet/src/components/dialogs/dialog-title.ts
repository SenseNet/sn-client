import { DialogTitle as MuiDialogTitle, Theme, withStyles } from '@material-ui/core'
import { globals } from '../../globalStyles'

export const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    backgroundColor: globals.common.headerBackground,
    textAlign: 'center',
    color: globals.common.headerText,
    marginBottom: theme.spacing(1),
  },
}))(MuiDialogTitle)
