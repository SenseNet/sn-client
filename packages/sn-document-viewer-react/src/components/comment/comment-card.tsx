import { Card, createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

type Props = {
  active: boolean
  onClick: () => void
}

const useStyles = makeStyles<Theme, Props>(() =>
  createStyles({
    root: {
      overflow: 'visible',
      backgroundColor: ({ active }) => `${active ? 'rgb(0,0,0,0.1)' : 'rgb(0,0,0,0)'}`,
      width: '100%',
      marginBottom: '10px',
    },
  }),
)

/**
 * Return a styled comment card component
 * @param isSelected A flag for store if comment is selected or not
 * @param onClick Function triggered on click event
 * @returns styled comment card component
 */
export const CommentCard: React.FC<Props> = (props) => {
  const classes = useStyles(props)

  return (
    <Card className={classes.root} raised={props.active} onClick={props.onClick}>
      {props.children}
    </Card>
  )
}
