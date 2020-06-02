import { Switch } from '@material-ui/core'
import { createStyles, Theme, withStyles } from '@material-ui/core/styles'

export const Switcher = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 20,
      height: 10,
      padding: 0,
      display: 'inline-flex',
    },
    switchBase: {
      padding: 1,
      color: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
      opacity: '1',
      '&$checked': {
        transform: 'translateX(10px)',
        color: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
          borderColor: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
        },
      },
    },
    thumb: {
      width: 8,
      height: 8,
      boxShadow: 'none',
    },
    track: {
      opacity: 1,
      backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[700] : theme.palette.grey[200],
    },
    checked: {},
  }),
)(Switch)
