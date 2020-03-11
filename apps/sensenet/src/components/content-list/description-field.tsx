import { createStyles, makeStyles, TableCell, Tooltip } from '@material-ui/core'
import React from 'react'
import clsx from 'clsx'
import { useGlobalStyles } from '../../globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    ellipsis: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingRight: '20px',
      maxWidth: '300px',
    },
  })
})

export const DescriptionField: React.FC<{ text: string }> = ({ text }) => {
  const globalClasses = useGlobalStyles()
  const classes = useStyles()

  return (
    <TableCell
      component="div"
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)}
      style={{ justifyContent: 'left' }}>
      <Tooltip title={text ? text.replace(/<(.|\n)*?>/g, '') : ''} placement="top">
        <div className={classes.ellipsis}>{text ? text.replace(/<(.|\n)*?>/g, '') : ''}</div>
      </Tooltip>
    </TableCell>
  )
}
