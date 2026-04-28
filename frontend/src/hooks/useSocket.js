import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export function useSocket(userId) {
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    if (userId) {
      socket.emit('join_user', userId)
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data)
  }, [])

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler)
    return () => socketRef.current?.off(event, handler)
  }, [])

  return { socket: socketRef.current, emit, on }
}
