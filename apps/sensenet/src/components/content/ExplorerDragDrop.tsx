import { useTheme } from '@material-ui/core/styles'
import { Close, FileCopyOutlined } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentChildrenContext, CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocalization, useSelectionService } from '../../hooks'
import { ExpandItemsContext } from '../tree/Contexts/ExpandedItemsProvider'
import {
  canDropContents,
  CONTENT_DRAG_TYPE,
  ContentDropOperation,
  contentParentPath,
  getContentDragRoots,
  isWithinContent,
} from './content-drag-drop'

type DragState = {
  items: GenericContent[]
  x: number
  y: number
  operation: ContentDropOperation
  target?: GenericContent
  allowed: boolean
}
type TouchChoice = DragState & { target: GenericContent }

export const ExplorerDragDrop: React.FC<{
  onNavigate: (content: GenericContent) => void
  enabled: boolean
  onTouchDrop?: () => void
}> = ({ children, onNavigate, enabled, onTouchDrop }) => {
  const theme = useTheme()
  const choiceRef = useRef<HTMLDivElement>(null)
  const repository = useRepository()
  const parent = useContext(CurrentContentContext)
  const currentChildren = useContext(CurrentChildrenContext)
  const tree = useContext(ExpandItemsContext)
  const selectionService = useSelectionService()
  const localization = useLocalization()
  const logger = useLogger('explorer-drag-drop')
  const [drag, setDrag] = useState<DragState>()
  const [choice, setChoice] = useState<TouchChoice>()
  const [message, setMessage] = useState<{ text: string; error: boolean }>()
  const [busy, setBusy] = useState(false)
  const dragRef = useRef<DragState>()
  const busyRef = useRef(false)
  const latest = useRef({
    parent,
    currentChildren,
    tree,
    localization,
    onNavigate,
    repository,
    logger,
    selectionService,
    onTouchDrop,
  })
  latest.current = {
    parent,
    currentChildren,
    tree,
    localization,
    onNavigate,
    repository,
    logger,
    selectionService,
    onTouchDrop,
  }
  const executeRef = useRef<(state: TouchChoice, operation: ContentDropOperation) => Promise<void>>()
  executeRef.current = async (state, operation) => {
    if (busyRef.current || !canDropContents(state.items, state.target, operation)) return
    busyRef.current = true
    setBusy(true)
    setChoice(undefined)
    setMessage(undefined)
    const { current } = latest
    const words = current.localization.copyMoveContentDialog[operation]
    try {
      const options = { idOrPath: state.items.map((item) => item.Id), targetPath: state.target.Path }
      const response =
        operation === 'copy' ? await current.repository.copy(options) : await current.repository.move(options)
      const result = response.d
      const errors = result.errors || []
      const succeeded = result.results || []
      const succeededIds = new Set(succeeded.map((item) => item.Id))
      if (operation === 'move' && succeeded.length) {
        const successfulSources = state.items.filter((item) => succeededIds.has(item.Id))
        const successfulIds = new Set(successfulSources.map((item) => item.Id))
        current.selectionService.selection.setValue(
          current.selectionService.selection.getValue().filter((item) => !successfulIds.has(item.Id)),
        )
        const movedAncestor = successfulSources.find((item) => isWithinContent(current.parent.Path, item.Path))
        if (movedAncestor) {
          const moved = succeeded.find((item) => item.Id === movedAncestor.Id)
          if (moved && latest.current.parent.Path === current.parent.Path)
            current.onNavigate({
              ...current.parent,
              Path: moved.Path + current.parent.Path.slice(movedAncestor.Path.length),
            })
        }
      }
      const invalidated = new Set([state.target.Path, ...state.items.map((item) => contentParentPath(item.Path))])
      invalidated.forEach((path) => current.tree?.[6](path))
      current.tree?.[1]((expanded) => new Set(expanded))
      if (errors.length) {
        const text = words.copyMultipleFailedNotification
          .replace('{0}', String(errors.length))
          .replace('{1}', state.target.DisplayName || state.target.Name)
        const detail = errors[0]?.error?.message?.value
        setMessage({ text: detail ? `${text} ${detail}` : text, error: true })
        current.logger.warning({ message: text, data: { details: errors } })
      } else {
        const text = words.copyMultipleSucceededNotification
          .replace('{0}', String(succeeded.length))
          .replace('{1}', state.target.DisplayName || state.target.Name)
        setMessage({ text, error: false })
      }
    } catch (error) {
      const text = words.copyMultipleFailedNotification
        .replace('{0}', String(state.items.length))
        .replace('{1}', state.target.DisplayName || state.target.Name)
      setMessage({ text, error: true })
      current.logger.warning({ message: text, data: { error } })
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!enabled) return
    let highlighted: HTMLElement | undefined
    let hoverTimer: ReturnType<typeof setTimeout> | undefined
    let hoverPath = ''
    let touchTimer: ReturnType<typeof setTimeout> | undefined
    let touchStart: { x: number; y: number; element: HTMLElement } | undefined
    let touchActive = false
    let suppressClickUntil = 0
    const parseElement = (element: Element | null): GenericContent | undefined => {
      const value = element?.getAttribute('data-explorer-content')
      if (!value) return
      try {
        const content: GenericContent = JSON.parse(value)
        return (
          latest.current.currentChildren.find((item) => item.Id === content.Id) ||
          (latest.current.parent.Id === content.Id ? latest.current.parent : content)
        )
      } catch {
        return
      }
    }
    const clear = () => {
      clearTimeout(touchTimer)
      touchStart = undefined
      highlighted?.classList.remove('sn-content-drop-target')
      highlighted = undefined
      clearTimeout(hoverTimer)
      hoverPath = ''
      dragRef.current = undefined
      touchActive = false
      setDrag(undefined)
    }
    const start = (element: HTMLElement, x: number, y: number) => {
      if (busyRef.current) return false
      const source = parseElement(element)
      if (!source) return false
      const { current } = latest
      const selected = current.selectionService.selection.getValue()
      const sourceContent = current.currentChildren.find((item) => item.Id === source.Id) || source
      const items = getContentDragRoots(selected.some((item) => item.Id === source.Id) ? selected : [sourceContent])
      if (!items.length || items.some((item) => item.Path.toLowerCase() === '/root')) return false
      const state: DragState = { items, x, y, operation: 'move', allowed: false }
      dragRef.current = state
      setDrag(state)
      setMessage(undefined)
      setChoice(undefined)
      return true
    }
    const over = (element: Element | null, x: number, y: number, operation: ContentDropOperation) => {
      if (!dragRef.current) return
      const targetElement = element?.closest<HTMLElement>('[data-explorer-content]')
      const target = parseElement(targetElement || null)
      const allowed = !!target && canDropContents(dragRef.current.items, target, operation)
      highlighted?.classList.remove('sn-content-drop-target')
      highlighted = allowed ? targetElement || undefined : undefined
      highlighted?.classList.add('sn-content-drop-target')
      const state = { ...dragRef.current, x, y, operation, target, allowed }
      dragRef.current = state
      setDrag(state)
      const nextHover = allowed && targetElement?.matches('[role="treeitem"]') ? target?.Path || '' : ''
      if (nextHover !== hoverPath) {
        clearTimeout(hoverTimer)
        hoverPath = nextHover
        if (nextHover && target)
          hoverTimer = setTimeout(
            () => latest.current.tree?.[1]((expanded) => new Set(expanded).add(String(target.Id))),
            650,
          )
      }
    }
    const onDragStart = (event: DragEvent) => {
      const element = (event.target as Element).closest<HTMLElement>('[data-explorer-drag="true"]')
      if (!element) return
      if (!start(element, event.clientX, event.clientY)) {
        event.preventDefault()
        return
      }
      event.dataTransfer?.setData(CONTENT_DRAG_TYPE, JSON.stringify(dragRef.current!.items.map((item) => item.Id)))
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copyMove'
    }
    const onDragOver = (event: DragEvent) => {
      if (!dragRef.current) return
      event.preventDefault()
      over(event.target as Element, event.clientX, event.clientY, event.ctrlKey || event.altKey ? 'copy' : 'move')
      if (event.dataTransfer)
        event.dataTransfer.dropEffect = dragRef.current.allowed ? dragRef.current.operation : 'none'
    }
    const onDrop = (event: DragEvent) => {
      if (!dragRef.current) return
      event.preventDefault()
      event.stopPropagation()
      over(event.target as Element, event.clientX, event.clientY, event.ctrlKey || event.altKey ? 'copy' : 'move')
      const state = dragRef.current
      clear()
      if (state?.allowed && state.target) void executeRef.current?.({ ...state, target: state.target }, state.operation)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clear()
        setChoice(undefined)
      } else if (dragRef.current)
        over(
          document.elementFromPoint(dragRef.current.x, dragRef.current.y),
          dragRef.current.x,
          dragRef.current.y,
          event.ctrlKey || event.altKey ? 'copy' : 'move',
        )
    }
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || (event.target as Element).closest('button,input,a,[role="separator"]')) return
      const element = (event.target as Element).closest<HTMLElement>('[data-explorer-drag="true"]')
      if (!element) return
      const point = event.touches[0]
      touchStart = { x: point.clientX, y: point.clientY, element }
      touchTimer = setTimeout(() => {
        if (!touchStart) return
        touchActive = start(element, touchStart.x, touchStart.y)
      }, 400)
    }
    const onTouchMove = (event: TouchEvent) => {
      const point = event.touches[0]
      if (!point) return
      if (!touchActive) {
        if (touchStart && Math.hypot(point.clientX - touchStart.x, point.clientY - touchStart.y) > 8) {
          clearTimeout(touchTimer)
          touchStart = undefined
        }
        return
      }
      event.preventDefault()
      over(document.elementFromPoint(point.clientX, point.clientY), point.clientX, point.clientY, 'move')
    }
    const onTouchEnd = (event: TouchEvent) => {
      clearTimeout(touchTimer)
      touchStart = undefined
      if (!touchActive) return
      event.preventDefault()
      suppressClickUntil = Date.now() + 500
      const point = event.changedTouches[0]
      if (point) over(document.elementFromPoint(point.clientX, point.clientY), point.clientX, point.clientY, 'move')
      const state = dragRef.current
      clear()
      if (
        state?.target &&
        (canDropContents(state.items, state.target, 'move') || canDropContents(state.items, state.target, 'copy'))
      ) {
        latest.current.onTouchDrop?.()
        setChoice({ ...state, target: state.target })
      }
    }
    const onClick = (event: MouseEvent) => {
      if (Date.now() < suppressClickUntil && !(event.target as Element).closest('.sn-content-transfer-choice')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    const onContextMenu = (event: MouseEvent) => {
      if (touchActive) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    const scrollTimer = setInterval(() => {
      const state = dragRef.current
      if (!state) return
      let element = document.elementFromPoint(state.x, state.y) as HTMLElement | null
      while (element && element !== document.body) {
        if (element.scrollHeight > element.clientHeight && /auto|scroll/.test(getComputedStyle(element).overflowY)) {
          const bounds = element.getBoundingClientRect()
          const previousScrollTop = element.scrollTop
          if (state.y < bounds.top + 32) element.scrollTop -= 14
          else if (state.y > bounds.bottom - 32) element.scrollTop += 14
          if (element.scrollTop !== previousScrollTop)
            over(document.elementFromPoint(state.x, state.y), state.x, state.y, state.operation)
          break
        }
        element = element.parentElement
      }
    }, 50)
    document.addEventListener('dragstart', onDragStart, true)
    document.addEventListener('dragover', onDragOver, true)
    document.addEventListener('drop', onDrop, true)
    document.addEventListener('dragend', clear, true)
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('keyup', onKeyDown, true)
    document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    document.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    document.addEventListener('touchend', onTouchEnd, { passive: false, capture: true })
    document.addEventListener('touchcancel', clear, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('contextmenu', onContextMenu, true)
    return () => {
      clear()
      clearTimeout(touchTimer)
      clearInterval(scrollTimer)
      document.removeEventListener('dragstart', onDragStart, true)
      document.removeEventListener('dragover', onDragOver, true)
      document.removeEventListener('drop', onDrop, true)
      document.removeEventListener('dragend', clear, true)
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('keyup', onKeyDown, true)
      document.removeEventListener('touchstart', onTouchStart, true)
      document.removeEventListener('touchmove', onTouchMove, true)
      document.removeEventListener('touchend', onTouchEnd, true)
      document.removeEventListener('touchcancel', clear, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('contextmenu', onContextMenu, true)
    }
  }, [enabled])

  useEffect(() => setChoice(undefined), [parent.Path])

  useEffect(() => {
    if (choice) choiceRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
  }, [choice])

  const actionLabel = (operation: ContentDropOperation) => localization.copyMoveContentDialog[operation].copyButton
  return (
    <>
      {children}
      {drag &&
        createPortal(
          <div
            className={`sn-content-drag-preview theme-${theme.palette.type} ${drag.allowed ? '' : 'is-invalid'}`}
            data-test="content-drag-preview"
            role="status"
            style={{
              left: Math.max(8, Math.min(drag.x + 16, window.innerWidth - 260)),
              top: Math.max(8, Math.min(drag.y + 20, window.innerHeight - 68)),
            }}>
            <FileCopyOutlined aria-hidden="true" />
            <span>
              {actionLabel(drag.operation)} · {drag.items.length}
              {drag.target && <> → {drag.target.DisplayName || drag.target.Name}</>}
            </span>
          </div>,
          document.body,
        )}
      {(message || busy) && (
        <div
          className={`sn-content-transfer-status ${message?.error ? 'is-error' : ''}`}
          data-test="content-transfer-status"
          role={message?.error ? 'alert' : 'status'}>
          <span>{busy ? localization.common.loadingContent : message?.text}</span>
          {!busy && (
            <button type="button" onClick={() => setMessage(undefined)} aria-label={localization.forms.close}>
              <Close />
            </button>
          )}
        </div>
      )}
      {choice && (
        <div
          ref={choiceRef}
          className="sn-content-transfer-choice"
          role="dialog"
          aria-label={choice.target.DisplayName || choice.target.Name}
          data-test="content-transfer-choice">
          <span>
            {choice.items.length} → {choice.target.DisplayName || choice.target.Name}
          </span>
          {(['move', 'copy'] as ContentDropOperation[]).map((operation) => (
            <button
              type="button"
              key={operation}
              data-test={`content-drop-${operation}`}
              disabled={!canDropContents(choice.items, choice.target, operation)}
              onClick={() => void executeRef.current?.(choice, operation)}>
              {actionLabel(operation)}
            </button>
          ))}
          <button type="button" onClick={() => setChoice(undefined)} aria-label={localization.forms.close}>
            <Close />
          </button>
        </div>
      )}
    </>
  )
}
