"""Tests for new APIs: live-astronomy, objects/:id, gallery/:id"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestLiveAstronomy:
    def test_live_astronomy_status(self):
        r = requests.get(f"{BASE_URL}/api/live-astronomy")
        assert r.status_code == 200
        data = r.json()
        print(f"PASS: /api/live-astronomy returned 200")
        return data

    def test_live_astronomy_has_lunar_phase(self):
        r = requests.get(f"{BASE_URL}/api/live-astronomy")
        assert r.status_code == 200
        data = r.json()
        # API returns 'lunar' with nested fields (illumination, phase_name, phase_days)
        assert "lunar" in data, f"Missing lunar, keys: {list(data.keys())}"
        assert "phase_name" in data["lunar"], f"Missing phase_name in lunar"
        print(f"PASS: lunar phase present: {data['lunar']['phase_name']}")

    def test_live_astronomy_has_upcoming_events(self):
        r = requests.get(f"{BASE_URL}/api/live-astronomy")
        data = r.json()
        assert "upcoming_events" in data, f"Missing upcoming_events, keys: {list(data.keys())}"
        assert isinstance(data["upcoming_events"], list)
        print(f"PASS: upcoming_events count: {len(data['upcoming_events'])}")

    def test_live_astronomy_has_space_fact(self):
        r = requests.get(f"{BASE_URL}/api/live-astronomy")
        data = r.json()
        assert "space_fact" in data, f"Missing space_fact, keys: {list(data.keys())}"
        print(f"PASS: space_fact present")


class TestObjectsById:
    def test_get_first_object_by_id(self):
        # First get all objects to find a valid id
        r = requests.get(f"{BASE_URL}/api/objects")
        assert r.status_code == 200
        objects = r.json()
        assert len(objects) > 0
        obj_id = objects[0].get("id") or objects[0].get("_id")
        assert obj_id is not None, "Object has no id field"
        
        r2 = requests.get(f"{BASE_URL}/api/objects/{obj_id}")
        assert r2.status_code == 200
        data = r2.json()
        assert "id" in data or "_id" in data
        print(f"PASS: /api/objects/{obj_id} returned object")

    def test_object_has_required_fields(self):
        r = requests.get(f"{BASE_URL}/api/objects")
        objects = r.json()
        obj_id = objects[0].get("id") or objects[0].get("_id")
        
        r2 = requests.get(f"{BASE_URL}/api/objects/{obj_id}")
        data = r2.json()
        for field in ["name_tamil", "image_url"]:
            assert field in data, f"Missing field: {field}, keys: {list(data.keys())}"
        print("PASS: Object has required fields")

    def test_invalid_object_id_returns_404(self):
        r = requests.get(f"{BASE_URL}/api/objects/nonexistent_id_12345")
        assert r.status_code == 404
        print("PASS: invalid object id returns 404")


class TestGalleryById:
    def test_get_first_gallery_item_by_id(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        assert r.status_code == 200
        items = r.json()
        assert len(items) > 0
        item_id = items[0].get("id") or items[0].get("_id")
        assert item_id is not None
        
        r2 = requests.get(f"{BASE_URL}/api/gallery/{item_id}")
        assert r2.status_code == 200
        data = r2.json()
        print(f"PASS: /api/gallery/{item_id} returned item")

    def test_gallery_item_has_required_fields(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        items = r.json()
        item_id = items[0].get("id") or items[0].get("_id")
        
        r2 = requests.get(f"{BASE_URL}/api/gallery/{item_id}")
        data = r2.json()
        # Gallery items use title_tamil and title_english
        for field in ["title_tamil", "image_url", "description_tamil"]:
            assert field in data, f"Missing field: {field}, keys: {list(data.keys())}"
        print("PASS: Gallery item has required fields")

    def test_invalid_gallery_id_returns_404(self):
        r = requests.get(f"{BASE_URL}/api/gallery/nonexistent_id_12345")
        assert r.status_code == 404
        print("PASS: invalid gallery id returns 404")
