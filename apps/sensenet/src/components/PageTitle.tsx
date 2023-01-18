import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import { globals } from '../globalStyles'

interface IPageTitleProps {
  title: string
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    pageTitle: {
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      paddingLeft: globals.common.explorePaddingLeft,
      fontFamily: '"Larsseit", Roboto',
      marginTop: '15px',
      fontSize: '20px',
    },
  })
})

export const PageTitle = (props: IPageTitleProps) => {
  const { title } = props
  const classes = useStyles()

  return <div className={classes.pageTitle}>{title}</div>
}
