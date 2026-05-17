"""Backend tests for DirectChatPage endpoints.

Tests login + endpoints used by the redesigned DirectChatPage:
- POST /api/auth/login
- GET /api/conversations
- GET /api/users/{user_id}
- GET /api/can-chat/{user_id}
- GET /api/messages/{user_id}
- POST /api/messages
- GET /api/posts
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://6c38cc57-a2f5-43d4-88bc-b9f9da7b4d0e.preview.emergentagent.com").rstrip("/")

MARIA = {"email": "maria@test.com", "password": "test123"}
CARLOS = {"email": "carlos@test.com", "password": "test123"}
MARIA_ID = "f505cf97-7473-4cd9-bc44-491aa7bbc8e1"
CARLOS_ID = "54dfc188-653d-45ef-895f-273b47bf87e5"


@pytest.fixture(scope="session")
def maria_token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json=MARIA, timeout=20)
    assert r.status_code == 200, f"Maria login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def carlos_token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json=CARLOS, timeout=20)
    assert r.status_code == 200, f"Carlos login failed: {r.status_code} {r.text}"
    return r.json()["token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ===== Auth =====
class TestAuth:
    def test_login_maria(self):
        r = requests.post(f"{BASE_URL}/api/auth/login", json=MARIA, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and "user" in data
        assert data["user"]["email"] == MARIA["email"]

    def test_login_carlos(self):
        r = requests.post(f"{BASE_URL}/api/auth/login", json=CARLOS, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["user"]["email"] == CARLOS["email"]

    def test_login_invalid(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": "maria@test.com", "password": "wrong"},
                          timeout=20)
        assert r.status_code in (400, 401)


# ===== Users =====
class TestUsers:
    def test_get_other_user(self, maria_token):
        r = requests.get(f"{BASE_URL}/api/users/{CARLOS_ID}", headers=auth(maria_token), timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == CARLOS_ID
        assert data["email"] == CARLOS["email"]


# ===== can-chat =====
class TestCanChat:
    def test_can_chat_response(self, maria_token):
        r = requests.get(f"{BASE_URL}/api/can-chat/{CARLOS_ID}", headers=auth(maria_token), timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert "can_chat" in data
        assert isinstance(data["can_chat"], bool)


# ===== Conversations =====
class TestConversations:
    def test_get_conversations(self, maria_token):
        r = requests.get(f"{BASE_URL}/api/conversations", headers=auth(maria_token), timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Sidebar requires each item to have user info
        for c in data:
            assert "user" in c, f"Conversation item missing 'user': {c}"


# ===== Posts =====
class TestPosts:
    def test_get_posts(self, maria_token):
        r = requests.get(f"{BASE_URL}/api/posts", headers=auth(maria_token), timeout=20)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ===== Messages (send & receive) =====
class TestMessages:
    def test_get_messages(self, maria_token):
        r = requests.get(f"{BASE_URL}/api/messages/{CARLOS_ID}", headers=auth(maria_token), timeout=20)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_send_message_persists(self, maria_token):
        payload = {"to_user_id": CARLOS_ID, "message": "TEST_redesign_chat_msg"}
        r = requests.post(f"{BASE_URL}/api/messages", headers=auth(maria_token),
                          json=payload, timeout=20)
        assert r.status_code in (200, 201), f"send failed: {r.status_code} {r.text}"

        # Verify persistence
        r2 = requests.get(f"{BASE_URL}/api/messages/{CARLOS_ID}", headers=auth(maria_token), timeout=20)
        assert r2.status_code == 200
        texts = [m.get("message") for m in r2.json()]
        assert "TEST_redesign_chat_msg" in texts

    def test_conversation_appears_after_send(self, maria_token):
        r = requests.get(f"{BASE_URL}/api/conversations", headers=auth(maria_token), timeout=20)
        assert r.status_code == 200
        partners = [c["user"]["id"] for c in r.json() if c.get("user")]
        assert CARLOS_ID in partners
