import { useContext } from 'react'
import { ShareContext } from '../context/ShareProvider'

export const useShare = () => {
  return useContext(ShareContext)
}
