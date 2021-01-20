import grey from '@material-ui/core/colors/grey'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'

type Props = {
  dimensions: {
    top: string | number | (string & {}) | undefined
    left: string | number | (string & {}) | undefined
    width: string | number | (string & {}) | undefined
    height: string | number | (string & {}) | undefined
  }
}

const useStyles = makeStyles<Theme, Props>(() =>
  createStyles({
    root: {
      top: ({ dimensions }) => dimensions.top,
      left: ({ dimensions }) => dimensions.left,
      width: ({ dimensions }) => dimensions.width,
      height: ({ dimensions }) => dimensions.height,
      position: 'absolute',
      backgroundColor: grey[600],
      opacity: 0.2,
    },
  }),
)

/**
 * Return a styled shape
 * @param dimensions Shape dimensions
 * @returns styled shape
 */
export function ShapeDraft({ dimensions }: Props) {
  const classes = useStyles({ dimensions })

  return <div className={classes.root} tabIndex={0} key={`draft-${dimensions.height}-${dimensions.width}`} />
}
