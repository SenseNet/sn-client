import { PathHelper } from '@sensenet/client-utils'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { IconOptions } from './Icon'

// Global cache for icons
const iconCache = new Map<string, string>()

const IconFromPath = ({ path, options }: { path: string; options: IconOptions }) => {
  const [icon, setIcon] = useState<string | null>(iconCache.get(path) || null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchIcon = async () => {
      // Check cache first
      if (iconCache.has(path)) {
        setIcon(iconCache.get(path)!)
        return
      }

      const imageUrl = PathHelper.joinPaths(options.repo.configuration.repositoryUrl, path)

      if (path.endsWith('.svg')) {
        try {
          const response = await options.repo.fetch(imageUrl, { cache: 'force-cache', signal })
          if (!response.ok) return
          const svg = await response.text()
          const resizedSvg = svg
            .replace('width=', 'width="24px" oldwidth=')
            .replace('height=', 'height="24px" oldheight=')
          if (!signal.aborted) {
            iconCache.set(path, resizedSvg) // Store in cache
            setIcon(resizedSvg)
          }
        } catch (err) {
          if ((err as any).name !== 'AbortError') {
            console.error('Failed to load SVG:', err)
          }
        }
      } else {
        if (!signal.aborted) {
          iconCache.set(path, imageUrl) // Store in cache
          setIcon(imageUrl)
        }
      }
    }

    if (!icon) {
      fetchIcon()
    }

    return () => {
      controller.abort()
    }
  }, [path, options.repo, icon])

  // Memoize the rendered output to prevent unnecessary DOM updates
  const renderedIcon = useMemo(() => {
    if (!icon) return null

    return path.endsWith('.svg') ? (
      <span dangerouslySetInnerHTML={{ __html: icon }} style={options.style} aria-hidden="true" />
    ) : (
      <img src={icon} alt="icon" style={options.style} />
    )
  }, [icon, path, options.style])

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
