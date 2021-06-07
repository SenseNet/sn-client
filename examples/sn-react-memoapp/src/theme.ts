import { createMuiTheme } from '@material-ui/core'

export const theme = createMuiTheme({
  props: {
    MuiUseMediaQuery: {
      noSsr: true,
    },
  },
})
