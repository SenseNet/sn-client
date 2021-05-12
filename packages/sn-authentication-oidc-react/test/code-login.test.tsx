import { codeLogin } from '../src/code-login'

declare const global: any
global.window = {}

describe('CodeLogin', () => {
  const loginParams = { clientId: 'test', clientSecret: 'test', identityServerUrl: 'https://is.test.com' }

  const mockData = {
    access_token: 'eyJhbGciOiJSUUclFOZmVmODlYZHhSVVMtNkkdCtqd3QifQ.eyJuYmYiOjE2MTk1Mj4eg7dmeDMJ0aow9ewPqleqdSpHwl',
    expires_in: 3600,
    scope: 'sensenet',
    token_type: 'Bearer',
  }

  const mockResponse = {
    ok: true,
    json: async () => mockData,
  }

  const fetchMock: any = async () => {
    return mockResponse
  }

  it('Should be constructed with a built-in fetch method', () => {
    global.window.fetch = jest.fn(() => mockResponse)
    codeLogin(loginParams)
    expect(global.window.fetch).toBeCalled()

    expect(global.window.fetch).toHaveBeenCalledWith('https://is.test.com/connect/token', {
      body: 'client_id=test&client_secret=test&grant_type=client_credentials&scope=sensenet',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    })
  })

  it('should resolve with a proper response', async () => {
    const resp = await codeLogin({ ...loginParams, fetchMethod: fetchMock })
    expect(resp).toEqual(mockData)
  })

  it('should resolve with userId', async () => {
    const responseData = { ...mockData, profile: { sub: 1 } }
    const resp = await codeLogin({ ...loginParams, fetchMethod: fetchMock, userId: 1 })
    expect(resp).toEqual(responseData)
  })
})
