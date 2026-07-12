from app.core.security import hash_password, verify_password


def test_verify_pwd_correct():
    hashed = hash_password("pwd")

    assert verify_password("pwd", hashed) is True


def test_verify_pwd_incorrect():
    hashed = hash_password("pwd")

    assert verify_password("password", hashed) is False
