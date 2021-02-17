import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import { DateFilter } from './date-filter'
import { PathFilter } from './path-filter'
import { ReferenceFilter } from './reference-filter'

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      margin: '5px 15px',

      '& > *': {
        marginRight: '1.5rem',
      },
    },
  })
})

export const MoreFilters = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <PathFilter />
      <ReferenceFilter />
      <DateFilter />
    </div>
  )
}
