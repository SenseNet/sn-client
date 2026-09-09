import { makeStyles, Theme } from '@material-ui/core/styles'
import { ChevronRight, StarBorder } from '@material-ui/icons'
import { ODataFieldParameter } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository, useRepositoryEvents } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization, usePersonalSettings, useSelectionService, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl, getUrlForContent } from '../../services'
import {
  isContentLink,
  isFavoriteRequestAborted,
  isFavoriteRootPath,
  loadFavoriteLinks,
  resolveContentLinkTarget,
} from '../../services/favorites'
import { contentDragAttributes } from '../content/content-drag-drop'
import { ContentItemPreview } from '../content/ContentItemPreview'
import { getTreeItemLabel } from './tree-helpers'

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    margin: '0 10px',
    padding: '8px 0 10px',
    borderBottom: `1px solid var(--sn-explorer-border, ${theme.palette.divider})`,
    color: `var(--sn-explorer-text, ${theme.palette.text.primary})`,
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: 32,
    padding: '0 8px 0 4px',
    gap: 8,
    border: 0,
    borderRadius: 7,
    background: 'transparent',
    color: `var(--sn-explorer-muted, ${theme.palette.text.secondary})`,
    font: 'inherit',
    fontSize: 12,
    fontWeight: 600,
    textAlign: 'left',
    cursor: 'pointer',
    '& > svg:first-child': { width: 16, height: 16, flexShrink: 0, transition: 'transform 120ms ease' },
    '& > svg:nth-child(2)': { width: 18, height: 18, flexShrink: 0 },
    '&:hover': { backgroundColor: `var(--sn-explorer-hover, ${theme.palette.action.hover})` },
    '&:focus-visible': { outline: `2px solid var(--sn-explorer-accent, ${theme.palette.primary.main})` },
  },
  list: { listStyle: 'none', margin: '2px 0 0', padding: 0 },
  item: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0,
    height: 34,
    margin: '2px 0',
    padding: '0 8px 0 26px',
    gap: 8,
    border: 0,
    borderRadius: 7,
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    fontSize: 13,
    lineHeight: '20px',
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': { backgroundColor: `var(--sn-explorer-hover, ${theme.palette.action.hover})` },
    '&[aria-current="location"]': {
      backgroundColor: `var(--sn-explorer-selected, ${theme.palette.action.selected})`,
    },
    '&:focus-visible': {
      outline: `2px solid var(--sn-explorer-accent, ${theme.palette.primary.main})`,
      outlineOffset: -2,
    },
  },
  icon: { display: 'flex', width: 20, height: 20, flexShrink: 0, '& svg, & img': { width: 20, height: 20 } },
  name: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
}))

type Favorite = { link: GenericContent; target: GenericContent }
type Props = { activeItemPath: string; editMode: boolean; onNavigate: (content: GenericContent) => void }
const normalizePath = (path: string) => path.replace(/\/+$/, '').toLowerCase()

export const FavoritesTree = ({ activeItemPath, editMode, onNavigate }: Props) => {
  const classes = useStyles()
  const repository = useRepository()
  const events = useRepositoryEvents()
  const logger = useLogger('tree-favorites')
  const history = useHistory()
  const snRoute = useSnRoute()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const personalSettings = usePersonalSettings()
  const selectionService = useSelectionService()
  const localization = useLocalization()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [expanded, setExpanded] = useState(true)
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let current = true
    const controller = new AbortController()
    setLoading(true)
    const load = async () => {
      try {
        // Reading the section must never create the favorites container.
        const links = await loadFavoriteLinks(repository, controller.signal)
        const resolved = await Promise.allSettled(
          links.filter(isContentLink).map(async (link) => {
            const target = await resolveContentLinkTarget(repository, link, controller.signal)
            return { link, target }
          }),
        )
        if (current) {
          setFavorites(
            resolved.flatMap((result) =>
              result.status === 'fulfilled' &&
              result.value.target.Id &&
              result.value.target.Path &&
              !isContentLink(result.value.target)
                ? [result.value]
                : [],
            ),
          )
        }
      } catch (error) {
        if (!current || controller.signal.aborted || isFavoriteRequestAborted(error)) return
        setFavorites([])
        logger.warning({ message: 'Could not load favorites.', data: { error } })
      } finally {
        if (current) setLoading(false)
      }
    }
    void load()
    return () => {
      current = false
      controller.abort()
    }
  }, [logger, reload, repository])

  useEffect(() => {
    const refresh = () => setReload((value) => value + 1)
    const subscriptions = [
      events.onContentCreated.subscribe(({ content }) => {
        if (content.Path && isFavoriteRootPath(content.Path)) refresh()
      }),
      events.onContentCopied.subscribe(refresh),
      events.onContentMoved.subscribe(refresh),
      events.onContentModified.subscribe(refresh),
      events.onContentDeleted.subscribe(refresh),
    ]
    return () => subscriptions.forEach((subscription) => subscription.dispose())
  }, [events])

  const navigate = async ({ link, target }: Favorite) => {
    try {
      const resolved = await resolveContentLinkTarget(repository, { ...link, Link: target } as GenericContent)
      selectionService.activeContent.setValue(resolved)
      if (!editMode && resolved.IsFolder && snRoute.path && PathHelper.isInSubTree(resolved.Path, snRoute.path)) {
        onNavigate(resolved)
        return
      }
      const expandedTarget = await repository.load<GenericContent>({
        idOrPath: resolved.Id || resolved.Path,
        oDataOptions: { expand: ['Actions'] as ODataFieldParameter<GenericContent> },
      })
      const options = { content: expandedTarget.d, repository, uiSettings, location: history.location, snRoute }
      history.push(editMode ? getUrlForContent({ ...options, action: 'edit' }) : getPrimaryActionUrl(options))
    } catch (error) {
      logger.warning({ message: 'Could not open favorite.', data: { error, content: target } })
    }
  }

  return (
    <section
      className={classes.section}
      aria-label={localization.drawer.titles.Favorites}
      aria-busy={loading}
      data-test="tree-favorites-section">
      <button
        type="button"
        className={classes.heading}
        aria-expanded={expanded}
        data-test="tree-favorites-toggle"
        onClick={() => setExpanded((value) => !value)}>
        <ChevronRight style={{ transform: expanded ? 'rotate(90deg)' : undefined }} aria-hidden="true" />
        <StarBorder aria-hidden="true" />
        {localization.drawer.titles.Favorites}
      </button>
      {expanded && favorites.length > 0 && (
        <ul className={classes.list}>
          {favorites.map((favorite) => {
            const name = getTreeItemLabel(favorite.target, personalSettings.preferDisplayName)
            return (
              <li key={favorite.link.Id}>
                <button
                  {...contentDragAttributes(favorite.target, false)}
                  type="button"
                  className={classes.item}
                  title={favorite.target.Path}
                  aria-current={
                    normalizePath(activeItemPath) === normalizePath(favorite.target.Path) ? 'location' : undefined
                  }
                  data-test="tree-favorite-item"
                  data-favorite-id={favorite.link.Id}
                  data-content-id={favorite.target.Id}
                  onClick={() => void navigate(favorite)}>
                  <span className={classes.icon} aria-hidden="true">
                    <ContentItemPreview content={favorite.target} size={20} thumbnails={false} />
                  </span>
                  <span className={classes.name}>{name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
