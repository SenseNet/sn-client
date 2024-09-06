import { User } from './models/user'

export async function convertAuthTokenApiCall(
  server: string,
  authToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const response = await fetch(`${server}/api/auth/convert-auth-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: authToken }),
    })

    if (response.ok) {
      const data = await response.json()
      const { accessToken, refreshToken } = data

      return { accessToken, refreshToken }
    } else {
      throw new Error(`Failed to convert auth token: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function refreshTokenApiCall(
  server: string,
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const response = await fetch(`${server}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      const { accessToken, refreshToken } = data

      return { accessToken, refreshToken }
    } else {
      throw new Error(`Failed to refresh token: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function logoutApiCall(server: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${server}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      return true
    } else {
      throw new Error(`Error during logout: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function getUserDetailsApiCall(server: string, accessToken: string): Promise<User> {
  try {
    const response = await fetch(`${server}/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      const user = await response.json()

      return {
        Avatar: {
          Url: user.avatar?.url
        },
        DisplayName: user.displayName,
        Name: user.name,
        Email: user.email,
        FullName: user.fullName,
        Id: user.id,
        LoginName: user.loginName,
        Path: user.path
      } 
    } else {
      throw new Error(`Error during logout: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
