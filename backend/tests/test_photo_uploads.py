"""Backend regression tests for the photo upload feature on /api/posts and /api/housing."""
import os
import base64
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://property-control-30.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

# A tiny valid PNG (1x1 transparent) encoded as base64 data URL
TINY_PNG_B64 = (
    "data:image/png;base64,"
    + base64.b64encode(
        bytes.fromhex(
            "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C489"
            "0000000A49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
        )
    ).decode()
)

ADMIN_CREDS = [
    {"email": "obrigadod7@gmail.com", "password": "admin"},
    {"email": "admin@watizat.com", "password": "admin123"},
]


@pytest.fixture(scope="session")
def auth_token():
    last_err = None
    for c in ADMIN_CREDS:
        r = requests.post(f"{API}/auth/login", json=c, timeout=20)
        if r.status_code == 200:
            return r.json().get("token")
        last_err = (c["email"], r.status_code, r.text[:120])
    pytest.skip(f"Could not authenticate with any admin credential: {last_err}")


@pytest.fixture(scope="session")
def headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


# -------------------- Health --------------------
def test_health_root():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code in (200, 404)  # root may not exist - just ensure server reachable


# -------------------- Auth --------------------
def test_login_returns_token(auth_token):
    assert isinstance(auth_token, str) and len(auth_token) > 10


# -------------------- Posts with images --------------------
def test_create_post_with_images_and_persistence(headers):
    payload = {
        "type": "need",
        "category": "food",
        "title": "TEST_photo_post",
        "description": "Test photo upload on SOS post",
        "images": [TINY_PNG_B64],
    }
    r = requests.post(f"{API}/posts", headers=headers, json=payload, timeout=20)
    assert r.status_code == 200, f"create post failed: {r.status_code} {r.text[:200]}"
    data = r.json()
    assert data.get("title") == "TEST_photo_post"
    assert data.get("category") == "food"
    post_id = data.get("id")
    assert post_id

    # GET /api/posts and find our post, verify images persisted
    g = requests.get(f"{API}/posts", headers=headers, timeout=20)
    assert g.status_code == 200
    posts = g.json()
    found = next((p for p in posts if p.get("id") == post_id), None)
    assert found is not None, "Created post not returned in GET /api/posts"
    assert "images" in found, "GET /api/posts response missing 'images' field"
    assert isinstance(found["images"], list) and len(found["images"]) == 1
    assert found["images"][0].startswith("data:image/")


def test_create_post_empty_images(headers):
    payload = {
        "type": "need",
        "category": "health",
        "title": "TEST_no_photo_post",
        "description": "Without photo",
    }
    r = requests.post(f"{API}/posts", headers=headers, json=payload, timeout=20)
    assert r.status_code == 200


# -------------------- Housing with photos --------------------
def test_create_housing_with_photos_and_persistence(headers):
    payload = {
        "listing_type": "offer",
        "title": "TEST_housing_photo",
        "description": "Test housing photo upload",
        "city": "Lisboa",
        "accommodation_type": "room",
        "duration": "temporary",
        "max_guests": 1,
        "amenities": ["wifi"],
        "photos": [TINY_PNG_B64, TINY_PNG_B64],
    }
    r = requests.post(f"{API}/housing", headers=headers, json=payload, timeout=20)
    assert r.status_code == 200, f"create housing failed: {r.status_code} {r.text[:200]}"
    data = r.json()
    listing_id = data.get("id")
    assert listing_id

    # GET single
    g = requests.get(f"{API}/housing/{listing_id}", headers=headers, timeout=20)
    assert g.status_code == 200
    listing = g.json()
    assert listing["title"] == "TEST_housing_photo"
    assert "photos" in listing and isinstance(listing["photos"], list)
    assert len(listing["photos"]) == 2
    assert all(p.startswith("data:image/") for p in listing["photos"])

    # GET list and ensure listing returned with photos
    gl = requests.get(f"{API}/housing", headers=headers, timeout=20)
    assert gl.status_code == 200
    items = gl.json() if isinstance(gl.json(), list) else gl.json().get("listings", [])
    found = next((x for x in items if x.get("id") == listing_id), None)
    assert found is not None
    assert found.get("photos") and len(found["photos"]) == 2

    # Cleanup
    d = requests.delete(f"{API}/housing/{listing_id}", headers=headers, timeout=20)
    assert d.status_code in (200, 204)


def test_create_housing_without_photos(headers):
    payload = {
        "listing_type": "need",
        "title": "TEST_housing_no_photo",
        "city": "Porto",
        "accommodation_type": "room",
        "duration": "temporary",
        "max_guests": 1,
    }
    r = requests.post(f"{API}/housing", headers=headers, json=payload, timeout=20)
    assert r.status_code == 200
    listing_id = r.json()["id"]
    g = requests.get(f"{API}/housing/{listing_id}", headers=headers, timeout=20)
    assert g.status_code == 200
    assert g.json().get("photos") == []
    # Cleanup
    requests.delete(f"{API}/housing/{listing_id}", headers=headers, timeout=20)


# -------------------- Auth required --------------------
def test_post_requires_auth():
    r = requests.post(f"{API}/posts", json={"type": "need", "category": "food", "title": "x", "description": "y"}, timeout=15)
    assert r.status_code in (401, 403)


def test_housing_requires_auth():
    r = requests.post(f"{API}/housing", json={"listing_type": "offer", "title": "x", "city": "Lisboa"}, timeout=15)
    assert r.status_code in (401, 403)
