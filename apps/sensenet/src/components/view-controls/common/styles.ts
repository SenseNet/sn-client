import { createStyles, makeStyles } from '@material-ui/core'
import { globals } from '../../../globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    grid: {
      padding: '14px 14px 0 14px',
      overflowY: 'auto',
      maxWidth: '100%',
      maxHeight: `calc(100% - ${globals.common.formActionButtonsHeight}px - ${globals.common.formTitleHeight}px)`,
    },
    actionButtonWrapper: {
      height: '80px',
      left: 0,
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      right: '7%',
    },
  })
})

export const useViewControlStyles = () => {
  return useStyles()
}
