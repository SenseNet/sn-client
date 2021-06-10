import { deepMerge } from '@sensenet/client-utils'
import React, { createContext, FC, useEffect, useState } from 'react'

export const defaultLocalization = {
  common: {
    cancel: 'Cancel',
  },
  menubar: {
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    blockquote: 'Block quote',
    code: 'Code',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    alignJustify: 'Align justify',
    bulletList: 'Bullet list',
    orderedList: 'Ordered list',
    link: 'Link',
    clearFormat: 'Clear format',
    undo: 'Undo',
    redo: 'Redo',
  },
  bubbleMenu: {
    removeImage: 'remove image',
    removeLink: 'remove link',
  },
  imageControl: {
    title: 'Insert image',
    submit: 'Insert',
  },
  linkControl: {
    title: 'Insert a link',
    url: 'Url',
    openInNewTab: 'Open link in a new tab',
    submit: 'Insert',
  },
}

export const LocalizationContext = createContext(defaultLocalization)

export type LocalizationType = typeof defaultLocalization

interface LocalizationProviderProps {
  localization?: Partial<LocalizationType>
}

export const LocalizationProvider: FC<LocalizationProviderProps> = (props) => {
  const [currentValue, setCurrentValue] = useState(deepMerge(defaultLocalization, props.localization))

  useEffect(() => {
    setCurrentValue(deepMerge(defaultLocalization, props.localization))
  }, [props.localization])

  return <LocalizationContext.Provider value={currentValue}>{props.children}</LocalizationContext.Provider>
}
