import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PathSaver = () => {
  const location = useLocation()

  useEffect(() => {
    // Ignore authentication callback path
    if (!location.pathname.startsWith('/authentication/callback')) {
      sessionStorage.setItem('lastPath', location.pathname + location.search)
    }
  }, [location])

  return null
}

export default PathSaver
