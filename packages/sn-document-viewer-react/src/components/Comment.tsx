import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import React, { useState } from 'react'
import { FunctionComponent } from 'react'

/**
 * Comment props interface.
 */
export interface CommentProps {
  avatarUrl?: string
  displayName?: string
  commentBody?: string
}

/**
 * Represents a single comment component.
 * @param {CommentProps} props
 */
export const Comment: FunctionComponent<CommentProps> = (props: CommentProps) => {
  const isLongText = props.commentBody && props.commentBody.length > 160
  const [isOpen, setIsOpen] = useState(!isLongText)
  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={props.avatarUrl} alt={`Picture of the commenter`} />}
        title={props.displayName}
      />
      <CardContent
        style={{
          height: isOpen ? 'unset' : '78px',
          overflow: 'hidden',
          fontSize: '14px',
          letterSpacing: '0.2px',
          lineHeight: '20px',
          wordWrap: 'break-word',
        }}>
        {props.commentBody}
      </CardContent>
      <CardActions>
        {isLongText ? (
          <Button size="small" onClick={() => setIsOpen(!isOpen)}>
            + Show More
          </Button>
        ) : null}
      </CardActions>
    </Card>
  )
}
