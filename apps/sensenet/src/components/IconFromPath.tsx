import { PathHelper } from '@sensenet/client-utils'
import React, { memo, useEffect, useState } from 'react'
import { IconOptions } from './Icon'

const IconFromPath = ({ path, options }: { path: string; options: IconOptions }) => {
  const [icon, setIcon] = useState<string | null>(null)

  const setResizedIcon = (svg: string) => {
    setIcon(svg.replace('width=', 'width="24px" oldwidth=').replace('height=', 'height="24px" oldheight='))
  }

  useEffect(() => {
    async function fetchData() {
      if (options.repo.iconCache.has(path)) {
        const cachedData = options.repo.iconCache.get(path) ?? ''
        setResizedIcon(cachedData)
        return
      }

      const imageUrl = PathHelper.joinPaths(options.repo.configuration.repositoryUrl, path)

      if (path.endsWith('.svg')) {
        const fetchedSvg = await options.repo.fetch(imageUrl, { cache: 'force-cache' })
        if (!fetchedSvg.ok) {
          return
        }
        const svg = await fetchedSvg.text().catch(() => '')
        options.repo.iconCache.set(path, svg)
        setResizedIcon(svg)
        return
      }

      options.repo.iconCache.set(path, imageUrl)
      setResizedIcon(imageUrl)
    }
    fetchData()
  }, [options.repo, path])

  if (!icon) {
    return null
  }

  if (path.endsWith('.svg')) {
    return <span dangerouslySetInnerHTML={{ __html: icon }} style={options.style} />
  }

  return <img src={icon} alt="icon" style={options.style} />
}

const memoIzedIconFromPath = memo(IconFromPath)

export { memoIzedIconFromPath as IconFromPath }
