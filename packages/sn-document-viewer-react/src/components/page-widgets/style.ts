import styled from 'styled-components'
import { Comment } from '../../models'

// tslint:disable: completed-docs

export const ShapesContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
`

export const CommentMarker = styled('div')<{ marker: Comment; zoomRatio: number }>`
  position: absolute;
  top: ${props => props.marker.y * props.zoomRatio}px;
  left: ${props => props.marker.x * props.zoomRatio}px;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: green;
`
