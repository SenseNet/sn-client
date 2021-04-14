import { createStyles, makeStyles } from '@material-ui/core'
import * as React from 'react'
import { globals } from '../styles/globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    page: {
      display: 'block',
      flex: 1,
      position: 'relative',
      padding: `${globals.common.containerPadding}rem 0`,
      marginBottom: '3rem',
    },
  })
})

const Page: React.FC = (props) => {
  const classes = useStyles()
  return <div className={classes.page}>{props.children}</div>
}

export default Page
