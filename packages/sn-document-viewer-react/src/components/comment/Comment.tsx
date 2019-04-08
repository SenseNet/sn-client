import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import React, { FunctionComponent, useState } from 'react'
import { connect } from 'react-redux'
import { Comment as CommentType } from '../../models/Comment'
import { componentType } from '../../services'
import { deleteComment, RootReducerType } from '../../store'
import { setSelectedCommentId } from '../../store/Comments'
import { DeleteButton } from './DeleteCommentButton'
import { StyledCard } from './style'

const mapStateToProps = (state: RootReducerType) => ({
  localization: state.sensenetDocumentViewer.localization,
  selectedCommentId: state.comments.selectedCommentId,
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
export const CommentComponent: FunctionComponent<CommentPropType> = props => {
  const isLongText = props.text && props.text.length > MAX_TEXT_LENGTH
  const [isOpen, setIsOpen] = useState(!isLongText)
  const isSelected = () => props.selectedCommentId === props.id

  return (
    <StyledCard
      id={props.id}
      isSelected={isSelected()}
      raised={isSelected()}
      onClick={() => props.setSelectedCommentId(props.id)}>
      <CardHeader
        avatar={<Avatar src={props.createdBy.avatarUrl} alt={props.localization.avatarAlt} />}
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
              {isOpen ? props.localization.showLess || 'Show less' : props.localization.showMore || 'Show more'}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentComponent)
