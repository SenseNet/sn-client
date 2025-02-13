import { useEffect, useRef, useState } from 'react'

export const useGlobalCacheFetch = (url: string, cacheTime = 60000) => {
  const cache = useRef<{ [key: string]: { data: any; timestamp: number } }>({}) // Globális cache objektum
  const [data, setData] = useState(cache.current[url] || null)
  //const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const now = Date.now()
      if (cache.current[url]) {
        const d = cache.current[url].data
        if (d !== undefined) {
          console.log('Fetching skipped: Using cached data.')
          if (now - d.timestamp < cacheTime) setData(cache.current[url].data)
        } else {
          console.log('Fetching skipped: download inprogress.')
        }
        return
      } else {
        cache.current[url] = { data: undefined, timestamp: now }
      }

      //setLoading(true)
      try {
        const response = await fetch(url)
        const result = await response.json()
        cache.current[url] = { data: result, timestamp: now }
        setData(result)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }
    fetchData().then((res) => {
      console.log('fetchData result', res)
    })
  }, [url, cacheTime])
  return { data }
}
