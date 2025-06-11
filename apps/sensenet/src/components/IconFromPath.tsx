import React, { memo, useEffect, useState } from 'react'
import { IconOptions } from './Icon'

type IconFromPathProps = {
  path: string
  options: IconOptions
  contentPath: string
  contentType: string
}

const IconFromPathComponent = ({ path, options, contentPath, contentType }: IconFromPathProps) => {
  const [iconUrlOrSvg, setIconUrlOrSvg] = useState<string | null>(null)
  const [isInlineSvg, setIsInlineSvg] = useState(false)

  useEffect(() => {
    const loadIcon = async () => {
      const fileName = path.split('/').pop() || ''
      let svgPath = `/icons/${fileName}`

      if (contentType.toLowerCase().endsWith('file')) {
        if (contentPath.toLowerCase().endsWith('.csv')) {
          svgPath = '/icons/csv.svg'
        } else if (contentPath.toLowerCase().endsWith('.svg')) {
          svgPath = '/icons/file_img.svg'
        }
      }

      // For SVGs, fetch and inline them
      if (svgPath.endsWith('.svg')) {
        try {
          const response = await fetch(svgPath, {
            cache: 'no-store',
          })
          if (!response.ok) return
          const svgText = await response.text()
          const resizedSvg = svgText
            .replace('width=', 'width="24px" oldwidth=')
            .replace('height=', 'height="24px" oldheight=')

          setIsInlineSvg(true)
          setIconUrlOrSvg(resizedSvg)
        } catch (e) {
          console.warn('Failed to load SVG:', e)
        }
        return
      }

      // For non-SVG fallback
      setIconUrlOrSvg(svgPath)
      setIsInlineSvg(false)
    }

    loadIcon()
  }, [path, contentPath, contentType])

  if (!iconUrlOrSvg) return null

  return isInlineSvg ? (
    <span dangerouslySetInnerHTML={{ __html: iconUrlOrSvg }} style={options.style} className="svgicon" />
  ) : (
    <img src={iconUrlOrSvg} alt="icon" style={options.style} />
  )
}

export const IconFromPath = memo(IconFromPathComponent)
