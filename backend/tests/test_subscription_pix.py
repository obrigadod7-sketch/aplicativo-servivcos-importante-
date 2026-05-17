"""Backend tests for Subscription + PIX BR Code endpoints (iteration 2)."""
import os
import re
import base64
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://6c38cc57-a2f5-43d4-88bc-b9f9da7b4d0e.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

MARIA = {"email": "maria@test.com", "password": "test123"}
CARLOS = {"email": "carlos@test.com", "password": "test123"}


# ---------------- helpers ----------------
def _login(creds):
    r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["token"]


def _h(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def _crc16_ccitt(payload: str) -> str:
    poly, crc = 0x1021, 0xFFFF
    for b in payload.encode('utf-8'):
        crc ^= b << 8
        for _ in range(8):
            crc = ((crc << 1) ^ poly) if (crc & 0x8000) else (crc << 1)
            crc &= 0xFFFF
    return f"{crc:04X}"


# ---------------- fixtures ----------------
@pytest.fixture(scope="module")
def maria_token():
    return _login(MARIA)


@pytest.fixture(scope="module")
def carlos_token():
    return _login(CARLOS)


@pytest.fixture(scope="module", autouse=True)
def _cleanup_subscription():
    """Remove subscriptions for both test users before & after tests via mongo."""
    # We don't have direct admin endpoint to delete. Best-effort: tests adapt.
    yield


# ---------------- tests ----------------

# Subscription status - new user (or returns existing)
class TestSubscriptionStatus:
    def test_status_endpoint_responds(self, maria_token):
        r = requests.get(f"{API}/subscription/status", headers=_h(maria_token), timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "has_subscription" in data
        assert isinstance(data["has_subscription"], bool)

    def test_status_unauth(self):
        r = requests.get(f"{API}/subscription/status", timeout=15)
        assert r.status_code in (401, 403)


# Subscription start - generates BR Code PIX + QR
class TestSubscriptionStart:
    def test_start_creates_or_returns_sub(self, maria_token):
        r = requests.post(f"{API}/subscription/start", headers=_h(maria_token), timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        # required fields
        for k in ("subscription_id", "status", "trial_ends_at", "amount", "brcode", "qr_code_base64", "pix_key"):
            assert k in data, f"missing {k}"
        assert data["amount"] == 35.90
        # BR Code starts with payload format indicator 000201
        assert data["brcode"].startswith("000201"), f"brcode prefix wrong: {data['brcode'][:20]}"
        # ends with 4 hex CRC
        assert re.match(r".*[0-9A-F]{4}$", data["brcode"]), "CRC suffix not 4 hex"
        # verify CRC validity
        body, crc = data["brcode"][:-4], data["brcode"][-4:]
        expected_crc = _crc16_ccitt(body)
        assert crc == expected_crc, f"CRC mismatch: got {crc}, expected {expected_crc}"
        # QR base64 is a valid data URL PNG
        assert data["qr_code_base64"].startswith("data:image/png;base64,")
        b64 = data["qr_code_base64"].split(",", 1)[1]
        raw = base64.b64decode(b64)
        assert raw[:8] == b"\x89PNG\r\n\x1a\n", "QR is not a valid PNG"

    def test_status_after_start_in_trial(self, maria_token):
        # After start, status should show has_subscription=True and active or in_trial
        r = requests.get(f"{API}/subscription/status", headers=_h(maria_token), timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["has_subscription"] is True
        assert data.get("status") in ("trial", "pending_verification", "active")
        # trial_ends_at present
        assert "trial_ends_at" in data and data["trial_ends_at"]

    def test_start_idempotent(self, maria_token):
        # Calling twice should not error; should reuse existing subscription
        r1 = requests.post(f"{API}/subscription/start", headers=_h(maria_token), timeout=30)
        r2 = requests.post(f"{API}/subscription/start", headers=_h(maria_token), timeout=30)
        assert r1.status_code == 200 and r2.status_code == 200
        assert r1.json()["subscription_id"] == r2.json()["subscription_id"]


# Subscription confirm-payment
class TestSubscriptionConfirm:
    def test_confirm_marks_pending(self, maria_token):
        # ensure subscription exists
        requests.post(f"{API}/subscription/start", headers=_h(maria_token), timeout=30)
        r = requests.post(
            f"{API}/subscription/confirm-payment",
            headers=_h(maria_token),
            json={"transaction_id": "TEST_TX_123", "proof_message": "TEST_PROOF"},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body.get("status") == "pending_verification"

        # Verify status reflects pending_verification
        s = requests.get(f"{API}/subscription/status", headers=_h(maria_token), timeout=15).json()
        assert s["status"] == "pending_verification"

    def test_confirm_no_subscription(self, carlos_token):
        # Carlos may or may not have sub depending on test order. If endpoint already
        # has sub for carlos, accept ok. If not, 404 expected.
        # First check
        s = requests.get(f"{API}/subscription/status", headers=_h(carlos_token), timeout=15).json()
        r = requests.post(
            f"{API}/subscription/confirm-payment",
            headers=_h(carlos_token),
            json={},
            timeout=15,
        )
        if not s.get("has_subscription"):
            assert r.status_code == 404
        else:
            assert r.status_code == 200


# Admin endpoints - non-admin should get 403
class TestAdminEndpointsAuth:
    def test_list_subs_forbidden_for_normal(self, maria_token):
        r = requests.get(f"{API}/admin/subscriptions", headers=_h(maria_token), timeout=15)
        assert r.status_code == 403

    def test_activate_forbidden_for_normal(self, maria_token):
        r = requests.post(f"{API}/admin/subscriptions/fake-id/activate", headers=_h(maria_token), timeout=15)
        assert r.status_code == 403

    def test_list_subs_unauth(self):
        r = requests.get(f"{API}/admin/subscriptions", timeout=15)
        assert r.status_code in (401, 403)
