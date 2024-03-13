import { createStyles, makeStyles, TableCell, Tooltip } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { clsx } from 'clsx'
import React from 'react'
import { ResponsivePlatforms } from '../../context'
import { useGlobalStyles } from '../../globalStyles'

type DisplayNameProps = {
  content: GenericContent
  device: ResponsivePlatforms
  isActive: boolean
}

const CHARACHTER_SPLIT = 10

const useStyles = makeStyles(() => {
  return createStyles({
    displayContainer: {
      position: 'relative',
      top: '1px',
      width: 'inherit',
      '& > span': {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      },
      '& .first': {
        maxWidth: `calc(100% - ${CHARACHTER_SPLIT + 1}ch)`,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  })
})

export const DisplayNameComponent: React.FunctionComponent<DisplayNameProps> = ({ content }) => {
  const globalClasses = useGlobalStyles()

  const contentValue = content.DisplayName || content.Name

  const splitedValue = [contentValue.slice(0, CHARACHTER_SPLIT * -1), contentValue.slice(CHARACHTER_SPLIT * -1)]

  const classes = useStyles()

  return (
    <TableCell
      component="div"
      classes={{
        root: clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle),
      }}
      style={{ justifyContent: 'left' }}>
      <Tooltip title={contentValue} placement="bottom">
        <div
          className={classes.displayContainer}
          data-test={`table-cell-${content.DisplayName?.replace(/\s+/g, '-').toLowerCase()}`}>
          <span className="first"> {splitedValue[0]} </span>
          <span className="second"> {splitedValue[1]} </span>
        </div>
      </Tooltip>
    </TableCell>
  )
}
