import { deepMerge, DeepPartial } from '@sensenet/client-utils'
import React, { createContext, FC, useEffect, useState } from 'react'

export const defaultLocalization = {
  common: {
    cancel: 'Cancel',
  },
  menubar: {
    typography: 'Heading',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    blockquote: 'Block quote',
    code: 'Code',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    alignJustify: 'Justify',
    bulletList: 'Bullet list',
    orderedList: 'Ordered list',
    link: 'Link',
    table: 'Insert table',
    clearFormat: 'Clear format',
    undo: 'Undo',
    redo: 'Redo',
  },
  bubbleMenu: {
    removeImage: 'remove image',
    removeLink: 'remove link',
  },
  contextMenu: {
    deleteTable: 'Delete table',
    deleteRow: 'Delete row',
    deleteCol: 'Delete column',
    addRowAbove: 'Add row above',
    addRowBelow: 'Add row below',
    addColBefore: 'Add column before',
    addColAfter: 'Add column after',
    toggleHeaderRow: 'Toggle header row',
    toggleHeaderCol: 'Toggle header column',
    mergeCells: 'Merge cells',
    splitCell: 'Split cell',
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
  tableControl: {
    title: 'Insert table',
    rows: 'Rows',
    cols: 'Cols',
    hasHeader: 'Has header',
    submit: 'Insert',
  },
  typographyControl: {
    paragraph: 'Paragraph',
    heading: 'Heading',
  },
}

export const LocalizationContext = createContext(defaultLocalization)

export type LocalizationType = DeepPartial<typeof defaultLocalization>

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
