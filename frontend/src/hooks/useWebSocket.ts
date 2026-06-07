import { useEffect, useRef, useState, useCallback } from 'react'

const WS_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api')
  .replace(/^http/, 'ws')
  .replace(/\/api$/, '')

export type WsMessage = Record<string, unknown>

export function useWebSocket(token: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null)
  const [connected, setConnected] = useState(false)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unmounted = useRef(false)

  const connect = useCallback(() => {
    if (!token || unmounted.current) return

    const ws = new WebSocket(`${WS_BASE}/ws?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => { if (!unmounted.current) setConnected(true) }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as WsMessage
        if (!unmounted.current) setLastMessage(msg)
      } catch {}
    }

    ws.onclose = () => {
      if (unmounted.current) return
      setConnected(false)
      // reconnect after 3 s
      reconnectTimer.current = setTimeout(connect, 3000)
    }

    ws.onerror = () => ws.close()
  }, [token])

  useEffect(() => {
    unmounted.current = false
    connect()
    return () => {
      unmounted.current = true
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  const send = useCallback((msg: WsMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }, [])

  return { send, lastMessage, connected }
}
