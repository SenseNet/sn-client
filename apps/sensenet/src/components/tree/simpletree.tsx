import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { usePersonalSettings } from '../../hooks'

export type ItemType = GenericContent & {
  children?: ItemType[]
  expanded?: boolean
  hasNextPage?: boolean
}

type SimpleTreeProps = {
  activeItemPath: string
  itemCount: number
  isLoading: boolean
  loadMore: (startIndex: number, path?: string) => Promise<void>
  onItemClick: (item: GenericContent) => void
  treeData: ItemType
}

export const getStringParts = (str: string, characterSplit = 10) => {
  return [str.slice(0, characterSplit * -1), str.slice(characterSplit * -1)]
}

export function SimpleTree({ treeData, itemCount, onItemClick, loadMore, isLoading, activeItemPath }: SimpleTreeProps) {
  const personalSettings = usePersonalSettings()
  console.log(treeData)
  console.log(itemCount)
  console.log(onItemClick)
  console.log(loadMore)
  console.log(isLoading)
  console.log(activeItemPath)
  console.log(personalSettings)
  return (
    <div
      style={{
        minWidth: '350px',
        maxWidth: '400px',
        flexGrow: 2,
        flexShrink: 0,
        borderRight: '12px solid rgba(128,128,128,.2)',
        backgroundColor: 'red',
      }}>
      <div>
        <span>tree</span>
      </div>
    </div>
  )
}
