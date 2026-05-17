"""Backend tests for chat/messages endpoints used by MessagesPage."""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fall back to reading frontend .env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.strip().split("=", 1)[1].rstrip("/")
    except Exception:
        pass

ADMIN_EMAIL = "admin@watizat.com"
ADMIN_PASS = "admin123"
MIGRANT_EMAIL = "test_migrant_photo@watizat.com"
MIGRANT_PASS = "Pass1234"


def _login(email, password):
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": password}, timeout=15)
    assert r.status_code == 200, f"login failed for {email}: {r.status_code} {r.text}"
    data = r.json()
    return data["token"], data["user"]


@pytest.fixture(scope="module")
def admin_session():
    return _login(ADMIN_EMAIL, ADMIN_PASS)


@pytest.fixture(scope="module")
def migrant_session():
    return _login(MIGRANT_EMAIL, MIGRANT_PASS)


def test_conversations_requires_auth():
    r = requests.get(f"{BASE_URL}/api/conversations", timeout=10)
    assert r.status_code in (401, 403)


def test_get_conversations_admin(admin_session):
    token, _ = admin_session
    r = requests.get(f"{BASE_URL}/api/conversations", headers={"Authorization": f"Bearer {token}"}, timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert isinstance(body, list)


def test_send_message_migrant_to_admin_and_appears_in_admin_conversations(admin_session, migrant_session):
    admin_token, admin_user = admin_session
    migrant_token, migrant_user = migrant_session

    unique = f"TEST_msg_{uuid.uuid4().hex[:8]}"
    # migrant sends to admin
    r = requests.post(
        f"{BASE_URL}/api/messages",
        headers={"Authorization": f"Bearer {migrant_token}"},
        json={"to_user_id": admin_user["id"], "message": unique},
        timeout=15,
    )
    assert r.status_code in (200, 201), f"send failed: {r.status_code} {r.text}"

    # admin fetches conversation thread
    r2 = requests.get(
        f"{BASE_URL}/api/messages/{migrant_user['id']}",
        headers={"Authorization": f"Bearer {admin_token}"},
        timeout=15,
    )
    assert r2.status_code == 200
    msgs = r2.json()
    assert isinstance(msgs, list)
    assert any(m.get("message") == unique for m in msgs), "sent message not found in thread"

    # conversations list shows migrant
    r3 = requests.get(f"{BASE_URL}/api/conversations", headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
    assert r3.status_code == 200
    convs = r3.json()
    assert any(c.get("user", {}).get("id") == migrant_user["id"] for c in convs), "migrant not in admin conversations"


def test_get_user_by_id(admin_session, migrant_session):
    admin_token, _ = admin_session
    _, migrant_user = migrant_session
    r = requests.get(
        f"{BASE_URL}/api/users/{migrant_user['id']}",
        headers={"Authorization": f"Bearer {admin_token}"},
        timeout=15,
    )
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == migrant_user["id"]
    assert "_id" not in data
    assert "password" not in data
