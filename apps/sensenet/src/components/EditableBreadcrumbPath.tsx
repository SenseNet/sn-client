import { ArrowForward, EditOutlined, FolderOutlined, InsertDriveFileOutlined } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocalization, usePersonalSettings } from '../hooks'
import { findExplorerPath, loadExplorerPathSuggestions, normalizeExplorerPath } from '../services/explorer-path-service'

type Props = {
  path: string
  currentFolder: string
  onNavigate: (content: GenericContent) => void
  children: ReactNode
}
let nextAddressId = 0

export const EditableBreadcrumbPath = ({ path, currentFolder, onNavigate, children }: Props) => {
  const repository = useRepository()
  const localization = useLocalization().contentViews
  const settings = usePersonalSettings()
  const [id] = useState(() => `explorer-path-${++nextAddressId}`)
  const host = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const openRequest = useRef<AbortController>()
  const restoreFocus = useRef(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(path)
  const [suggestions, setSuggestions] = useState<{ value: string; items: GenericContent[] }>()
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState('')
  const [suggestionError, setSuggestionError] = useState(false)
  const [popupStyle, setPopupStyle] = useState<CSSProperties>()
  const items = suggestions && suggestions.value === draft ? suggestions.items : []

  const close = () => {
    openRequest.current?.abort()
    setEditing(false)
    setOpening(false)
  }
  const edit = () => {
    setDraft(path || currentFolder || '/Root')
    setError('')
    setActive(-1)
    setEditing(true)
  }

  useEffect(() => {
    close()
    return () => openRequest.current?.abort()
    // Only a change of location/repository ends an editing session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, repository])

  useEffect(() => {
    if (editing) {
      input.current?.focus()
      input.current?.select()
    } else if (restoreFocus.current) {
      restoreFocus.current = false
      host.current?.querySelector<HTMLButtonElement>('[data-test="explorer-path-edit"]')?.focus()
    }
  }, [editing])

  useEffect(() => {
    if (!editing) return
    const controller = new AbortController()
    setSuggestions(undefined)
    setActive(-1)
    setLoading(true)
    setSuggestionError(false)
    const timer = window.setTimeout(() => {
      loadExplorerPathSuggestions(repository, draft, currentFolder, controller.signal, settings.showHiddenItems)
        .then((contents) => {
          if (!controller.signal.aborted) setSuggestions({ value: draft, items: contents })
        })
        .catch(() => {
          if (!controller.signal.aborted) setSuggestionError(true)
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 180)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [currentFolder, draft, editing, repository, settings.showHiddenItems])

  useLayoutEffect(() => {
    if (!editing) return
    const reposition = () => {
      const element = host.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const colors = getComputedStyle(element)
      const visibleBottom = window.visualViewport
        ? window.visualViewport.offsetTop + window.visualViewport.height
        : window.innerHeight
      const width = Math.min(Math.max(rect.width, 280), window.innerWidth - 16)
      setPopupStyle({
        position: 'fixed',
        left: Math.min(Math.max(8, rect.left), window.innerWidth - width - 8),
        top: rect.bottom + 5,
        width,
        maxHeight: Math.max(80, visibleBottom - rect.bottom - 13),
        '--sn-address-surface': colors.getPropertyValue('--sn-explorer-surface') || '#fff',
        '--sn-address-text': colors.getPropertyValue('--sn-explorer-text') || '#202733',
        '--sn-address-muted': colors.getPropertyValue('--sn-explorer-muted') || '#707a88',
        '--sn-address-border': colors.getPropertyValue('--sn-explorer-border') || '#dce2e8',
        '--sn-address-hover': colors.getPropertyValue('--sn-explorer-hover') || '#eef1f5',
        '--sn-address-accent': colors.getPropertyValue('--sn-explorer-accent') || '#087cdd',
      } as CSSProperties)
    }
    const dismiss = (event: PointerEvent) => {
      if (!host.current?.contains(event.target as Node) && !popup.current?.contains(event.target as Node)) close()
    }
    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    document.addEventListener('pointerdown', dismiss)
    window.visualViewport?.addEventListener('resize', reposition)
    window.visualViewport?.addEventListener('scroll', reposition)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
      document.removeEventListener('pointerdown', dismiss)
      window.visualViewport?.removeEventListener('resize', reposition)
      window.visualViewport?.removeEventListener('scroll', reposition)
    }
  }, [editing])

  useEffect(() => {
    popup.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const complete = (item: GenericContent) => {
    openRequest.current?.abort()
    setOpening(false)
    setError('')
    setDraft(`${item.Path}${item.IsFolder ? '/' : ''}`)
    setActive(-1)
    input.current?.focus()
  }

  const open = async () => {
    if (opening) return
    const selected = items[active]
    const target = normalizeExplorerPath(selected?.Path || draft, currentFolder)
    if (!target) {
      setError(localization.pathNotFound)
      return
    }
    const controller = new AbortController()
    openRequest.current?.abort()
    openRequest.current = controller
    setOpening(true)
    setError('')
    try {
      const content = await findExplorerPath(repository, target, controller.signal)
      if (controller.signal.aborted) return
      if (!content) {
        setError(localization.pathNotFound)
        return
      }
      onNavigate(content)
      close()
    } catch (loadError) {
      if (!controller.signal.aborted) {
        const status = (loadError as { statusCode?: number }).statusCode
        setError(status === 404 || status === 403 ? localization.pathNotFound : localization.pathLoadFailed)
      }
    } finally {
      if (!controller.signal.aborted) setOpening(false)
    }
  }

  return (
    <div
      className={`sn-explorer-location__path${editing ? ' sn-explorer-location__path--editing' : ''}`}
      data-test="editable-breadcrumb-path"
      ref={host}
      onClick={(event) => {
        if (!editing && !(event.target as Element).closest('button, a, input')) edit()
      }}>
      {editing ? (
        <form
          className="sn-explorer-path-form"
          onSubmit={(event) => {
            event.preventDefault()
            void open()
          }}>
          <input
            ref={input}
            type="text"
            role="combobox"
            value={draft}
            aria-label={localization.locationPath}
            aria-autocomplete="list"
            aria-expanded={Boolean(popupStyle)}
            aria-controls={`${id}-suggestions`}
            aria-activedescendant={items[active] ? `${id}-${items[active].Id}` : undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : `${id}-help`}
            autoComplete="off"
            spellCheck={false}
            data-test="explorer-path-input"
            onChange={(event) => {
              openRequest.current?.abort()
              setOpening(false)
              setError('')
              setDraft(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) {
                if (event.key === 'Enter') event.preventDefault()
                return
              }
              if (event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                restoreFocus.current = true
                close()
              } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                const direction = event.key === 'ArrowDown' ? 1 : -1
                setActive((current) =>
                  items.length
                    ? current < 0
                      ? direction > 0
                        ? 0
                        : items.length - 1
                      : (current + direction + items.length) % items.length
                    : -1,
                )
              } else if (event.key === 'Tab' && !event.shiftKey && items.length) {
                event.preventDefault()
                complete(items[active >= 0 ? active : 0])
              }
            }}
          />
          <button
            type="submit"
            className="sn-explorer-location__nav-button"
            disabled={opening}
            aria-label={localization.goToLocation}
            data-test="explorer-path-go">
            <ArrowForward aria-hidden="true" />
          </button>
        </form>
      ) : (
        <>
          {children}
          <button
            type="button"
            className="sn-explorer-location__nav-button"
            onClick={edit}
            aria-label={localization.editLocation}
            title={localization.editLocation}
            data-test="explorer-path-edit">
            <EditOutlined aria-hidden="true" />
          </button>
        </>
      )}
      {editing &&
        popupStyle &&
        createPortal(
          <div ref={popup} style={popupStyle} className="sn-explorer-path-popup" data-test="explorer-path-popup">
            {error && (
              <div id={`${id}-error`} className="sn-explorer-path-error" role="alert" data-test="explorer-path-error">
                {error}
              </div>
            )}
            <div role="listbox" aria-label={localization.pathSuggestions} id={`${id}-suggestions`}>
              {items.map((item, index) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={active === index}
                  id={`${id}-${item.Id}`}
                  key={item.Id}
                  tabIndex={-1}
                  className="sn-explorer-path-option"
                  data-test="explorer-path-suggestion"
                  data-path={item.Path}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => complete(item)}>
                  {item.IsFolder ? (
                    <FolderOutlined aria-hidden="true" />
                  ) : (
                    <InsertDriveFileOutlined aria-hidden="true" />
                  )}
                  <span>
                    <span className="sn-explorer-path-name">{item.Name}</span>
                    {item.DisplayName && item.DisplayName !== item.Name && (
                      <span className="sn-explorer-path-description">{item.DisplayName}</span>
                    )}
                  </span>
                  {item.IsFolder && (
                    <span className="sn-explorer-path-slash" aria-hidden="true">
                      /
                    </span>
                  )}
                </button>
              ))}
            </div>
            {!items.length && (
              <div className="sn-explorer-path-message" role="status">
                {loading
                  ? localization.loading
                  : suggestionError
                  ? localization.pathSuggestionsFailed
                  : localization.noPathSuggestions}
              </div>
            )}
            <div id={`${id}-help`} className="sn-explorer-path-help">
              {opening ? localization.loading : localization.pathHelp}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
