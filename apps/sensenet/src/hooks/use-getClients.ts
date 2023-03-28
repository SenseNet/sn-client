/**
 * Custom hook that downloads Api security details
 * Has to be wrapped with **RepositoryContext**
 */

import { useRepository } from '@sensenet/hooks-react'
import { useEffect, useState } from 'react'
import { ApiKey, clientTypes, spaTypes } from '../components/settings/api-key'

export const useGetClients = () => {
  const repo = useRepository()

  const [spas, setSpas] = useState<ApiKey[]>([])
  const [clients, setClients] = useState<ApiKey[]>([])
  const [unAuthorizedRequest, setUnAuthorizedRequest] = useState(false)

  useEffect(() => {
    const ac = new AbortController()

    ;(async () => {
      try {
        let response = await repo.executeAction<any, { clients: ApiKey[] }>({
          idOrPath: '/Root',
          name: 'GetClients',
          method: 'GET',
          requestInit: {
            signal: ac.signal,
          },
        })

        if (response.clients.length === 0) {
          response = await repo.executeAction<any, { clients: ApiKey[] }>({
            idOrPath: '/Root',
            name: 'GetClientsForRepository',
            method: 'GET',
            requestInit: {
              signal: ac.signal,
            },
          })
        }

        setClients(response.clients.filter((client: any) => clientTypes.includes(client.type)))
        setSpas(response.clients.filter((client: any) => spaTypes.includes(client.type)))
      } catch (error) {
        console.log(error.message)
        setUnAuthorizedRequest(true)
      }
    })()

    return () => {
      ac.abort()
    }
  }, [repo])

  return { spas, clients, unAuthorizedRequest, setClients, setSpas }
}
