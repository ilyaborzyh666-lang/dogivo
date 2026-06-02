import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from functools import lru_cache
from app.core.config import get_settings


@lru_cache
def get_firebase_app():
    settings = get_settings()
    if not firebase_admin._apps:
        if settings.FIREBASE_SERVICE_ACCOUNT_PATH:
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        else:
            cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
    return firebase_admin.get_app()


def verify_firebase_token(id_token: str) -> dict:
    get_firebase_app()
    return firebase_auth.verify_id_token(id_token)
