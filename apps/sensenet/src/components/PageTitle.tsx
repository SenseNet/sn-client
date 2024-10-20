import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

interface IPageTitleProps<T = string> {
  title: T
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    pageTitle: {
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
      fontFamily: '"Larsseit", Roboto',
      fontSize: '24px',
      padding: '8px 16px',
    },
  })
})

export const PageTitle = (props: IPageTitleProps) => {
  const { title } = props
  const classes = useStyles()

  return <div className={classes.pageTitle}>{title}</div>
}
