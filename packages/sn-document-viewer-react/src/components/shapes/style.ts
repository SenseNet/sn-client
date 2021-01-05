import { DraftCommentMarker } from '@sensenet/client-core'
import styled from 'styled-components'

export const ShapesContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
`
export const MARKER_SIZE = 10

export const CommentMarker = styled('div')<{
  marker: DraftCommentMarker
  zoomRatioStanding: number
  zoomRatioLying: number
  isSelected: boolean
  rotation: number
}>`
  position: absolute;
  top: ${(props) => {
    switch (props.rotation) {
      case 90:
        return `${parseFloat(props.marker.x) * props.zoomRatioLying}px`
      case 180:
        return 'unset'
      case 270:
        return 'unset'
      default:
        return `${parseFloat(props.marker.y) * props.zoomRatioStanding}px`
    }
  }};
  right: ${(props) => {
    switch (props.rotation) {
      case 90:
        return `${parseFloat(props.marker.y) * props.zoomRatioLying}px`
      case 180:
        return `${parseFloat(props.marker.x) * props.zoomRatioStanding}px`
      case 270:
        return 'unset'
      default:
        return 'unset'
    }
  }};
  bottom: ${(props) => {
    switch (props.rotation) {
      case 90:
        return 'unset'
      case 180:
        return `${parseFloat(props.marker.y) * props.zoomRatioStanding}px`
      case 270:
        return `${parseFloat(props.marker.x) * props.zoomRatioLying}px`
      default:
        return 'unset'
    }
  }};
  left: ${(props) => {
    switch (props.rotation) {
      case 90:
        return 'unset'
      case 180:
        return 'unset'
      case 270:
        return `${parseFloat(props.marker.y) * props.zoomRatioLying}px`
      default:
        return `${parseFloat(props.marker.x) * props.zoomRatioStanding}px`
    }
  }};
  width: ${MARKER_SIZE}px;
  height: ${MARKER_SIZE}px;
  border-radius: ${MARKER_SIZE}px;
  background-color: ${(props) =>
    props.isSelected ? props.theme.palette.primary.light : props.theme.palette.primary.dark};
  cursor: pointer;
`
