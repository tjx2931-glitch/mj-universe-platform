"""Backend API tests for MJ விண்வெளி அனுபவம்"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSpaceAPIs:
    """Space content API tests"""

    def test_past_events_count(self):
        r = requests.get(f"{BASE_URL}/api/space/past")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 20, f"Expected 20 past events, got {len(data)}"
        print(f"PASS: /api/space/past returned {len(data)} items")

    def test_past_events_have_required_fields(self):
        r = requests.get(f"{BASE_URL}/api/space/past")
        assert r.status_code == 200
        items = r.json()
        for item in items[:3]:
            assert "title_tamil" in item
            assert "image_url" in item
            assert "agency" in item
        print("PASS: Past events have required fields")

    def test_present_events_count(self):
        r = requests.get(f"{BASE_URL}/api/space/present")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 15, f"Expected 15 present missions, got {len(data)}"
        print(f"PASS: /api/space/present returned {len(data)} items")

    def test_future_events_count(self):
        r = requests.get(f"{BASE_URL}/api/space/future")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 15, f"Expected 15 future missions, got {len(data)}"
        print(f"PASS: /api/space/future returned {len(data)} items")


class TestAstronomyObjects:
    """Astronomy objects API tests"""

    def test_objects_count(self):
        r = requests.get(f"{BASE_URL}/api/objects")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 16, f"Expected 16 objects, got {len(data)}"
        print(f"PASS: /api/objects returned {len(data)} items")

    def test_objects_have_tamil_names(self):
        r = requests.get(f"{BASE_URL}/api/objects")
        items = r.json()
        for item in items[:3]:
            assert "name_tamil" in item
            assert "description_tamil" in item
        print("PASS: Objects have Tamil fields")


class TestTimeline:
    """Timeline API tests"""

    def test_timeline_count(self):
        r = requests.get(f"{BASE_URL}/api/timeline")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 25, f"Expected 25 timeline events, got {len(data)}"
        print(f"PASS: /api/timeline returned {len(data)} items")


class TestGallery:
    """Gallery API tests"""

    def test_gallery_count(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 12, f"Expected 12 gallery items, got {len(data)}"
        print(f"PASS: /api/gallery returned {len(data)} items")

    def test_gallery_has_image_urls(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        items = r.json()
        for item in items[:3]:
            assert "image_url" in item
            assert item["image_url"].startswith("http")
        print("PASS: Gallery items have valid image URLs")


class TestAstrology:
    """Astrology calculator API tests"""

    def test_calculate_returns_rasi(self):
        payload = {"birth_date": "1990-06-15", "birth_time": "10:30", "birth_place": "Chennai"}
        r = requests.post(f"{BASE_URL}/api/astrology/calculate", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "rasi" in data
        assert "nakshatra" in data
        assert "lagna" in data
        assert "panchangam" in data
        print(f"PASS: Astrology returns rasi={data['rasi'].get('tamil','')}, nakshatra={data['nakshatra'].get('tamil','')}")

    def test_calculate_panchangam_fields(self):
        payload = {"birth_date": "1990-06-15", "birth_time": "10:30", "birth_place": "Chennai"}
        r = requests.post(f"{BASE_URL}/api/astrology/calculate", json=payload)
        data = r.json()
        panchangam = data.get("panchangam", {})
        assert "vaara" in panchangam
        assert "thithi" in panchangam
        print(f"PASS: Panchangam has vaara={panchangam.get('vaara')}, thithi={panchangam.get('thithi')}")
