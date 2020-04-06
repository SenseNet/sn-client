import styled from 'styled-components'
import { DraftCommentMarker } from '../../models'

export const ShapesContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
`
export const MARKER_SIZE = 10

export const CommentMarker = styled('div')<{ marker: DraftCommentMarker; zoomRatio: number; isSelected: boolean }>`
  position: absolute;
  top: ${props => parseFloat(props.marker.y) * props.zoomRatio}px;
  left: ${props => parseFloat(props.marker.x) * props.zoomRatio}px;
  width: ${MARKER_SIZE}px;
  height: ${MARKER_SIZE}px;
  border-radius: ${MARKER_SIZE}px;
  background-color: ${props =>
    props.isSelected ? props.theme.palette.primary.light : props.theme.palette.primary.dark};
  cursor: pointer;
`
