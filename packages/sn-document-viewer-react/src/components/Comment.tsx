import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import React, { useState } from 'react'
import { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { RootReducerType } from '../store'

/**
 * User properties that created the comment
 */
export interface CreatedByUser {
  id: number
  path: string
  userName: string
  displayName: string
  avatarUrl: string
}

/**
 * Comment props interface.
 */
export interface CommentProps {
  id: string
  createdBy: CreatedByUser
  text: string
  delete: (id: string) => void
}

const mapStateToProps = (state: RootReducerType) => ({
  localization: state.sensenetDocumentViewer.localization,
})

const StyledCardContent = styled(CardContent)`
  font-size: 14px;
  letter-spacing: 0.2px;
  line-height: 20px;
  word-wrap: break-word;
`
const DeleteButton = (props: CommentPropType) => (
  <Button size="small" onClick={() => props.delete(props.id)}>
    {props.localization.delete || 'delete'}
  </Button>
)

type CommentPropType = ReturnType<typeof mapStateToProps> & CommentProps
/**
 * Represents a single comment component.
 * @param {CommentPropType} props
 */
export const Comment: FunctionComponent<CommentPropType> = (props: CommentPropType) => {
  const isLongText = props.text && props.text.length > 160
  const [isOpen, setIsOpen] = useState(!isLongText)
  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={props.createdBy.avatarUrl} alt={props.localization.avatarAlt} />}
        title={props.createdBy.displayName}
      />
      <Collapse in={isOpen} timeout="auto" collapsedHeight={isOpen ? '0px' : '78px'}>
        <StyledCardContent>{props.text}</StyledCardContent>
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
    </Card>
  )
}

export default connect(mapStateToProps)(Comment)
