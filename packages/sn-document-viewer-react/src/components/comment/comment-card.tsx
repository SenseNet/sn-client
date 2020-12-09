import { Card, createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

type Props = {
  isSelected: boolean
  onClick: () => void
  id: string
  renderChildren: () => JSX.Element
}

const useStyles = makeStyles<Theme, Props>(() =>
  createStyles({
    root: {
      overflow: 'visible',
      backgroundColor: ({ isSelected }) => `${isSelected ? 'rgb(0,0,0,0.1)' : 'rgb(0,0,0,0)'}`,
      width: '100%',
      marginBottom: '10px',
    },
  }),
)

/**
 * Return a styled comment card component
 * @param isSelected A flag for store if comment is selected or not
 * @param onClick Function triggered on click event
 * @param id Id of the comment
 * @param renderChildren Function what returns the wrapped components
 * @returns styled comment card component
 */
export function CommentCard({ isSelected, onClick, id, renderChildren }: Props) {
  const classes = useStyles({ isSelected, onClick, id, renderChildren })

  return (
    <Card className={classes.root} raised={isSelected} id={id} onClick={onClick}>
      {renderChildren()}
    </Card>
  )
}
