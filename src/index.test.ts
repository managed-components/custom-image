import { MCEvent } from '@managed-components/types'
import { performClientFetch } from './index'
import { vi } from 'vitest'

const mockFetch = vi.fn()

const mockEvent: MCEvent = {
  type: 'event',
  client: {
    emitter: 'browser',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    language: 'en-GB,en-US;q=0.9,en;q=0.8',
    referer: '',
    ip: '::1',
    title: 'Example Dot Com',
    timestamp: 1694436541740,
    url: new URL('http://example.com'),
    fetch: mockFetch,
    set: () => undefined,
    execute: () => undefined,
    return: () => undefined,
    get: () => undefined,
    attachEvent: () => undefined,
    detachEvent: () => undefined,
  },
  payload: {
    imgSrc: 'https://example.com/test',
  },
}

describe('performClientFetch function', () => {
  it('should call client.fetch with correct arguments when imgSrc is present', async () => {
    await performClientFetch(mockEvent)

    // test that mockFetch was called with all the correct arguments
    expect(mockFetch).toHaveBeenCalledWith(mockEvent.payload.imgSrc, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    })
  })
})
