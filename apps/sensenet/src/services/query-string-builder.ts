interface PathWithQueryParams {
  path: string
  newParams: { [key: string]: string | string[] | null | undefined }
  currentParams?: URLSearchParams
}

export const pathWithQueryParams = ({ path, newParams, currentParams }: PathWithQueryParams) => {
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
      return value.forEach((current) => currentParams!.append(key, current))
    }

    return currentParams!.set(key, value as string)
  })

  return `${path}${path.slice(-1) === '?' ? '' : '?'}${currentParams.toString()}`
}
