import { MCEvent } from '@managed-components/types'
import { performClientFetch } from './index'
import { vi, expect, describe, it, beforeEach } from 'vitest'
import { mockEvent } from '@mackenly/zaraz-tools'

// Create mock functions
const mockExecute = vi.fn()
const mockConsoleLog = vi.fn()
const mockConsoleError = vi.fn()

describe('performClientFetch function', () => {
  beforeEach(() => {
    // Clear mocks between tests
    mockExecute.mockClear()
    mockConsoleLog.mockClear()
    mockConsoleError.mockClear()

    // Mock console methods
    console.log = mockConsoleLog
    console.error = mockConsoleError
  })

  it('should log error when no imgSrc is provided', async () => {
    const fakeEvent: MCEvent = {
      ...mockEvent,
      client: {
        ...mockEvent.client,
        execute: mockExecute,
      },
      payload: {}, // No imgSrc provided
    }

    await performClientFetch(fakeEvent)

    // Verify client.execute wasn't called
    expect(mockExecute).not.toHaveBeenCalled()

    // Verify error was logged
    expect(mockConsoleError).toHaveBeenCalledWith(
      'No imgSrc provided in payload'
    )
  })

  it('should call client.fetch with correct arguments when useImgTag is false', async () => {
    const testImgSrc = 'https://example.com/test'
    const fakeEvent: MCEvent = {
      ...mockEvent,
      client: {
        ...mockEvent.client,
        execute: mockExecute,
        fetch: vi.fn(), // Mock fetch function
      },
      payload: {
        imgSrc: testImgSrc,
        useImgTag: false,
      },
    }
    await performClientFetch(fakeEvent)
    // Verify client.fetch was called with correct parameters
    expect(fakeEvent.client.fetch).toHaveBeenCalledWith(testImgSrc, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    })
  })

  it('should call client.fetch with correct arguments when useImgTag is not present', async () => {
    const testImgSrc = 'https://example.com/test'
    const fakeEvent: MCEvent = {
      ...mockEvent,
      client: {
        ...mockEvent.client,
        execute: mockExecute,
        fetch: vi.fn(), // Mock fetch function
      },
      payload: {
        imgSrc: testImgSrc,
      },
    }
    await performClientFetch(fakeEvent)
    // Verify client.fetch was called with correct parameters
    expect(fakeEvent.client.fetch).toHaveBeenCalledWith(testImgSrc, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    })
  })

  it('should call client.execute when useImgTag is true', async () => {
    const testImgSrc = 'https://example.com/test'
    const fakeEvent: MCEvent = {
      ...mockEvent,
      client: {
        ...mockEvent.client,
        execute: mockExecute,
      },
      payload: {
        imgSrc: testImgSrc,
        useImgTag: true,
      },
    }

    await performClientFetch(fakeEvent)

    // Verify client.execute was called
    expect(mockExecute).toHaveBeenCalled()
    const executedScript = mockExecute.mock.calls[0][0]
    expect(executedScript).toContain('https://example.com/test')
    expect(executedScript).not.toContain('undefined')
    expect(executedScript).not.toContain('null')
    expect(executedScript).not.toContain('NaN')
    expect(executedScript).not.toContain('Infinity')
  })

  it("should call client.execute when useImgTag is 'true'", async () => {
    const testImgSrc = 'https://example.com/test'
    const fakeEvent: MCEvent = {
      ...mockEvent,
      client: {
        ...mockEvent.client,
        execute: mockExecute,
      },
      payload: {
        imgSrc: testImgSrc,
        useImgTag: 'true',
      },
    }

    await performClientFetch(fakeEvent)

    // Verify client.execute was called
    expect(mockExecute).toHaveBeenCalled()
    const executedScript = mockExecute.mock.calls[0][0]
    expect(executedScript).toContain('https://example.com/test')
    expect(executedScript).not.toContain('undefined')
    expect(executedScript).not.toContain('null')
    expect(executedScript).not.toContain('NaN')
    expect(executedScript).not.toContain('Infinity')
  })

  it('should correctly escape double quotes in imgSrc when using the img tag', async () => {
    const testImgSrc = 'https://example.com/test?param="test"'
    const fakeEvent: MCEvent = {
      ...mockEvent,
      client: {
        ...mockEvent.client,
        execute: mockExecute,
      },
      payload: {
        imgSrc: testImgSrc,
        useImgTag: true,
      },
    }

    await performClientFetch(fakeEvent)

    // Verify that quotes were escaped properly
    const executedScript = mockExecute.mock.calls[0][0]
    expect(executedScript).toContain(
      'https://example.com/test?param=\\"test\\"'
    )
    expect(executedScript).not.toContain(
      'https://example.com/test?param="test"'
    )
  })
})
