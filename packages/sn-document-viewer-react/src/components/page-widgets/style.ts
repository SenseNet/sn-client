import styled from 'styled-components'
import { MarkerCoordinates } from '../../models'

// tslint:disable: completed-docs

export const ShapesContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
`
export const MARKER_SIZE = 10

export const CommentMarker = styled('div')<{ marker: MarkerCoordinates; zoomRatio: number; isSelected: boolean }>`
  position: absolute;
  top: ${props => props.marker.y * props.zoomRatio}px;
  left: ${props => props.marker.x * props.zoomRatio}px;
  width: ${MARKER_SIZE}px;
  height: ${MARKER_SIZE}px;
  border-radius: ${MARKER_SIZE}px;
  background-color: ${props => (props.isSelected ? 'chartreuse' : 'green')};
  cursor: pointer;
`
