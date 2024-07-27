import { renderHook, act } from '@testing-library/react-hooks'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import useAuthStore from '../authStore'

jest.mock('axios')
jest.mock('react-hot-toast')

describe('useAuthStore', () => {
  describe('getUser', () => {
    it('should set user and isLoggedIn on successful request', async () => {
      const mockUser = { id: 1, name: 'Test User' }
      (axios.get as jest.Mock).mockResolvedValue({ data: mockUser })

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.getUser()
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.loading).toBe(false)
    })

    it('should handle error and set isLoggedIn to false', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Error message',
            topics: ['topic1', 'topic2'],
          },
        },
      }
      (axios.get as jest.Mock).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.getUser()
      })

      expect(result.current.isLoggedIn).toBe(false)
      expect(result.current.topics).toEqual(['topic1', 'topic2'])
      expect(result.current.loading).toBe(false)
      expect(toast.error).toHaveBeenCalledWith('Error message', {
        position: 'bottom-left',
        duration: 5000,
      })
    })

    it('should set loading to true during request and false after', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: {} })

      const { result } = renderHook(() => useAuthStore())

      let loadingDuringRequest = false

      await act(async () => {
        result.current.getUser()
        loadingDuringRequest = result.current.loading
      })

      expect(loadingDuringRequest).toBe(true)
      expect(result.current.loading).toBe(false)
    })
  })
})
