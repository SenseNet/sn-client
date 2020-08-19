import { createStyles, makeStyles } from '@material-ui/core'
import { globals } from '../../../globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    grid: {
      margin: '0 auto',
      padding: '14px 14px 0 14px',
      overflowY: 'auto',
      width: '100%',
      maxHeight: `calc(100% - ${globals.common.formActionButtonsHeight}px - ${globals.common.formTitleHeight}px)`,
    },
    fieldWrapper: {
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'column',
      padding: '15px !important',
      height: 'fit-content',
      position: 'relative',
    },
    field: {
      width: '75%',
      position: 'relative',
    },
    fieldFullWidth: {
      width: '88%',
      position: 'relative',
    },
    actionButtonWrapper: {
      height: '80px',
      width: '100%',
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      right: 0,
      textAlign: 'right',
    },
  })
})

export const useViewControlStyles = () => {
  return useStyles()
}
