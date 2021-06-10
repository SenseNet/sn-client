import { Theme } from '@material-ui/core'

export const getCommonStyles = (theme: Theme) => ({
  editorBackground: theme.palette.type === 'dark' ? '#222' : theme.palette.common.white,
  editorBorder: `2px solid ${theme.palette.primary.main}`,
  editorBorderRadius: '5px',
})
