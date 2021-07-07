import { createMuiTheme } from '@material-ui/core'

export const theme = createMuiTheme({
  props: {
    MuiUseMediaQuery: {
      noSsr: true,
    },
  },
  palette: {
    primary: {
      light: '#80cbc4',
      main: '#019592',
      dark: '#00796b',
    },
    secondary: {
      light: '#90caf9',
      main: '#1976d2',
      dark: '#1565c0',
    },
  },
})
