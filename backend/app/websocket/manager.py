from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # user_id -> list of active websocket connections
        self._connections: dict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, user_id: int) -> None:
        await websocket.accept()
        self._connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int) -> None:
        self._connections[user_id].discard(websocket) if hasattr(self._connections[user_id], 'discard') else None
        if websocket in self._connections[user_id]:
            self._connections[user_id].remove(websocket)

    async def send_to_user(self, user_id: int, message: dict) -> None:
        dead = []
        for ws in self._connections.get(user_id, []):
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws, user_id)

    async def broadcast_booking_update(self, owner_id: int, walker_id: int, payload: dict) -> None:
        await self.send_to_user(owner_id, payload)
        await self.send_to_user(walker_id, payload)


manager = ConnectionManager()
