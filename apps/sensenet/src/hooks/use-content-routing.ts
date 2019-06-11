import { useContext } from 'react'
import { ContentRoutingContext } from '../context'

export const useContentRouting = () => useContext(ContentRoutingContext)
