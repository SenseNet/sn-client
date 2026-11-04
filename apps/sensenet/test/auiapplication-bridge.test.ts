import { createBridgeFetchResponse } from '../src/components/content/auiapplication-bridge'

describe('createBridgeFetchResponse', () => {
  it('serializes binary responses as ArrayBuffer without corrupting bytes', async () => {
    const bytes = new Uint8Array([0x00, 0xff, 0x80, 0x41, 0x0a])
    const response = new Response(bytes, {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })

    const bridgeResponse = await createBridgeFetchResponse(response)

    expect(bridgeResponse.ok).toBe(true)
    expect(bridgeResponse.status).toBe(200)
    expect(bridgeResponse.headers['content-type']).toBe('application/octet-stream')
    expect(Array.from(new Uint8Array(bridgeResponse.body))).toEqual(Array.from(bytes))

    const blob = new Blob([bridgeResponse.body], { type: bridgeResponse.headers['content-type'] })
    expect(Array.from(new Uint8Array(await blob.arrayBuffer()))).toEqual(Array.from(bytes))
  })
})
