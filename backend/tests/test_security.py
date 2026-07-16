from app.core.security import hash_password, verify_password, create_access_token
import jwt
from app.core.config import settings


def test_verify_pwd_correct():
    hashed = hash_password("pwd")

    assert verify_password("pwd", hashed) is True


def test_verify_pwd_incorrect():
    hashed = hash_password("pwd")

    assert verify_password("password", hashed) is False


def test_create_access_token():
    token = create_access_token({"sub": "testuser"})

    payload = jwt.decode(
        token, key=settings.secret_key, algorithms=[settings.algorithm]
    )

    assert payload["sub"] == "testuser"
    assert "exp" in payload
