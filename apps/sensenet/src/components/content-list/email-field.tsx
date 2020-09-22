import { createStyles, makeStyles, TableCell, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    anchor: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    cell: {
      paddingRight: '3px',
    },
  })
})

export const EmailField: React.FC<{ mail: string }> = ({ mail }) => {
  const globalClasses = useGlobalStyles()
  const classes = useStyles()

  return (
    <TableCell
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle, classes.cell)}
      component="div">
      <Tooltip placement="top" title={mail}>
        <a href={`mailto:${mail}`} className={classes.anchor}>
          {mail}
        </a>
      </Tooltip>
    </TableCell>
  )
}
