import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { Comment as CommentType } from '../../models/Comment'
import { componentType } from '../../services'
import { deleteComment, RootReducerType } from '../../store'
import { setSelectedCommentId } from '../../store/Comments'
import { useLocalization } from '../../hooks'
import { DeleteButton } from './DeleteCommentButton'
import { StyledCard } from './style'

const mapStateToProps = (state: RootReducerType) => ({
  selectedCommentId: state.comments.selectedCommentId,
  host: state.sensenetDocumentViewer.documentState.document.hostName,
})

const mapDispatchToProps = {
  deleteComment,
  setSelectedCommentId,
}

/**
 * Comment prop type
 */
export type CommentPropType = componentType<typeof mapStateToProps, typeof mapDispatchToProps, CommentType>

const MAX_TEXT_LENGTH = 160

/**
 * Represents a single comment component.
 */
export const Comment: React.FC<CommentPropType> = props => {
  const isLongText = props.text && props.text.length > MAX_TEXT_LENGTH
  const [isOpen, setIsOpen] = useState(!isLongText)
  const localization = useLocalization()
  const isSelected = () => props.selectedCommentId === props.id

  return (
    <StyledCard
      id={props.id}
      isSelected={isSelected()}
      raised={isSelected()}
      onClick={() => props.setSelectedCommentId(props.id)}>
      <CardHeader
        avatar={
          props.host === props.createdBy.avatarUrl ? (
            <Avatar />
          ) : (
            <Avatar src={props.createdBy.avatarUrl} alt={localization.avatarAlt} />
          )
        }
        title={props.createdBy.displayName}
      />
      <Collapse in={isOpen} timeout="auto" collapsedHeight={isOpen ? '0px' : '78px'}>
        <CardContent>
          <Typography style={{ wordBreak: 'break-word' }}>{props.text}</Typography>
        </CardContent>
      </Collapse>
      <CardActions>
        {isLongText ? (
          <>
            <Button size="small" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? localization.showLess || 'Show less' : localization.showMore || 'Show more'}
            </Button>
            {isOpen ? <DeleteButton {...props} /> : null}
          </>
        ) : (
          <DeleteButton {...props} />
        )}
      </CardActions>
    </StyledCard>
  )
}
