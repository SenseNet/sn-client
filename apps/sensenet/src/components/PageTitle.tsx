import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import { globals } from '../globalStyles'

interface IPageTitleProps<T = string> {
  title: T
}
/*If this value needs somewhere else. TO-DO: place in globals.common*/
const TTITLE_SIZE = 50.31

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    pageTitle: {
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      fontFamily: '"Larsseit", Roboto',
      fontSize: '24px',
      padding: '8px 16px',
      height: `${TTITLE_SIZE}px`,
      '& ~ #treeAndDatagridWrapper': {
        height: `calc(100% - ${globals.common.drawerItemHeight}px - ${TTITLE_SIZE}px)`,
      },
    },
  })
})

export const PageTitle = (props: IPageTitleProps) => {
  const { title } = props
  const classes = useStyles()

  return (
    <div data-page-title={title} className={classes.pageTitle}>
      {title}
    </div>
  )
}
