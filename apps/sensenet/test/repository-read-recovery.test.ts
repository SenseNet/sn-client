import { Repository } from '@sensenet/client-core'

const url = 'https://repository.example/odata.svc/Root'
const response = (status = 200) => new Response(JSON.stringify({ d: { results: [] } }), { status })

describe('Repository read recovery', () => {
  it('recovers from a transient fetch failure while preserving authentication and request options', async () => {
    const fetch = jest.fn().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce(response())
    const repository = new Repository({ token: 'test-token' }, fetch)
    const controller = new AbortController()
    const result = await repository.fetch(url, {
      signal: controller.signal,
      credentials: 'include',
      headers: { 'X-Test': 'preserved' },
    })
    expect(result.status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(2)
    for (const [request] of fetch.mock.calls) {
      expect(request.url).toBe(url)
      expect(request.headers.get('Authorization')).toBe('Bearer test-token')
      expect(request.headers.get('X-Test')).toBe('preserved')
    }
    controller.abort()
    expect(fetch.mock.calls.every(([request]) => request.signal.aborted)).toBe(true)
  })

  it('stops after two retries and preserves the final transport error', async () => {
    const error = new TypeError('Failed to fetch')
    const fetch = jest.fn().mockRejectedValue(error)
    const repository = new Repository(undefined, fetch)
    await expect(repository.fetch(url)).rejects.toBe(error)
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it.each([502, 503, 504])('recovers from HTTP %s on a read', async (status) => {
    const fetch = jest.fn().mockResolvedValueOnce(response(status)).mockResolvedValueOnce(response())
    const repository = new Repository(undefined, fetch)
    expect((await repository.fetch(url)).status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it.each([401, 403, 404, 500])('does not retry HTTP %s', async (status) => {
    const fetch = jest.fn().mockResolvedValue(response(status))
    const repository = new Repository(undefined, fetch)
    expect((await repository.fetch(url)).status).toBe(status)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('never replays a failed %s request', async (method) => {
    const fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const repository = new Repository(undefined, fetch)
    await expect(repository.fetch(url, { method })).rejects.toThrow('Failed to fetch')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('cancels a pending retry immediately when navigation aborts the read', async () => {
    const fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const repository = new Repository(undefined, fetch)
    const controller = new AbortController()
    const pending = repository.fetch(url, { signal: controller.signal })
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    await new Promise((resolve) => setTimeout(resolve, 0))
    controller.abort()
    await rejected
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('does not start an already-aborted read', async () => {
    const fetch = jest.fn()
    const repository = new Repository(undefined, fetch)
    const controller = new AbortController()
    controller.abort()
    await expect(repository.fetch(url, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('does not retry AbortError or ordinary application exceptions', async () => {
    for (const error of [new DOMException('Cancelled', 'AbortError'), new Error('Sign in again')]) {
      const fetch = jest.fn().mockRejectedValue(error)
      const repository = new Repository(undefined, fetch)
      await expect(repository.fetch(url)).rejects.toBe(error)
      expect(fetch).toHaveBeenCalledTimes(1)
    }
  })

  it('forwards cancellation to Actions and both allowed-child-type requests', async () => {
    const repository = new Repository({ repositoryUrl: 'https://repository.example' })
    const fetch = jest.spyOn(repository, 'fetch').mockImplementation(async () => response())
    const controller = new AbortController()
    const options = { idOrPath: '/Root', requestInit: { signal: controller.signal, headers: { 'X-Test': 'value' } } }
    await repository.getActions(options)
    await repository.allowedChildTypes.get(options)
    expect(fetch).toHaveBeenCalledTimes(3)
    for (const [, init] of fetch.mock.calls) {
      expect(init?.signal).toBe(controller.signal)
      expect(init?.headers).toEqual({ 'X-Test': 'value' })
      expect(init?.method).toBe('GET')
    }
  })
})
