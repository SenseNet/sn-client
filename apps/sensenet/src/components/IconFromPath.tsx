import { PathHelper } from '@sensenet/client-utils'
import React, { memo, useEffect, useState } from 'react'
import { IconOptions } from './Icon'

const IconFromPath = ({
  path,
  options,
  contentPath,
  contentType,
}: {
  path: string
  options: IconOptions
  contentPath: string
  contentType: string
}) => {
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (options.repo.iconCache.has(path)) {
        const cachedData = options.repo.iconCache.get(path) ?? ''
        setIcon(cachedData)
        return
      }
      let svgPath = path

      if (contentType.toLowerCase().endsWith('file')) {
        if (contentPath.toLowerCase().endsWith('.csv')) {
          svgPath = '/Root/System/Images/Icons/colors/csv.svg'
        }
        if (contentPath.toLowerCase().endsWith('.svg')) {
          svgPath = '/Root/System/Images/Icons/colors/file_img.svg'
        }
      }
      const imageUrl = PathHelper.joinPaths(options.repo.configuration.repositoryUrl, svgPath)

      if (path.endsWith('.svg')) {
        const fetchedSvg = await options.repo.fetch(imageUrl, { cache: 'force-cache' })
        if (!fetchedSvg.ok) {
          return
        }
        const svg = await fetchedSvg.text().catch(() => '')
        const resizedsvg = svg
          .replace('width=', 'width="24px" oldwidth=')
          .replace('height=', 'height="24px" oldheight=')
        options.repo.iconCache.set(path, resizedsvg)
        setIcon(resizedsvg)
        return
      }
      if (path !== undefined) {
        options.repo.iconCache.set(path, imageUrl)
      }
      setIcon(imageUrl)
    }
    fetchData()
  }, [contentPath, contentType, options.repo, path])

  if (!icon) {
    return null
  }

  if (path !== undefined && path.endsWith('.svg')) {
    return <span dangerouslySetInnerHTML={{ __html: icon }} style={options.style} className="svgicon" />
  }

  return <img src={icon} alt="icon" style={options.style} />
}

const memoIzedIconFromPath = memo(IconFromPath)

export { memoIzedIconFromPath as IconFromPath }
