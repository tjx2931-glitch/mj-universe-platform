const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchSpacePast = () => fetch(`${BASE_URL}/api/space/past`).then(r => r.json());
export const fetchSpacePresent = () => fetch(`${BASE_URL}/api/space/present`).then(r => r.json());
export const fetchSpaceFuture = () => fetch(`${BASE_URL}/api/space/future`).then(r => r.json());
export const fetchObjects = () => fetch(`${BASE_URL}/api/objects`).then(r => r.json());
export const fetchTimeline = () => fetch(`${BASE_URL}/api/timeline`).then(r => r.json());
export const fetchGallery = () => fetch(`${BASE_URL}/api/gallery`).then(r => r.json());

export const calculateAstrology = (data) =>
  fetch(`${BASE_URL}/api/astrology/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());
