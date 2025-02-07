import { PathHelper } from '@sensenet/client-utils'
import React, { memo, useEffect, useState } from 'react'
import { IconOptions } from './Icon'

const IconFromPath = ({
  path,
  options,
  contentPath,
  contentType,
}: {
  path: string | undefined
  options: IconOptions
  contentPath: string
  contentType: string
}) => {
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (path !== undefined && options.repo.iconCache.has(path)) {
        const cachedData = options.repo.iconCache.get(path) ?? ''
        setIcon(cachedData)
        return
      }
      let svgPath = '/Root/System/Images/Icons/colors/file.svg'
      if (path !== undefined) svgPath = path
      switch (path) {
        case '/Root/System/Images/Icons/KELERImageIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/file_img.svg'
          break
        case '/Root/System/Images/Icons/workspace.svg':
          svgPath = '/Root/System/Images/Icons/colors/workspace.svg'
          break
        case '/Root/System/Images/Icons/SmartFolderIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/smartfolder.svg'
          break
        case '/Root/System/Images/Icons/SystemFolderIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/systemfolder.svg'
          break
        case '/Root/System/Images/Icons/KELERPageIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/page.svg'
          break
        case '/Root/System/Images/Icons/KELERSiteIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/site.svg'
          break
        case '/Root/System/Images/Icons/KELERFolderIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/folder.svg'
          break
        case '/Root/System/Images/Icons/GroupIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/users.svg'
          break

        case '/Root/System/Images/Icons/site.svg':
          svgPath = '/Root/System/Images/Icons/colors/site.svg'
          break
        case '/Root/System/Images/Icons/KELERLinkIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/link.svg'
          break
        case '/Root/System/Images/Icons/KELERFileIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/file.svg'
          break
        case '/Root/System/Images/Icons/KELERArticleIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/article.svg'
          break
        case '/Root/System/Images/Icons/KELERPageFolderIcon.svg':
          svgPath = '/Root/System/Images/Icons/colors/pages.svg'
          break
        default:
          break
      }
      if (contentType.toLowerCase().endsWith('file')) {
        if (contentPath.toLowerCase().endsWith('.csv')) {
          svgPath = '/Root/System/Images/Icons/colors/csv.svg'
        }
        if (contentPath.toLowerCase().endsWith('.svg')) {
          svgPath = '/Root/System/Images/Icons/colors/file_img.svg'
        }
      }
      const imageUrl = PathHelper.joinPaths(options.repo.configuration.repositoryUrl, svgPath)

      if (path !== undefined && path.endsWith('.svg')) {
        const fetchedSvg = await options.repo.fetch(imageUrl, { cache: 'force-cache' })
        if (!fetchedSvg.ok) {
          return
        }
        const svg = await fetchedSvg.text().catch(() => '')
        const resizedsvg = svg
          .replace('width=', 'width="100%" oldwidth=')
          .replace('height=', 'height="100%" oldheight=')
        options.repo.iconCache.set(svgPath, resizedsvg)
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
