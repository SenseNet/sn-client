import { indigo, teal } from '@material-ui/core/colors'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import zIndex from '@material-ui/core/styles/zIndex'

const theme: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: indigo,
    secondary: teal,
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiList: {
      root: {
        margin: '0 !important',
        padding: '0 !important',
      },
    },
    MuiAppBar: {
      root: {
        zIndex: zIndex.drawer + 1,
      },
    },
  },
}

export default theme
