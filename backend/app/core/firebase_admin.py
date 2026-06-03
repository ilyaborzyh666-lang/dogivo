import httpx
from jose import jwt, JWTError
from app.core.config import get_settings

GOOGLE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
FIREBASE_ISSUER_PREFIX = "https://securetoken.google.com/"


async def verify_firebase_token(id_token: str) -> dict:
    settings = get_settings()
    project_id = "dogivo-cacc9"

    async with httpx.AsyncClient() as client:
        resp = await client.get(GOOGLE_CERTS_URL)
        certs = resp.json()

    header = jwt.get_unverified_header(id_token)
    kid = header.get("kid")
    if not kid or kid not in certs:
        raise ValueError("Invalid token: unknown kid")

    public_key = certs[kid]
    payload = jwt.decode(
        id_token,
        public_key,
        algorithms=["RS256"],
        audience=project_id,
        issuer=f"{FIREBASE_ISSUER_PREFIX}{project_id}",
    )
    return payload
