import { Highlight, Shapes } from '@sensenet/client-core'
import { Button, ClickAwayListener, createStyles, makeStyles, Popper, Theme } from '@material-ui/core'
import yellow from '@material-ui/core/colors/yellow.js'
import { Delete } from '@material-ui/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalization } from '../..'
import { useDocumentPermissions, useViewerState } from '../../hooks'

type Props = {
  shape: Highlight
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (
    clientRect?: DOMRect,
  ) =>
    | {
        w: number
        h: number
      }
    | undefined
  dimensions: {
    top: string | number | (string & {}) | undefined
    left: string | number | (string & {}) | undefined
    width: string | number | (string & {}) | undefined
    height: string | number | (string & {}) | undefined
  }
  zoomRatio: number
  removeShape: (shapeType: keyof Shapes, guid: string) => void
  rotationDegree: number
}

const useStyles = makeStyles<
  Theme,
  Props & {
    permissions: {
      canEdit: boolean
      canHideRedaction: boolean
      canHideWatermark: boolean
    }
  }
>((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      resize: ({ permissions, rotationDegree }) => (permissions.canEdit && rotationDegree === 0 ? 'both' : 'none'),
      overflow: 'auto',
      backgroundColor: yellow[600],
      opacity: 0.5,
    },
    button: {
      backgroundColor: theme.palette.error.light,
    },
  }),
)

/**
 * Return a styled highlight component
 * @param shape Shape attributes
 * @param permissions Permissions of the current user
 * @param dimensions Shape dimensions
 * @param zoomRatio Zoom ratio
 * @param onDragStart Function triggered on drag event
 * @param onResized Function triggered on resized event
 * @param removeShape Function triggered on delete
 * @returns styled highlight component
 */

export const ShapeHighlight: React.FC<Props> = (props) => {
  const permissions = useDocumentPermissions()
  const classes = useStyles({ ...props, permissions })
  const localization = useLocalization()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'highlight-delete' : undefined
  const highlightElement = useRef<HTMLDivElement>(null)
  const viewerState = useViewerState()
  const { updateState } = viewerState

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (viewerState.currentlyResizedElementId === props.shape.guid) {
        updateState({ currentlyResizedElementId: undefined })
        const newSize = props.onResized(highlightElement.current?.getClientRects()[0])
        console.log('NEWSIZE:', newSize)
        if (highlightElement.current && newSize) {
          highlightElement.current.style.width = `${newSize.w * props.zoomRatio}px`
          highlightElement.current.style.height = `${newSize.h * props.zoomRatio}px`
        }
      }
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [props, updateState, viewerState.currentlyResizedElementId])

  useEffect(() => {
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          console.log('MUTATION:', mutation)
          updateState({ currentlyResizedElementId: props.shape.guid })
        }
      })
    })

    highlightElement.current && mutationObserver.observe(highlightElement.current, { attributes: true })
    return () => mutationObserver.disconnect()
  }, [props.shape.guid, updateState])

  const onRightClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <>
      <div
        className={classes.root}
        tabIndex={0}
        draggable={permissions.canEdit}
        onDragStart={props.onDragStart}
        onContextMenu={onRightClick}
        ref={highlightElement}
        style={{
          top: props.dimensions.top,
          left: props.dimensions.left,
          width: `${props.dimensions.width}px`,
          height: `${props.dimensions.height}px`,
        }}
      />
      <Popper id={id} open={open} anchorEl={anchorEl} placement="right-start">
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Button
            variant="contained"
            className={classes.button}
            onMouseUp={() => props.removeShape('highlights', props.shape.guid)}
            startIcon={<Delete scale={props.zoomRatio} />}>
            {localization.delete}
          </Button>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
