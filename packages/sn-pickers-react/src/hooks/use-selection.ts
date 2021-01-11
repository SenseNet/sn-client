import { useContext } from 'react'
import { SelectionContext } from '../context/selection'

export const useSelection = () => useContext(SelectionContext)
