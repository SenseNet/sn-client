import { ChangePasswordRequest } from './models/change-password-request';
import { ForgottenPasswordRequest } from './models/forgotten-password-request';
import { LoginRequest } from './models/login-request';
import { LoginResponse } from './models/login-response';
import { MultiFactorLoginRequest } from './models/multi-factor-login-request';
import { PasswordRecoveryRequest } from './models/password-recovery-request';
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

export async function loginApiCall(server: string, loginRequest: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${server}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginRequest)
    })

    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(`Error during login: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function forgotPasswordApiCall(server: string, passwordRequest: ForgottenPasswordRequest): Promise<void> {
  try {
    const response = await fetch(`${server}/api/auth/forgotten-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordRequest)
    })

    if (!response.ok) {
      throw new Error(`Error during request password recovery email: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function passwordRecoveryApiCall(server: string, passwordRequest: PasswordRecoveryRequest): Promise<void> {
  try {
    const response = await fetch(`${server}/api/auth/password-recovery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordRequest)
    })

    if (!response.ok) {
      throw new Error(`Error during resetting password: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function changePasswordApiCall(server: string, accessToken: string, passwordRequest: ChangePasswordRequest): Promise<void> {
  try {
    const response = await fetch(`${server}/api/auth/password-recovery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(passwordRequest)
    })

    if (!response.ok) {
      throw new Error(`Error during changing password: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function multiFactorApiCall(server: string, loginRequest: MultiFactorLoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${server}/api/auth/login/multi-factor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginRequest)
    })

    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(`Error during mfa valiadation: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function validateTokenApiCall(server: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${server}/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok)
      return true
  } catch (error) {
    console.error('Error:', error)
  }

  return false
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