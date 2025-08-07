import { PathHelper } from '@sensenet/client-utils'
import React, { useEffect, useState } from 'react'
import { IconOptions } from './Icon'

const IconFromPath = ({ path, options }: { path: string; options: IconOptions }) => {
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    const fetchIcon = async () => {
      const imageUrl = PathHelper.joinPaths(options.repo.configuration.repositoryUrl, path)

      if (path.endsWith('.svg')) {
        try {
          const response = await options.repo.fetch(imageUrl, { cache: 'force-cache' })
          if (!response.ok) {
            return
          }
          const svg = await response.text()
          const resizedSvg = svg
            .replace('width=', 'width="24px" oldwidth=')
            .replace('height=', 'height="24px" oldheight=')
          setIcon(resizedSvg)
        } catch {
          // handle error silently
        }
      } else {
        setIcon(imageUrl)
      }
    }

    fetchIcon()
  }, [options.repo, path])

  if (!icon) return null

  return path.endsWith('.svg') ? (
    <span dangerouslySetInnerHTML={{ __html: icon }} style={options.style} />
  ) : (
    <img src={icon} alt="icon" style={options.style} />
  )
}

export { IconFromPath }
