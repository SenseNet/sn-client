import { GenericContent } from '@sensenet/default-content-types'
import { useInjector } from '@sensenet/hooks-react'
import { useContext, useEffect, useState } from 'react'
import { ResponsiveContext } from '../context'
import { useRepoState } from '../services'
import { CommandProviderManager } from '../services/CommandProviderManager'

export interface CommandPaletteItem {
  primaryText: string
  secondaryText: string
  url: string
  hits: string[]
  content?: GenericContent
  openAction?: () => void
}

export const useCommandPalette = () => {
  const [inputValue, setInputValue] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const [items, setItems] = useState<CommandPaletteItem[]>([])

  const defaultRepository = useRepoState().getCurrentRepoState()!.repository
  const [repository, setRepository] = useState(defaultRepository)
  const device = useContext(ResponsiveContext)

  const injector = useInjector()

  useEffect(() => {
    ;(async () => {
      const cpm = injector.getInstance(CommandProviderManager)
      const foundItems = await cpm.getItems({ term: inputValue, repository, device })
      setItems(foundItems)
    })()
  }, [device, injector, inputValue, repository])

  useEffect(() => {
    if (!isOpened) {
      setItems([])
      setInputValue('')
    }
  }, [isOpened])

  return {
    inputValue,
    setInputValue,
    isOpened,
    setIsOpened,
    items,
    setItems,
    setRepository,
  }
}
