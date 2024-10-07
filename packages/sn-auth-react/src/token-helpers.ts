const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(''),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to parse JWT', error)
      return null
    }
  }
  
  export const isTokenAboutToExpire = (token: string | null, threshold: number) => {
    if (!token) return true
    const decoded = parseJwt(token)
    if (!decoded || !decoded.exp) return true
  
    const expiryTime = decoded.exp * 1000
    const currentTime = Date.now()
    return expiryTime - currentTime < threshold
  }