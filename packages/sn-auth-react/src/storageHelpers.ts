import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DETAILS_KEY } from "./constants"
import { User } from "./models/user"

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

export const getUserDetails = () : User | null => {
    const user = window.localStorage.getItem(USER_DETAILS_KEY)

    if (user)
        return JSON.parse(user)
    return null
}


export const setUserDetails = (userDetails: User) : void => {
    window.localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(userDetails))
}

export const removeUserDetails = () : void => {
    window.localStorage.removeItem(USER_DETAILS_KEY)
}

