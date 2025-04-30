import { createStyles, makeStyles } from '@material-ui/core'
import { globals } from '../../../globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    grid: {
      padding: '21px',
      overflowY: 'auto',
      maxWidth: '100%',
      maxHeight: `calc(100% - ${globals.common.formActionButtonsHeight}px - ${globals.common.formTitleHeight}px)`,
    },
    actionButtonWrapper: {
      left: 'auto',
      position: 'absolute',
      padding: '9px',
      right: '1%',
    },
  })
})

export const useViewControlStyles = () => {
  return useStyles()
}
