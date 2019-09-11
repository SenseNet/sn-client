import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import { useRepository } from '@sensenet/hooks-react'
import { CommentData } from '../../models/Comment'
import { useComments, useLocalization } from '../../hooks'
import { DeleteButton } from './DeleteCommentButton'
import { StyledCard } from './style'

/**
 * Comment prop type
 */
export interface CommentProps {
  comment: CommentData
}

const MAX_TEXT_LENGTH = 160

/**
 * Represents a single comment component.
 */
export const Comment: React.FC<CommentProps> = props => {
  const isLongText = props.comment.text && props.comment.text.length > MAX_TEXT_LENGTH
  const [isOpen, setIsOpen] = useState(!isLongText)
  const localization = useLocalization()
  const comments = useComments()
  const repo = useRepository()

  const [isSelected, setIsSelected] = useState(props.comment.id === comments.activeCommentId)

  useEffect(() => {
    setIsSelected(props.comment.id === comments.activeCommentId)
  }, [comments.activeCommentId, props.comment.id])

  return (
    <StyledCard id={props.comment.id} isSelected={isSelected} raised={isSelected} onClick={comments.setActiveComment}>
      <CardHeader
        avatar={
          repo.configuration.repositoryUrl === props.comment.createdBy.avatarUrl ? (
            <Avatar />
          ) : (
            <Avatar src={props.comment.createdBy.avatarUrl} alt={localization.avatarAlt} />
          )
        }
        title={props.comment.createdBy.displayName}
      />
      <Collapse in={isOpen} timeout="auto" collapsedHeight={isOpen ? '0px' : '78px'}>
        <CardContent>
          <Typography style={{ wordBreak: 'break-word' }}>{props.comment.text}</Typography>
        </CardContent>
      </Collapse>
      <CardActions>
        {isLongText ? (
          <>
            <Button size="small" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? localization.showLess || 'Show less' : localization.showMore || 'Show more'}
            </Button>
            {isOpen ? <DeleteButton comment={props.comment} /> : null}
          </>
        ) : (
          <DeleteButton comment={props.comment} />
        )}
      </CardActions>
    </StyledCard>
  )
}
