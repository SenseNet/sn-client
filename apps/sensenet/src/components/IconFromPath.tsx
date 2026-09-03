import { PathHelper } from '@sensenet/client-utils'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { IconOptions } from './Icon'

// Global cache for icons
const iconCache = new Map<string, string | null>()
const iconRequestCache = new Map<string, Promise<string | null>>()

const loadIcon = (path: string, repo: IconOptions['repo']) => {
  if (iconCache.has(path)) {
    return Promise.resolve(iconCache.get(path)!)
  }

  const pendingRequest = iconRequestCache.get(path)

  if (pendingRequest) {
    return pendingRequest
  }

  const imageUrl = PathHelper.joinPaths(repo.configuration.repositoryUrl, path)
  const request = (async () => {
    if (!path.endsWith('.svg')) {
      iconCache.set(path, imageUrl)
      return imageUrl
    }

    try {
      const response = await repo.fetch(imageUrl, { cache: 'force-cache' })

      if (!response.ok) {
        iconCache.set(path, null)
        return null
      }

      const svg = await response.text()
      const resizedSvg = svg.replace('width=', 'width="24px" oldwidth=').replace('height=', 'height="24px" oldheight=')

      iconCache.set(path, resizedSvg)
      return resizedSvg
    } catch {
      iconCache.set(path, null)
      return null
    }
  })()

  iconRequestCache.set(path, request)
  request.finally(() => iconRequestCache.delete(path))

  return request
}

const IconFromPath = ({ path, options }: { path: string; options: IconOptions }) => {
  const { repo, style } = options
  const [icon, setIcon] = useState<string | null>(() => iconCache.get(path) || null)

  useEffect(() => {
    let isMounted = true

    if (iconCache.has(path)) {
      setIcon(iconCache.get(path) || null)
      return
    }

    setIcon(null)
    loadIcon(path, repo).then((loadedIcon) => {
      if (isMounted) {
        setIcon(loadedIcon)
      }
    })

    return () => {
      isMounted = false
    }
  }, [path, repo])

  // Memoize the rendered output to prevent unnecessary DOM updates
  const renderedIcon = useMemo(() => {
    if (!icon) return null

    return path.endsWith('.svg') ? (
      <span dangerouslySetInnerHTML={{ __html: icon }} style={style} aria-hidden="true" />
    ) : (
      <img src={icon} alt="icon" style={style} />
    )
  }, [icon, path, style])

  return renderedIcon
}

// Memoize the component to prevent re-renders if props are unchanged
export const MemoizedIconFromPath = memo(IconFromPath, (prevProps, nextProps) => {
  return (
    prevProps.path === nextProps.path &&
    prevProps.options.repo === nextProps.options.repo &&
    prevProps.options.style === nextProps.options.style
  )
})

export { IconFromPath }
