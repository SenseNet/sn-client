import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { useEffect, useRef, useState } from 'react'
import {
  getFavoriteErrorMessage,
  isFavoriteRequestAborted,
  isFavoriteRootPath,
  loadFavoriteLink,
  toggleFavorite,
} from '../services/favorites'

/** Keeps optional bookmark reads separate from a user-requested write. */
export const useFavoriteState = (content: GenericContent, enabled = true) => {
  const repository = useRepository()
  const logger = useLogger('favorite-state')
  const latest = useRef({ content, repository })
  latest.current = { content, repository }
  const generation = useRef(0)
  const checkController = useRef<AbortController>()
  const busy = useRef(false)
  const mounted = useRef(true)
  const [state, setState] = useState<{ id: number; repository: typeof repository; active: boolean; busy: boolean }>()
  const available =
    Number.isInteger(content.Id) && content.Id > 0 && Boolean(content.Path) && !isFavoriteRootPath(content.Path)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    ++generation.current
    busy.current = false
  }, [content.Id, content.Path, repository])

  useEffect(() => {
    // Closing a menu cancels its read, but must not cancel an already requested save.
    if (!enabled || !available || busy.current) return
    const request = ++generation.current
    const controller = new AbortController()
    checkController.current = controller
    setState({ id: content.Id, repository, active: false, busy: true })
    loadFavoriteLink(repository, { Id: content.Id }, controller.signal)
      .then((link) => {
        if (mounted.current && !controller.signal.aborted && generation.current === request)
          setState({ id: content.Id, repository, active: Boolean(link), busy: false })
      })
      .catch((error) => {
        if (generation.current !== request || controller.signal.aborted || isFavoriteRequestAborted(error)) return
        setState({ id: content.Id, repository, active: false, busy: false })
        const detail = getFavoriteErrorMessage(error)
        logger.warning({ message: `Could not check favorite state.${detail ? ` ${detail}` : ''}`, data: { error } })
      })
    return () => {
      controller.abort()
    }
  }, [available, content.Id, content.Path, enabled, logger, repository])

  const toggle = async () => {
    if (!enabled || !available || busy.current) return
    busy.current = true
    const request = ++generation.current
    const target = latest.current
    checkController.current?.abort()
    setState({ id: target.content.Id, repository: target.repository, active: Boolean(state?.active), busy: true })
    try {
      // Recheck the server instead of deciding from a possibly stale UI star.
      const active = await toggleFavorite(target.repository, target.content)
      if (mounted.current && generation.current === request)
        setState({ id: target.content.Id, repository: target.repository, active, busy: false })
      return active
    } catch (error) {
      if (!isFavoriteRequestAborted(error)) {
        const detail = getFavoriteErrorMessage(error)
        logger.error({
          message: `Could not toggle favorite state.${detail ? ` ${detail}` : ''}`,
          data: { error, content: target.content },
        })
      }
    } finally {
      if (mounted.current && generation.current === request) {
        busy.current = false
        setState((value) => value && { ...value, busy: false })
      }
    }
  }

  const current = state && state.id === content.Id && state.repository === repository ? state : undefined
  return { available, isFavorite: Boolean(current?.active), isBusy: available && (!current || current.busy), toggle }
}
