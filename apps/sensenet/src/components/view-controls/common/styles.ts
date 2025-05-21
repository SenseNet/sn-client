import { createStyles, makeStyles } from '@material-ui/core'
import { globals } from '../../../globalStyles'

const useStyles = makeStyles((theme) => {
  return createStyles({
    grid: {
      padding: '21px',
      overflowY: 'auto',
      maxWidth: '100%',
      maxHeight: `calc(100% - ${globals.common.formActionButtonsHeight}px - ${globals.common.formTitleHeight}px)`,
    },
    actionButtonWrapper: {
      padding: '8px',
      paddingRight: '39px',
      borderTop: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
      marginTop: 'auto',
    },
  })
})

export const useViewControlStyles = () => {
  return useStyles()
}
