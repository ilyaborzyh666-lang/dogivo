from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError
from sqlalchemy import select

from app.core.security import decode_token
from app.db.session import AsyncSessionLocal
from app.models.booking import Booking, BookingStatus
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
            if data.get("type") == "location_update":
                lat, lon = data.get("lat"), data.get("lon")
                async with AsyncSessionLocal() as db:
                    result = await db.execute(
                        select(Booking).where(
                            Booking.walker_id == user_id,
                            Booking.status == BookingStatus.IN_PROGRESS,
                        )
                    )
                    booking = result.scalar_one_or_none()
                if booking:
                    await manager.send_to_user(booking.owner_id, {
                        "type": "walker_location",
                        "walker_id": user_id,
                        "booking_id": booking.id,
                        "lat": lat,
                        "lon": lon,
                    })
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
