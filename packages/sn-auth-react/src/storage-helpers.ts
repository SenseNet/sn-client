import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants'

export const getStorageKey = (key: string, storageKeyPrefix?: string): string => {
  return storageKeyPrefix ? `${storageKeyPrefix}:${key}` : key
}

export const getAccessToken = (storageKeyPrefix?: string): string | null => {
  return window.localStorage.getItem(getStorageKey(ACCESS_TOKEN_KEY, storageKeyPrefix))
}

export const setAccessToken = (token: string, storageKeyPrefix?: string): void => {
  window.localStorage.setItem(getStorageKey(ACCESS_TOKEN_KEY, storageKeyPrefix), token)
}

export const removeAccessToken = (storageKeyPrefix?: string): void => {
  window.localStorage.removeItem(getStorageKey(ACCESS_TOKEN_KEY, storageKeyPrefix))
}

export const getRefreshToken = (storageKeyPrefix?: string): string | null => {
  return window.localStorage.getItem(getStorageKey(REFRESH_TOKEN_KEY, storageKeyPrefix))
}

export const setRefreshToken = (token: string, storageKeyPrefix?: string): void => {
  window.localStorage.setItem(getStorageKey(REFRESH_TOKEN_KEY, storageKeyPrefix), token)
}

export const removeRefreshToken = (storageKeyPrefix?: string): void => {
  window.localStorage.removeItem(getStorageKey(REFRESH_TOKEN_KEY, storageKeyPrefix))
}
