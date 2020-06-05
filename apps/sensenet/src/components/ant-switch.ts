import { Switch } from '@material-ui/core'
import { createStyles, Theme, withStyles } from '@material-ui/core/styles'

export const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.common.white,
      opacity: '1',
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.black,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      opacity: 1,
    },
    checked: {},
  }),
)(Switch)
