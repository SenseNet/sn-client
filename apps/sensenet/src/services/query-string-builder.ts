const encode = (value: string, shouldEncode: boolean) => {
  if (shouldEncode) {
    return encodeURIComponent(value)
  }

  return value
}

interface PathWithQueryParams {
  path: string
  newParams: { [key: string]: string | string[] | null | undefined }
  currentParams?: URLSearchParams
  shouldEncode?: boolean
}

export const pathWithQueryParams = ({ path, newParams, currentParams, shouldEncode = true }: PathWithQueryParams) => {
  if (!newParams) {
    return path
  }

  if (!currentParams) {
    currentParams = new URLSearchParams()
  }

  const keys = Object.keys(newParams)

  keys.forEach((key) => {
    const value = newParams[key]

    if (value === undefined || value === null) return

    if (Array.isArray(value) && value.length) {
      currentParams!.delete(key)
      return value.forEach((current) => currentParams!.append(key, encode(current, shouldEncode)))
    }

    return currentParams!.set(key, encode(value as string, shouldEncode))
  })

  return `${path}${path.slice(-1) === '?' ? '' : '?'}${currentParams.toString()}`
}
