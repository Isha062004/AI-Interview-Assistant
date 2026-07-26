from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from infrastructure.messaging.websocket_manager import ws_manager

router = APIRouter(prefix="/ws", tags=["Real-time WebSockets"])

@router.websocket("/session/{session_id}")
async def websocket_session_endpoint(websocket: WebSocket, session_id: str):
    await ws_manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type", "ping")

            if event_type == "code_sync":
                await ws_manager.broadcast_to_session({
                    "type": "code_update",
                    "code": data.get("code", ""),
                    "language": data.get("language", "python")
                }, session_id)
            elif event_type == "voice_transcript":
                await ws_manager.broadcast_to_session({
                    "type": "transcript_stream",
                    "text": data.get("text", ""),
                    "is_final": data.get("is_final", False)
                }, session_id)
            else:
                await ws_manager.send_personal_message({"type": "pong", "status": "active"}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, session_id)
