import { Tabs as MuiTabs, withStyles } from '@material-ui/core'

export const Tabs = withStyles((theme) => ({
  indicator: {
    backgroundColor: theme.palette.primary.main,
  },
}))(MuiTabs)
