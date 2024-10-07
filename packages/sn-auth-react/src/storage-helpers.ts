import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants"

export const getAccessToken = () : string | null => {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const setAccessToken = (token: string) : void => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const removeAccessToken = () : void => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const getRefreshToken = () : string | null => {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setRefreshToken = (token: string) : void => {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const removeRefreshToken = () : void => {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}
