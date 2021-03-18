import { Tab as MuiTab, withStyles } from '@material-ui/core'

export const Tab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    '&$selected': {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
  },
  selected: {},
}))(MuiTab)
