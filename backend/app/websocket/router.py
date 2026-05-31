from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError

from app.core.security import decode_token
from app.websocket.manager import manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        await websocket.close(code=4001)
        return

    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            # Echo location updates from walker to relevant owners
            if data.get("type") == "location_update":
                await manager.send_to_user(user_id, {
                    "type": "walker_location",
                    "walker_id": user_id,
                    "lat": data.get("lat"),
                    "lon": data.get("lon"),
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
