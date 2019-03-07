import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import React, { useState } from 'react'
import { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { RootReducerType } from '../store'

/**
 * Comment props interface.
 */
export interface CommentProps {
  avatarUrl?: string
  displayName?: string
  commentBody?: string
}

const mapStateToProps = (state: RootReducerType) => ({
  localication: state.sensenetDocumentViewer.localization,
})

type CommentPropType = Partial<ReturnType<typeof mapStateToProps>> & CommentProps

/**
 * Represents a single comment component.
 * @param {CommentPropType} props
 */
export const Comment: FunctionComponent<CommentPropType> = (props: CommentPropType) => {
  const isLongText = props.commentBody && props.commentBody.length > 160
  const [isOpen, setIsOpen] = useState(!isLongText)
  const showMoreText = (props.localication && props.localication.showMore) || 'Show more'
  const showLessText = (props.localication && props.localication.showLess) || 'Show less'
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
            {isOpen ? showLessText : showMoreText}
          </Button>
        ) : null}
      </CardActions>
    </Card>
  )
}

export default connect(mapStateToProps)(Comment)
