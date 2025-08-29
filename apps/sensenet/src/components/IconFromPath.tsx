import { PathHelper } from '@sensenet/client-utils'
import React, { useEffect, useState } from 'react'
import { IconOptions } from './Icon'

const IconFromPath = ({ path, options }: { path: string; options: IconOptions }) => {
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchIcon = async () => {
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
            setIcon(resizedSvg)
          }
        } catch (err) {
          if ((err as any).name !== 'AbortError') {
            console.error('Failed to load SVG:', err)
          }
        }
      } else {
        if (!signal.aborted) {
          setIcon(imageUrl)
        }
      }
    }

    fetchIcon()

    return () => {
      controller.abort()
    }
  }, [options.repo, path])

  if (!icon) return null

  return path.endsWith('.svg') ? (
    <span dangerouslySetInnerHTML={{ __html: icon }} style={options.style} aria-hidden="true" />
  ) : (
    <img src={icon} alt="icon" style={options.style} />
  )
}

export { IconFromPath }
