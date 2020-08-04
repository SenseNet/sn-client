import { Switch, Theme, withStyles } from '@material-ui/core'

export const Switcher = withStyles((theme: Theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'inline-flex',
  },
  sizeSmall: {
    width: 20,
    height: 10,

    '& $thumb': {
      width: 8,
      height: 8,
    },

    '& $switchBase': {
      padding: 1,

      '&$checked': {
        transform: 'translateX(10px)',
      },
    },
  },
  switchBase: {
    padding: 2,
    color: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    opacity: 1,
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
        borderColor: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
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
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[700] : theme.palette.grey[200],
  },
  checked: {},
}))(Switch)
