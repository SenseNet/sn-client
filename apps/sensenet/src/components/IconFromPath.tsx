import { PathHelper } from '@sensenet/client-utils'
import React, { memo, useEffect, useState } from 'react'
import { IconOptions } from './Icon'

type IconFromPathProps = {
  path: string
  options: IconOptions
  contentPath: string
  contentType: string
}

const IconFromPathComponent = ({ path, options, contentPath, contentType }: IconFromPathProps) => {
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    const loadIcon = async () => {
      let svgPath = path

      if (contentType.toLowerCase().endsWith('file')) {
        if (contentPath.toLowerCase().endsWith('.csv')) {
          svgPath = '/icons/csv.svg'
        } else if (contentPath.toLowerCase().endsWith('.svg')) {
          svgPath = '/icons/file_img.svg'
        }
      } else {
        const fileName = path.split('/').pop()
        if (fileName) {
          svgPath = `/icons/${fileName}`
        }
      }

      if (svgPath.endsWith('.svg')) {
        try {
          const response = await options.repo.fetch(svgPath, { cache: 'force-cache' })
          if (!response.ok) return

          const svgText = await response.text()
          const resizedSvg = svgText
            .replace('width=', 'width="24px" oldwidth=')
            .replace('height=', 'height="24px" oldheight=')

          options.repo.iconCache.set(path, resizedSvg)
          setIcon(resizedSvg)
        } catch (e) {
          console.warn('Failed to load SVG icon:', e)
        }
        return
      }

      setIcon(svgPath)
      options.repo.iconCache.set(path, svgPath)
    }

    loadIcon()
  }, [path, contentPath, contentType, options.repo])

  if (!icon) return null

  return path.endsWith('.svg') ? (
    <span dangerouslySetInnerHTML={{ __html: icon }} style={options.style} className="svgicon" />
  ) : (
    <img src={icon} alt="icon" style={options.style} />
  )
}

export const IconFromPath = memo(IconFromPathComponent)
