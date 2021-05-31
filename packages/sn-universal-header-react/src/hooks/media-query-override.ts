import { useMediaQuery, useTheme } from '@material-ui/core'

export const useMediaQueryOverride = () => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('md'))
}
